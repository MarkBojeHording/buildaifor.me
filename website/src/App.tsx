import { Toaster } from "@/components/ui/toaster.tsx";
import { Toaster as Sonner } from "@/components/ui/sonner.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Tech from "./pages/Tech.tsx";
import Blog from "./pages/Blog.tsx";
import CustomChatbots from "./pages/services/CustomChatbots.tsx";
import DocumentProcessing from "./pages/services/DocumentProcessing.tsx";
import DataAutomation from "./pages/services/DataAutomation.tsx";
import WorkflowOptimization from "./pages/services/WorkflowOptimization.tsx";
import RAGSystems from "./pages/services/RAGSystems.tsx";
import APIIntegrations from "./pages/services/APIIntegrations.tsx";
import BusinessIntelligence from "./pages/services/BusinessIntelligence.tsx";
import MachineLearning from "./pages/services/MachineLearning.tsx";
import HealthcarePatientAssistant from "./pages/portfolio/HealthcarePatientAssistant.tsx";
import HRRecruitmentAutomation from "./pages/portfolio/HRRecruitmentAutomation.tsx";
import AIEmailWorkflow from "./pages/portfolio/AIEmailWorkflow.tsx";
import ManufacturingQualityControl from "./pages/portfolio/ManufacturingQualityControl.tsx";
import LegalDocumentAnalyzer from "./pages/portfolio/LegalDocumentAnalyzer.tsx";
import EcommerceSalesIntelligence from "./pages/portfolio/EcommerceSalesIntelligence.tsx";
import FinancialKnowledgeAssistant from "./pages/portfolio/FinancialKnowledgeAssistant.tsx";
import EstateAssistant from "./pages/EstateAssistant.tsx";
import DentalOfficeDemo from "./pages/DentalOfficeDemo.tsx";
import RestaurantDemo from "./pages/RestaurantDemo.tsx";
import HairSalonDemo from "./pages/HairSalonDemo.tsx";
import FitnessStudioDemo from "./pages/FitnessStudioDemo.tsx";
import NotFound from "./pages/NotFound.tsx";
import RealEstateDemo from "./pages/RealEstateDemo.tsx";
import EcommerceDemo from './pages/EcommerceDemo.tsx';
import LawFirmDemo from './pages/LawFirmDemo.tsx';

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
