
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import FeaturedArticle from '../components/FeaturedArticle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  author_name: string;
  published_at: string;
}

const Index = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured and latest articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Fetch featured article
        const { data: featuredData, error: featuredError } = await supabase
          .from('articles')
          .select('id, title, excerpt, image_url, author_name, published_at, category_id, categories(name)')
          .eq('is_featured', true)
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .limit(1)
          .single();
          
        if (featuredError && featuredError.code !== 'PGRST116') {
          throw featuredError;
        }
        
        if (featuredData) {
          setFeaturedArticle({
            ...featuredData,
            category: featuredData.categories?.name || 'Uncategorized'
          });
        }
        
        // Fetch latest articles
        const { data: latestData, error: latestError } = await supabase
          .from('articles')
          .select('id, title, excerpt, image_url, author_name, published_at, category_id, categories(name)')
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .limit(6);
          
        if (latestError) throw latestError;
        
        const formattedLatest = latestData.map(article => ({
          ...article,
          category: article.categories?.name || 'Uncategorized'
        }));
        
        setLatestArticles(formattedLatest);
        
        // For demo, use the same articles for popular
        setPopularArticles(formattedLatest.slice(0, 3));
      } catch (error) {
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
    
    fetchArticles();
  }, []);

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
      
      <main className="flex-grow">
        {/* Hero Section with Featured Article */}
        <section className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
          ) : featuredArticle ? (
            <FeaturedArticle 
              id={featuredArticle.id} 
              title={featuredArticle.title} 
              excerpt={featuredArticle.excerpt} 
              imageUrl={featuredArticle.image_url} 
              category={featuredArticle.category} 
              author={featuredArticle.author_name} 
              date={formatDate(featuredArticle.published_at)} 
            />
          ) : (
            <div className="text-center py-16 border rounded-lg bg-gray-50">
              <h2 className="text-2xl font-semibold mb-2">No Featured Article Yet</h2>
              <p className="text-gray-500">Check back soon for featured content.</p>
            </div>
          )}
        </section>
        
        {/* Latest Articles */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="latest" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Latest Tech News</h2>
              <TabsList>
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="latest" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                  ))}
                </div>
              ) : latestArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestArticles.map(article => (
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
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500">No articles available yet. Check back soon!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                  ))}
                </div>
              ) : popularArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularArticles.map(article => (
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
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500">No articles available yet. Check back soon!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Newsletter Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated with Bytevanta</h2>
              <p className="text-gray-600 mb-8">Subscribe to our newsletter to receive the latest tech news directly to your inbox.</p>
              
              <form className="flex flex-col sm:flex-row gap-4 justify-center">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bytevanta-blue flex-grow max-w-md"
                />
                <button 
                  type="submit" 
                  className="bg-bytevanta-blue hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
