import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import MainPage from "./Pages/MainPage";
import LoginSignup from "./Pages/LoginSignup";
import Profile from "./Pages/Profile";
import Pricing from "./Pages/Pricing";
import Blogs from "./Pages/Blog";
import Features from "./Pages/Features";
import Disclaimer from './Pages/Disclaimer';
import TermsOfService from './Pages/TermsOfService';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import RefundPolicy from './Pages/RefundPolicy';

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideLayout = location.pathname === "/profile";

  const [loading, setLoading] = useState(false);
  const [targetPath, setTargetPath] = useState(null);

  // Call this function to navigate with loading spinner
  const handleNavigate = (path) => {
    setLoading(true);
    setTargetPath(path);
  };

  useEffect(() => {
    if (loading && targetPath) {
      const timer = setTimeout(() => {
        setLoading(false);
        navigate(targetPath);
        setTargetPath(null);
      }, 2000); // Loading duration in ms (2 seconds)

      return () => clearTimeout(timer);
    }
  }, [loading, targetPath, navigate]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="border-8 border-gray-300 border-t-8 border-t-blue-600 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<MainPage onNavigate={handleNavigate} />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/features" element={<Features />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
      </Routes>

      {!hideLayout && <Footer className="bg-gray-800 text-white py-4 text-center" />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
