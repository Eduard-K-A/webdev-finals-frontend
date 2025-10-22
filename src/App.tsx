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
          <Route path="/hotels/search" element={<div>Hotel List Page </div>} />
          <Route path="/myBookings" element={<Bookings />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />

          <Route path="*" element={<div>404 Not Found</div>} />

        </Routes>
      </Router>
    </SearchContextProvider>
  );
}

export default App;
