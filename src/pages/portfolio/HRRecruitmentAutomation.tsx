import { Users, Search, Calendar, TrendingUp, Clock, Target, ArrowLeft, CheckCircle, Star, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const HRRecruitmentAutomation = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const recruitmentMetrics = [
    { label: 'Screening Time Reduction', value: '60%', description: 'Faster candidate evaluation process' },
    { label: 'Scheduling Automation', value: '90%', description: 'Interviews scheduled automatically' },
    { label: 'Hiring Speed', value: '2x faster', description: 'Time from application to offer' },
    { label: 'Quality Score', value: '4.7/5', description: 'Candidate match accuracy rating' }
  ];

  const candidateFlow = [
    {
      stage: 'Application Received',
      status: 'completed',
      candidates: 247,
      description: 'Initial applications processed'
    },
    {
      stage: 'AI Screening',
      status: 'completed',
      candidates: 89,
      description: 'Candidates passed initial screening'
    },
    {
      stage: 'Skills Assessment',
      status: 'in-progress',
      candidates: 34,
      description: 'Currently taking assessments'
    },
    {
      stage: 'Interview Scheduled',
      status: 'pending',
      candidates: 12,
      description: 'Awaiting interview scheduling'
    }
  ];

  const automationFeatures = [
    {
      icon: Search,
      title: 'Resume Screening',
      description: 'AI analyzes resumes against job requirements and ranks candidates',
      benefits: ['Keyword matching', 'Experience evaluation', 'Skills assessment', 'Cultural fit analysis']
    },
    {
      icon: Calendar,
      title: 'Interview Scheduling',
      description: 'Automated coordination between candidates and interviewers',
      benefits: ['Calendar integration', 'Timezone handling', 'Reminder notifications', 'Rescheduling automation']
    },
    {
      icon: UserCheck,
      title: 'Candidate Communication',
      description: 'Personalized messaging throughout the recruitment process',
      benefits: ['Status updates', 'Next steps guidance', 'Feedback delivery', 'Onboarding coordination']
    },
    {
      icon: Target,
      title: 'Performance Analytics',
      description: 'Track recruitment metrics and optimize hiring processes',
      benefits: ['Time-to-hire tracking', 'Source effectiveness', 'Interviewer feedback', 'Quality metrics']
    }
  ];

  const topCandidates = [
    {
      name: 'Sarah Johnson',
      position: 'Senior Developer',
      score: 94,
      skills: ['React', 'Node.js', 'AWS'],
      experience: '5 years',
      status: 'Interview Scheduled'
    },
    {
      name: 'Michael Chen',
      position: 'Product Manager',
      score: 91,
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      experience: '7 years',
      status: 'Skills Assessment'
    },
    {
      name: 'Emily Rodriguez',
      position: 'UX Designer',
      score: 88,
      skills: ['Figma', 'User Research', 'Prototyping'],
      experience: '4 years',
      status: 'Reference Check'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Button
            variant="outline"
            onClick={() => {
              // Clear saved scroll position for main page
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
            className="mb-6 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  HR Recruitment Automation
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="text-blue-600"> Recruitment Pipeline </span>
                  That Never Sleeps
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your hiring process with intelligent automation that screens candidates,
                  schedules interviews, and identifies top talent - reducing time-to-hire by 50%
                  while improving candidate quality.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {recruitmentMetrics.map((metric, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="text-2xl font-bold text-purple-600">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-xs text-gray-600">{metric.description}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Automate Recruitment
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  View Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Recruitment Pipeline</h3>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="space-y-3">
                    {candidateFlow.map((stage, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        stage.status === 'completed' ? 'bg-green-50 border-green-200' :
                        stage.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{stage.stage}</span>
                          <span className="text-lg font-bold text-purple-600">{stage.candidates}</span>
                        </div>
                        <div className="text-xs text-gray-600">{stage.description}</div>
                        {stage.status === 'in-progress' && (
                          <div className="mt-2">
                            <div className="w-full bg-blue-200 rounded-full h-1">
                              <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">This Week's Activity</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="font-medium">Applications:</span> 247</div>
                      <div><span className="font-medium">Screened:</span> 89</div>
                      <div><span className="font-medium">Interviews:</span> 23</div>
                      <div><span className="font-medium">Offers:</span> 5</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Candidates Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Ranked Top Candidates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI analyzes resumes, skills, and experience to identify the best candidates for each role
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span>Top Candidates This Week</span>
              </CardTitle>
              <CardDescription>
                Candidates ranked by AI matching score and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCandidates.map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-gray-600">{candidate.position} • {candidate.experience}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidate.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{candidate.score}%</div>
                      <div className="text-sm text-gray-600">Match Score</div>
                      <Badge className={`mt-1 ${
                        candidate.status === 'Interview Scheduled' ? 'bg-green-100 text-green-700' :
                        candidate.status === 'Skills Assessment' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {candidate.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Automation Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Recruitment Automation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From application to offer - every step of your hiring process optimized with AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {automationFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <span>{feature.title}</span>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Benefits:</h4>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforming HR Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from companies using our recruitment automation platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle>60% Faster Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI-powered resume screening eliminates manual review time,
                  allowing HR teams to focus on high-value candidate interactions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle>90% Scheduling Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automated interview scheduling eliminates back-and-forth emails,
                  reducing coordination time and improving candidate experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle>2x Faster Hiring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Streamlined processes and automated workflows reduce time-to-hire
                  from weeks to days, helping you secure top talent faster.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Revolutionize Your Hiring?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join forward-thinking companies that are hiring faster and smarter
            with AI-powered recruitment automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg">
              Request Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-700 px-8 py-4 text-lg">
              View Case Study
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HRRecruitmentAutomation;
