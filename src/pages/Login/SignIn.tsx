import React, { useState } from "react";
import axios from "axios";
import { User, Lock } from "lucide-react";

// --- AnimatedText (same as Register) ---
const AnimatedText: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
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

// --- InputField (moved outside to prevent re-creation each render) ---
const inputBase =
  "w-full px-4 py-2 border border-[#d4a574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574] hover:border-[#b48c5a] hover:shadow-md transition-all pl-10";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-[#362f22] mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-[#d4a574]">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={inputBase}
      />
    </div>
  </div>
);

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await axios.post(`${apiBaseUrl}/auth/login`, { username, password });

      setIsSuccess(true);
      setMessage(res.data.message || "Log in successful!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
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
    <div className="flex flex-col h-[calc(100vh-72px)] bg-[#f5f0eb]">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side */}
        <div
          className="md:w-4/5 flex items-center justify-center p-8 bg-cover bg-center h-[calc(100vh-72px)]"
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

        {/* Right side */}
        <div className="md:w-2/5 flex items-start justify-center p-8 overflow-y-auto overflow-x-hidden h-[calc(100vh-72px)]">
          <div
            className="flex shadow-lg rounded-2xl overflow-hidden border border-[#d4a574] w-full max-w-md opacity-0 translate-x-full animate-slide-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-1 bg-[#d4a574]"></div>

            <div className="flex flex-col w-full p-6 sm:p-8 bg-white">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#362f22]">
                LuxeStay
              </h2>

              {message && (
                <p
                  className={`text-center mb-4 ${
                    isSuccess ? "text-[#d4a574]" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<User className="w-5 h-5" />}
                />

                <InputField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                />

                <button
                  type="submit"
                  className="w-full py-2 mt-2 bg-[#d4a574] text-white font-semibold rounded-lg hover:bg-[#b48c5a] transition-colors"
                >
                  Log In
                </button>
              </form>

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
