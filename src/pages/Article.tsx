
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Share2, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import Layout from '../components/Layout';

interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  author_name: string;
  published_at: string;
  read_time?: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  author_name: string;
  published_at: string;
}

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Article ID is missing",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch the article details
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('id, title, content, image_url, category_id, author_name, published_at, categories(name)')
          .eq('id', id)
          .single();
          
        if (articleError) throw articleError;
        
        if (!articleData) {
          toast({
            title: "Not found",
            description: "The article you are looking for doesn't exist.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Calculate approximate read time (1 minute per 200 words)
        const wordCount = articleData.content?.split(/\s+/).length || 0;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));
        
        const formattedArticle: ArticleDetail = {
          id: articleData.id,
          title: articleData.title,
          content: articleData.content,
          image_url: articleData.image_url,
          category: articleData.categories?.name || 'Uncategorized',
          author_name: articleData.author_name,
          published_at: articleData.published_at,
          read_time: `${readTime} min read`
        };
        
        setArticle(formattedArticle);
        
        // Fetch related articles in the same category
        const { data: relatedData, error: relatedError } = await supabase
          .from('articles')
          .select('id, title, excerpt, image_url, author_name, published_at, category_id, categories(name)')
          .eq('category_id', articleData.category_id)
          .neq('id', id)
          .limit(2);
          
        if (relatedError) throw relatedError;
        
        const formattedRelated = relatedData.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          image_url: article.image_url,
          category: article.categories?.name || 'Uncategorized',
          author_name: article.author_name,
          published_at: formatDate(article.published_at),
        }));
        
        setRelatedArticles(formattedRelated);
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-bytevanta-blue text-lg">Loading article...</div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Article Header */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <img 
            src={article.image_url || '/placeholder.svg'} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <span className="inline-block bg-bytevanta-red text-white px-3 py-1 rounded-full text-sm mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
                {article.title}
              </h1>
              
              <div className="flex items-center mt-6 text-white space-x-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{article.author_name}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{article.read_time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-end mb-6 space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
            
            <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            
            {relatedArticles.length > 0 && (
              <div className="border-t border-gray-200 mt-12 pt-12">
                <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map(related => (
                    <ArticleCard 
                      key={related.id}
                      id={related.id}
                      title={related.title}
                      excerpt={related.excerpt}
                      imageUrl={related.image_url}
                      category={related.category}
                      author={related.author_name}
                      date={related.published_at}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
