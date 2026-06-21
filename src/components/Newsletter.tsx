import React, { useState, useEffect } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    fbq: any;
  }
}

const Newsletter = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    whatsappNumber: "",
    teenAge: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const eventDate = new Date('2026-07-18T00:00:00');
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.parentName || !formData.email || !formData.whatsappNumber || !formData.teenAge) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("parent_name", formData.parentName);
      payload.append("email", formData.email);
      payload.append("whatsapp", formData.whatsappNumber);
      payload.append("teen_age", formData.teenAge);
      payload.append("source", "WestBridge Olympiad Registration");

      const response = await fetch("https://formspree.io/f/xojzgglz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.errors?.[0]?.message || "Submission failed");
      }

      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      toast.success("Registration submitted! We'll be in touch on WhatsApp shortly.");
      setFormData({ parentName: "", email: "", whatsappNumber: "", teenAge: "" });
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="w-full bg-white py-0">
      <div className="section-container">
        <div className="flex items-center gap-4 mb-6">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">05</span>
            <span>Join the Test</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Left Card - The Details */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end" style={{
              backgroundImage: "url('/background-section3.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold">
                The Olympiad Thinking Test
              </h2>
            </div>

            <div className="bg-white p-4 sm:p-8" style={{ backgroundColor: "#FFFFFF", border: "1px solid #ECECEC" }}>
              <h3 className="text-lg sm:text-xl font-display mb-6 sm:mb-8">
                One test to discover where your child can win.
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {[
                  { label: "Date", value: "18 July 2026" },
                  { label: "Location", value: "Hong Kong" },
                  { label: "Price", value: "HK$300" },
                  { label: "What it measures", value: "Reasoning style, current level, subject preferences" },
                  { label: "Outcome", value: "The best Olympiad direction for your child" },
                  { label: "Subjects covered", value: "Math · Physics · Chemistry · Biology · Informatics · Geography" },
                  { label: "Next step", value: "WestBridge handles all preparation from here" },
                ].map((item) => (
                  <div className="flex items-start gap-3" key={item.label}>
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
                        <span className="font-semibold text-base">{item.label}:</span> {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Countdown Timer */}
              <div className="mt-8 p-4 bg-gradient-to-r from-pulse-50 to-pulse-100 rounded-xl border border-pulse-200">
                <h4 className="text-lg font-semibold text-pulse-800 mb-4 text-center">Test Countdown</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-pulse-600">{timeLeft.days}</div>
                    <div className="text-xs text-gray-600">Days</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-pulse-600">{timeLeft.hours}</div>
                    <div className="text-xs text-gray-600">Hours</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-pulse-600">{timeLeft.minutes}</div>
                    <div className="text-xs text-gray-600">Minutes</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-pulse-600">{timeLeft.seconds}</div>
                    <div className="text-xs text-gray-600">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Contact Form */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex flex-col items-start" style={{
              backgroundImage: "url('/background-section1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}>
              <div className="inline-block px-4 sm:px-6 py-2 border border-white text-white rounded-full text-xs mb-4">
                Join the Test
              </div>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold mt-auto">
                Register your child
              </h2>
            </div>
            
            <div className="bg-white p-4 sm:p-8" style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #ECECEC"
            }}>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Parent Name</label>
                  <input 
                    type="text" 
                    name="parentName" 
                    value={formData.parentName} 
                    onChange={handleChange} 
                    placeholder="Enter parent's full name" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Enter email address" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    name="whatsappNumber" 
                    value={formData.whatsappNumber} 
                    onChange={handleChange} 
                    placeholder="Enter WhatsApp number" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Student Age</label>
                  <input
                    type="number"
                    name="teenAge"
                    value={formData.teenAge}
                    onChange={handleChange}
                    placeholder="Enter student's age"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-pulse-500 hover:bg-pulse-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors duration-300"
                  >
                    {isSubmitting ? "Submitting..." : "Join the Test — HK$300"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
