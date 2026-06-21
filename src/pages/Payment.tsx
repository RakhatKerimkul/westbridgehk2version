import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, FileText } from "lucide-react";

const Payment = () => {
  const handlePayment = () => {
    window.open("https://buy.stripe.com/cNicN40GH4cv7pY3FDes007", "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">The Young CFO Weekend</CardTitle>
          <CardDescription>
            Complete your registration for the exclusive weekend program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Investment: HK$2,000</p>
            <p className="text-sm text-muted-foreground">
              Secure payment processed by Stripe
            </p>
          </div>
          
          <Button 
            onClick={handlePayment}
            className="w-full h-12 text-lg"
            size="lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Complete Payment
          </Button>
          
          <div className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm p-0 h-auto">
                  <FileText className="w-4 h-4 mr-1" />
                  View Service Agreement & Terms of Purchase
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Service Agreement & Terms of Purchase</DialogTitle>
                  <DialogDescription>
                    Unboring CFO LLC — The Young CFO Weekend
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4 text-sm">
                    <p className="font-medium">Last Updated: 27 July 2025</p>
                    
                    <p>
                      This Service Agreement ("Agreement") is entered into between Unboring CFO LLC, a Delaware limited liability company ("Provider," "we," "our," or "us"), and you ("Participant," "Client," or "you") as of the date you purchase access to The Young CFO Weekend ("Program"). By making a payment via Stripe or any other payment processor provided on our website, you confirm that you have read, understood, and agree to be bound by the following terms:
                    </p>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">1. Services Provided</h3>
                      <p>
                        Unboring CFO LLC will provide you with participation in The Young CFO Weekend program as described on our website at the time of your purchase, including all live sessions, materials, and activities listed in the Program outline.
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">2. Payment</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All payments are processed securely via Stripe or another approved payment processor.</li>
                        <li>Prices are listed in U.S. Dollars (USD) and are exclusive of applicable taxes, which will be calculated and displayed at checkout.</li>
                        <li>Your seat in the Program is confirmed only upon receipt of full payment.</li>
                      </ul>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">3. Refund Policy</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>All sales are final and payments are non-refundable, except where prohibited by law.</li>
                        <li>If the Provider cancels the Program in its entirety, you will receive a full refund of the amount paid.</li>
                        <li>If you are unable to attend, you may request in writing to transfer your registration to another eligible participant, subject to our approval.</li>
                      </ul>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">4. Participant Responsibilities</h3>
                      <p className="mb-2">You agree to:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Provide accurate personal information at registration.</li>
                        <li>Attend scheduled sessions on time.</li>
                        <li>Engage respectfully with instructors and other participants.</li>
                        <li>Use Program materials only for your personal educational purposes.</li>
                      </ul>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">5. Intellectual Property</h3>
                      <p>
                        All Program materials, content, and resources are the exclusive property of Unboring CFO LLC and are protected by copyright, trademark, and other intellectual property laws. You may not copy, share, or distribute them without our prior written consent.
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">6. Limitation of Liability</h3>
                      <p>
                        To the fullest extent permitted by law, Unboring CFO LLC shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your participation in the Program. Our maximum liability shall not exceed the total amount you paid for the Program.
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">7. Governing Law</h3>
                      <p>
                        This Agreement shall be governed by and construed under the laws of the State of Delaware, without regard to conflict of laws principles.
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">8. Acceptance of Terms</h3>
                      <p>
                        By clicking "Pay" at checkout and completing your payment through Stripe, you acknowledge that you have read, understood, and agreed to this Agreement.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            By proceeding with payment, you agree to our Service Agreement & Terms of Purchase
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;