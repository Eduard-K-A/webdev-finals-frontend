import React, { useState } from "react";
import axios from "axios";

// AnimatedText component with wave animation
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

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const inputClass =
    "w-full px-4 py-2 border border-[#d4a574] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574] hover:border-[#b48c5a] hover:shadow-md transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      {/* Send registration data to the backend */}
      const res = await axios.post("http://localhost:5000/auth/Register", {
        username,
        firstName,
        lastName,
        email,
        password,
      });
      setMessage(res.data.message || "Registered successfully!"); 
      {/* Reset form fields after successful registration */}
      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setMessage(err.response.data.message || "Registration failed");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-[#f5f0eb]">
      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - marketing text */}
        <div
          className="md:w-4/5 flex items-center justify-center p-8 bg-cover bg-center h-[calc(100vh-72px)]"
          style={{ backgroundImage: "url('/assets/registerPageImg.png')" }}
        >
          <div className="text-center md:text-left" style={{ animationDelay: "1s" }}>
            <AnimatedText text="Welcome to LuxeStay" />
            <p className="text-lg md:text-xl text-black-700 max-w-xl">
              Experience luxury at every stay. Join LuxeStay today and discover
              premium accommodations, exclusive deals, and a world of comfort
              tailored just for you.
            </p>
          </div>
        </div>

        {/* Right side - registration card */}
        <div className="md:w-2/5 flex items-start justify-center p-8 overflow-y-auto overflow-x-hidden h-[calc(100vh-72px)]">
          <div
            className="flex shadow-lg rounded-2xl overflow-hidden border border-[#d4a574] w-full opacity-0 translate-x-full animate-slide-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-1 bg-[#d4a574]"></div>
            <div className="flex flex-col w-full p-6 sm:p-8 bg-white">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#d4a574]">
                Create an Account
              </h2>

              {message && (
                <p
                  className={`text-center mb-4 ${
                    message.toLowerCase().includes("success")
                      ? "text-[#d4a574]"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputClass}
                />

                <button
                  type="submit"
                  className="w-full py-2 mt-2 bg-[#d4a574] text-white font-semibold rounded-lg hover:bg-[#b48c5a] transition-colors"
                >
                  Register
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <a
                  href="/Signin"
                  className="text-[#d4a574] font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Register;