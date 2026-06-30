import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackMetaEvent } from "@/lib/metaPixel";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-white py-12 border-t border-gray-100">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display font-bold mb-2">{t.footer.name}</h3>
            <p className="text-gray-600">{t.footer.tagline}</p>
          </div>
          <div className="space-y-2 md:text-right">
            <a
              href="https://wa.me/message/ABMUZYYPNTEVI1"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackMetaEvent("Contact")}
              className="flex md:justify-end items-center gap-2 text-gray-700 hover:text-pulse-500"
            >
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
          © {new Date().getFullYear()} {t.footer.name} · {t.footer.location} ·{" "}
          <Link to="/privacy-policy" className="text-pulse-500 hover:underline">{t.footer.privacy}</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
