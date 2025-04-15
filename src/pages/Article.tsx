
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Share2, Bookmark } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';

interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
}

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the article data from an API
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock article data
      const mockArticle: ArticleDetail = {
        id: id || "article-1",
        title: "The Future of AI: How Machine Learning is Reshaping Tech Industries",
        content: `
          <p>Artificial intelligence continues to evolve at a rapid pace, with new breakthroughs happening every day. These advancements are not just academic curiosities but are actively reshaping how entire industries operate.</p>
          
          <p>Machine learning algorithms have become increasingly sophisticated, capable of processing vast amounts of data and extracting meaningful patterns that human analysts might miss. This has led to significant improvements in areas like predictive analytics, natural language processing, and computer vision.</p>
          
          <h2>Impact on Healthcare</h2>
          <p>In healthcare, AI is revolutionizing diagnosis and treatment planning. Machine learning models can analyze medical images with remarkable accuracy, often detecting subtle abnormalities that human doctors might overlook. This is not about replacing physicians but augmenting their capabilities, allowing them to make more informed decisions.</p>
          
          <h2>Financial Services Transformation</h2>
          <p>The financial sector has embraced AI for risk assessment, fraud detection, and algorithmic trading. Banks and investment firms use machine learning to analyze market trends and customer behavior, enabling more personalized services and more accurate risk models.</p>
          
          <h2>Looking Ahead</h2>
          <p>As we look to the future, the integration of AI into our daily lives will only deepen. From autonomous vehicles to smart home systems, the technology will become increasingly invisible as it becomes more ubiquitous.</p>
          
          <p>However, this technological revolution also brings challenges. Questions about privacy, bias in algorithms, and the economic impact of automation remain central to the conversation about AI's future. Addressing these concerns will require thoughtful policy-making and ethical guidelines that ensure the benefits of AI are widely shared.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        category: "AI",
        author: "Jane Smith",
        date: "April 12, 2025",
        readTime: "5 min read",
      };
      
      // Mock related articles
      const mockRelatedArticles: RelatedArticle[] = [
        {
          id: "related-1",
          title: "How Neural Networks Are Powering the Next Generation of AI Applications",
          excerpt: "An in-depth look at the neural network architectures driving today's AI revolution.",
          imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
          category: "AI",
          author: "Michael Johnson",
          date: "April 11, 2025",
        },
        {
          id: "related-2",
          title: "The Ethics of Artificial Intelligence: Navigating the Gray Areas",
          excerpt: "As AI becomes more powerful, ethical considerations become increasingly important.",
          imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
          category: "AI",
          author: "Emma Wilson",
          date: "April 9, 2025",
        },
      ];
      
      setArticle(mockArticle);
      setRelatedArticles(mockRelatedArticles);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-bytevanta-blue">Loading article...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article not found</h2>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
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
            src={article.imageUrl} 
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
                  <span>{article.author}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{article.date}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{article.readTime}</span>
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
            
            <div className="border-t border-gray-200 mt-12 pt-12">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
