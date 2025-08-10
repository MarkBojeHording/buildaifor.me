import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Globe,
  Target,
  ArrowLeft
} from 'lucide-react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  useScrollToTop(); // Scroll to top when component mounts
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Articles', icon: BookOpen },
    { id: 'ai-fundamentals', label: 'AI Fundamentals', icon: Brain },
    { id: 'chatbots', label: 'Chatbots & NLP', icon: BookOpen },
    { id: 'business', label: 'Business Applications', icon: TrendingUp },
    { id: 'technology', label: 'Technology Deep Dives', icon: Zap },
    { id: 'ethics', label: 'AI Ethics & Privacy', icon: Shield },
    { id: 'industry', label: 'Industry Insights', icon: Globe }
  ];

  const articles = [
    {
      id: 1,
      title: 'The Future of AI in Healthcare: Beyond Chatbots',
      excerpt: 'Explore how AI is revolutionizing healthcare beyond simple chatbots, from diagnostic assistance to drug discovery and patient monitoring.',
      category: 'business',
      author: 'AI Team',
      date: '2024-01-15',
      readTime: '8 min read',
      featured: true,
      tags: ['Healthcare', 'AI Diagnostics', 'Patient Care', 'Medical Technology'],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'future-of-ai-healthcare'
    },
    {
      id: 2,
      title: 'RAG vs Traditional Search: Why Context Matters',
      excerpt: 'Deep dive into Retrieval-Augmented Generation technology and how it\'s transforming information retrieval with context-aware responses.',
      category: 'technology',
      author: 'Tech Team',
      date: '2024-01-08',
      readTime: '12 min read',
      featured: true,
      tags: ['RAG', 'Search Technology', 'AI', 'Information Retrieval'],
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'rag-vs-traditional-search'
    },
    {
      id: 3,
      title: 'Automating Legal Document Review: A Complete Guide',
      excerpt: 'Learn how AI is streamlining legal document analysis, contract review, and compliance processes for law firms and legal departments.',
      category: 'business',
      author: 'Legal AI Team',
      date: '2024-01-01',
      readTime: '10 min read',
      featured: false,
      tags: ['Legal Tech', 'Document Analysis', 'Compliance', 'Automation'],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'automating-legal-document-review'
    },
    {
      id: 4,
      title: 'Building Scalable AI Solutions: Architecture Best Practices',
      excerpt: 'Technical deep-dive into designing and implementing scalable AI systems that can grow with your business needs.',
      category: 'technology',
      author: 'Engineering Team',
      date: '2023-12-25',
      readTime: '15 min read',
      featured: false,
      tags: ['Architecture', 'Scalability', 'Best Practices', 'System Design'],
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'building-scalable-ai-solutions'
    },
    {
      id: 5,
      title: 'AI in E-commerce: Personalization and Customer Experience',
      excerpt: 'Discover how AI is transforming e-commerce through personalized recommendations, inventory management, and customer service.',
      category: 'business',
      author: 'E-commerce Team',
      date: '2023-12-18',
      readTime: '9 min read',
      featured: false,
      tags: ['E-commerce', 'Personalization', 'Customer Experience', 'Recommendations'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'ai-ecommerce-personalization'
    },
    {
      id: 6,
      title: 'The ROI of AI Automation: Measuring Success',
      excerpt: 'Comprehensive guide to measuring and demonstrating the return on investment from AI automation initiatives.',
      category: 'business',
      author: 'Analytics Team',
      date: '2023-12-11',
      readTime: '11 min read',
      featured: false,
      tags: ['ROI', 'Analytics', 'Business Metrics', 'Success Measurement'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'roi-ai-automation'
    },
    {
      id: 7,
      title: 'Ethical AI: Building Responsible Automation Systems',
      excerpt: 'Explore the importance of ethical AI development and how to build responsible automation systems that benefit society.',
      category: 'ethics',
      author: 'Ethics Team',
      date: '2023-12-04',
      readTime: '13 min read',
      featured: false,
      tags: ['AI Ethics', 'Responsible AI', 'Bias', 'Transparency'],
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'ethical-ai-systems'
    },
    {
      id: 8,
      title: 'AI for Small Businesses: Getting Started Guide',
      excerpt: 'Practical implementation tips and strategies for small businesses looking to adopt AI automation.',
      category: 'business',
      author: 'SMB Team',
      date: '2023-11-27',
      readTime: '7 min read',
      featured: false,
      tags: ['Small Business', 'Implementation', 'Getting Started', 'Automation'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      slug: 'ai-small-business-guide'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Back to Main Page Button */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                // Clear saved scroll position for home page before navigating
                const savedPositions = sessionStorage.getItem('scrollPositions');
                if (savedPositions) {
                  try {
                    const positions = JSON.parse(savedPositions);
                    delete positions['/'];
                    sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
                  } catch (error) {
                    console.warn('Failed to clear scroll position:', error);
                  }
                }
                navigate('/');
              }}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Main Page
            </Button>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Insights & Knowledge
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest AI trends, technologies, and business applications.
              Monthly insights to help you navigate the AI landscape.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600">Featured</Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.date)}</span>
                        <Clock className="w-4 h-4 ml-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/blog/${article.slug}`)}
                      >
                        Read Article
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {searchTerm || selectedCategory !== 'all' ? 'Search Results' : 'Latest Articles'}
            </h2>
            {regularArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.date)}</span>
                        <Clock className="w-4 h-4 ml-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/blog/${article.slug}`)}
                      >
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or category filters.
                </p>
              </div>
            )}
          </div>

          {/* Newsletter Signup */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Stay Updated with AI Insights
                </h3>
                <p className="text-blue-100 mb-6">
                  Get monthly articles delivered to your inbox. No spam, just valuable AI knowledge.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
