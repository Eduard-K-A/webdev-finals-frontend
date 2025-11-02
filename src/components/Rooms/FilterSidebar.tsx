import React from 'react';
import { SlidersHorizontal, Star, X, DollarSign, Users } from 'lucide-react'; 

const TAILWIND_COLORS = {
    NAVY: 'var(--color-brand-navy)',
    GOLD: 'var(--color-brand-gold)',
    GOLD_HOVER: 'var(--color-brand-gold-hover)', 
    LIGHT_BG: 'var(--color-background-light)', 
    TEXT_GRAY: 'var(--color-text-gray)', 
    GRAY_200: '#e5e7eb', 
    GRAY_400: '#9ca3af', 
    GRAY_700: '#374151', 
};

interface MultiFilterState {
    roomTypes: string[];
    capacity: number[]; 
    priceRange: [number, number];
    minRating: number | null;
}

interface FilterSidebarProps {
    className?: string;
    filters: MultiFilterState;
    updateFilters: (key: keyof MultiFilterState, value: any) => void;
    clearFilters: () => void;
    isFilterActive: boolean; 
    showFilters: boolean; 
    setShowFilters: (show: boolean) => void; 
}

const AVAILABLE_ROOM_TYPES = ['Suite', 'Double', 'Single', 'Family', 'Executive']; 
const CAPACITY_OPTIONS = [1, 2, 3, 4];
// Updated: Removed the 3.0 option
const MIN_RATINGS = [4.5, 4.0, 3.5]; 
const SLIDER_MAX = 500; 

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    className = '',
    filters,
    updateFilters,
    clearFilters,
    isFilterActive,
    showFilters,
    setShowFilters,
}) => {
    
    const [priceInputText, setPriceInputText] = React.useState<[string, string]>([
        filters.priceRange[0].toString(),
        filters.priceRange[1].toString(),
    ]);

    React.useEffect(() => {
        setPriceInputText([filters.priceRange[0].toString(), filters.priceRange[1].toString()]);
    }, [filters.priceRange]);
    
    const handleRoomTypeChange = (type: string, isChecked: boolean) => {
        const newTypes = isChecked
            ? [...filters.roomTypes, type]
            : filters.roomTypes.filter(t => t !== type);
        updateFilters('roomTypes', newTypes);
    };

    const handleCapacityCheckboxChange = (capacity: number, isChecked: boolean) => {
        const newCapacities = isChecked
            ? [...filters.capacity, capacity]
            : filters.capacity.filter(c => c !== capacity);
        updateFilters('capacity', newCapacities);
    };

    const handleRatingChange = (rating: number) => {
        // Toggle selection off if already selected
        const newRating = filters.minRating === rating ? null : rating;
        updateFilters('minRating', newRating);
    };

    const handlePriceTextChange = (index: 0 | 1, value: string) => {
        const newPriceInputText: [string, string] = [...priceInputText];
        newPriceInputText[index] = value;
        setPriceInputText(newPriceInputText);
    };

    const handlePriceBlur = (index: 0 | 1) => {
        const value = priceInputText[index].trim();
        let numValue: number;

        if (value === '' || isNaN(Number(value))) {
            numValue = index === 0 ? 0 : SLIDER_MAX;
        } else {
            numValue = Math.max(0, Number(value)); 
        }
        
        const newRange: [number, number] = [...filters.priceRange];
        newRange[index] = numValue;

        // Prevent min from being greater than max, and vice-versa
        if (newRange[0] > newRange[1]) {
             newRange[index] = filters.priceRange[index];
        }

        updateFilters('priceRange', newRange);
        
        // Update input text to reflect the sanitized/corrected value
        const finalPriceInputText: [string, string] = [...priceInputText];
        finalPriceInputText[index] = newRange[index].toString();
        setPriceInputText(finalPriceInputText);
    };
    
    
    return (
        <div className={`${className} lg:w-80 lg:flex-shrink-0`}> 
            <div 
                className={`
                    fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden
                    ${showFilters ? 'opacity-100 block' : 'opacity-0 hidden'}
                `}
                onClick={() => setShowFilters(false)}
            ></div>
            <div 
                className={`
                    bg-white p-6 rounded-2xl border-2 border-[${TAILWIND_COLORS.GRAY_200}] shadow-sm transition-transform duration-300
                    lg:translate-x-0 lg:shadow-sm lg:p-6 lg:static lg:sticky lg:top-24 lg:h-auto lg:overflow-y-visible lg:z-auto
                    fixed top-0 left-0 w-80 z-50 overflow-y-auto h-full
                    ${showFilters ? 'translate-x-0' : '-translate-x-full'}
                `}
            >

                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h3 className={`text-xl font-semibold text-[${TAILWIND_COLORS.NAVY}] flex items-center gap-2`}>
                        <SlidersHorizontal className="w-5 h-5" /> Filters
                    </h3>
                    <button onClick={() => setShowFilters(false)} className="text-gray-700 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* 1. FILTER HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-semibold text-[${TAILWIND_COLORS.NAVY}] flex items-center gap-2`}>
                        <SlidersHorizontal className="w-5 h-5 mr-0 inline-block" /> Filters
                    </h2>
                    {isFilterActive && (
                        <button 
                            onClick={clearFilters}
                            className={`
                                text-sm font-normal p-2 rounded-lg transition-colors
                                text-[${TAILWIND_COLORS.GOLD}] hover:text-[${TAILWIND_COLORS.GOLD_HOVER}] hover:bg-[${TAILWIND_COLORS.GOLD}]/10
                            `}
                        >
                            Clear All
                        </button>
                    )}
                </div>
                
                {/* 2. Price Range Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className={`text-base font-medium text-[${TAILWIND_COLORS.NAVY}] mb-4 flex items-center gap-2`}>
                        <DollarSign className={`w-4 h-4 text-[${TAILWIND_COLORS.GOLD}]`} /> Price per Night
                    </h4>
                    <div className="flex justify-between items-center gap-3 text-sm">
                        <div className="flex flex-col flex-1">
                            <input
                                type="number"
                                value={priceInputText[0]}
                                onChange={(e) => handlePriceTextChange(0, e.target.value)}
                                onBlur={() => handlePriceBlur(0)} 
                                onFocus={(e) => e.target.select()} 
                                className={`
                                    w-full px-3 py-1.5 rounded-lg text-center border border-gray-300
                                    text-gray-600 bg-[${TAILWIND_COLORS.LIGHT_BG}]
                                    focus:border-[${TAILWIND_COLORS.GOLD}] focus:ring-1 focus:ring-[${TAILWIND_COLORS.GOLD}] transition-colors outline-none
                                `}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <span className={`text-[${TAILWIND_COLORS.TEXT_GRAY}] font-normal text-sm`}>to</span>
                        <div className="flex flex-col flex-1">
                            <input
                                type="number"
                                value={priceInputText[1]}
                                onChange={(e) => handlePriceTextChange(1, e.target.value)}
                                onBlur={() => handlePriceBlur(1)} 
                                onFocus={(e) => e.target.select()}
                                className={`
                                    w-full px-3 py-1.5 rounded-lg text-center border border-gray-300
                                    text-gray-600 bg-[${TAILWIND_COLORS.LIGHT_BG}]
                                    focus:border-[${TAILWIND_COLORS.GOLD}] focus:ring-1 focus:ring-[${TAILWIND_COLORS.GOLD}] transition-colors outline-none
                                `}
                                placeholder="500"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Room Type Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className={`text-base font-medium text-[${TAILWIND_COLORS.NAVY}] mb-4`}>Room Type</h4>
                    <div className="space-y-3">
                        {AVAILABLE_ROOM_TYPES.map(type => (
                            <label key={type} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.roomTypes.includes(type)}
                                    onChange={(e) => handleRoomTypeChange(type, e.target.checked)}
                                    className={`
                                        h-4 w-4 rounded transition-colors border-gray-300 cursor-pointer 
                                        text-blue-600 bg-white border-2 hover:border-gray-400
                                        focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                    `}
                                />
                                <span className={`
                                    text-sm transition-colors text-[${TAILWIND_COLORS.GRAY_700}]
                                    hover:text-[${TAILWIND_COLORS.NAVY}]
                                `}>
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 4. Capacity Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className={`text-base font-medium text-[${TAILWIND_COLORS.NAVY}] mb-4 flex items-center gap-2`}>
                        <Users className={`w-4 h-4 text-[${TAILWIND_COLORS.GOLD}]`} /> Capacity
                    </h4>
                    <div className="space-y-3">
                        {CAPACITY_OPTIONS.map(capacity => (
                            <label key={capacity} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.capacity.includes(capacity)}
                                    onChange={(e) => handleCapacityCheckboxChange(capacity, e.target.checked)}
                                    className={`
                                        h-4 w-4 rounded transition-colors border-gray-300 cursor-pointer 
                                        text-blue-600 bg-white border-2 hover:border-gray-400
                                        focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                    `}
                                />
                                <span className={`
                                    text-sm transition-colors text-[${TAILWIND_COLORS.GRAY_700}]
                                    hover:text-[${TAILWIND_COLORS.NAVY}]
                                `}>
                                    {capacity} {capacity === 1 ? 'Guest' : 'Guests'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                
                {/* 5. Minimum Rating Filter */}
                <div className="p-0 border-none">
                    <h4 className={`text-base font-medium text-[${TAILWIND_COLORS.NAVY}] mb-4 flex items-center gap-2`}>
                        <Star className={`w-4 h-4 text-[${TAILWIND_COLORS.GOLD}]`} /> Minimum Rating
                    </h4>
                    <div className="flex flex-col gap-2">
                        {MIN_RATINGS.map(rating => {
                            const isSelected = filters.minRating === rating;
                            return (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating)}
                                    className={`
                                        w-full px-4 py-2.5 rounded-lg border-2 font-normal transition-all
                                        flex items-center justify-between
                                        ${isSelected
                                            // New style: solid Navy background, white text/border
                                            ? `bg-[${TAILWIND_COLORS.NAVY}] border-[${TAILWIND_COLORS.NAVY}] text-white`
                                            : `border-[${TAILWIND_COLORS.GRAY_200}] text-[${TAILWIND_COLORS.GRAY_700}] hover:border-gray-300`
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2 text-sm">
                                        <Star 
                                            className={`w-4 h-4 
                                                ${isSelected 
                                                    // New style: star icon is white when selected
                                                    ? `text-white fill-white` 
                                                    : `text-[${TAILWIND_COLORS.GRAY_400}]`
                                                }
                                            `} 
                                        />
                                        {rating}+ Stars
                                    </span>
                                    
                                    {isSelected && (
                                        // New style: Checkmark circle is Gold when selected
                                        <div 
                                            className={`h-5 w-5 rounded-full bg-[${TAILWIND_COLORS.GOLD}] flex items-center justify-center`}
                                        >
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;