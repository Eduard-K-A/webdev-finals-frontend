import React from "react";
import { useLocation, Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  const location = useLocation();
  const fromRegister = location.state?.fromRegister;
  const fromHome = location.state?.fromHome;

  return (
    <div className="min-h-screen bg-[#fffdf8] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-2xl bg-white shadow-lg border border-[#d4a574]/40 rounded-2xl p-10 animate-slide-up-fade-in">
        <h1 className="text-4xl font-bold text-[var(--color-brand-navy)] mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-[var(--color-brand-navy)] leading-relaxed mb-8">
          LuxeStay values your privacy. We collect only the necessary
          information to provide personalized hotel booking experiences. Your
          data will never be sold or shared with third parties without your
          consent. Please review this policy regularly for updates or changes.
        </p>

        {(fromRegister || fromHome) && (
          <Link
            to={fromRegister ? "/register" : "/"}
            className="inline-block bg-[#d4a574] text-white px-6 py-2 rounded-lg hover:bg-[#b48c5a] transition"
          >
            Back
          </Link>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
