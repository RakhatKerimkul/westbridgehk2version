import React from "react";
import { Sigma, Atom, FlaskConical, Dna, Code2, Globe2, LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

// Icons stay here; the subject names come from translations (same order).
const subjectIcons: LucideIcon[] = [Sigma, Atom, FlaskConical, Dna, Code2, Globe2];

const ImageShowcaseSection = () => {
  const { t } = useLanguage();
  return (
    <section className="w-full pt-0 pb-8 sm:pb-12 bg-white" id="subjects">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            {t.subjects.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            {t.subjects.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {t.subjects.items.map((name, i) => {
            const Icon = subjectIcons[i];
            return (
              <div
                key={name}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-elegant transition-shadow flex flex-col items-center"
              >
                <Icon className="w-9 h-9 sm:w-10 sm:h-10 mb-3 text-pulse-500" strokeWidth={1.75} />
                <div className="font-semibold text-gray-900 text-sm sm:text-base">{name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;
