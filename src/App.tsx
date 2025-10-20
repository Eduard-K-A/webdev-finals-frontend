import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { SearchContextProvider } from './context/SearchContext';
// import HotelListPage from './pages/HotelListPage'; // To be created next

function App() {
  return (
    <SearchContextProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels/search" element={<div>Hotel List Page </div>} />
          {/* Add other core routes here (HotelDetails, Auth, MyBookings) */}
        </Routes>
      </Router>
    </SearchContextProvider>
  );
}

export default App;