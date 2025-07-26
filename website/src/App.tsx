import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Tech from "./pages/Tech";
import Blog from "./pages/Blog";
import CustomChatbots from "./pages/services/CustomChatbots";
import DocumentProcessing from "./pages/services/DocumentProcessing";
import DataAutomation from "./pages/services/DataAutomation";
import WorkflowOptimization from "./pages/services/WorkflowOptimization";
import RAGSystems from "./pages/services/RAGSystems";
import APIIntegrations from "./pages/services/APIIntegrations";
import BusinessIntelligence from "./pages/services/BusinessIntelligence";
import MachineLearning from "./pages/services/MachineLearning";
import HealthcarePatientAssistant from "./pages/portfolio/HealthcarePatientAssistant";
import HRRecruitmentAutomation from "./pages/portfolio/HRRecruitmentAutomation";
import AIEmailWorkflow from "./pages/portfolio/AIEmailWorkflow";
import ManufacturingQualityControl from "./pages/portfolio/ManufacturingQualityControl";
import LegalDocumentAnalyzer from "./pages/portfolio/LegalDocumentAnalyzer";
import EcommerceSalesIntelligence from "./pages/portfolio/EcommerceSalesIntelligence";
import FinancialKnowledgeAssistant from "./pages/portfolio/FinancialKnowledgeAssistant";
import EstateAssistant from "./pages/EstateAssistant";
import DentalOfficeDemo from "./pages/DentalOfficeDemo";
import RestaurantDemo from "./pages/RestaurantDemo";
import HairSalonDemo from "./pages/HairSalonDemo";
import FitnessStudioDemo from "./pages/FitnessStudioDemo";
import NotFound from "./pages/NotFound";
import RealEstateDemo from "./pages/RealEstateDemo";
import EcommerceDemo from './pages/EcommerceDemo';
import LawFirmDemo from './pages/LawFirmDemo';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/portfolio" element={<Portfolio />} /> */}
          <Route path="/tech" element={<Tech />} />
          <Route path="/blog" element={<Blog />} />
          {/* Service pages */}
          <Route path="/services/custom-chatbots" element={<CustomChatbots />} />
          <Route path="/services/document-processing" element={<DocumentProcessing />} />
          <Route path="/services/data-automation" element={<DataAutomation />} />
          <Route path="/services/workflow-optimization" element={<WorkflowOptimization />} />
          <Route path="/services/rag-systems" element={<RAGSystems />} />
          <Route path="/services/api-integrations" element={<APIIntegrations />} />
          <Route path="/services/business-intelligence" element={<BusinessIntelligence />} />
          <Route path="/services/machine-learning" element={<MachineLearning />} />
          {/* Portfolio case study pages */}
          <Route path="/portfolio/healthcare-patient-assistant" element={<HealthcarePatientAssistant />} />
          <Route path="/portfolio/hr-recruitment-automation" element={<HRRecruitmentAutomation />} />
          <Route path="/portfolio/ai-email-workflow" element={<AIEmailWorkflow />} />
          <Route path="/portfolio/manufacturing-quality-control" element={<ManufacturingQualityControl />} />
          <Route path="/portfolio/legal-document-analyzer" element={<LegalDocumentAnalyzer />} />
          <Route path="/portfolio/ecommerce-sales-intelligence" element={<EcommerceSalesIntelligence />} />
          <Route path="/portfolio/financial-knowledge-assistant" element={<FinancialKnowledgeAssistant />} />
          {/* Estate Assistant */}
          <Route path="/estate" element={<EstateAssistant />} />
          {/* Demo pages */}
          <Route path="/demo/dental-office" element={<DentalOfficeDemo />} />
          <Route path="/demo/restaurant" element={<RestaurantDemo />} />
          <Route path="/demo/hair-salon" element={<HairSalonDemo />} />
          <Route path="/demo/fitness-studio" element={<FitnessStudioDemo />} />
          <Route path="/demo/real-estate" element={<RealEstateDemo />} />
          <Route path="/demo/ecommerce" element={<EcommerceDemo />} />
          <Route path="/demo/law-firm" element={<LawFirmDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
// Updated: Sat Jul 26 17:57:58 +07 2025
// VERSION: Sat Jul 26 19:29:03 +07 2025
