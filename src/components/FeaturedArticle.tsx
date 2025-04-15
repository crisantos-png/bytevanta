
import { Link } from 'react-router-dom';

interface FeaturedArticleProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
}

const FeaturedArticle = ({ id, title, excerpt, imageUrl, category, author, date }: FeaturedArticleProps) => {
  return (
    <Link to={`/article/${id}`} className="block group">
      <div className="relative overflow-hidden rounded-lg h-[400px] md:h-[500px]">
        <img 
          src={imageUrl || '/placeholder.svg'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
          <div className="mb-4">
            <span className="bg-bytevanta-red text-white text-xs px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            {title}
          </h2>
          
          <p className="text-gray-200 mb-4 line-clamp-3">
            {excerpt}
          </p>
          
          <div className="flex justify-between items-center text-sm text-gray-300">
            <p>{author}</p>
            <p>{date}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedArticle;
