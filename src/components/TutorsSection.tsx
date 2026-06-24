import React from "react";
import fettullah from "@/assets/fettullah.jpg.asset.json";
import ahmed from "@/assets/ahmed.jpg.asset.json";
import arseniy from "@/assets/arseniy.png.asset.json";
import { useLanguage } from "@/i18n/LanguageContext";

// Photos + names stay here; role/bullets/quote come from translations (same order).
const tutorMeta = [
  { name: "Fettullah", photo: fettullah.url, objectPos: "center 20%" },
  { name: "Arseniy", photo: arseniy.url, objectPos: "center 15%" },
  { name: "Ahmed", photo: ahmed.url, objectPos: "center 30%" },
];

const TutorsSection = () => {
  const { t } = useLanguage();
  const tutors = tutorMeta.map((meta, i) => ({ ...meta, ...t.tutors.list[i] }));
  return (
    <section className="py-12 sm:py-16 bg-gray-50" id="tutors">
      <div className="section-container">
        <div className="flex items-center gap-4 mb-6">
          <div className="pulse-chip">
            <span>{t.tutors.chip}</span>
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-10">{t.tutors.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tutors.map((tutor) => (
            <div key={tutor.name} className="group bg-white rounded-2xl overflow-hidden shadow-elegant flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(254,92,2,0.35)] ring-1 ring-black/5">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <img src={tutor.photo} alt={tutor.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" style={{ objectPosition: tutor.objectPos }} />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-display font-bold">{tutor.name}</h3>
                <p className="text-pulse-500 text-sm font-medium mb-3">{tutor.role}</p>
                <ul className="text-gray-700 text-sm mb-4 space-y-1.5">
                  {tutor.bullets.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-pulse-500 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 italic text-sm mt-auto border-l-2 border-pulse-500 pl-3">"{tutor.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorsSection;
