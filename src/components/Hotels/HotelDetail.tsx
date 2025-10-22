import React from 'react';
import { useParams } from 'react-router-dom';
import hotels from '../../data/hotels.json';
import type { FeaturedHotel } from '../../types';


const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); //params for the URL

  const hotelId = id ? parseInt(id, 10) : NaN // Convert id to number, if not a number then return NaN

  const hotel = (hotels as FeaturedHotel[]).find(h => h.id === hotelId);
  // If no hotel is found with that id, display a helpful message.
  if (!hotel) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-600">Hotel not found!</h2>
        <p className="text-gray-500">Please check the ID and try again.</p>
      </div>
    );
  }

  // If the hotel is found, display its details.
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{hotel.name}</h1>
      <div className="text-lg text-gray-600">
        <p>
          <span className="font-semibold">Location:</span> {hotel.city}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Price:</span> 
          <span className="text-2xl font-bold text-blue-600 ml-2">${hotel.price}</span>
          <span className="text-gray-500"> / night</span>
        </p>
      </div>
    </div>
  );
};

export default HotelDetail;
