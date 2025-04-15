
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const UploadPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    excerpt: '',
    content: '',
    author_name: '',
    image: null as File | null,
    imagePreview: '',
  });

  const isEditMode = !!id;

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch article data if in edit mode
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setFormData({
          title: data.title,
          category_id: data.category_id,
          excerpt: data.excerpt,
          content: data.content,
          author_name: data.author_name,
          image: null,
          imagePreview: data.image_url || '',
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          title: "Error",
          description: "Failed to load article data",
          variant: "destructive",
        });
        navigate('/admin/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isEditMode) {
      fetchArticle();
    }
  }, [id, isEditMode, navigate]);

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
      category_id: value,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      if (!formData.title || !formData.category_id || !formData.content || !formData.author_name) {
        toast({
          title: "Missing fields",
          description: "Please fill out all required fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      let image_url = formData.imagePreview;
      
      // Upload image if exists
      if (formData.image) {
        const file = formData.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `article-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('public').upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('public').getPublicUrl(filePath);
        image_url = data.publicUrl;
      }
      
      // Prepare article data
      const articleData = {
        title: formData.title,
        category_id: formData.category_id,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        content: formData.content,
        author_name: formData.author_name,
        image_url,
        published_at: new Date().toISOString(),
      };
      
      // Insert or update article
      if (isEditMode) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Article updated",
          description: "Your article has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);
          
        if (error) throw error;
        
        toast({
          title: "Article published",
          description: "Your article has been published successfully.",
        });
      }
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Error publishing article:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while publishing your article.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <CardTitle>{isEditMode ? 'Edit Article' : 'Create New Article'}</CardTitle>
            </CardHeader>
            
            {isLoading && !isEditMode ? (
              <CardContent className="flex justify-center py-8">
                <p>Loading...</p>
              </CardContent>
            ) : (
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
                    <Label htmlFor="author_name">Author Name *</Label>
                    <Input 
                      id="author_name" 
                      name="author_name" 
                      placeholder="Enter author name" 
                      value={formData.author_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      onValueChange={handleCategoryChange}
                      value={formData.category_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Article Excerpt</Label>
                    <Textarea 
                      id="excerpt" 
                      name="excerpt" 
                      placeholder="Brief summary of the article (optional)"
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
                      {isLoading ? "Publishing..." : isEditMode ? "Update Article" : "Publish Article"}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadPage;
