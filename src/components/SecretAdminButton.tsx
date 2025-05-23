
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const SecretAdminButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
            
        navigate('/admin/dashboard');
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
    <>
      {/* Hidden button that looks like regular text */}
      <span 
        onClick={handleSecretClick} 
        className="cursor-default text-xs text-gray-300 hover:text-gray-300"
        aria-hidden="true"
      >
        .
      </span>

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
    </>
  );
};

export default SecretAdminButton;
