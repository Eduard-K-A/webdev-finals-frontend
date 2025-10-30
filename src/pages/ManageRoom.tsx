import React, { useState } from 'react';
import axios from 'axios';

/**
 * ManageRoom
 * - Uploads images to backend (/api/upload) which forwards to Cloudinary
 * - Creates a room record by POSTing to /api/rooms with returned photo URLs
 * - Dispatches a `roomCreated` event with the created room so other pages can react
 */


const ManageRoom: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Single');
  const [pricePerNight, setPricePerNight] = useState('');
  const [maxPeople, setMaxPeople] = useState('1');
  const [amenities, setAmenities] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!title || !description || !pricePerNight || !maxPeople) {
      setMessage('Please fill required fields');
      return;
    }

    try {
      setLoading(true);

      // 1) upload images to backend which uses Cloudinary
      let uploadedImages: any[] = [];
      if (images && images.length > 0) {
        const form = new FormData();
        // attach files
        Array.from(images).forEach((file) => form.append('images', file));
        // optional description for images
        form.append('description', description);


        const uploadRes = await axios.post(`${apiBaseUrl}/api/upload`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImages = uploadRes.data.data.images || [];
      }

      // 2) create room record with photo urls
      const roomPayload = {
        title,
        description,
        type,
        pricePerNight: Number(pricePerNight),
        maxPeople: Number(maxPeople),
        amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
        photos: uploadedImages
      };

      const roomRes = await axios.post(`${apiBaseUrl}/api/rooms`, roomPayload, {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage('Room created successfully');

      // Dispatch global event so Rooms.tsx can pick up the new room
      window.dispatchEvent(new CustomEvent('roomCreated', { detail: roomRes.data.room }));

      // reset form
      setTitle('');
      setDescription('');
      setPricePerNight('');
      setMaxPeople('1');
      setAmenities('');
      (document.getElementById('images') as HTMLInputElement).value = '';
      setImages(null);

    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Upload or save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create / Manage Room</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" required className="w-full p-2 border" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" required className="w-full p-2 border" />
        <div className="flex gap-2">
          <select value={type} onChange={(e)=>setType(e.target.value)} className="p-2 border">
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>
          <input value={pricePerNight} onChange={(e)=>setPricePerNight(e.target.value)} placeholder="Price per night" required className="p-2 border" type="number" />
          <input value={maxPeople} onChange={(e)=>setMaxPeople(e.target.value)} placeholder="Max people" required className="p-2 border" type="number" />
        </div>
        <input value={amenities} onChange={(e)=>setAmenities(e.target.value)} placeholder="Amenities (comma separated)" className="w-full p-2 border" />

        <div>
          <label className="block mb-1">Images (max 10)</label>
          <input id="images" type="file" accept="image/*" multiple onChange={handleFiles} />
        </div>

        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Uploading...' : 'Create Room'}
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default ManageRoom;
