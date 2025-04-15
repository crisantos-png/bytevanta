
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UploadPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    image: null as File | null,
    imagePreview: '',
  });

  // Simple authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!formData.title || !formData.category || !formData.content) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // In a real app, you would submit this to an API
    setTimeout(() => {
      toast({
        title: "Article submitted",
        description: "Your article has been created successfully.",
      });
      navigate('/admin/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/dashboard')} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Create New Article</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="Enter article title" 
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    onValueChange={handleCategoryChange}
                    value={formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI">AI</SelectItem>
                      <SelectItem value="Startups">Startups</SelectItem>
                      <SelectItem value="Gadgets">Gadgets</SelectItem>
                      <SelectItem value="Apps">Apps</SelectItem>
                      <SelectItem value="Blockchain">Blockchain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Article Excerpt</Label>
                  <Textarea 
                    id="excerpt" 
                    name="excerpt" 
                    placeholder="Brief summary of the article" 
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Article Content *</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    placeholder="Write your article content here..." 
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange} 
                  />
                  
                  {formData.imagePreview && (
                    <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden">
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <CardFooter className="flex justify-end px-0 pb-0">
                  <Button 
                    type="submit" 
                    className="bg-bytevanta-blue hover:bg-blue-600" 
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isLoading ? "Publishing..." : "Publish Article"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadPage;
