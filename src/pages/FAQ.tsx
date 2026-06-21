import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqData = [
  {
    id: 1,
    question: "What is The Young CFO Weekend?",
    answer: "It's a 1-day U.S.-designed business simulation in Hong Kong where teens step into the role of a Chief Financial Officer (CFO) of a company, making real-world business and finance decisions in a safe, guided environment."
  },
  {
    id: 2,
    question: "Who is this program for?",
    answer: "For teens aged 15–18 who are curious about business, finance, entrepreneurship, or leadership — or who are still unsure about their future career path."
  },
  {
    id: 3,
    question: "Why should my teen attend instead of just reading books or watching videos?",
    answer: "Because experience beats theory. In one day, your teen will: Make decisions in realistic business scenarios, See the direct impact of their choices, Learn skills like budgeting, financial analysis, and strategic thinking, Build confidence and a competitive advantage for university applications."
  },
  {
    id: 4,
    question: "What will my teen learn?",
    answer: "How companies manage money and make financial decisions, How to read and understand financial statements, How to analyze profit, costs, and investments, How to work in a team and present business ideas, How to think like a leader."
  },
  {
    id: 5,
    question: "Will this help with university admissions?",
    answer: "Absolutely. Your teen will earn a U.S.-issued certificate, gain a unique experience that stands out in applications, and even have the option of receiving a personal recommendation letter from our CFO mentor."
  },
  {
    id: 6,
    question: "Who is the speaker and mentor?",
    answer: "Saul — CFO for multiple U.S. companies with combined revenues of $30M USD, founder of The Unboring CFO LLC in the U.S. and the finance tech startup FinGPT, and an instructor who has taught finance to over 1,000 students worldwide."
  },
  {
    id: 7,
    question: "Where will the event take place?",
    answer: "In a centrally located, modern training venue in Hong Kong. Exact address and details will be provided after registration."
  },
  {
    id: 8,
    question: "What's included in the ticket price?",
    answer: "Full-day participation (10:00–17:00), All learning materials and case studies, U.S.-issued certificate of completion, Bonus: 1-to-1 career session with Saul (for the ones who registered in 24 hours), Bonus: personal recommendation letter from Saul (for the ones who registered in 24 hours)."
  },
  {
    id: 9,
    question: "Is there a refund guarantee?",
    answer: "Yes — if your teen doesn't enjoy the program, we offer a 100% refund."
  },
  {
    id: 10,
    question: "My teen has no finance background. Will they understand?",
    answer: "Yes. The program is designed for beginners, with step-by-step guidance, interactive tasks, and team activities."
  },
  {
    id: 11,
    question: "My teen already studies business in school. Will this still be useful?",
    answer: "Definitely. This is practical, real-world learning, not just theory. Even advanced students benefit from applying their knowledge in a realistic CFO role."
  },
  {
    id: 12,
    question: "Will my teen be sitting in lectures all day?",
    answer: "No — this is not a boring classroom session. It's a mix of workshops, team challenges, role-playing, and real decision-making."
  },
  {
    id: 13,
    question: "Is English the main language of the program?",
    answer: "Yes, the program is conducted in English. Cantonese support is available if needed."
  },
  {
    id: 14,
    question: "Do parents attend as well?",
    answer: "The program is for teens only, but parents will receive a summary of what their teen learned and how to support them afterward."
  },
  {
    id: 15,
    question: "Is space limited?",
    answer: "Yes — we only accept 20–25 students per session to ensure personal attention."
  }
];

const objectionData = [
  {
    id: 1,
    objection: "HKD 2,000 for one day is too expensive.",
    response: "Think about the alternative — spending 4 years and hundreds of thousands of HKD on a degree your teen might not even use. This program could save you years of wasted time and tuition by helping your teen discover if business and finance are truly their path."
  },
  {
    id: 2,
    objection: "My teen is too young for finance.",
    response: "That's exactly why this is perfect — we teach finance in a fun, hands-on way that any motivated teen can understand, and early exposure builds a lifelong advantage."
  },
  {
    id: 3,
    objection: "What if my teen doesn't like it?",
    response: "No risk — if your teen doesn't love the experience, we refund 100% of your fee."
  },
  {
    id: 4,
    objection: "Can't they just learn this later at university?",
    response: "Yes, but by then it may be too late — they will already have committed time and money to a path they might not enjoy. Here they can explore risk-free."
  },
  {
    id: 5,
    objection: "Will one day really make a difference?",
    response: "One day can change everything. We've had students discover their passion for finance — or decide to pivot — after just a few hours in the CFO role."
  },
  {
    id: 6,
    objection: "I'm not sure my teen will fit in.",
    response: "We have a welcoming, small-group environment. Every teen is encouraged to participate and supported by the mentor and peers."
  },
  {
    id: 7,
    objection: "What if my teen is shy?",
    response: "That's fine. We design activities so everyone can contribute, whether they're outgoing or more reserved."
  }
];

export default function FAQ() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [expandedObjection, setExpandedObjection] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const toggleObjection = (id: number) => {
    setExpandedObjection(expandedObjection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions about our CFO workshop? Find answers to the most common questions from our participants.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq) => (
            <Card 
              key={faq.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md border-border"
              onClick={() => toggleCard(faq.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                      expandedCard === faq.id && "rotate-180"
                    )}
                  />
                </div>
                
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    expandedCard === faq.id 
                      ? "max-h-96 opacity-100 mt-4" 
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Objections Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Common Concerns & Our Responses
            </h2>
            <p className="text-lg text-muted-foreground">
              We understand parents have concerns. Here are honest answers to the most common ones.
            </p>
          </div>

          <div className="space-y-6">
            {objectionData.map((objection) => (
              <div
                key={objection.id}
                className="bg-muted/30 rounded-xl p-6 border-l-4 border-primary cursor-pointer transition-all duration-200 hover:bg-muted/50"
                onClick={() => toggleObjection(objection.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      💭 "{objection.objection}"
                    </h3>
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        expandedObjection === objection.id 
                          ? "max-h-96 opacity-100" 
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="pt-2">
                        <p className="text-muted-foreground leading-relaxed">
                          <span className="font-medium text-primary">Our response:</span> {objection.response}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4",
                      expandedObjection === objection.id && "rotate-180"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions? We'd love to help!
          </p>
        </div>
      </div>
    </div>
  );
}