
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import ArticleCard from '../components/ArticleCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  author_name: string;
  published_at: string;
}

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // First get the category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('slug', slug)
          .single();
          
        if (categoryError) throw categoryError;
        
        setCategoryName(categoryData.name);
        
        // Then get articles in that category
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('id, title, excerpt, image_url, category_id, author_name, published_at')
          .eq('category_id', categoryData.id)
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false });
          
        if (articlesError) throw articlesError;
        
        const formattedArticles = articlesData.map(article => ({
          ...article,
          category: categoryData.name
        }));
        
        setArticles(formattedArticles);
      } catch (error) {
        console.error('Error fetching category articles:', error);
        toast({
          title: "Error",
          description: "Failed to load articles for this category",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchArticles();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 border-b pb-4">{categoryName}</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">Loading articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  imageUrl={article.image_url}
                  category={article.category}
                  author={article.author_name}
                  date={formatDate(article.published_at)}
                />
              ))}
              
              {articles.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No articles available in this category yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
