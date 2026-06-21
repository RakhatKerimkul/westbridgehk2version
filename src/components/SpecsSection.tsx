import React from "react";

const SpecsSection = () => {
  return (
    <section className="w-full py-6 sm:py-10 bg-white" id="why">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center gap-4 mb-8 sm:mb-16">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
            <span>Why Olympiads</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="max-w-5xl pl-4 sm:pl-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight mb-6 sm:mb-8">
            <span className="block bg-clip-text text-transparent bg-[url('/text-mask-image.jpg')] bg-cover bg-center">
              "When we see an Olympiad medal on an application, we know we're looking at a student who can think under pressure and stay with a hard problem long after most would give up. That's the kind of mind we're trying to admit."
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 pl-1">— Admissions officer, top-10 global university</p>
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
