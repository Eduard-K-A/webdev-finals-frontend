import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import type { Room, Photo } from '../../types';
import { Edit, Trash2, Plus, Search, Bed, DollarSign, ListOrdered, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchWithCache, clearCacheKey } from '../../utils/cache';

// Tag component using brand colors
const RoomTag: React.FC<{ type: string }> = ({ type }) => (
    <span className="inline-flex items-center rounded-full bg-[var(--color-brand-gold)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/50">
        {type}
    </span>
);

// Stat Card component
const StatCard: React.FC<{ title: string; value: string | number; color: string;
icon: React.ReactNode }> = ({ title, value, color, icon }) => (
    <div className={`p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between text-white ${color}`}>
        <div>
            <p className="text-sm font-medium text-gray-800">{title}</p>
            <p className="text-3xl font-extrabold text-[var(--color-brand-navy)] mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full text-white bg-[var(--color-brand-navy)]/10`}>
            {icon}
    
        </div>
    </div>
);


interface RoomFormModalProps {
    roomData: Room | null;
    onClose: () => void;
    onSave: () => void;
}

// Define RoomType explicitly to resolve the SetStateAction error (Fix #1)
type RoomType = 'Single' | 'Double' | 'Suite' | 'Family' | 'Executive' | string;

const RoomFormModal: React.FC<RoomFormModalProps> = ({ roomData, onClose, onSave }) => {
    const isEditing = !!roomData;
    const initialPhotos: Photo[] = roomData?.photos || [];
    
    // Initial previews are ONLY the URLs of existing photos
    const initialExistingUrls: string[] = initialPhotos.map(p => p.url);
    
    // State for form fields
    const [title, setTitle] = useState(roomData?.title || '');
    const [description, setDescription] = useState(roomData?.description || '');
    // FIXED: Use RoomType to allow any existing string or fallback (Fix #1)
    const [type, setType] = useState<RoomType>(roomData?.type || 'Single'); 
    const [pricePerNight, setPricePerNight] = useState(roomData?.pricePerNight.toString() || '');
    const [maxPeople, setMaxPeople] = useState(roomData?.maxPeople.toString() || '1');
    const initialAmenities = roomData?.amenities.join(', ') || '';
    const [amenitiesString, setAmenitiesString] = useState(initialAmenities);
    const [isAvailable, setIsAvailable] = useState(roomData?.isAvailable ?? true);
    const [rating, setRating] = useState(roomData?.rating?.toString() || '0');

    // 1. Files newly selected for upload (objects)
    const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
    const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>(initialExistingUrls);
    const [fileUrlMap, setFileUrlMap] = useState<Map<string, File>>(new Map());
    const [allPreviewUrls, setAllPreviewUrls] = useState<string[]>(initialExistingUrls);

    const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState<string | null>(roomData?.thumbnailPic?.url || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const MAX_IMAGES = 10;

    // useEffect to update allPreviewUrls whenever state changes
    useEffect(() => {
        const newFileUrls = Array.from(fileUrlMap.keys());
        setAllPreviewUrls([...existingPhotoUrls, ...newFileUrls]);
    }, [existingPhotoUrls, fileUrlMap]);

    // --- Image Handling (Fix #2 continued) ---
    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);

        const currentTotal = existingPhotoUrls.length + imagesToUpload.length;
        const totalImages = currentTotal + newFiles.length;
        
        let allowedFiles = newFiles;

        if (totalImages > MAX_IMAGES) {
            const spaceLeft = MAX_IMAGES - currentTotal;
            allowedFiles = newFiles.slice(0, spaceLeft);
            
            if (spaceLeft < newFiles.length) {
                setMessage(`Added ${allowedFiles.length} images. Maximum ${MAX_IMAGES} reached.`);
            } else {
                setMessage('');
            }
        } else {
            setMessage('');
        }
        
        // Add allowed files to state
        setImagesToUpload(prev => [...prev, ...allowedFiles]);
        
        // Create Object URLs and update map
        setFileUrlMap(prevMap => {
            const newUrlMap = new Map(prevMap);
            allowedFiles.forEach(file => {
                const url = URL.createObjectURL(file);
                newUrlMap.set(url, file);
            });
            return newUrlMap;
        });


        (e.target as HTMLInputElement).value = ''; // Clear input
    };

    const handleRemoveImage = (urlToRemove: string) => {
        if (fileUrlMap.has(urlToRemove)) {
            const fileToRemove = fileUrlMap.get(urlToRemove);
            if (fileToRemove) {
                URL.revokeObjectURL(urlToRemove);
                setImagesToUpload(prev => prev.filter(f => f !== fileToRemove));
            }
            // Remove from map
            setFileUrlMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(urlToRemove);
                return newMap;
            });
        } else {
            // It's an existing image, remove from existingPhotoUrls
            setExistingPhotoUrls(prev => prev.filter(url => url !== urlToRemove));
        }
        
        // Update Thumbnail selection
        if (selectedThumbnailUrl === urlToRemove) {
            setSelectedThumbnailUrl(null);
        }
    };
    
    // --- Submission Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!title || !description || !pricePerNight || !maxPeople || allPreviewUrls.length === 0) {
            setMessage('Please fill all required fields and upload at least one image.');
            return;
        }

        try {
            setLoading(true);

            // 1. Upload new images
            let uploadedPhotos: Photo[] = [];
            if (imagesToUpload.length > 0) {
                const form = new FormData();
                imagesToUpload.forEach((file) => form.append('images', file));

                const uploadRes = await axios.post(`${apiBaseUrl}/api/upload`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploadedPhotos = uploadRes.data.data.images || [];
            }

            // 2. Consolidate photos: Existing non-removed photos + newly uploaded ones
            const existingPhotos: Photo[] = roomData?.photos.filter(p => existingPhotoUrls.includes(p.url)) || [];
            const finalPhotos: Photo[] = [...existingPhotos, ...uploadedPhotos];
            
            // 3. Determine the Thumbnail 
            let thumbnailPic: Photo | null = null; 
            if (selectedThumbnailUrl) {
                let potentialThumbnail = finalPhotos.find(p => p.url === selectedThumbnailUrl);
                if (!potentialThumbnail && isEditing && roomData?.photos) {
                    // This finds the original Photo object with the necessary 'public_id'
                    potentialThumbnail = roomData.photos.find(p => p.url === selectedThumbnailUrl);
                }

                if (potentialThumbnail) {
                    // Use the full Photo object (url and public_id)
                    thumbnailPic = potentialThumbnail; 
                }
            } else if (finalPhotos.length > 0) {
                 // Fallback to the first image if no thumbnail is explicitly selected
                thumbnailPic = finalPhotos[0];
            }
            

            const roomPayload = {
                title,
                description,
                type,
                pricePerNight: Number(pricePerNight),
                maxPeople: Number(maxPeople),
                amenities: amenitiesString ? amenitiesString.split(',').map(a => a.trim()) : [],
                photos: finalPhotos,
                // Ensure thumbnailPic is explicitly null if no image is selected/found
                thumbnailPic: thumbnailPic, 
                isAvailable: isAvailable, 
                rating: Number(rating),
            };

            if (isEditing) {
                const roomId = roomData._id; // Use only MongoDB ObjectId
                await axios.put(`${apiBaseUrl}/api/rooms/${roomId}`, roomPayload);
                setMessage('Room updated successfully');
            } else {
                await axios.post(`${apiBaseUrl}/api/rooms`, roomPayload);
                setMessage('Room created successfully');
            }

            clearCacheKey('all_rooms');
            clearCacheKey('admin_rooms');
            clearCacheKey('featured_hotels');

            onSave(); 
        } catch (err: any) {
            console.error(err);
            setMessage(err?.response?.data?.message || 'Upload or save failed');
        } finally {
            setLoading(false);
        }
    };
    

    // Tailwind classes using CSS variables
    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] transition duration-150";
    const buttonGold = "bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-hover)] text-[var(--color-brand-navy)] font-semibold shadow-md";
    const buttonNavy = "bg-[var(--color-brand-navy)] hover:bg-gray-700 text-white font-semibold";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-3xl font-bold text-[var(--color-brand-navy)]">
                        {isEditing ? 'Edit Room' : 'Add New Room'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Room Name *</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Deluxe King Suite" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Room Type *</label>
                            <select value={type} onChange={(e) => setType(e.target.value as RoomType)} required className={inputClass}>
                                {['Single', 'Double', 'Suite', 'Family', 'Executive'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Capacity (Guests) *</label>
                            <input type="number" value={maxPeople} onChange={(e) => setMaxPeople(e.target.value)} required placeholder="2" min="1" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Price per Night ($) *</label>
                            <input type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} required placeholder="299" min="0" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Room Rating (0-5)</label>
                            <input
                                type="number"
                                value={rating}
                                onChange={e => setRating(e.target.value)}
                                min={0}
                                max={5}
                                step={0.1}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Description *</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe the room features and benefits..." rows={3} className={`${inputClass} resize-none`} />
                    </div>
                    
                    {/* Availability and Amenities */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Amenities (comma separated)</label>
                            <input value={amenitiesString} onChange={(e) => setAmenitiesString(e.target.value)} placeholder="Wifi, Air Conditioning, Mini Bar" className={inputClass} />
                        </div>
                         {/* Availability Checkbox */}
                        <div className='flex items-end'>
                            <label className='flex items-center space-x-2 text-gray-700'>
                                <input
                                    type="checkbox"
                                    checked={isAvailable}
                                    onChange={(e) => setIsAvailable(e.target.checked)}
                                    className='form-checkbox h-5 w-5 text-[var(--color-brand-gold)] border-gray-300 rounded focus:ring-[var(--color-brand-gold)]'
                                />
                                <span className='text-sm font-medium'>Room is available for booking</span>
                            </label>
                        </div>
                    </div>

                    {/* --- Image Upload Section --- */}
                    <div className="border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-[var(--color-brand-navy)]">Room Photos ({allPreviewUrls.length} / {MAX_IMAGES})</h3>
                            <input
                                id="images-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFiles}
                                className="hidden"
                                disabled={allPreviewUrls.length >= MAX_IMAGES}
                            />
                            <label 
                                htmlFor="images-upload"
                                className={`px-4 py-2 rounded-lg text-sm transition cursor-pointer ${
                                    allPreviewUrls.length < MAX_IMAGES 
                                        ? `${buttonNavy}`
                                        : 'bg-gray-400 text-white cursor-not-allowed'
                                }`}
                            >
                                Upload Photos (Max {MAX_IMAGES})
                            </label>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-4">You can upload up to {MAX_IMAGES} images. Click an image to set it as the main **Thumbnail**.</p>
                        
                        {/* Image Previews */}
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                            {/* FIXED: Use allPreviewUrls for rendering */}
                            {allPreviewUrls.map((url, idx) => {
                                // Check if the URL is a new file's Object URL
                                return (
                                    <div key={url} className="relative aspect-square">
                                        <img
                                            src={url}
                                            alt={`Preview ${idx + 1}`}
                                            className={`w-full h-full object-cover rounded-md border-2 cursor-pointer transition ${
                                                selectedThumbnailUrl === url ? 'border-[var(--color-brand-gold)] ring-2 ring-[var(--color-brand-gold)]' : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                            onClick={() => setSelectedThumbnailUrl(url)}
                                        />
                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            // FIXED: Only pass the URL for removal; the function figures out if it's new or old (Fix #2)
                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(url); }}
                                            className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 transition shadow-lg"
                                        >
                                            <XCircle className='w-4 h-4' />
                                        </button>
                                        
                                        {/* Thumbnail Badge */}
                                        {selectedThumbnailUrl === url && (
                                            <span className='absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]'>
                                                Thumbnail
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-4 flex justify-end space-x-3 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-6 py-2.5 rounded-lg transition border border-gray-300 text-gray-700 hover:bg-gray-100`}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2.5 rounded-lg transition ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : buttonGold}`}
                        >
                            {loading ? (isEditing ? 'Updating...' : 'Adding Room...') : (isEditing ? 'Update Room' : 'Add Room')}
                        </button>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <p className={`text-sm mt-2 text-right ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

// --- Main ManageRoom Component ---
const ManageRoom: React.FC = () => {
    const { isLoggedIn, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        setAuthChecked(true);
    }, [isLoggedIn, isAdmin]);

    useEffect(() => {
        if (authChecked && (!isLoggedIn || !isAdmin)) {
            navigate('/');
        }
    }, [isLoggedIn, isAdmin, navigate, authChecked]);

    // --- Data Fetching ---
    const fetchRooms = async () => {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
            const fetched = await fetchWithCache(
                'admin_rooms',
                async () => {
                    const res = await axios.get(`${apiBaseUrl}/api/rooms`);
                    return (res.data.rooms || []).map((r: any) => ({ ...r, id: r.id || r._id }));
    
                },
                3 * 60 * 1000 
            );
            setRooms(fetched);
        } catch (err) {
            console.error('Failed to fetch rooms', err);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // --- Room Actions ---
    const handleAddRoom = () => {
        setRoomToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditRoom = (room: Room) => {
        setRoomToEdit(room);
        setIsModalOpen(true);
    };

    // Optimized delete logic
    const handleDeleteRoom = async (room: Room) => {
        if (!confirm(`Are you sure you want to delete room: ${room.title}?`)) return;
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
            const roomId = room._id; // Use only MongoDB ObjectId
            await axios.delete(`${apiBaseUrl}/api/rooms/${roomId}`);
            clearCacheKey('all_rooms');
            clearCacheKey('admin_rooms');
            clearCacheKey('featured_hotels');
            await fetchRooms(); // Re-fetch the list
            setSuccessMessage('Room deleted successfully');
            setTimeout(() => setSuccessMessage(null), 2500);
        } catch (err) {
            console.error('Failed to delete room', err);
            alert('Failed to delete room');
        }
    };

    // Optimized modal close after update
    const handleModalClose = async (msg?: string) => {
        setRoomToEdit(null);
        setIsModalOpen(false);
        await fetchRooms(); // Ensure room list is updated after modal closes
        if (msg) {
            setSuccessMessage(msg);
            setTimeout(() => setSuccessMessage(null), 2500);
        }
    };

    // --- Filtered/Computed Data ---
    const filteredRooms = useMemo(() => {
        return rooms.filter(room => 
            room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [rooms, searchTerm]);

    const stats = useMemo(() => {
        const total = rooms.length;
        const available = rooms.filter(r => r.isAvailable).length;
        const unavailable = total - available;
        const totalPrice = rooms.reduce((sum, r) => sum + r.pricePerNight, 0);
        const avgPrice = total > 0 ? (totalPrice / total).toFixed(0) : '0';
        
        return { total, available, unavailable, avgPrice 
        };
    }, [rooms]);
    

    // Tailwind classes using CSS variables
    const goldText = "text-[var(--color-brand-gold)]";
    const navyText = "text-[var(--color-brand-navy)]";
    if (!authChecked) {
        return (
            <div className="flex items-center justify-center h-screen animate-pulse text-gray-500 text-xl">
                <span className="loader mr-2" />
                Loading room management...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* --- Header & Search --- */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className={`text-3xl font-bold ${navyText}`}>Room Management</h1>
                        <p className="text-gray-600">Manage all rooms and their availability</p>
                    </div>
                </div>
                {successMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold border border-green-300 animate-fade-in">
                    {successMessage}
                  </div>
                )}
                {/* --- Search and Add Button --- */}
                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-full max-w-sm">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${goldText}`} />
                        <input
                            type="text"
                            placeholder="Search rooms by name or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] transition duration-150`}
                        />
                    </div>
                    
                    <button
                        onClick={handleAddRoom}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-white font-semibold transition bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-hover)] shadow-md`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Room</span>
                    </button>
                </div>


                {/* --- Stats Cards --- */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Rooms" 
                        value={stats.total} 
                        color="bg-white"
                        icon={<ListOrdered className="w-6 h-6 text-[var(--color-brand-navy]" />}
                    />
                    <StatCard 
                        title="Available Now" 
                        value={stats.available} 
                        color="bg-white"
                        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                    />
                    <StatCard 
                        title="Unavailable" 
                        value={stats.unavailable} 
                        color="bg-white"
                        icon={<XCircle className="w-6 h-6 text-red-600" />}
                    />
                    <StatCard 
                        title="Avg. Price" 
                        value={`$${stats.avgPrice}`} 
                        color="bg-white"
                        icon={<DollarSign className="w-6 h-6 text-[var(--color-brand-gold)]" />}
                    />
                </div>

                {/* --- Room Table --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className={`text-xl font-semibold mb-4 ${navyText}`}>Room List</h2>
                  
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Room</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Night</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room, index) => (
                                    <tr key={room.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-3">
                                            <img 
                                                src={room.thumbnailPic?.url || room.photos?.[0]?.url || 'https://via.placeholder.com/60'} 
                                                alt={room.title}
                                                className="w-12 h-12 object-cover rounded-md flex-shrink-0 border border-gray-200"
                                            />
                                            <div>
                                                <div className={`${navyText} font-semibold`}>{room.title}</div>
                                                <div className="text-xs text-gray-500">#{index + 1}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <RoomTag type={room.type} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {room.maxPeople} guests
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                            ${room.pricePerNight}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                                            {typeof room.rating === 'number' ? room.rating.toFixed(1) : 'N/A'}
                                            <svg className="w-4 h-4 ml-1 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                room.isAvailable 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {room.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button 
                                                onClick={() => handleEditRoom(room)} 
                                                title="Edit Room"
                                                className={`text-gray-500 hover:${goldText} transition`}
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteRoom(room)} 
                                                title="Delete Room"
                                                className="text-gray-500 hover:text-red-600 transition"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        No rooms found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Render Modal */}
            {isModalOpen && (
                <RoomFormModal 
                    roomData={roomToEdit} 
                    onClose={() => handleModalClose()} 
                    onSave={() => handleModalClose(isModalOpen && roomToEdit ? 'Room updated successfully' : 'Room created successfully')} 
                />
            )}
        </div>
    );
};

export default ManageRoom;