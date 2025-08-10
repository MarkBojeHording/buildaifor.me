
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Automation Specialist
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                AI Automation Solutions to
                <span className="text-blue-600"> Transform </span>
                Your Business
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                AI solutions that streamline operations, boost productivity, and drive growth.
                From intelligent chatbots to advanced document processing and workflow automation.
              </p>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group"
              >
                See How It Works
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div> */}
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <div className="text-sm text-gray-600">Automating document processing...</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-blue-900">✅ 1,247 documents processed</div>
                    <div className="text-xs text-blue-600">98.7% accuracy rate</div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div className="text-sm text-gray-600">Optimizing workflows...</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-green-900">⚡ 67% time reduction achieved</div>
                    <div className="text-xs text-green-600">Workflow efficiency improved</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-900" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
