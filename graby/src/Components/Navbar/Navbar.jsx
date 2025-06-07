import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import { Parallax } from 'react-parallax';
import { auth } from '../../firebase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('shadow-lg', window.scrollY > 80);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (link) => {
    setMobileOpen(false);
    if (link.scroll === false) {
      navigate(`/${link.to}`);
    } else {
      if (location.pathname === '/') {
        scroller.scrollTo(link.to, { smooth: true, offset: -80, duration: 500 });
      } else {
        navigate('/', { state: { scrollTo: link.to } });
      }
    }
  };

  const navLinks = [
    { to: 'home', label: 'Home' },
    { to: 'about', label: 'About' },
    { to: 'blog', label: 'Blog' },
    { to: 'contact', label: 'Contact Us' },
    { to: 'features', label: 'Service', scroll: false },
    { to: 'pricing', label: 'Pricing', scroll: false },
  ];

  return (
    <>
      <Parallax
        bgImage="https://c4.wallpaperflare.com/wallpaper/234/91/830/honeycomb-hexagon-dot-mesh-wallpaper-preview.jpg"
        strength={200}
        bgImageStyle={{ objectFit: 'cover', objectPosition: 'top', minHeight: '100px' }}
      >
        <nav
          ref={navRef}
          className="fixed top-0 w-full bg-black/90 border-b border-gray-800 z-50 backdrop-blur-md transition-shadow"
        >
          <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
            <button
              onClick={() => handleNavClick({ to: 'home', scroll: true })}
              className="text-2xl font-semibold text-white hover:text-[#cccccc]"
            >
              NetTrackr
            </button>

            <div className="hidden md:flex space-x-8">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className="group relative text-white font-medium transition text-base"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#cccccc] transition-all duration-300 group-hover:w-full"></span>
                  <span className="ml-1 inline-block transform translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <NavLink to="/profile">
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                  />
                </NavLink>
              ) : (
                <NavLink
                  to="/auth"
                  className="px-4 py-2 border border-[#cccccc] rounded hover:bg-[#333333] text-white transition text-base"
                >
                  Login
                </NavLink>
              )}

              <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 text-white">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden transform transition-all duration-300 ease-in-out ${
              mobileOpen ? 'max-h-screen opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
            } overflow-hidden bg-black text-white px-6 pb-6 pt-2 space-y-4`}
          >
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link)}
                className="group block text-white font-medium text-base relative"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#cccccc] transition-all duration-300 group-hover:w-full"></span>
                <span className="ml-1 inline-block transform translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  →
                </span>
              </button>
            ))}
            <div className="pt-2 border-t border-gray-700">
              {user ? (
                <NavLink to="/profile" onClick={() => setMobileOpen(false)}>
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mt-2"
                  />
                </NavLink>
              ) : (
                <NavLink
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 border border-[#cccccc] rounded hover:bg-[#333333] mt-2 text-base"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </nav>

        <div className="h-20" />
      </Parallax>
    </>
  );
}
