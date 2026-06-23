import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import medalCeremony from "@/assets/hero-hk.jpg.asset.json";


const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      className="overflow-hidden relative bg-cover"
      id="hero"
      style={{
        backgroundImage: 'url("/Header-background.webp")',
        backgroundPosition: "center 30%",
        padding: isMobile ? "100px 12px 40px" : "120px 20px 60px",
      }}
    >
      <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-pulse-gradient opacity-20 blur-3xl rounded-full"></div>

      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <div className="pulse-chip mb-3 sm:mb-6">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">01</span>
              <span>Hong Kong</span>
            </div>

            <h1 className="section-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
              Olympiads are the path to the world's top universities.
            </h1>

            <p className="section-subtitle mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed text-gray-950 font-normal text-base sm:text-lg text-left">
              One diagnostic test. We choose the right subject. We handle the preparation.
              Parents take one step — register your child for the Olympiad Thinking Test.
            </p>

            <p className="mb-6 text-sm text-gray-600">
              Limited seats for the 18 July test.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#newsletter"
                className="relative flex items-center justify-center group w-full sm:w-auto text-center min-h-[52px] touch-manipulation"
                style={{
                  backgroundColor: "#FE5C02",
                  borderRadius: "1440px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "20px",
                  padding: "16px 24px",
                  border: "none",
                  display: "block",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                <span className="pointer-events-none flex items-center justify-center w-full">
                  Join the Test
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 pointer-events-none" />
                </span>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0 group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-pulse-500/40 via-pulse-300/20 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(254,92,2,0.45)] group-hover:-translate-y-1">
              <img
                src={medalCeremony.url}
                alt="Hong Kong team holding the HK flag and gold medals at the International Physics Olympiad"
                width={1200}
                height={1600}
                className="w-full h-[520px] sm:h-[640px] lg:h-[720px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-7 text-white">
                <div className="text-xs uppercase tracking-widest opacity-80 mb-1">Olympiad Thinking Test</div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl sm:text-4xl font-display font-bold">18 July</div>
                    <div className="text-sm opacity-90">Hong Kong</div>
                  </div>
                  <p className="text-xs sm:text-sm opacity-90 italic max-w-[55%] text-right">
                    "No one knows what he is capable of doing until he tries."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
