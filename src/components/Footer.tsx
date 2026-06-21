import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white py-12 border-t border-gray-100">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display font-bold mb-2">WestBridge Olympiad Academy</h3>
            <p className="text-gray-600">Olympiad preparation for ambitious Hong Kong students.</p>
          </div>
          <div className="space-y-2 md:text-right">
            <a href="https://wa.me/message/ABMUZYYPNTEVI1" target="_blank" rel="noreferrer" className="flex md:justify-end items-center gap-2 text-gray-700 hover:text-pulse-500">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href="mailto:westbridgehk@gmail.com" className="flex md:justify-end items-center gap-2 text-gray-700 hover:text-pulse-500">
              <Mail size={16} /> westbridgehk@gmail.com
            </a>
            <a href="tel:+85270520288" className="flex md:justify-end items-center gap-2 text-gray-700 hover:text-pulse-500">
              <Phone size={16} /> (+852) 7052 0288
            </a>
            <a href="https://www.instagram.com/westbridge.hk/" target="_blank" rel="noreferrer" className="flex md:justify-end items-center gap-2 text-gray-700 hover:text-pulse-500">
              <Instagram size={16} /> @westbridge.hk
            </a>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} WestBridge Olympiad Academy · Hong Kong ·{" "}
          <Link to="/privacy-policy" className="text-pulse-500 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
