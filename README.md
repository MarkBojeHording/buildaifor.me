# buildaifor.me - AI Solutions Agency

A modern, professional website for an AI solutions agency that specializes in building custom AI automation solutions for businesses across various industries.

## 🚀 Feature

### Core Services
- **AI Chatbots & Virtual Assistants** - Intelligent customer service and support automation
- **Document Processing & Analysis** - Automated contract analysis, data extraction, and risk assessment
- **Data Analysis & Predictive Analytics** - Business intelligence and forecasting solutions
- **Workflow Automation** - Process optimization and task automation
- **RAG (Retrieval-Augmented Generation) Systems** - Knowledge management and intelligent search
- **Computer Vision Solutions** - Quality control, defect detection, and visual analysis
- **API Integrations** - Seamless third-party service connections

### Industries Served
- Healthcare
- Legal Services
- E-commerce & Retail
- Manufacturing
- Financial Services
- Human Resources

### Interactive Features
- **Contact Form** - EmailJS-powered contact form with Gmail integration
- **Consultation Booking** - Calendly popup for scheduling free consultations
- **Portfolio Showcase** - Interactive project gallery with detailed case studies
- **Responsive Navigation** - Smooth scrolling and mobile-optimized navigation

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives
- **Email Service**: EmailJS with Gmail integration
- **Scheduling**: Calendly popup integration
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing hero section
│   ├── Services.tsx    # Services showcase
│   ├── Portfolio.tsx   # Project portfolio
│   ├── Industries.tsx  # Industry solutions
│   ├── About.tsx       # About section
│   ├── Process.tsx     # Work process
│   ├── Pricing.tsx     # Pricing plans
│   ├── Contact.tsx     # Contact form with EmailJS
│   ├── CalendlyPopup.tsx # Calendly integration
│   └── Footer.tsx      # Footer
├── pages/              # Page components
│   ├── services/       # Individual service pages
│   ├── portfolio/      # Portfolio case studies
│   ├── About.tsx       # About page
│   └── Index.tsx       # Home page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # App entry point
```

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Custom Logo**: SVG logo combining building/construction and AI elements
- **Interactive Portfolio**: Filterable project showcase with case studies
- **Contact Forms**: Professional contact and consultation request forms
- **Performance Optimized**: Fast loading with Vite and optimized assets
- **High-Contrast Buttons**: Accessible button styling for all backgrounds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- EmailJS account (for contact form)
- Calendly account (for consultation booking)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd buildaifor.me
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
# Create .env file if needed for any future environment variables
touch .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📧 EmailJS Setup (Contact Form)

The contact form uses EmailJS to send emails through Gmail. Here's how to set it up:

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Gmail Service
1. In EmailJS dashboard, click "Add New Service"
2. Select "Gmail" as the service type
3. Connect your Gmail account (the one that will receive emails)
4. Name it (e.g., "Gmail Service")
5. **Copy the Service ID** (looks like `service_abc123`)

### 3. Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template:

**Subject:** `New AI Project Inquiry from {{from_name}}`

**Body:**
```
Name: {{from_name}}
Email: {{from_email}}
Company: {{company_name}}
Project Type: {{project_type}}
Budget Range: {{budget_range}}
Message: {{message}}
```

4. Set "To Email" to your Gmail address
5. Set "From Name" to `{{from_name}}`
6. Set "Reply To" to `{{from_email}}`
7. **Copy the Template ID** (looks like `template_xyz789`)

### 4. Get Your Public Key
1. Go to "Account" → "API Keys" in EmailJS dashboard
2. **Copy your Public Key** (looks like `QpnDI71fHb5sCSLbRI2TW`)

### 5. Update Contact Component
In `src/components/Contact.tsx`, update these values:
```javascript
emailjs.send(
  'YOUR_SERVICE_ID',      // Replace with your Gmail Service ID
  'YOUR_TEMPLATE_ID',     // Replace with your Template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    company_name: formData.company,
    project_type: formData.projectType,
    budget_range: formData.budget,
    message: formData.message
  },
  'YOUR_PUBLIC_KEY'       // Replace with your Public Key
)
```

## 📅 Calendly Setup (Consultation Booking)

The "Book Free Consultation" buttons open a Calendly popup for scheduling.

### 1. Create Calendly Account
1. Go to [https://calendly.com/](https://calendly.com/)
2. Sign up for a free account
3. Complete your profile setup

### 2. Create Event Type
1. Click "+ New Event Type"
2. Set event name (e.g., "Free AI Consultation")
3. Set duration (e.g., 30 minutes)
4. Configure availability and timezone
5. Add any questions for invitees
6. Save the event

### 3. Get Your Calendly URL
1. In your Calendly dashboard, find your event
2. Click "Share" or copy the event URL
3. The URL should look like: `https://calendly.com/yourusername/event-name`

### 4. Update Calendly Component
In `src/components/CalendlyPopup.tsx`, update the URL:
```javascript
<InlineWidget
  url="https://calendly.com/YOUR_USERNAME/YOUR_EVENT_NAME"
  // ... other props
/>
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 Key Sections

1. **Hero Section** - Compelling headline with call-to-action
2. **Services** - Detailed service offerings with icons and descriptions
3. **Portfolio** - Interactive project showcase with filtering
4. **Industries** - Industry-specific solutions and use cases
5. **About** - Company information and expertise
6. **Process** - Step-by-step development methodology
7. **Pricing** - Transparent pricing plans ($40/hour for custom solutions)
8. **Contact** - EmailJS-powered contact form
9. **Consultation Booking** - Calendly popup integration

## 🔧 Customization

### Colors
The primary brand colors are defined in `tailwind.config.ts`:
- Primary Blue: `#2563eb` (blue-600)
- Dark Blue: `#1d4ed8` (blue-800)
- Gray tones for text and backgrounds

### Components
All UI components are built with shadcn/ui and can be customized in the `src/components/ui/` directory.

### Content
Update content by modifying the respective component files in `src/components/`.

### Button Styling
For pages with colored/gradient backgrounds, buttons use high-contrast styling:
- Primary: `bg-white text-[accent-color] hover:bg-gray-100`
- Secondary: `border-white text-white hover:bg-white hover:text-[accent-color]`

## 📈 Performance

- Lighthouse score: 95+ (Performance, Accessibility, Best Practices, SEO)
- Optimized images and assets
- Efficient bundle splitting with Vite
- Minimal JavaScript footprint
- Fast loading with Vite HMR

## 🔒 Security

- No sensitive data in client-side code
- Secure form handling with EmailJS
- HTTPS ready
- Content Security Policy compliant
- EmailJS public key is safe to expose (by design)

## 📦 Dependencies

Key dependencies include:
- `react-calendly` - Calendly integration
- `@emailjs/browser` - EmailJS client library
- `react-router-dom` - Client-side routing
- `lucide-react` - Icon library
- `@radix-ui/*` - UI primitives
- `tailwindcss` - CSS framework

## 📄 License

This project is proprietary software for buildaifor.me AI agency.

## 🤝 Support

For support or questions about this website, please contact the development team.

---

**Built with ❤️ for buildaifor.me**
