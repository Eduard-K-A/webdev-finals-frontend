// src/components/Featured/FeaturedHotels.tsx
import React from "react";
import { Link } from "react-router-dom";
import hotels from "../../data/hotels.json";
import type { FeaturedHotel } from "../../types";

// Define type for a featured item
interface FeaturedHotelsProps {}

const FeaturedHotels: React.FC<FeaturedHotelsProps> = () => {
  const hotelsList = hotels as FeaturedHotel[];

  return (
    <section className="mt-16 mb-20 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Popular Reservations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotelsList.map((hotel) => (
          <Link
            key={hotel.id}
            to={`/Hotels/${hotel.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-[1.02] duration-300 cursor-pointer block"
          >
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold"></div>
            <div className=" p-4 text-xl font-semibold text-gray-900 block">
              {hotel.name}
              <p className="text-gray-500 mt-1">{hotel.city}</p>
              <span className="mt-2 inline-block text-lg font-bold text-blue-600">
                ${hotel.price}
                <span className="text-sm font-normal text-gray-500">
                  /night
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;
