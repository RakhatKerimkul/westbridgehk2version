import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const SpecsSection = () => {
  const { t } = useLanguage();
  return (
    <section className="w-full py-6 sm:py-10 bg-white" id="why">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center gap-4 mb-8 sm:mb-16">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
            <span>{t.why.chip}</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="max-w-5xl pl-4 sm:pl-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight mb-6 sm:mb-8">
            <span className="block bg-clip-text text-transparent bg-[url('/text-mask-image.jpg')] bg-cover bg-center">
              {t.why.quote}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 pl-1">{t.why.attribution}</p>
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
