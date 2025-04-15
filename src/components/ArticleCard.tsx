
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
}

const ArticleCard = ({ id, title, excerpt, imageUrl, category, author, date }: ArticleCardProps) => {
  return (
    <Link to={`/article/${id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-bytevanta-blue text-white text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        </CardContent>
        
        <CardFooter className="flex justify-between text-xs text-gray-500 pt-0">
          <p>{author}</p>
          <p>{date}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ArticleCard;
