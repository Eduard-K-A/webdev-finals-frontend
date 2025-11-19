import React from "react";
import { Star, Wifi, Coffee, Users, Tv } from "lucide-react";

const AboutUs: React.FC = () => {
  return (
    <div className="relative bg-gray-50 min-h-screen">
      
      {/* Page Header */}
      <header className="bg-[var(--color-brand-navy)] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Welcome to LuxeStay
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Experience luxury, comfort, and impeccable service in the heart of the city. 
            Our curated accommodations are designed for relaxation and convenience.
          </p>
        </div>
      </header>

      {/* What We Offer Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-brand-navy)] mb-12">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            <Wifi className="w-12 h-12 mx-auto text-[var(--color-brand-navy)] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Free Wi-Fi</h3>
            <p className="text-gray-600 text-sm">
              Stay connected with high-speed internet throughout the property.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            <Coffee className="w-12 h-12 mx-auto text-[var(--color-brand-navy)] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Complimentary Breakfast</h3>
            <p className="text-gray-600 text-sm">
              Enjoy a delicious breakfast to start your day right.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            <Tv className="w-12 h-12 mx-auto text-[var(--color-brand-navy)] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Entertainment</h3>
            <p className="text-gray-600 text-sm">
              Relax in rooms with modern entertainment options for your enjoyment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            <Users className="w-12 h-12 mx-auto text-[var(--color-brand-navy)] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Spacious Rooms</h3>
            <p className="text-gray-600 text-sm">
              Rooms designed for comfort, accommodating families and groups with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="Hotel Lobby"
              className="rounded-2xl shadow-2xl object-cover w-full h-full"
            />
          </div>

          {/* Text */}
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-navy)] mb-4">
              Your Comfort, Our Priority
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              At LuxeStay, we pride ourselves on delivering an unforgettable experience. 
              From meticulously designed rooms to personalized service, every detail is crafted for your satisfaction.
            </p>
            <p className="text-gray-700 text-lg">
              Relax, recharge, and create memories in an environment that blends elegance with convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-brand-navy)] mb-12">
          What Our Guests Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[var(--color-brand-navy)] fill-[var(--color-brand-navy)]" />
                <Star className="w-5 h-5 text-[var(--color-brand-navy)] fill-[var(--color-brand-navy)]" />
                <Star className="w-5 h-5 text-[var(--color-brand-navy)] fill-[var(--color-brand-navy)]" />
                <Star className="w-5 h-5 text-[var(--color-brand-navy)] fill-[var(--color-brand-navy)]" />
                <Star className="w-5 h-5 text-[var(--color-brand-navy)] fill-[var(--color-brand-navy)]" />
              </div>
              <p className="text-gray-700 text-sm">
                "Amazing stay! The staff were so friendly, and the rooms were immaculate. Highly recommend LuxeStay to anyone visiting the city!"
              </p>
              <p className="text-gray-900 font-semibold mt-2">– Jane Doe</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
