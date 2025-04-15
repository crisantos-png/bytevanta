import { useState } from 'react';
import { Milk } from 'lucide-react';
import Layout from '../components/Layout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Privacy = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSecretClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple fixed password authentication
      if (password === '@Anonymousfemboy€€') {
        toast({
          title: "Admin access granted",
          description: "Redirecting to admin dashboard...",
        });
            
        window.location.href = '/admin/dashboard';
      } else {
        toast({
          title: "Invalid password",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error verifying admin password:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during verification.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Last updated: April 15, 2025
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Bytevanta. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Data We Collect</h2>
          <p className="mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>Identity Data includes first name, last name, username or similar identifier.</li>
            <li>Contact Data includes email address and telephone numbers.</li>
            <li>Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform.</li>
            <li>Usage Data includes information about how you use our website and services.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Data</h2>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>To register you as a new customer.</li>
            <li>To deliver relevant content and advertisements to you.</li>
            <li>To use data analytics to improve our website, products/services, marketing, customer relationships and experiences.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
          <p className="mb-4">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Legal Rights</h2>
          <p className="mb-4">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Contact Us</h2>
          <p className="mb-8">
            If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@bytevanta.com.
          </p>
        </div>
        
        {/* Secret admin access button - milk carton icon */}
        <div className="flex justify-center mt-12 mb-6">
          <button 
            onClick={handleSecretClick}
            className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
            aria-label="Additional information"
          >
            <Milk className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Admin Login Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogDescription>
              Enter the admin password to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full bg-bytevanta-blue hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Access Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Privacy;
