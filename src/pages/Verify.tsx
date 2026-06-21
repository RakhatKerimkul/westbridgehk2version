
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Search, Shield, Award, Calendar, MapPin, User } from "lucide-react";

const Verify = () => {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock certificate database
  const certificates = {
    "YCF2025001": {
      valid: true,
      participant: "John Smith",
      program: "The Young CFO Weekend",
      date: "30 August 2025",
      location: "Central, Hong Kong"
    },
    "YCF2025002": {
      valid: true,
      participant: "Emma Johnson",
      program: "The Young CFO Weekend",
      date: "30 August 2025",
      location: "Central, Hong Kong"
    },
    "YCF2025003": {
      valid: true,
      participant: "Michael Chen",
      program: "The Young CFO Weekend",
      date: "30 August 2025",
      location: "Central, Hong Kong"
    }
  };

  const handleVerification = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const certificate = certificates[certificateId as keyof typeof certificates];
      
      if (certificate) {
        setVerificationResult(certificate);
      } else {
        setVerificationResult({ valid: false });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && certificateId && !isLoading) {
      handleVerification();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-diploma-cream via-background to-diploma-cream">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 md:mb-6">
            <Shield className="w-8 h-8 md:w-12 md:h-12 text-diploma-gold mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold diploma-heading text-center">
              Certificate Verification
            </h1>
          </div>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-diploma-gold to-diploma-brown mx-auto mb-4 md:mb-8"></div>
          <p className="text-lg md:text-xl lg:text-2xl diploma-text max-w-2xl mx-auto leading-relaxed px-4">
            Verify the authenticity of certificates issued by our institution
          </p>
        </div>

        {/* Main Verification Card */}
        <Card className="border-2 border-diploma-gold bg-diploma-cream shadow-2xl diploma-shadow mb-6 md:mb-8">
          <CardHeader className="bg-gradient-to-r from-diploma-brown to-diploma-dark-brown text-white rounded-t-lg">
            <CardTitle className="text-xl md:text-2xl lg:text-3xl diploma-heading text-center flex flex-col sm:flex-row items-center justify-center text-white">
              <Award className="w-6 h-6 md:w-8 md:h-8 mb-2 sm:mb-0 sm:mr-3" />
              Verify Certificate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="space-y-4">
              <Label htmlFor="certificateId" className="text-diploma-brown font-semibold text-base md:text-lg">
                Certificate ID
              </Label>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Input
                  id="certificateId"
                  type="text"
                  placeholder="Enter certificate ID (e.g., YCF2025001)"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="border-2 border-diploma-gold focus:border-diploma-brown bg-background text-diploma-brown text-base md:text-lg h-10 md:h-12 rounded-lg shadow-inner flex-1"
                />
                <Button 
                  onClick={handleVerification}
                  disabled={!certificateId || isLoading}
                  className="bg-diploma-brown text-diploma-cream hover:bg-diploma-gold hover:text-diploma-brown px-6 md:px-8 h-10 md:h-12 text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl w-full sm:w-auto"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-diploma-cream"></div>
                  ) : (
                    <>
                      <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <div className={`rounded-xl border-2 transition-all duration-500 ${
                verificationResult.valid 
                  ? 'border-green-500 bg-green-50 animate-pulse' 
                  : 'border-red-500 bg-red-50'
              }`}>
                <div className="p-4 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center justify-center mb-6 md:mb-8">
                    {verificationResult.valid ? (
                      <div className="flex flex-col sm:flex-row items-center text-green-600 text-center sm:text-left">
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 mb-2 sm:mb-0 sm:mr-4 animate-bounce" />
                        <div>
                          <span className="text-2xl md:text-3xl font-bold block">Valid Certificate</span>
                          <span className="text-base md:text-lg text-green-500">Verified and Authentic</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center text-red-600 text-center sm:text-left">
                        <XCircle className="w-10 h-10 md:w-12 md:h-12 mb-2 sm:mb-0 sm:mr-4" />
                        <div>
                          <span className="text-2xl md:text-3xl font-bold block">Invalid Certificate</span>
                          <span className="text-base md:text-lg text-red-500">Not Found in Database</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {verificationResult.valid && (
                    <div className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border border-diploma-gold">
                          <div className="flex items-center mb-3">
                            <User className="w-5 h-5 md:w-6 md:h-6 text-diploma-brown mr-2 md:mr-3" />
                            <Label className="font-semibold text-diploma-brown text-base md:text-lg">Participant Name</Label>
                          </div>
                          <p className="text-diploma-brown text-lg md:text-xl font-medium break-words">{verificationResult.participant}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border border-diploma-gold">
                          <div className="flex items-center mb-3">
                            <Award className="w-5 h-5 md:w-6 md:h-6 text-diploma-brown mr-2 md:mr-3" />
                            <Label className="font-semibold text-diploma-brown text-base md:text-lg">Program Name</Label>
                          </div>
                          <p className="text-diploma-brown text-lg md:text-xl font-medium break-words">{verificationResult.program}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border border-diploma-gold">
                          <div className="flex items-center mb-3">
                            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-diploma-brown mr-2 md:mr-3" />
                            <Label className="font-semibold text-diploma-brown text-base md:text-lg">Program Date</Label>
                          </div>
                          <p className="text-diploma-brown text-lg md:text-xl font-medium">{verificationResult.date}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border border-diploma-gold">
                          <div className="flex items-center mb-3">
                            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-diploma-brown mr-2 md:mr-3" />
                            <Label className="font-semibold text-diploma-brown text-base md:text-lg">Location</Label>
                          </div>
                          <p className="text-diploma-brown text-lg md:text-xl font-medium">{verificationResult.location}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4 md:p-6 border border-green-200 text-center">
                        <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-800 font-semibold text-base md:text-lg">
                          This certificate has been verified as authentic and issued by our institution.
                        </p>
                      </div>
                    </div>
                  )}

                  {!verificationResult.valid && (
                    <div className="text-center space-y-4">
                      <div className="bg-gradient-to-r from-red-100 to-red-50 rounded-lg p-4 md:p-6 border border-red-200">
                        <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600 mx-auto mb-4" />
                        <p className="text-red-700 text-base md:text-lg font-semibold mb-2">
                          Certificate ID "{certificateId}" is not valid or does not exist in our database.
                        </p>
                        <p className="text-red-600 text-sm md:text-base">
                          Please verify the ID and try again, or contact our support team for assistance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="bg-white border border-diploma-gold shadow-lg">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-diploma-brown mb-4">How to Verify:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-diploma-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-diploma-brown font-bold text-base md:text-lg">1</span>
                </div>
                <p className="text-diploma-brown text-sm md:text-base">Enter the certificate ID found on your certificate</p>
              </div>
              <div className="p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-diploma-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-diploma-brown font-bold text-base md:text-lg">2</span>
                </div>
                <p className="text-diploma-brown text-sm md:text-base">Click verify or press Enter to check authenticity</p>
              </div>
              <div className="p-3 md:p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-diploma-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-diploma-brown font-bold text-base md:text-lg">3</span>
                </div>
                <p className="text-diploma-brown text-sm md:text-base">View the verification result and certificate details</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verify;
