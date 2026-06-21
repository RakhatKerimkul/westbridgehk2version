import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Star, CheckCircle, Mail, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  warmupText: string;
  imageUrl?: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "If your teen had to choose a career today, how confident would you feel they'd make the right choice?",
    options: ["Not at all confident", "Somewhat confident", "Very confident", "Absolutely certain"],
    warmupText: "The Young CFO Weekend gives them that chance — a safe, 1-day, U.S.-designed business simulation where they run a company, make financial decisions, and discover if business & finance could be their passion."
  },
  {
    id: 2,
    question: "Who would you trust to mentor your teen in finance?",
    options: ["A CFO instructor", "A business owner", "A CFO working with American companies"],
    warmupText: "Your teen will be mentored by Saul, who embodies all three qualities you're looking for:\n• CFO Instructor – Trained over 1,000 adults from scratch to become CFOs, helping them build successful careers in finance.\n• Business Owner – Founder of The Unboring CFO LLC in the U.S. and FinGPT, an innovative AI-powered finance startup.\n• CFO for U.S. Companies – Advises multiple trucking companies in the United States with a combined annual revenue of over $30M USD.",
    imageUrl: "/lovable-uploads/3354400f-f154-44ab-b133-b605b1cc6c96.png"
  },
  {
    id: 3,
    question: "Where do you think it's better to learn business skills?",
    options: ["Online", "In a real-world simulation", "Doesn't matter"],
    warmupText: "The Young CFO Weekend takes place in a premium office space in a Hong Kong skyscraper — designed to recreate the authentic corporate atmosphere. The exact venue address will be available after booking.",
    imageUrl: "/lovable-uploads/912cca57-7b63-4bd1-8d7a-5db80f28ca4c.png"
  },
  {
    id: 4,
    question: "Would you like to give your teen a unique U.S. certificate that stands out in university applications?",
    options: ["Yes", "Not sure"],
    warmupText: "Graduates receive a U.S.-issued certificate — a unique asset for their university portfolio.",
    imageUrl: "/lovable-uploads/7a1b8100-7156-4639-91f0-0238fa770b3f.png"
  },
  {
    id: 5,
    question: "How much is it worth for your teen to gain career confidence — without spending 4 years and hundreds of thousands of Hong Kong dollars on a degree they might not even use?",
    options: [
      "Priceless",
      "$10,000 HKD", 
      "$2,000 HKD",
      "$0 — We'll figure it out later"
    ],
    warmupText: "For just $2,000 HKD, your teen can test-drive the finance world in a single day, guided by a U.S. CFO mentor. One day could save you years of tuition and hundreds of thousands in the wrong career path."
  },
  {
    id: 6,
    question: "Which bonus would you choose if you reserved your teen's seat in the next 24 hours?",
    options: [
      "HK$200 discount — save instantly on your registration fee.",
      "1-to-1 meeting with Saul, the speaker, to discuss your teen's career perspectives.",
      "Personal recommendation letter from Saul for your teen — great for university applications."
    ],
    warmupText: ""
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'quiz' | 'warmup' | 'final' | 'loading'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [parentName, setParentName] = useState("");
  const [teenName, setTeenName] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Preload images function
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (preloadedImages.has(url)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(url));
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Preload next question's image when current question loads
  useEffect(() => {
    const preloadNextImage = async () => {
      if (currentStep === 'quiz' || currentStep === 'warmup') {
        const nextQuestionIndex = currentQuestion + 1;
        if (nextQuestionIndex < quizQuestions.length) {
          const nextQuestion = quizQuestions[nextQuestionIndex];
          if (nextQuestion.imageUrl) {
            try {
              await preloadImage(nextQuestion.imageUrl);
              console.log(`Preloaded image for question ${nextQuestionIndex + 1}`);
            } catch (error) {
              console.error('Failed to preload image:', error);
            }
          }
        }
      }
    };

    preloadNextImage();
  }, [currentStep, currentQuestion, preloadedImages]);

  // Initial preload of first few images
  useEffect(() => {
    const preloadInitialImages = async () => {
      const imagesToPreload = quizQuestions
        .slice(0, 3) // Preload first 3 images
        .filter(q => q.imageUrl)
        .map(q => q.imageUrl!);

      for (const imageUrl of imagesToPreload) {
        try {
          await preloadImage(imageUrl);
        } catch (error) {
          console.error('Failed to preload initial image:', imageUrl, error);
        }
      }
    };

    preloadInitialImages();
  }, []);

  // Handle image loading states
  const handleImageLoad = (imageUrl: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };

  const handleImageLoadStart = (imageUrl: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  // Countdown timer
  useEffect(() => {
    if (currentStep === 'final' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    if (parentName.trim() && teenName.trim()) {
      setCurrentStep('quiz');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      setSelectedAnswer("");
      
      if (currentQuestion === quizQuestions.length - 1) {
        // Quiz completed - show loading and save results
        setCurrentStep('loading');
        saveQuizResults(newAnswers);
      } else {
        setCurrentStep('warmup');
      }
    }
  };

  const continueFromWarmup = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentStep('quiz');
    }
  };

  const saveQuizResults = async (finalAnswers: string[]) => {
    try {
      // Prepare quiz responses
      const responses = quizQuestions.map((question, index) => ({
        question: question.question,
        answer: finalAnswers[index],
        options: question.options
      }));

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: saveError } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: user?.id || null,
          user_email: null,
          parent_name: parentName,
          teen_name: teenName,
          responses: responses,
          score: finalAnswers.length,
          completed_at: new Date().toISOString()
        });

      if (saveError) {
        console.error('Error saving quiz results:', saveError);
      }

      // Send Telegram notification
      const { error: notificationError } = await supabase.functions.invoke('send-quiz-notification', {
        body: {
          parentName,
          teenName,
          responses,
          score: finalAnswers.length,
          completedAt: new Date().toISOString()
        }
      });

      if (notificationError) {
        console.error('Notification error:', notificationError);
      }

    } catch (error: any) {
      console.error('Error processing quiz completion:', error);
    } finally {
      // Always proceed to final step regardless of save/notification success
      setCurrentStep('final');
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl diploma-shadow animate-diploma-glow">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4 diploma-heading">
                Is The Young CFO Weekend Right for Your Teen?
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Find out in 2 minutes — and unlock special bonuses for registering your teen's seat within 24 hours.
              </p>
              <div className="w-24 h-0.5 bg-diploma-gold mx-auto my-6"></div>
            </div>

            <div className="space-y-6">
                <div>
                  <Label htmlFor="parentName" className="text-base font-medium">Parent's Name</Label>
                  <Input
                    id="parentName"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="teenName" className="text-base font-medium">Teen's Name</Label>
                  <Input
                    id="teenName"
                    value={teenName}
                    onChange={(e) => setTeenName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter your teen's name"
                  />
                </div>

                <Button 
                  onClick={startQuiz}
                  disabled={!parentName.trim() || !teenName.trim()}
                  className="w-full mt-8 h-12 text-lg font-semibold"
                  size="lg"
                >
                  Start Quiz
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl diploma-shadow">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 rounded-full bg-diploma-gold/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-8 h-8 text-diploma-gold" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Preparing Your Bonuses...
              </h2>
              <p className="text-muted-foreground mb-6">
                We're analyzing your responses and setting up your exclusive rewards.
              </p>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div className="bg-diploma-gold h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-diploma-gold"></div>
              <span className="text-sm text-muted-foreground">This will just take a moment...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'warmup') {
    const question = quizQuestions[currentQuestion];
    const isImageLoading = question.imageUrl ? imageLoadingStates[question.imageUrl] : false;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4">
        <Card className="w-full max-w-3xl diploma-shadow">
          <CardContent className="p-4 sm:p-8 text-center">
            <div className="mb-6">
              {currentQuestion === 0 ? (
                <div className="mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-diploma-gold/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-diploma-gold" />
                  </div>
                  <div className="text-center max-w-2xl mx-auto px-2 sm:px-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 leading-relaxed">
                      The Young CFO Weekend gives them that chance
                    </h2>
                    <div className="space-y-4 text-base sm:text-lg md:text-xl text-foreground leading-relaxed font-medium">
                      <p>A safe, 1-day, U.S.-designed business simulation where they:</p>
                      <div className="grid gap-3 text-left max-w-md mx-auto">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 rounded-full bg-diploma-gold flex-shrink-0"></span>
                          <span>Run a company</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 rounded-full bg-diploma-gold flex-shrink-0"></span>
                          <span>Make financial decisions</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 rounded-full bg-diploma-gold flex-shrink-0"></span>
                          <span>Discover if business & finance could be their passion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentQuestion === 1 ? (
                <div className="mb-8">
                  <div className="relative">
                    {isImageLoading && (
                      <div className="w-64 h-80 mx-auto mb-6 bg-muted rounded-lg animate-pulse flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-diploma-gold"></div>
                      </div>
                    )}
                    <img 
                      src="/lovable-uploads/3354400f-f154-44ab-b133-b605b1cc6c96.png" 
                      alt="Saul - CFO Instructor" 
                      className={cn(
                        "w-64 h-80 rounded-lg mx-auto mb-6 object-cover object-top transition-opacity duration-300",
                        isImageLoading ? "opacity-0" : "opacity-100"
                      )}
                      loading="eager"
                      onLoadStart={() => handleImageLoadStart("/lovable-uploads/3354400f-f154-44ab-b133-b605b1cc6c96.png")}
                      onLoad={() => handleImageLoad("/lovable-uploads/3354400f-f154-44ab-b133-b605b1cc6c96.png")}
                    />
                  </div>
                  <div className="text-left max-w-2xl mx-auto space-y-4">
                    <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                      Your teen will be mentored by Saul, who embodies all three qualities you're looking for:
                    </h2>
                    <div className="space-y-3 text-lg text-foreground">
                      <div className="flex items-start space-x-3">
                        <span className="text-diploma-gold font-bold">•</span>
                        <div>
                          <span className="font-semibold">CFO Instructor</span> – Trained over 1,000 adults from scratch to become CFOs, helping them build successful careers in finance.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-diploma-gold font-bold">•</span>
                        <div>
                          <span className="font-semibold">Business Owner</span> – Founder of The Unboring CFO LLC in the U.S. and FinGPT, an innovative AI-powered finance startup.
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-diploma-gold font-bold">•</span>
                        <div>
                          <span className="font-semibold">CFO for U.S. Companies</span> – Advises multiple trucking companies in the United States with a combined annual revenue of over $30M USD.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentQuestion === 2 ? (
                <div className="mb-8">
                  <div className="relative">
                    {isImageLoading && (
                      <div className="w-80 h-96 mx-auto mb-6 bg-muted rounded-lg animate-pulse flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-diploma-gold"></div>
                      </div>
                    )}
                    <img 
                      src="/lovable-uploads/912cca57-7b63-4bd1-8d7a-5db80f28ca4c.png" 
                      alt="Hong Kong Skyscraper Office Space" 
                      className={cn(
                        "w-80 h-96 rounded-lg mx-auto mb-6 object-contain transition-opacity duration-300",
                        isImageLoading ? "opacity-0" : "opacity-100"
                      )}
                      loading="lazy"
                      onLoadStart={() => handleImageLoadStart("/lovable-uploads/912cca57-7b63-4bd1-8d7a-5db80f28ca4c.png")}
                      onLoad={() => handleImageLoad("/lovable-uploads/912cca57-7b63-4bd1-8d7a-5db80f28ca4c.png")}
                    />
                  </div>
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground mb-4 leading-relaxed">
                      The Young CFO Weekend takes place in a premium office space in a Hong Kong skyscraper — designed to recreate the authentic corporate atmosphere.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      The exact venue address will be available after booking.
                    </p>
                  </div>
                </div>
              ) : currentQuestion === 3 ? (
                <div className="mb-8">
                  <div className="relative">
                    {isImageLoading && (
                      <div className="w-full max-w-2xl h-96 mx-auto mb-6 bg-muted rounded-lg animate-pulse flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-diploma-gold"></div>
                      </div>
                    )}
                    <img 
                      src="/lovable-uploads/7a1b8100-7156-4639-91f0-0238fa770b3f.png" 
                      alt="Young CFO Certificate" 
                      className={cn(
                        "w-full max-w-2xl h-auto rounded-lg mx-auto mb-6 object-contain transition-opacity duration-300",
                        isImageLoading ? "opacity-0" : "opacity-100"
                      )}
                      loading="lazy"
                      onLoadStart={() => handleImageLoadStart("/lovable-uploads/7a1b8100-7156-4639-91f0-0238fa770b3f.png")}
                      onLoad={() => handleImageLoad("/lovable-uploads/7a1b8100-7156-4639-91f0-0238fa770b3f.png")}
                    />
                  </div>
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground mb-4 leading-relaxed">
                      Graduates receive a U.S.-issued certificate — a unique asset for their university portfolio.
                    </h2>
                  </div>
                </div>
              ) : currentQuestion === 4 ? (
                <div className="mb-8">
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground mb-6 leading-relaxed">
                      For just $2,000 HKD, your teen can test-drive the finance world in a single day, guided by a U.S. CFO mentor.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      One day could save you years of tuition and hundreds of thousands in the wrong career path.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-diploma-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-diploma-gold" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 leading-relaxed whitespace-pre-line">
                    {quizQuestions[currentQuestion].warmupText}
                  </h2>
                </div>
              )}
            </div>
            
            <Button onClick={continueFromWarmup} className="mt-6" size="lg">
              Continue Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'final') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl diploma-shadow animate-diploma-glow">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-diploma-gold/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-diploma-gold" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-6 diploma-heading">
                Congratulations!
              </h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                You automatically qualify for <span className="underline">ALL THREE</span> bonuses when you register within 24 hours!
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-diploma-gold/20 via-card to-diploma-gold/10 p-6 rounded-xl text-center border-2 border-diploma-gold/50 hover-scale animate-fade-in backdrop-blur-sm shadow-lg hover:shadow-diploma-gold/25 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-diploma-gold/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">HK$200 Discount</h3>
                  <p className="text-sm text-muted-foreground">Save instantly on registration</p>
                </div>
              </div>
              <div className="relative overflow-hidden bg-gradient-to-br from-diploma-gold/20 via-card to-diploma-gold/10 p-6 rounded-xl text-center border-2 border-diploma-gold/50 hover-scale animate-fade-in backdrop-blur-sm shadow-lg hover:shadow-diploma-gold/25 transition-all duration-300 group" style={{animationDelay: '0.1s'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-diploma-gold/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">1-to-1 Meeting</h3>
                  <p className="text-sm text-muted-foreground">With Saul</p>
                </div>
              </div>
              <div className="relative overflow-hidden bg-gradient-to-br from-diploma-gold/20 via-card to-diploma-gold/10 p-6 rounded-xl text-center border-2 border-diploma-gold/50 hover-scale animate-fade-in backdrop-blur-sm shadow-lg hover:shadow-diploma-gold/25 transition-all duration-300 group" style={{animationDelay: '0.2s'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-diploma-gold/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📜</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">Recommendation Letter</h3>
                  <p className="text-sm text-muted-foreground">For university applications</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg mb-8 border-2 border-diploma-gold">
              <div className="text-center">
                <Clock className="w-8 h-8 text-diploma-gold mx-auto mb-4" />
                <div className="text-4xl font-bold font-mono text-foreground mb-2">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-muted-foreground">Time remaining to claim your bonuses</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-foreground mb-4">
                All three bonuses are automatically reserved for {teenName} when you register within the countdown period.
              </p>
              <p className="text-muted-foreground">
                Don't miss out — these exclusive bonuses are only available for the next 24 hours!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz questions
  const question = quizQuestions[currentQuestion];
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl diploma-shadow">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 leading-relaxed">
              {question.question}
            </h2>

            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                      selectedAnswer === option
                        ? "border-diploma-gold bg-diploma-gold/10" 
                        : "border-border hover:border-diploma-gold/50 hover:bg-card"
                    )}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="text-base leading-relaxed cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Button 
            onClick={nextQuestion}
            disabled={!selectedAnswer}
            className="w-full"
            size="lg"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'See Your Bonuses' : 'Next Question'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
