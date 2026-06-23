import React from "react";

interface Node {
  num: string;
  title: string;
  caption: string;
  wide?: boolean;
}

const nodes: Node[] = [
  { num: "01", title: "The Thinking Test", caption: "The entry gate" },
  { num: "02", title: "Choose Your Discipline", caption: "Math · Physics · Chemistry · Biology · Informatics" },
  { num: "03", title: "Preparation", caption: "Weekly coaching · problem sets · mock olympiads · mentorship", wide: true },
  { num: "04", title: "Win the Olympiad", caption: "Regional → National → International" },
  { num: "05", title: "Step Into Your Future", caption: "Top-tier university admission" },
];

const Schedule = () => {
  return (
    <section className="py-16 sm:py-24 relative bg-[#FAF6EE]" id="path">
      <div className="section-container">
        <div className="mb-12 sm:mb-16">
          <div className="pulse-chip mb-4">
            <span>Student Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3">
            From one test to a university-ready profile
          </h2>
          <p className="text-pulse-500 font-medium tracking-wide">Secure Your Spot →</p>
        </div>

        {/* Desktop / tablet diagram */}
        <div className="hidden md:block">
          <div className="grid grid-cols-5 gap-4 items-stretch">
            {nodes.map((n) => (
              <div key={n.num} className="text-center">
                <div className="text-pulse-500 font-semibold text-sm mb-3">{n.num}</div>
              </div>
            ))}
          </div>

          <div className="relative">
            {/* connecting line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-gray-300 -translate-y-1/2 z-0"></div>
            <div className="relative grid grid-cols-5 gap-4 items-center z-10">
              {nodes.map((n) => (
                <div key={n.num} className="flex justify-center">
                  <div
                    className={`group bg-[#FAF6EE] border border-gray-300 flex items-center justify-center text-center px-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(254,92,2,0.35)] hover:border-pulse-400 ${
                      n.wide
                        ? "rounded-[140px] h-40 w-full"
                        : "rounded-full h-40 w-40"
                    }`}
                  >
                    <h3 className="font-display font-bold text-base lg:text-lg leading-tight">
                      {n.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-6">
            {nodes.map((n) => (
              <p key={n.num} className="text-center text-xs lg:text-sm text-gray-600 px-2">
                {n.caption}
              </p>
            ))}
          </div>
        </div>

        {/* Mobile vertical stack */}
        <div className="md:hidden space-y-4">
          {nodes.map((n, i) => (
            <div key={n.num} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-pulse-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {n.num}
                </div>
                {i < nodes.length - 1 && <div className="w-px flex-1 bg-gray-300 my-1 min-h-[24px]"></div>}
              </div>
              <div className="flex-1 pb-4">
                <h3 className="font-display font-bold text-lg">{n.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{n.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
