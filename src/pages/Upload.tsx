
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Layout from '../components/Layout';

const Upload = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
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
      if (!formData.title || !formData.category_id || !formData.content) {
        toast({
          title: "Missing fields",
          description: "Please fill out all required fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      let image_url = formData.imagePreview;
      
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
      
      const articleData = {
        title: formData.title,
        category_id: formData.category_id,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        content: formData.content,
        author_name: formData.author_name,
        image_url,
        published_at: new Date().toISOString(),
      };
      
      if (isEditMode) {
        await supabase.from('articles').update(articleData).eq('id', id);
        toast({ title: "Article updated" });
      } else {
        await supabase.from('articles').insert([articleData]);
        toast({ title: "Article published" });
      }
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/dashboard')} 
          className="mb-6"
        >
          Back to Dashboard
        </Button>
        
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Edit Article' : 'Create New Article'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Title</label>
              <Input
                name="title" 
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Author</label>
              <Input
                name="author_name" 
                value={formData.author_name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Category</label>
              <Select 
                value={formData.category_id}
                onValueChange={handleCategoryChange}
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
            
            <div>
              <label className="block mb-1">Excerpt (optional)</label>
              <Textarea
                name="excerpt" 
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div>
              <label className="block mb-1">Content</label>
              <Textarea
                name="content" 
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Featured Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              
              {formData.imagePreview && (
                <div className="mt-4">
                  <img 
                    src={formData.imagePreview} 
                    alt="Preview" 
                    className="h-40 object-cover"
                  />
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Saving..." : isEditMode ? "Update Article" : "Publish Article"}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
