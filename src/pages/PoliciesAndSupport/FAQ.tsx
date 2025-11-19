import React, { useState } from "react";
import Footer from "../../components/Dashboard/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FAQ: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: "What are the check-in and check-out times?", a: "Check-in starts at 2:00 PM, and check-out is by 12:00 PM. Early check-in or late check-out may be available upon request, subject to availability." },
    { q: "Do you offer free Wi-Fi?", a: "Yes! Complimentary high-speed Wi-Fi is available throughout the hotel, including rooms and common areas." },
    { q: "Is parking available at the hotel?", a: "Yes, we offer free on-site parking for all guests. Valet service is also available for a small fee." },
    { q: "Can I bring my pet?", a: "Pets are welcome at LuxeStay in designated pet-friendly rooms. Please inform us in advance to ensure availability." },
    { q: "What is your cancellation policy?", a: "Free cancellation is available up to 24 hours before check-in. Cancellations after this period may incur a fee equivalent to one night’s stay." },
    { q: "Do you provide airport shuttle service?", a: "Yes, we offer airport pick-up and drop-off service. Advance booking is required. Charges may apply." },
    { q: "Are meals included with the stay?", a: "Breakfast is complimentary for all room bookings. Additional meals and in-room dining are available at extra cost." },
    { q: "Can I host events or meetings at the hotel?", a: "Yes! We have fully equipped event spaces for meetings, conferences, and special occasions. Contact our events team for booking and pricing." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto p-8 relative">
      <button
          onClick={() => navigate("/")}
          className="absolute top-8-left-12 sm:left- bg-white border-2 border-[#0a1e3d] text-[#0a1e3d] hover:bg-[#0a1e3d] hover:text-white rounded-full p-2 shadow-md transition-colors duration-200 z-10"
          aria-label="Go back to home page" 
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-brand-navy)]">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="border p-4 rounded-lg shadow-sm">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left flex justify-between items-center font-semibold text-lg"
                >
                  {faq.q}
                  {/* Arrow rotates smoothly */}
                  <span
                    className={`ml-2 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▲
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-[max-height] duration-500 ease-out"
                  style={{
                    maxHeight: isOpen ? 1000 : 0,
                  }}
                >
                  <p className="mt-2 text-gray-700">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FAQ;
