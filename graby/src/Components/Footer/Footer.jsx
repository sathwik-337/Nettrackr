import React from 'react';
import { BsGlobe2 } from 'react-icons/bs';
import { FaFacebookF, FaTwitter, FaInstagram, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Netlogo from '../../assests/net.png';
import { Parallax } from 'react-parallax';

export default function Footer() {
  const footerNavs = [
    {
      label: 'Resources',
      items: [
        { href:'/', name: 'Contact Us' },
        // { href: '/booking', name: 'Book Appointment' },
        // { href: '/ebook', name: 'Ebooks' },
        { href: '/blogs', name: 'Blogs' },
      ],
    },
    {
      label: 'About',
      items: [
        { href: '/disclaimer', name: 'Disclaimer' },
        { href: '/terms', name: 'Terms of Service' },
        { href: '/privacy', name: 'Privacy Policy' },
        { href: '/refund', name: 'Refund Policy' },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Parallax
      bgImage="https://c4.wallpaperflare.com/wallpaper/234/91/830/honeycomb-hexagon-dot-mesh-wallpaper-preview.jpg"
      strength={150}
      bgImageStyle={{ objectFit: 'cover', objectPosition: 'bottom' }}
    >
      <footer className="bg-black text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-12 md:px-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-10">
            <div className="md:flex-1">
              <img src={Netlogo} alt="NetTrackr Logo" className="w-24 mb-4" />
              <p className="text-sm leading-relaxed">
                Subscribe to our plans and get access to our Premium Analytics Dashboard, real-time click tracking, and advanced geofencing tools.
              </p>
              <div className="mt-4">
                <p className="text-sm">📧 support@nettrackr.in</p>
                <p className="text-sm">📞 +91-9876543210</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-10">
              {footerNavs.map((group, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-lg mb-3 text-white">{group.label}</h4>
                  <ul className="space-y-2 text-sm">
                    {group.items.map((item, j) => (
                      <li key={j}>
                        <Link
                          to={item.href}
                          className="hover:text-[#CCCCCC] transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                {/* <h4 className="font-semibold text-lg mb-3 text-white">Newsletter</h4> */}
                <p className="text-sm mb-3">Stay updated with our latest offers and features.</p>
                {/* <form className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-[#CCCCCC]"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-[#CCCCCC] transition-colors px-4 py-2 rounded text-black text-sm"
                  >
                    Subscribe
                  </button>
                </form> */}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between text-sm">
            <div>&copy; {new Date().getFullYear()} NetTrackr. All rights reserved.</div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <a
                href="https://twitter.com/EducatorAnanth"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CCCCCC] transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.facebook.com/educatorananth/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CCCCCC] transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://ananthprabhu.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CCCCCC] transition-colors"
              >
                <BsGlobe2 />
              </a>
              <a
                href="#top"
                onClick={scrollToTop}
                className="hover:text-[#CCCCCC] transition-colors"
              >
                <FaArrowUp />
              </a>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </footer>
    </Parallax>
  );
}
