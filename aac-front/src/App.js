import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Aprender from "./pages/Aprender"; 
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";


function App() {
  return (
    <>
      <Navbar />

      <div style={{ padding: 0, margin: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/aprender" element={<Aprender />} />
          <Route
              path="/admin"
              element={
                localStorage.getItem("isAdmin") === "true" ? (
                  <Admin />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/login" element={<Login />} />

        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
