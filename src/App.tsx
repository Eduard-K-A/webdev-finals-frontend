import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { SearchContextProvider } from "./context/SearchContext";
import Bookings from "./pages/Bookings";
import SignIn from "./components/Login/SignIn";
import Register from "./components/Login/Register";
import NavBar from "./components/Dashboard/NavBar";
import HotelDetail from "./components/Hotels/HotelDetail";

function App() {
  return (
    <SearchContextProvider>
      <Router>
        <NavBar />
        <Routes>
          
          <Route path="/" element={<HomePage />} />
          <Route path="/Hotels/Search" element={<div>Hotel List Page </div>} />
          <Route path="/MyBookings" element={<Bookings />} />
          <Route path="/Signin" element={<SignIn />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Hotels/:id" element={<HotelDetail />} />

          <Route path="*" element={<div>404 Not Found</div>} />

        </Routes>
      </Router>
    </SearchContextProvider>
  );
}

export default App;
