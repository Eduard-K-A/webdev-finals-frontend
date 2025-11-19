import React from "react";
import { useLocation, Link } from "react-router-dom";
import Footer from "../../components/Dashboard/Footer";

const Policies: React.FC = () => {
  const location = useLocation();
  const fromRegister = location.state?.fromRegister;
  const fromHome = location.state?.fromHome;

  return (

    <>
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-3xl bg-white shadow-lg border border-[#d4a574]/40 rounded-2xl p-10 animate-slide-up-fade-in">
        {/* --- Heading --- */}
        <h1 className="text-4xl font-bold text-[var(--color-brand-navy)] mb-6">
          Terms & Conditions and Policy
        </h1>

        {/* --- Terms & Conditions Section --- */}
        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-brand-navy)] mb-3">
            Terms & Conditions
          </h2>
          <p className="text-lg text-[var(--color-brand-navy)] leading-relaxed">
            By creating an account on LuxeStay, you agree to follow our
            guidelines and policies. Users are expected to provide
            accurate information, maintain account confidentiality, and use
            the platform responsibly. LuxeStay reserves the right to modify
            or update these terms at any time without prior notice.
          </p>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-[#d4a574]/30 my-6"></div>

        {/* --- Privacy Policy Section --- */}
        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-brand-navy)] mb-3">
            Privacy Policy
          </h2>
          <p className="text-lg text-[var(--color-brand-navy)] leading-relaxed">
            LuxeStay values your privacy. We collect only the necessary
            information to provide personalized hotel booking experiences.
            Your data will never be sold or shared with third parties
            without your consent. Please review this policy regularly for
            updates or changes.
          </p>
        </section>

        {/* --- Back button if coming from Register or Home --- */}
        {(fromRegister || fromHome) && (
          <Link
            to={fromRegister ? "/register" : "/"}
            className="mt-8 inline-block bg-[#d4a574] text-white px-6 py-2 rounded-lg hover:bg-[#b48c5a] transition"
          >
            Back
          </Link>
        )}
      </div>

    </div>
    <Footer />
    </>

  );
};

export default Policies;
