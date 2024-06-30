import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './pages/Header/Header';
import Footer from './pages/Footer/Footer';
import About from './pages/About/About';
import Home from './pages/Home/Home';
import Fields from './pages/Fields/Fields';
import Contact from './pages/Contact/Contact';
import './User.css';

function UserApp() {
  return (
    <div>
        
      <Header />
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="hakkimizda" element={<About />} />
        <Route path="sahalarimiz" element={<Fields />} />
        <Route path="iletisim" element={<Contact />} />
      </Routes>
    </div>
    <Footer />
    </div>
  );
}

export default UserApp;
