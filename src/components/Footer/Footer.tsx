// src/components/Footer/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex justify-center space-x-6 text-sm mb-4">
                    <a href="/about" className="hover:text-blue-400">About Us</a>
                    <a href="/faq" className="hover:text-blue-400">FAQ</a>
                    <a href="/terms" className="hover:text-blue-400">Terms</a>
                    <a href="/privacy" className="hover:text-blue-400">Privacy</a>
                </div>
                <p className="text-gray-400 text-xs">
                    &copy; {new Date().getFullYear()} Hotel Booking, Inc. Expertly built for your comfort.
                </p>
            </div>
        </footer>
    );
};

export default Footer;