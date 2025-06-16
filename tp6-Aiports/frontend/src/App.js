import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddAirport from "./pages/AddAirport";
import PopularAirports from "./pages/PopularAirports";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-airport" element={<AddAirport />} />
        <Route path="/popular" element={<PopularAirports />} />
      </Routes>
    </Router>
  );
}

export default App;


