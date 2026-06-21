import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-20">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
          {/* Back button */}
          <button 
            onClick={handleGoBack}
            className="flex items-center gap-2 text-pulse-500 hover:text-pulse-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Young CFO Weekend
          </button>
          
          <h1 className="text-4xl font-display font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <p className="mb-6">
              This Privacy Policy describes how Young CFO Weekend ("we," "our," or "us") collects, uses, and protects your personal information when you visit our website at youngcfoweekend.com or participate in our services.
            </p>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Parent name and contact information</li>
              <li>Email address</li>
              <li>WhatsApp phone number</li>
              <li>Teenager's age</li>
              <li>Any other information you voluntarily provide through our forms or communications</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referral source (how you found our website)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To communicate with you about Young CFO Weekend programs</li>
              <li>To process registrations and provide customer support</li>
              <li>To send educational content and program updates</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>For marketing purposes, including targeted advertising on social media platforms like Meta (Facebook/Instagram)</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Information Sharing</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our business, including email services, analytics providers, and payment processors</li>
              <li><strong>Advertising Partners:</strong> Social media platforms like Meta for targeted advertising purposes</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            </ul>
            <p className="mb-4">We do not sell your personal information to third parties.</p>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to improve your experience on our website and for advertising purposes. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Essential cookies for website functionality</li>
              <li>Analytics cookies to understand website usage</li>
              <li>Marketing cookies for targeted advertising, including Meta Pixel</li>
            </ul>
            <p className="mb-4">
              You can manage cookie preferences through your browser settings, but some website features may not function properly if cookies are disabled.
            </p>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Restrict processing of your information</li>
            </ul>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Children's Privacy</h2>
            <p className="mb-4">
              Our services are designed for teenagers aged 15-18 with parental consent. We collect information from parents/guardians, not directly from minors. Parents have the right to review, delete, or refuse further collection of their child's information.
            </p>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website with an updated effective date.
            </p>

            <h2 className="text-2xl font-display font-bold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <ul className="list-none mb-4">
              <li><strong>Website:</strong> youngcfoweekend.com</li>
              <li><strong>Email:</strong> info@youngcfoweekend.com</li>
            </ul>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                This privacy policy is designed to comply with applicable privacy laws and regulations, including GDPR, CCPA, and Meta advertising policies.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;