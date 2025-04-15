
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash, LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Article {
  id: string;
  title: string;
  category: { name: string };
  published_at: string | null;
  created_at: string;
  status: 'published' | 'draft';
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, category_id, categories(name), published_at, created_at')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedArticles = data.map(article => ({
          id: article.id,
          title: article.title,
          category: article.categories,
          published_at: article.published_at,
          created_at: article.created_at,
          // Explicitly cast the status to either 'published' or 'draft'
          status: article.published_at ? ('published' as const) : ('draft' as const)
        }));
        
        setArticles(formattedArticles);
      } catch (error: any) {
        console.error('Error fetching articles:', error);
        toast({
          title: "Error",
          description: "Failed to load articles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchArticles();
    }
  }, [user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setArticles(articles.filter(article => article.id !== id));
      
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            
            <div className="flex items-center gap-4">
              <Link to="/admin/upload">
                <Button className="bg-bytevanta-blue hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Button>
              </Link>
              
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Articles</CardTitle>
              <CardDescription>Manage your published and draft articles</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-5 py-3 px-4 bg-gray-100 font-medium">
                  <div className="col-span-2">Title</div>
                  <div>Category</div>
                  <div>Date</div>
                  <div>Status</div>
                </div>
                
                {loading ? (
                  <div className="py-8 text-center text-gray-500">Loading articles...</div>
                ) : (
                  articles.map((article) => (
                    <div key={article.id} className="grid grid-cols-5 py-4 px-4 border-t items-center">
                      <div className="col-span-2 font-medium">{article.title}</div>
                      <div>{article.category?.name || 'Uncategorized'}</div>
                      <div>{formatDate(article.published_at || article.created_at)}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm px-2 py-1 rounded ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.status}
                        </span>
                        
                        <div className="flex space-x-2">
                          <Link to={`/admin/edit/${article.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                            <Trash className="h-4 w-4 text-bytevanta-red" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {!loading && articles.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    No articles yet. Create your first article!
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="text-sm text-gray-500">
                Showing {articles.length} articles
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
