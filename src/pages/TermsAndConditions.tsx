import React from "react";
import { useLocation, Link } from "react-router-dom";

const TermsAndConditions: React.FC = () => {
  const location = useLocation();
  const fromRegister = location.state?.fromRegister;
  const fromHome = location.state?.fromHome;

  return (
    <div className="min-h-screen bg-[#fffdf8] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-2xl bg-white shadow-lg border border-[#d4a574]/40 rounded-2xl p-10 animate-slide-up-fade-in">
        <h1 className="text-4xl font-bold text-[var(--color-brand-navy)] mb-4">
          Terms & Conditions
        </h1>
        <p className="text-lg text-[var(--color-brand-navy)] leading-relaxed mb-8">
          By creating an account on LuxeStay, you agree to follow our guidelines
          and policies. Users are expected to provide accurate information,
          maintain account confidentiality, and use the platform responsibly.
          LuxeStay reserves the right to modify or update these terms at any
          time without prior notice.
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

export default TermsAndConditions;
