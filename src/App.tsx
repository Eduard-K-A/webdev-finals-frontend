import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { SearchContextProvider } from "./context/SearchContext";
import Bookings from "./pages/Bookings";
import SignIn from "./pages/Login/SignIn";
import Register from "./pages/Login/Register";
import NavBar from "./components/Dashboard/NavBar";
import HotelDetail from "./pages/HotelDetail";
import Terms from "./pages/TermsAndConditions";
import Policy from "./pages/PrivacyPolicy";

function App() {
  return (
    <SearchContextProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Hotels/Search" element={<div>Hotel List Page</div>} />
          <Route path="/MyBookings" element={<Bookings />} />
          <Route path="/Signin" element={<SignIn />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Hotels/:id" element={<HotelDetail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/policy" element={<Policy />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </SearchContextProvider>
  );
}

export default App;
