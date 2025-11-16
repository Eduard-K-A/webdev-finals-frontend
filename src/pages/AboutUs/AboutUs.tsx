import React from "react";

const HERO_IMAGE_URL = "https://via.placeholder.com/1200x400"; // replace with the actual image URL

const AboutUs: React.FC = () => {
  const team = [
    { name: "Anterola Eduard King", role: "Backend Developer", img: "https://via.placeholder.com/150" },
    { name: "Platon Shan Christian", role: "Frontend Developer", img: "https://via.placeholder.com/150" },
    { name: "Esquillo Christian", role: "Frontend Developer", img: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">

      {/* Mission Banner */}
      <section
        className="relative rounded-lg overflow-hidden shadow-lg h-64 flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${HERO_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-6">
          <h1 className="text-4xl font-bold mb-4 text-white">Our Mission</h1>
          <p className="text-white text-lg max-w-2xl">
            As Group 10, our mission is to create an exceptional online experience for our guests. 
            We strive to provide a website that is intuitive, beautifully designed, and easy to navigate, 
            so planning your stay is as enjoyable and seamless as the experience at our hotel itself.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-brand-navy)]">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:scale-105 transform transition duration-300"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-[var(--color-brand-navy)] break-words">
                {member.name}
              </h3>
              <p className="text-black">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-[var(--color-brand-navy)]">Contact Us</h2>
        <p className="text-black mb-1">
          Phone: <a href="tel:+18005550123" className="text-blue-600 hover:underline">+1 (800) 555-0123</a>
        </p>
        <p className="text-black">
          Email: <a href="mailto:contact@luxestay.com" className="text-blue-600 hover:underline">contact@luxestay.com</a>
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
