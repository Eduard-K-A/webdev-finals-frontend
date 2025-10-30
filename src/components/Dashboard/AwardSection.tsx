import React from 'react';
import { Award, Star, type LucideIcon } from 'lucide-react';

interface AwardItemProps {
  icon: LucideIcon | string;
  title: string;
  subtitle: string;
}

const AwardItem: React.FC<AwardItemProps> = ({ icon: IconOrEmoji, title, subtitle }) => {
    const isEmoji = typeof IconOrEmoji === 'string';

    const iconElement = isEmoji ? (
        <div className="text-3xl mb-2" role="img" aria-label={title}>{IconOrEmoji}</div>
    ) : (
        <IconOrEmoji className="h-12 w-12 text-[#d4a574] mx-auto mb-2" />
    );

    return (
        <div className="flex flex-col items-center text-center">
            {iconElement}
            <h3 className="text-[#0a1e3d] mb-1 font-medium text-lg">
                {title}
            </h3>
            <p className="text-sm text-gray-600 font-normal">
                {subtitle}
            </p>
        </div>
    );
};

const AwardsSection: React.FC = () => {
    return (
        <div className="bg-[#f8f9fa] -mt-20 pt-32 pb-16">   
            
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    
                    {/* Award 1: Lucide Award Icon */}
                    <AwardItem
                        icon={Award}
                        title="World's Best Hotel"
                        subtitle="Travel Awards 2025"
                    />
                    
                    {/* Award 2: Lucide Star Icon */}
                    <AwardItem
                        icon={Star}
                        title="4.9 Rating"
                        subtitle="From 2,500+ Reviews"
                    />
                    
                    {/* Award 3: Trophy Emoji */}
                    <AwardItem
                        icon="🏆" 
                        title="5-Star Service"
                        subtitle="Certified Excellence"
                    />
                    
                    {/* Award 4: Sparkles Emoji */}
                    <AwardItem
                        icon="✨" 
                        title="Premium Amenities"
                        subtitle="Luxury Included"
                    />
                </div>
            </div>
        </div>
    );
};

export default AwardsSection;
