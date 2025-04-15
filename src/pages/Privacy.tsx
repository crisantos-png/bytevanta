import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Privacy = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSecretClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password === '@Anonymousfemboy€€') {
        toast({
          title: "Admin access granted",
          description: "Redirecting to admin dashboard...",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Invalid password",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An error occurred during verification.",
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
          <p className="mb-4">Last updated: April 15, 2025</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Bytevanta. We respect your privacy and are committed to protecting your personal data.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Data We Collect</h2>
          <p className="mb-4">
            We may collect basic user data such as name, email, and usage information.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Contact Us</h2>
          <p className="mb-8">
            If you have any questions, please contact us at privacy@bytevanta.com.
          </p>
        </div>
        
        <div className="flex justify-center mt-12 mb-6">
          <button 
            onClick={handleSecretClick}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Additional information"
          >
            Admin
          </button>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
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
