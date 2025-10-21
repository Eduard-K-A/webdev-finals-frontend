import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { SearchContextProvider } from './context/SearchContext';
import Bookings from './pages/Bookings';
import SignIn from './components/Login/SignIn';
import Register from './components/Login/Register';
import NavBar from './components/Dashboard/NavBar';
import Hotels from './components/Hotels/Hotels';

function App() {
  return (
 

    <SearchContextProvider> 
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels/search" element={<div>Hotel List Page </div>} />
          <Route path="/Bookings" element={<Bookings />} />
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path='/hotels/:id' element ={<Hotels/>} />
        </Routes>
      </Router>
    </SearchContextProvider>

  );
}

export default App;