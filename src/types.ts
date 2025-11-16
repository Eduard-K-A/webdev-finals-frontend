

// Define the shape of the search options
export interface SearchOptions {
    adults: number;
    children: number;
    rooms: number;
}

// Define the shape of the full search state
export interface SearchState {
    destination: string | undefined;
    checkInDate: Date | undefined;
    checkOutDate: Date | undefined;
    options: SearchOptions;
    minPrice?: number;
    maxPrice?: number;
}

// Define the shape of the context object's functions
export interface SearchContextType {
    searchParams: SearchState;
    updateSearchParams: (params: Partial<SearchState>) => void; // Partial allows updating only some fields
    resetSearch: () => void;
}

//define the shape of photo object
export interface Photo  {
  url: string;
  publicId?: string;
  originalName?: string;
}

//define the shape of room object
export interface Room {
  id: string;
  title: string;
  description: string;
  type: "Single" | "Double" | "Suite" | "Family" | "Exclusive";
  pricePerNight: number;
  maxPeople: number;
  amenities: string[];
  thumbnail: string;
  photos: Photo[];
  isAvailable: boolean;
  rating?: number; 
  averageRating: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  isTopRated?: boolean;
  city?: string;
}

export interface RoomCardProps {
  room: Room;
  onViewDetails: () => void;
  onBookNow?: () => void;
}

//user types
export interface UserType {
  _id: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin';
  roles?: string[]; // Additional field for roles array from backend
}

export interface AuthContextType{
    user: UserType | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  logout: () => void;
  login: (userData: UserType) => void;
}