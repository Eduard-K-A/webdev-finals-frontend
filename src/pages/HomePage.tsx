// src/pages/HomePage.tsx
import React from 'react';
import Header from '../components/Dashboard/Header';
import Footer from '../components/Dashboard/Footer';
import FeaturedHotels from '../components/Hotels/FeaturedHotel';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F1ED]">
            <Header type="home" />
            
            <main className="flex-grow pt-20">
                <FeaturedHotels />
                
                <section className="py-16 bg-[#F7F1ED] px-4 text-center">
                    <h2 className="text-2xl font-semibold mb-3">Hotel Room Reservation System</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Book and reserve rooms at the best hotels worldwide with ease and convenience!
                    </p>
                </section>
            </main>
            
            <Footer />
        </div>
    );
};

export default HomePage;