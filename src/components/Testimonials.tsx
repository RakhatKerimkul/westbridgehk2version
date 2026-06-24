import React, { useRef } from "react";
import story1 from "@/assets/story-1-edited.jpg.asset.json";
import story2 from "@/assets/story-2-edited.jpg.asset.json";
import story3 from "@/assets/story-3.jpg.asset.json";
import { useLanguage } from "@/i18n/LanguageContext";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  image: string;
}

// Images stay here; content/author/role come from translations (same order).
const storyImages = [story1.url, story2.url, story3.url];

const TestimonialCard = ({ content, author, role, image }: TestimonialProps) => (
  <div className="group rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(254,92,2,0.35)] hover:border-pulse-200">
    <div className="relative h-56 overflow-hidden">
      <img
        src={image}
        alt={author}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/80" />
      <div className="absolute bottom-3 left-4 right-4 text-white">
        <h4 className="font-semibold text-lg leading-tight drop-shadow-md">{author}</h4>
        <p className="text-white/90 text-sm drop-shadow">{role}</p>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col justify-between">
      <p className="text-gray-800 text-base leading-relaxed">{`"${content}"`}</p>
    </div>
  </div>
);

const Testimonials = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section className="py-12 bg-white relative" id="stories" ref={sectionRef}>
      <div className="section-container">
        <div className="flex items-center gap-4 mb-6">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
            <span>{t.stories.chip}</span>
          </div>
        </div>

        <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-left">{t.stories.title}</h2>
        <p className="text-gray-600 mb-12 max-w-3xl">
          {t.stories.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.stories.list.map((story, i) => (
            <TestimonialCard key={i} {...story} image={storyImages[i]} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
