// src/pages/HomePage.tsx
import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import FeaturedHotels from '../components/Featured/FeaturedHotels';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header type="home" />
            
            <main className="flex-grow">
                {/* SearchForm is already included in the Header component */}
                <FeaturedHotels />
                
                <section className="py-16 bg-gray-50 px-4 text-center">
                    <h2 className="text-2xl font-semibold mb-3">Why Choose MERN Booking?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We offer real-time availability, secure payments, and 24/7 customer support, ensuring a stress-free travel experience from search to check-out.
                    </p>
                </section>
            </main>
            
            <Footer />
        </div>
    );
};

export default HomePage;