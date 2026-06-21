import React from "react";

const Row = ({ label, gold, silver, bronze }: { label: string; gold: number; silver: number; bronze: number }) => (
  <div className="grid grid-cols-4 items-center gap-2 sm:gap-4 py-4 border-b border-gray-200 last:border-0">
    <div className="text-xs sm:text-sm font-medium text-gray-700">{label}</div>
    <div className="text-center">
      <div className="text-xl sm:text-2xl font-bold" style={{ color: "#D4AF37" }}>{gold}</div>
      <div className="text-[10px] uppercase tracking-wider text-gray-500">Gold</div>
    </div>
    <div className="text-center">
      <div className="text-xl sm:text-2xl font-bold text-gray-400">{silver}</div>
      <div className="text-[10px] uppercase tracking-wider text-gray-500">Silver</div>
    </div>
    <div className="text-center">
      <div className="text-xl sm:text-2xl font-bold" style={{ color: "#CD7F32" }}>{bronze}</div>
      <div className="text-[10px] uppercase tracking-wider text-gray-500">Bronze</div>
    </div>
  </div>
);

const MedalsSection = () => (
  <section className="py-12 sm:py-16 bg-white" id="medals">
    <div className="section-container">
      <div className="flex items-center gap-4 mb-6">
        <div className="pulse-chip">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">03</span>
          <span>Results</span>
        </div>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">Medals from the same methodology</h2>
      <p className="text-gray-600 mb-10 max-w-3xl">
        Outcomes from students trained through the same methodology and programme model across international, republic, and state-level Olympiads.
      </p>

      <div className="rounded-2xl border border-gray-200 shadow-elegant p-4 sm:p-8 bg-white">
        <Row label="International (last 2 years)" gold={31} silver={71} bronze={102} />
        <Row label="Republic 2026" gold={52} silver={67} bronze={127} />
        <Row label="Republic 2025" gold={41} silver={72} bronze={131} />
      </div>
    </div>
  </section>
);

export default MedalsSection;
