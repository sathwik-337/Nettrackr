import React, { useState, useRef } from "react";
import { Element } from "react-scroll";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Cards from "./cards";
import Shareicon from "../assests/share (1).png";
import Monitoricon from "../assests/monitor.png";
import Linkicon from "../assests/link.png";
import BlogList from "./BlogList";
import ReCAPTCHA from "react-google-recaptcha";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.4, ease: "easeOut" },
  }),
};

export default function MainPage() {
  const [verified, setVerified] = useState(false);
  const formRef = useRef(null);

  const handleCaptcha = (value) => {
    if (value) setVerified(true);
  };

  const handleSubmit = (e) => {
    if (!verified) {
      e.preventDefault();
      alert("Please complete the reCAPTCHA.");
    }
  };

  return (
    <div className="pt-20 bg-white text-gray-800 min-h-screen">
      {/* HOME */}
      <Element name="home" className="scroll-mt-20">
        <motion.div
          className="min-h-screen flex flex-col justify-center items-center px-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="p-8 rounded-lg max-w-xl">
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 drop-shadow"
              custom={0.1}
              variants={fadeUp}
            >
              Navigate Your Audience
            </motion.h1>
            <motion.p
              className="text-lg mb-8 text-gray-700 max-w-xl"
              custom={0.2}
              variants={fadeUp}
            >
              Create a smart link, share it, and get real-time analytics about your
              visitors — IP, device, location, and more.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              custom={0.3}
              variants={fadeUp}
            >
              <Link
                to="/profile"
                className="bg-black hover:text-[#CCCCCC] text-white px-6 py-3 rounded-lg transition"
              >
                Create a Tracking Link
              </Link>
              <Link
                to="/features"
                className="border border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-lg transition"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </Element>

      {/* ABOUT */}
      <Element name="about" className="scroll-mt-20">
        <motion.section
          className="min-h-screen text-center py-20 px-6 bg-gray-100 rounded-lg mx-4 md:mx-20 my-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.1}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">How to use</h2>
          <p className="text-md max-w-2xl mx-auto mb-10 text-gray-700">
            Our platform creates a custom short link. When someone clicks it, we
            gather key information such as device, location, IP, and browser details
            – then redirect them to your target URL.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Cards
              icon={Linkicon}
              title="Generate Link"
              description="Create a shortened URL from your dashboard with redirection and logging enabled."
              textColor="text-gray-900"
            />
            <Cards
              icon={Shareicon}
              title="Share It"
              description="Send your link via email, social media, or any channel to the target user."
              textColor="text-gray-900"
            />
            <Cards
              icon={Monitoricon}
              title="View Logs"
              description="Access detailed visitor logs including IP address, device type, OS, and location."
              textColor="text-gray-900"
            />
          </div>
        </motion.section>
      </Element>

      {/* BLOG */}
      <Element name="blog" className="scroll-mt-20">
        <motion.section
          className="min-h-screen text-center py-20 px-6 max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.1}
        >
          <h2 className="text-3xl font-bold mb-10 text-gray-900">Blogs</h2>
          <BlogList darkMode={false} />
        </motion.section>
      </Element>

      {/* CONTACT */}
      <Element name="contact" className="scroll-mt-20">
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center p-6 max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.1}
        >
          <h2 className="text-3xl font-bold mb-10 text-gray-900">Contact Us</h2>
          <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden md:flex">
            {/* Contact Form */}
            <form
              ref={formRef}
              action="https://formspree.io/f/myzjkodo" // <-- Replace with your actual Formspree form ID
              method="POST"
              className="md:w-1/2 p-8 space-y-6 text-gray-800"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p className="text-gray-600">
                Have questions or need help? Fill out the form and we'll get back to you shortly.
              </p>
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CCCCCC]"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CCCCCC]"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CCCCCC]"
                  required
                />
              </div>

              {/* reCAPTCHA */}
              <ReCAPTCHA
                sitekey="6LcdllgrAAAAAAssBwPyFcDk7zi633DKgh5iN5pj" // <-- Replace with your actual reCAPTCHA site key
                onChange={handleCaptcha}
              />

              <button
                type="submit"
                className="w-full bg-black hover:text-[#CCCCCC] text-white text py-2 rounded-lg transition"
              >
                Send Message
              </button>
            </form>

            {/* Embedded Google Map */}
            <div className="md:w-1/2 h-80 md:h-auto">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019569450924!2d-122.41941558468103!3d37.77492927975859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f971efc9%3A0x9b2f8c9e1d7c329c!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </Element>
    </div>
  );
}
