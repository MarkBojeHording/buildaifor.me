
import { MessageSquare, Code, Cog, Headphones } from 'lucide-react';
import CalendlyPopup from './CalendlyPopup';

const Process = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Consultation',
      description: 'We analyze your business needs and identify AI automation opportunities',
      details: [
        'Business process assessment',
        'ROI analysis and planning',
        'Technology stack evaluation',
        'Timeline and scope definition'
      ]
    },
    {
      icon: Code,
      title: 'Custom Development',
      description: 'Building tailored AI solutions using cutting-edge technologies',
      details: [
        'AI model development',
        'System architecture design',
        'Integration planning',
        'Testing and validation'
      ]
    },
    {
      icon: Cog,
      title: 'Integration',
      description: 'Seamless deployment and integration with your existing systems',
      details: [
        'System deployment',
        'Data migration',
        'User training',
        'Performance optimization'
      ]
    },
    {
      icon: Headphones,
      title: 'Ongoing Support',
      description: 'Continuous monitoring, maintenance, and optimization',
      details: [
        '24/7 system monitoring',
        'Regular updates',
        'Performance analytics',
        'Scaling and enhancements'
      ]
    }
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our AI Development Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A proven methodology that ensures successful AI implementation from concept to deployment and beyond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                </div>

                <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-xs text-blue-600 font-medium flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-blue-300"></div>
                  <div className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-blue-300 transform rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Schedule a free consultation to discuss your AI automation needs and learn how we can transform your business processes.
            </p>
            <CalendlyPopup>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                Book Free Consultation
              </button>
            </CalendlyPopup>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
