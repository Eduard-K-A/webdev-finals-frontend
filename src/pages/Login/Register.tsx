import React, { useState, useCallback } from "react"; // added useCallback to stabilize handlers
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, FileSignature } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// --- AnimatedText Component (wave animation) ---
const AnimatedText: React.FC<{ text: string; style?: React.CSSProperties }> = ({
  text,
  style,
}) => {
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

// Memoize the InputField to prevent it from re-rendering unnecessarily
const InputField = React.memo(
  ({
    label,
    type,
    placeholder,
    value,
    onChange,
    icon,
    rightIcon,
  }: {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    rightIcon?: React.ReactNode;
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-[#362f22] mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-3 text-[#d4a574]">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-[#d4a574]/70 bg-white text-[#362f22] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574] hover:border-[#b48c5a] hover:shadow-sm transition-all pl-10"
        />
        {rightIcon && (
          <span className="absolute right-3 top-3 text-[#d4a574] cursor-pointer select-none">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  )
);

const Register: React.FC = () => {
  // --- State Management ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Memoize handlers to prevent new function references each render

  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value),
    []
  );
  const handleLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value),
    []
  );
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (!agree) {
      setMessage("Please agree to the terms and privacy policy.");
      return;
    }

    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await axios.post(`${apiBaseUrl}/auth/Register`, {
        firstName,
        lastName,
        email,
        password,
      });

      setIsSuccess(true);
      setMessage(res.data.message || "Registered successfully!");

      // Automatically log in the user with the returned data
      if (res.data.user) {
        login(res.data.user);
      }

      // Reset fields after success
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setAgree(false);

      // Redirect to home page after 1 second
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setIsSuccess(false);
      if (axios.isAxiosError(err) && err.response) {
        setMessage(err.response.data.message || "Registration failed");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-[#FFFFFF]">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - marketing text */}
        <div
          className="md:w-4/5 flex items-center justify-center p-8 bg-cover bg-center h-[calc(100vh-72px)]"
          style={{ backgroundImage: "url('/assets/registerPageImg.png')" }}
        >
          <div
            className="text-center md:text-left"
            style={{ animationDelay: "1s" }}
          >
            <AnimatedText text="Welcome to LuxeStay" />
            <p className="text-lg md:text-xl text-[#362f22]/80 max-w-xl">
              Experience luxury at every stay. Join LuxeStay today and discover
              premium accommodations, exclusive deals, and a world of comfort
              tailored just for you.
            </p>
          </div>
        </div>

        {/* Right side - registration card */}
        <div className="md:w-2/5 flex items-start justify-center p-8 overflow-y-auto overflow-x-hidden h-[calc(100vh-72px)]">
          <div
            className="flex shadow-xl rounded-2xl overflow-hidden border border-[#d4a574]/60 w-full bg-white opacity-0 translate-x-full animate-slide-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-1 bg-[#d4a574]"></div>
            <div className="flex flex-col w-full p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#362f22]">
                Create an Account
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="First Name"
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  icon={<FileSignature className="w-5 h-5" />}
                />

                <InputField
                  label="Last Name"
                  type="text"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  icon={<FileSignature className="w-5 h-5" />}
                />

                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="your.email@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  icon={<Mail className="w-5 h-5" />}
                />

                {/* Password Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-[#362f22] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[#d4a574]">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 border border-[#d4a574]/70 bg-white text-[#362f22] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574] hover:border-[#b48c5a] hover:shadow-sm transition-all pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-[#d4a574] focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="accent-[#d4a574] w-4 h-4"
                  />
                  <label className="text-[#362f22]/80">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      state={{ fromRegister: true }}
                      className="text-[#d4a574] hover:underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/policy"
                      state={{ fromRegister: true }}
                      className="text-[#d4a574] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2 mt-2 bg-[#d4a574] text-white font-semibold rounded-lg hover:bg-[#b48c5a] transition-colors shadow-sm"
                >
                  Register
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  to="/Signin"
                  className="text-[#d4a574] font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
