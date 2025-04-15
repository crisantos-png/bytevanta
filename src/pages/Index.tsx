
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import FeaturedArticle from '../components/FeaturedArticle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  // This would normally come from an API
  const featuredArticle = {
    id: "featured-1",
    title: "The Future of AI: How Machine Learning is Reshaping Tech Industries",
    excerpt: "Artificial intelligence continues to evolve at a rapid pace, with new breakthroughs happening every day. We take a deep dive into how these technologies are reshaping entire industries.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    category: "AI",
    author: "Jane Smith",
    date: "April 12, 2025",
  };
  
  // Mock data for the latest articles
  const latestArticles = [
    {
      id: "article-1",
      title: "New Startup Raises $50M for Quantum Computing Solution",
      excerpt: "A revolutionary approach to quantum computing that could solve complex problems in minutes rather than years.",
      imageUrl: "https://images.unsplash.com/photo-1639322537231-2fefa0953d4b",
      category: "Startups",
      author: "John Doe",
      date: "April 10, 2025",
    },
    {
      id: "article-2",
      title: "Review: The Latest Smartphone That's Taking Over the Market",
      excerpt: "We test the newest flagship device that's setting new standards for battery life and camera performance.",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      category: "Gadgets",
      author: "Alex Johnson",
      date: "April 8, 2025",
    },
    {
      id: "article-3",
      title: "Tech Giants Announce New Collaboration on Open-Source AI",
      excerpt: "Major technology companies are joining forces to develop open-source artificial intelligence tools.",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      category: "AI",
      author: "Sarah Williams",
      date: "April 5, 2025",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with Featured Article */}
        <section className="container mx-auto px-4 py-8">
          <FeaturedArticle {...featuredArticle} />
        </section>
        
        {/* Latest Articles */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="latest" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Latest Tech News</h2>
              <TabsList>
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="latest" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestArticles.map(article => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              <div className="text-center py-16">
                <p className="text-gray-500">No articles available yet. Check back soon!</p>
              </div>
            </TabsContent>
            
            <TabsContent value="trending" className="mt-0">
              <div className="text-center py-16">
                <p className="text-gray-500">No articles available yet. Check back soon!</p>
              </div>
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
