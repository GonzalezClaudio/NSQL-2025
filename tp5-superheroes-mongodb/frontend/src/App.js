import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Marvel from './pages/Marvel';
import DC from './pages/DC';
import AddHero from './pages/AddHero';
import Header from './components/Header';
import HeroDetail from './components/HeroDetail';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marvel" element={<Marvel />} />
        <Route path="/dc" element={<DC />} />
        <Route path="/agregar" element={<AddHero />} />
        <Route path="/superheroe/:nombre" element={<HeroDetail />} />

        {/* <Route path="/superheroe/:nombre" element={<Detalle />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


