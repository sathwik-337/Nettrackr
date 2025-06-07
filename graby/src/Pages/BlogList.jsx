import React from 'react';
import BlogCard from './Blogs'; // Assuming BlogCard displays a card UI for one blog
import { Link } from 'react-router-dom';
import './BlogCard.css';
import vpnImg from '../assests/VPN.jpg';
import ipImg from '../assests/IP.jpg';
import dnsImg from '../assests/DNS.jpg';
import firewallImg from '../assests/FIRE.jpg';
import sniffingImg from '../assests/SNIF.jpg';

const cards = [
  {
    title: 'VPN Security',
    description: 'VPNs encrypt your internet traffic and mask your online identity, improving privacy and security when browsing.',
    imageUrl: vpnImg,
  },
  {
    title: 'IP Address Tracking',
    description: 'Each device online has a unique IP address. IP tracking helps identify device location and activity.',
    imageUrl: ipImg,
  },
  {
    title: 'DNS Explained',
    description: 'DNS (Domain Name System) converts domain names into IP addresses so browsers can load websites.',
    imageUrl: dnsImg,
  },
  {
    title: 'Firewall Basics',
    description: 'Firewalls filter traffic to protect your device or network from unauthorized access.',
    imageUrl: firewallImg,
  },
  {
    title: 'Network Sniffing',
    description: 'Network sniffing tools monitor and capture data packets moving through your network.',
    imageUrl: sniffingImg,
  }
];

const BlogList = () => {
  const allCards = [...cards, ...cards]; // for scroll effect

  return (
    <div className="blog-card-scroll-wrapper">
      <div className="blog-card-scroll-track">
        {allCards.map((card, idx) => (
          <div key={idx} className="blog-card-wrapper">
            <BlogCard
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
            />
            <Link
              to="/blogs"
              className="read-more-btn bg-black text-white px-4 py-2 rounded mt-2 inline-block hover:text-[#CCCCCC] transition"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
