// src/pages/HomePage.tsx
import React from 'react';
import Header from '../components/Dashboard/Header';
import Footer from '../components/Dashboard/Footer';
import AwardSection from '../components/Dashboard/AwardSection';
import FeaturedHotels from '../components/Hotels/FeaturedHotel';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F1ED]">
            <Header type="home" />
        <main className="flex-grow">
                <AwardSection /> 
                <FeaturedHotels />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;