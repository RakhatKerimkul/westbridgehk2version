import React from "react";
import fettullah from "@/assets/fettullah.jpg.asset.json";
import ahmed from "@/assets/ahmed.jpg.asset.json";
import arseniy from "@/assets/arseniy.png.asset.json";

const tutors = [
  {
    name: "Fettullah",
    role: "Math Coach · IMO Silver Medalist",
    bio: "Studied Computer Science at HKUST. Believes mathematics becomes visible everywhere once students learn to think deeply.",
    quote:
      "Olympiads are a huge advantage even after your bachelor's and master's. Companies are hunting for people who can think like this.",
    photo: fettullah.url,
    objectPos: "center 20%",
  },
  {
    name: "Arseniy",
    role: "Physics Coach · 6 years teaching",
    bio: "Winner/medalist of IJSO, Balkan Physics Olympiad, International Tuymaada, Zhautykov, and Kazakhstan Republic Physics Olympiad.",
    quote: "Physics rewards students who are willing to stay with a problem after the obvious method fails.",
    photo: arseniy.url,
    objectPos: "center 15%",
  },
  {
    name: "Ahmed",
    role: "Informatics Coach · IOI Bronze",
    bio: "HKU full scholarship. ICPC regional medalist. Two-time Kazakhstan National Olympiad gold medalist.",
    quote:
      "CS is no longer optional. Students who learn algorithms early understand the world before everyone else catches up.",
    photo: ahmed.url,
    objectPos: "center 30%",
  },
];

const TutorsSection = () => (
  <section className="py-12 sm:py-16 bg-gray-50" id="tutors">
    <div className="section-container">
      <div className="flex items-center gap-4 mb-6">
        <div className="pulse-chip">
          <span>Tutors</span>
        </div>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-10">Coached by Olympiad medalists</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {tutors.map((t) => (
          <div key={t.name} className="group bg-white rounded-2xl overflow-hidden shadow-elegant flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(254,92,2,0.35)] ring-1 ring-black/5">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
              <img src={t.photo} alt={t.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" style={{ objectPosition: t.objectPos }} />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-display font-bold">{t.name}</h3>
              <p className="text-pulse-500 text-sm font-medium mb-3">{t.role}</p>
              <p className="text-gray-700 text-sm mb-4">{t.bio}</p>
              <p className="text-gray-600 italic text-sm mt-auto border-l-2 border-pulse-500 pl-3">"{t.quote}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TutorsSection;
