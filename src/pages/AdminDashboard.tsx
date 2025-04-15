
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash, LogOut } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  status: 'published' | 'draft';
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Mock articles for the dashboard
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "article-1",
      title: "New Startup Raises $50M for Quantum Computing Solution",
      category: "Startups",
      date: "April 10, 2025",
      status: "published",
    },
    {
      id: "article-2",
      title: "Review: The Latest Smartphone That's Taking Over the Market",
      category: "Gadgets",
      date: "April 8, 2025",
      status: "published",
    },
    {
      id: "article-3",
      title: "Tech Giants Announce New Collaboration on Open-Source AI",
      category: "AI",
      date: "April 5, 2025",
      status: "draft",
    },
  ]);

  // Simple authentication check
  useEffect(() => {
    // In a real app, you would check for an authentication token
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  // Set authentication when the component mounts
  useEffect(() => {
    localStorage.setItem('isAuthenticated', 'true');
    
    // Clean up on unmount
    return () => {
      // This is just for demonstration - a real app would have proper auth management
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/admin');
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
              
              <Button variant="outline" onClick={handleLogout}>
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
                
                {articles.map((article) => (
                  <div key={article.id} className="grid grid-cols-5 py-4 px-4 border-t items-center">
                    <div className="col-span-2 font-medium">{article.title}</div>
                    <div>{article.category}</div>
                    <div>{article.date}</div>
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
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-bytevanta-red" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {articles.length === 0 && (
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
