import React from "react";
import { Link } from "react-router-dom";
// Assuming 'lucide-react' for modern, clean icons
import { Users, Star, Wifi, Tv, Coffee } from "lucide-react";
import type { RoomCardProps} from "../../types";


// Helper to map amenity strings to Lucide icons (for display only)
const AmenityIcon = ({ name }: { name: string }) => {
  const iconMap: { [key: string]: React.ElementType } = {
    wifi: Wifi,
    tv: Tv,
    "coffee maker": Coffee,
    // Add more mappings as needed
  };
  const Icon = iconMap[name.toLowerCase()] || Wifi; // Default to Wifi
  return <Icon className="w-4 h-4 text-gray-500" />;
};

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onViewDetails,
  onBookNow,
}) => {
  const displayRating = room.rating ? room.rating.toFixed(1) : "N/A";
  const firstImage = room.photos?.[0]?.url || "placeholder-url";

  // Tailwind Color Variables
  const NAVY = "#0a1e3d";
  const GOLD = "#d4a574";
  const HOVER_GOLD = "#c19563";
  const RED = "#d4183d";
  const LIGHT_GRAY = "#f8f9fa";

  return (
    // 1. CARD CONTAINER: Horizontal layout, Gold border on hover, large shadow
    <div
      className={`
                overflow-hidden rounded-2xl border-2 border-gray-200 
                hover:border-[${GOLD}] hover:shadow-xl transition-all duration-300 
                cursor-pointer group bg-white
                ${!room.isAvailable ? "opacity-75" : ""}
            `}
      onClick={onViewDetails} // Primary click action
    >
      <div className="grid md:grid-cols-3 gap-0">
        {/* 2. IMAGE SECTION (1/3 width on desktop) */}
        <div className="relative h-64 md:h-auto overflow-hidden">
          <img
            src={firstImage}
            alt={room.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Placeholder for broken image
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-size="16" dy=".3em"%3EImage Unavailable%3C/text%3E%3C/svg%3E';
            }}
          />

          {/* PRICE BADGE: Gold/Tan background, Navy text, positioned top-right */}
          <div
            className={`
                        absolute top-4 right-4 bg-[${GOLD}] text-[${NAVY}] 
                        px-4 py-2 rounded-full shadow-lg z-10
                    `}
          >
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">${room.pricePerNight}</span>
              <span className="text-xs font-normal">/night</span>
            </div>
          </div>

          {/* UNAVAILABLE OVERLAY/BADGE (if needed) */}
          {!room.isAvailable && (
            <div
              className={`
                            absolute inset-0 bg-black/40 flex items-center justify-center 
                            text-white text-xl font-bold z-20
                        `}
            >
              <span className={`bg-[${RED}] px-4 py-2 rounded-lg`}>
                Not Available
              </span>
            </div>
          )}
        </div>

        {/* 3. DETAILS SECTION (2/3 width on desktop) */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            {/* Title: Primary Navy text, Gold on group hover */}
            <h3
              className={`
                                text-2xl font-medium mb-1 text-[${NAVY}] 
                                group-hover:text-[${GOLD}] transition-colors
                            `}
            >
              {room.title}
            </h3>

            {/* Room Type and Capacity Badges */}
            <div className="flex items-center gap-3 mb-3">
              {/* Room Type Badge: Navy border/text */}
              <span
                className={`
                                border border-[${NAVY}] text-[${NAVY}] 
                                px-2 py-0.5 text-sm font-medium rounded-md
                            `}
              >
                {room.type}
              </span>

              {/* Capacity Badge: Light gray background, Gold icon */}
              <span
                className={`
                                flex items-center gap-1 text-sm 
                                bg-[${LIGHT_GRAY}] px-2 py-0.5 rounded-md text-gray-700
                            `}
              >
                <Users className={`w-4 h-4 text-[${GOLD}]`} />
                Up to {room.maxPeople} guests
              </span>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 mb-3">
              {/* Rating */}
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className={`w-5 h-5 text-[${GOLD}] fill-[${GOLD}]`} />
                <span>{displayRating}</span>
                <span className="text-gray-500 font-normal">
                  ({room.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Top Rated Badge: Navy background */}
              {room.isTopRated && (
                <span
                  className={`
                                    bg-[${NAVY}] text-white px-2 py-0.5 rounded-full 
                                    text-xs font-semibold
                                `}
                >
                  Top Rated
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {room.description}
            </p>

            {/* Amenities Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <div
                  key={index}
                  className={`
                                    flex items-center gap-1 text-xs px-2 py-1 rounded-full 
                                    border border-gray-200 text-gray-700 
                                    hover:border-[${GOLD}] transition-colors
                                `}
                >
                  <AmenityIcon name={amenity} />
                  {amenity}
                </div>
              ))}
              {room.amenities.length > 3 && (
                <span
                  className={`
                                    text-xs bg-[${GOLD}]/10 text-[${NAVY}] px-2 py-1 
                                    rounded-full font-medium
                                `}
                >
                  + {room.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* 4. ACTION BUTTONS */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            {/* View Details Button: Navy Border/Text */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className={`
                                flex-1 px-4 py-2 rounded-xl border-2 font-medium transition-colors
                                border-[${NAVY}] text-[${NAVY}] hover:bg-[${NAVY}] hover:text-white
                            `}
            >
              View Details
            </button>

            {/* Book Now Button: Solid Gold Background */}
            {room.isAvailable ? (
              <Link
                to={`/Book/${room.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookNow?.();
                }}
                className={`
            flex-1 px-4 py-2 rounded-xl border-2 font-medium transition-colors text-center
            bg-[${GOLD}] text-[${NAVY}] hover:bg-[${HOVER_GOLD}]
        `}
              >
                Book Now
              </Link>
            ) : (
              <button
                disabled
                className={`
            flex-1 px-4 py-2 rounded-xl border-2 font-medium transition-colors
            bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 text-center
        `}
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
