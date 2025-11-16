import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Room {
  id: number;
  name: string;
  city: string;
  price: number;
  image?: string;
}

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      setLoading(true);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await axios.get(`${apiBaseUrl}/api/rooms/${id}`);
        setRoom(res.data); // Axios automatically parses JSON
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error || !room) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-600">Error!</h2>
        <p className="text-gray-500">{error || 'Room not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {room.image && (
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-96 object-cover rounded-xl shadow-lg hover:scale-105 transform transition duration-300"
        />
      )}

      <div className="bg-white rounded-xl shadow-md p-8 space-y-6 hover:shadow-xl transition-shadow duration-300">
        <h1 className="text-5xl font-extrabold text-[var(--color-brand-navy)] tracking-tight">
          {room.name}
        </h1>

        <div className="text-gray-800 space-y-3 text-lg">
          <p>
            <span className="font-semibold">Location:</span> {room.city}
          </p>
          <p>
            <span className="font-semibold">Price:</span>
            <span className="text-2xl font-bold text-blue-600 ml-2">${room.price}</span>
            <span className="text-gray-500"> / night</span>
          </p>
        </div>

        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;
