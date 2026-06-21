import React, { useRef } from "react";
import story1 from "@/assets/story-1-edited.jpg.asset.json";
import story2 from "@/assets/story-2-edited.jpg.asset.json";
import story3 from "@/assets/story-3.jpg.asset.json";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  image: string;
}

const testimonials: TestimonialProps[] = [
  {
    content:
      "Without a mentor I would have spent months stuck on the wrong problems. Having someone who already walked the road tell me exactly what to fix changed everything.",
    author: "HKPhO Gold 2026",
    role: "Grade 8 student",
    image: story1.url,
  },
  {
    content:
      "EuPhO silver and APhO bronze taught me that the jump is never magic. It is one careful correction after another.",
    author: "EuPhO Silver · APhO Bronze 2026",
    role: "Final-year secondary school student",
    image: story2.url,
  },
  {
    content:
      "I never thought companies would actively search for Olympiad winners even after four years of bachelor's. The skills you build on the way stay with you for life.",
    author: "IOI Bronze Medalist",
    role: "HKU graduate · Huawei",
    image: story3.url,
  },
];

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
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section className="py-12 bg-white relative" id="stories" ref={sectionRef}>
      <div className="section-container">
        <div className="flex items-center gap-4 mb-6">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
            <span>Success Stories</span>
          </div>
        </div>

        <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-left">From students trained on the same methodology</h2>
        <p className="text-gray-600 mb-12 max-w-3xl">
          These outcomes come from students trained through the same methodology and programme model across international, republic, and state-level Olympiads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
