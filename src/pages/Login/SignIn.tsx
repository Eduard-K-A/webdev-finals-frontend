import React, { useState } from "react";
import axios from "axios";

// AnimatedText component with wave animation (Copied from Register.tsx for consistency)
const AnimatedText: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
  return (
    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#362f22] flex flex-wrap">
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block animate-wave"
          style={{ animationDelay: `calc(${index * 0.1}s + 1s)`, ...style }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
};

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const inputClass =
    "w-full px-4 py-2 border border-[#d4a574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574] hover:border-[#b48c5a] hover:shadow-md transition-all";

  // IMPORTANT: In a production environment, you should use Firestore for state management,
  // not localStorage, but for this example, we keep the original logic.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    try {
      // Send sign-in data to the backend

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await axios.post(`${apiBaseUrl}/auth/login`, {
        username,
        password,
      });
      
      setIsSuccess(true);
      setMessage(res.data.message || "Log in successful!");
      
      // Store user data 
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Navigate or redirect user after successful login
      // window.location.href = "/dashboard"; 
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setIsSuccess(false);
        setMessage(err.response.data.message || "Log in failed. Check your credentials.");
      } else {
        setIsSuccess(false);
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    // Updated: Matches Register.tsx main container classes
    <div className="flex flex-col h-[calc(100vh-72px)] bg-[#f5f0eb]">
      
      {/* Main content wrapper */}
      <div className="flex flex-col md:flex-row flex-1">
        
        {/* Left side - Hero Section 
            Updated: md:w-4/5 width, h-[calc(100vh-72px)] height, and image path
        */}
        <div
          className="md:w-4/5 flex items-center justify-center p-8 bg-cover bg-center h-[calc(100vh-72px)]"
          // Using the image path from the provided Register code for delogconsistency
          style={{ backgroundImage: "url('/assets/registerPageImg.png')" }} 
        >
          <div className="text-center md:text-left" style={{ animationDelay: "1s" }}>
            <AnimatedText text="Welcome Back" />
            <p className="text-lg md:text-xl text-black max-w-xl">
              Ready to plan your next adventure? Log in to access your bookings,
              loyalty rewards, and personalized recommendations.
            </p>
          </div>
        </div>

        {/* Right side - Log In card (40% width on desktop, top-aligned) */}
        <div className="md:w-2/5 flex items-start justify-center p-8 overflow-y-auto overflow-x-hidden h-[calc(100vh-72px)]">
          <div
            // Updated: Changed shadow-2xl to shadow-lg to match Register.tsx
            className="flex shadow-lg rounded-2xl overflow-hidden border border-[#d4a574] w-full max-w-md opacity-0 translate-x-full animate-slide-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Gold Accent Bar */}
            <div className="w-1 bg-[#d4a574]"></div>

            <div className="flex flex-col w-full p-6 sm:p-8 bg-white">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#362f22]">
              LuxeStay
              </h2>

              {message && (
                <p
                  // Updated: Simplified styling to match Register.tsx message display
                  className={`text-center mb-4 ${
                    isSuccess
                      ? "text-[#d4a574]"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={inputClass}
                />
                
                {/* Password Field */}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />

                <button
                  type="submit"
                  className="w-full py-2 mt-2 bg-[#d4a574] text-white font-semibold rounded-lg hover:bg-[#b48c5a] transition-colors"
                >
                  Log In
                </button>
              </form>

              {/* Link to Register */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{" "}
                <a
                  href="/Register"
                  className="text-[#d4a574] font-medium hover:underline"
                >
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;