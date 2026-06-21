import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SpecsSection from "@/components/SpecsSection";
import MedalsSection from "@/components/MedalsSection";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import Schedule from "@/components/Schedule";
import TutorsSection from "@/components/TutorsSection";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = (this as HTMLAnchorElement).getAttribute("href")?.substring(1);
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        const offset = window.innerWidth < 768 ? 100 : 80;
        window.scrollTo({ top: targetElement.offsetTop - offset, behavior: "smooth" });
      });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="space-y-4 sm:space-y-8">
        <Hero />
        <SpecsSection />
        <ImageShowcaseSection />
        <Schedule />
        <TutorsSection />
        <MedalsSection />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
