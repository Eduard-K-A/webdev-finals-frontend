

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

//
export interface FeaturedHotel {
  image: string;
  id: number;
  name: string;
  city: string;
  price: number;
  imagePlaceholder: string; // Using a descriptive placeholder
}
