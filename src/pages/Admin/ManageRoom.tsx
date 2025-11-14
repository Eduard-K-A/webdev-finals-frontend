import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Room, Photo } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ManageRoom
 * - Admin can create, update, and delete rooms
 * - Uploads images to backend (/api/upload) → Cloudinary
 * - Room list shows Edit/Delete buttons
 * - Collapsible image preview panel
 * - Modal preview with navigation arrows
 * - Redirects to homepage if user is logged out or not admin
 */

const ManageRoom: React.FC = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  // --- State Variables ---
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null); // null when creating a new room

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Single');
  const [pricePerNight, setPricePerNight] = useState('');
  const [maxPeople, setMaxPeople] = useState('1');
  const [amenities, setAmenities] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // --- Redirect to homepage if not logged in or not admin ---
  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate('/');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  // --- Fetch all rooms on mount ---
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/rooms`);
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  };

  // --- Handle File Upload Selection ---
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  // --- Reset Form (used for Cancel) ---
  const resetForm = () => {
    setEditingRoomId(null);
    setTitle('');
    setDescription('');
    setType('Single');
    setPricePerNight('');
    setMaxPeople('1');
    setAmenities('');
    setImages([]);
    setPreviewUrls([]);
    (document.getElementById('images') as HTMLInputElement).value = '';
    setMessage('');
  };

  // --- Handle Form Submission (Create / Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!title || !description || !pricePerNight || !maxPeople) {
      setMessage('Please fill required fields');
      return;
    }

    try {
      setLoading(true);

      // 1) Upload new images to backend → Cloudinary
      let uploadedImages: Photo[] = [];
      if (images.length > 0) {
        const form = new FormData();
        images.forEach((file) => form.append('images', file));
        form.append('description', description);

        const uploadRes = await axios.post(`${apiBaseUrl}/api/upload`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImages = uploadRes.data.data.images || [];
      }

      // Merge existing photos if updating
      let photos: Photo[] = uploadedImages;
      if (editingRoomId) {
        const existingRoom = rooms.find(r => r._id === editingRoomId);
        if (existingRoom) {
          photos = [...existingRoom.photos, ...uploadedImages];
        }
      }

      // 2) Prepare room payload
      const roomPayload = {
        title,
        description,
        type,
        pricePerNight: Number(pricePerNight),
        maxPeople: Number(maxPeople),
        amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
        photos,
      };

      // 3) Create or update room
      if (editingRoomId) {
        await axios.put(`${apiBaseUrl}/api/rooms/${editingRoomId}`, roomPayload, {
          headers: { 'Content-Type': 'application/json' },
        });
        setMessage('Room updated successfully');
      } else {
        await axios.post(`${apiBaseUrl}/api/rooms`, roomPayload, {
          headers: { 'Content-Type': 'application/json' },
        });
        setMessage('Room created successfully');
      }

      fetchRooms();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Upload or save failed');
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Edit Room ---
  const handleEditRoom = (room: Room) => {
    setEditingRoomId(room._id);
    setTitle(room.title);
    setDescription(room.description);
    setType(room.type);
    setPricePerNight(room.pricePerNight.toString());
    setMaxPeople(room.maxPeople.toString());
    setAmenities(room.amenities.join(', '));
    setPreviewUrls(room.photos.map(photo => photo.url));
    setImages([]); // Only new uploads
  };

  // --- Handle Delete Room ---
  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/rooms/${roomId}`);
      setRooms(prev => prev.filter(r => r._id !== roomId));
      setMessage('Room deleted successfully');
      if (editingRoomId === roomId) resetForm();
    } catch (err) {
      console.error('Failed to delete room', err);
      setMessage('Failed to delete room');
    }
  };

  // --- Modal Navigation ---
  const handlePrevImage = () => {
    if (modalImageIndex === null) return;
    setModalImageIndex((prev) => (prev! > 0 ? prev! - 1 : previewUrls.length - 1));
  };

  const handleNextImage = () => {
    if (modalImageIndex === null) return;
    setModalImageIndex((prev) => (prev! < previewUrls.length - 1 ? prev! + 1 : 0));
  };

  return (
    <div className="fixed inset-0 flex flex-col font-sans overflow-hidden pt-[72px] h-full">
      {/* --- Header --- */}
      <header className="border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Create / Manage Room</h1>
          <p className="text-sm text-gray-500">Fill in details and upload room images</p>
        </div>
        <button
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          className="text-sm font-medium text-gray-600 border px-3 py-1.5 rounded hover:bg-gray-100 transition"
        >
          {isPreviewOpen ? 'Hide Image' : 'Show Image'}
        </button>
      </header>

      {/* --- Main Content --- */}
      <div className="flex flex-1 h-full">
        {/* Left Column: Form Section */}
        <div className={`transition-all duration-300 ${isPreviewOpen ? 'w-1/2' : 'w-full'} px-10 py-8 overflow-y-auto`}>
          <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter room title"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the room"
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
              />
            </div>

            {/* Type, Price, People */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price per Night *</label>
                <input
                  type="number"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  placeholder="₱"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max People *</label>
                <input
                  type="number"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Amenities (comma separated)
              </label>
              <input
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder="Wi-Fi, Air Conditioning, Mini Bar"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload Images (max 10)</label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="block w-full text-sm text-gray-600"
              />
            </div>

            {/* Submit + Cancel Buttons */}
            <div className="pt-4 flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2.5 rounded-md text-white ${
                  loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition`}
              >
                {loading ? 'Uploading...' : editingRoomId ? 'Update Room' : 'Create Room'}
              </button>

              {editingRoomId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Status Message */}
            {message && (
              <p className={`text-sm mt-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </form>
        </div>

        {/* Right Column: Existing Rooms + Image Preview Overlay */}
        <div className="w-1/2 border-l border-gray-200 bg-gray-50 p-6 relative flex flex-col h-full">
          {/* --- Existing Room List --- */}
          <div className={`flex-1 min-h-0 overflow-y-auto transition-opacity duration-300 ${isPreviewOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Existing Rooms</h2>
            {rooms.length > 0 ? (
              <ul className="space-y-3">
                {rooms.map(room => (
                  <li key={room._id} className="border p-3 rounded-md flex justify-between items-center">
                    <div>
                      <span className="font-medium">{room.title}</span> - {room.type} - ₱{room.pricePerNight}/night
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No rooms available</p>
            )}
          </div>

          {/* --- Image Preview Overlay --- */}
          {isPreviewOpen && (
            <div className="absolute inset-0 bg-gray-50 z-10 p-6 overflow-y-auto transition-opacity duration-300">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Image Preview</h2>

              {previewUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group cursor-pointer"
                      onClick={() => setModalImageIndex(idx)}
                    >
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-md border border-gray-200 shadow-sm"
                      />
                      <div className="absolute inset-0 bg-gray-700 bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center rounded-md">
                        <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition">
                          Preview Image
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic">No images selected</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Image Preview */}
      {modalImageIndex !== null && (
        <div
          onClick={() => setModalImageIndex(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div className="relative flex items-center">
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
              className="absolute left-0 text-white text-3xl px-4 hover:text-gray-300"
            >
              <ChevronLeft />
            </button>

            <img
              src={previewUrls[modalImageIndex]}
              alt="Full preview"
              className="max-w-4xl max-h-[90vh] rounded-lg shadow-lg"
            />

            <button
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
              className="absolute right-0 text-white text-3xl px-4 hover:text-gray-300"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoom;
