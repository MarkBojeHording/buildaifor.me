import { Code, Brain, Zap, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const achievements = [
    {
      icon: Brain,
      title: 'Advanced RAG Expert',
      description: 'Specialized in retrieval-augmented generation systems'
    },
    {
      icon: Zap,
      title: 'Full-Stack Proficiency',
      description: 'End-to-end development from backend to frontend'
    },
    {
      icon: Award,
      title: 'Award-Winning Solutions',
      description: 'Consistent delivery of high-quality solutions'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About the AI Automation Expert
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                With over 5 years of experience in AI development and automation, I specialize in
                creating intelligent solutions that transform how businesses operate. My expertise
                spans from advanced RAG systems to full-stack development, ensuring comprehensive
                AI solutions that deliver measurable business value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose BuildAIFor.Me?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Rapid Deployment</h4>
                    <p className="text-sm text-gray-600">Get your AI solution up and running in 24-48 hours with our template approach</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">No Technical Headaches</h4>
                    <p className="text-sm text-gray-600">We handle all API costs, maintenance, and technical complexity</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Proven Results</h4>
                    <p className="text-sm text-gray-600">Track record of delivering measurable ROI and business transformation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
              <p className="mb-6 opacity-90">
                Let's discuss how AI automation can revolutionize your operations and drive growth.
              </p>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                Start Your Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;