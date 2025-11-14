import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Dashboard/HomePage";
import { SearchContextProvider } from "./context/SearchContext";
import { AuthContextProvider } from "./context/AuthContext";
import MyBookings from "./pages/User/MyBooking";
import Book from "./pages/User/Book";
import User from "./pages/Admin/User";
import SignIn from "./pages/Login/SignIn";
import Register from "./pages/Login/Register";
import NavBar from "./components/Dashboard/NavBar";
import RoomDetail from "./pages/Room/RoomDetail";
import Terms from "./pages/Terms/TermsAndConditions";
import Policy from "./pages/Terms/PrivacyPolicy";
import ManageRoom from "./pages/Admin/ManageRoom";
import RoomLayout from "./pages/Room/RoomLayout";

function App() {
  return (
    <AuthContextProvider>
      <SearchContextProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Hotels/Search" element={<div>Hotel List Page</div>} />
            <Route path="/Rooms" element={<RoomLayout />} />
            <Route path='/Rooms/Search' element={<RoomLayout />} />
            <Route path="/Book/:roomId" element={<Book />} />
            <Route path="/MyBookings" element={<MyBookings />} />
            <Route path="/Signin" element={<SignIn />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Hotels/:id" element={<RoomDetail />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/Admin/ManageRoom" element={<ManageRoom />} />
            <Route path="/Admin/Users" element={<User />} />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Router>
      </SearchContextProvider>
    </AuthContextProvider>
  );
}

export default App;
