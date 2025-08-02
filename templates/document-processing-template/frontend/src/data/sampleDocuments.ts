export interface DocumentSection {
  id: string;
  documentId: string;
  title: string;
  content: string;
  page: number;
  section: string;
  paragraph: number;
  startChar: number;
  endChar: number;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  pages: number;
  sections: DocumentSection[];
  fullText: string;
}

export const sampleDocuments: Document[] = [
  {
    id: "lease-agreement",
    title: "Commercial Lease Agreement",
    type: "Lease",
    pages: 12,
    fullText: "",
    sections: [
      {
        id: "lease-1-1",
        documentId: "lease-agreement",
        title: "Parties and Property",
        content: "This Commercial Lease Agreement (the 'Lease') is entered into on January 15, 2024, between ABC Properties LLC, a Delaware limited liability company ('Landlord'), and TechStart Inc., a California corporation ('Tenant'). The Landlord hereby leases to Tenant, and Tenant hereby leases from Landlord, the premises located at 123 Business Plaza, Suite 200, San Francisco, CA 94105 (the 'Premises').",
        page: 1,
        section: "1.1",
        paragraph: 1,
        startChar: 0,
        endChar: 300
      },
      {
        id: "lease-1-2",
        documentId: "lease-agreement",
        title: "Term of Lease",
        content: "The term of this Lease shall be three (3) years, commencing on February 1, 2024 (the 'Commencement Date') and ending on January 31, 2027 (the 'Expiration Date'), unless sooner terminated as provided herein.",
        page: 1,
        section: "1.2",
        paragraph: 2,
        startChar: 301,
        endChar: 450
      },
      {
        id: "lease-2-1",
        documentId: "lease-agreement",
        title: "Monthly Rent",
        content: "Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month, due on the first day of each month during the term of this Lease. Rent shall be paid by electronic transfer to the account designated by Landlord.",
        page: 2,
        section: "2.1",
        paragraph: 1,
        startChar: 451,
        endChar: 650
      },
      {
        id: "lease-2-2",
        documentId: "lease-agreement",
        title: "Security Deposit",
        content: "Upon execution of this Lease, Tenant shall deposit with Landlord the sum of Seventeen Thousand Dollars ($17,000.00) as a security deposit to secure Tenant's faithful performance of the terms and conditions of this Lease.",
        page: 2,
        section: "2.2",
        paragraph: 2,
        startChar: 651,
        endChar: 800
      },
      {
        id: "lease-3-1",
        documentId: "lease-agreement",
        title: "Use of Premises",
        content: "Tenant shall use the Premises solely for general office purposes and shall not use or permit the Premises to be used for any other purpose without the prior written consent of Landlord.",
        page: 3,
        section: "3.1",
        paragraph: 1,
        startChar: 801,
        endChar: 950
      },
      {
        id: "lease-4-1",
        documentId: "lease-agreement",
        title: "Maintenance and Repairs",
        content: "Landlord shall be responsible for maintaining the structural components of the building, including the roof, exterior walls, and foundation. Tenant shall be responsible for maintaining the interior of the Premises, including HVAC systems, plumbing, and electrical systems serving the Premises.",
        page: 4,
        section: "4.1",
        paragraph: 1,
        startChar: 951,
        endChar: 1150
      },
      {
        id: "lease-5-1",
        documentId: "lease-agreement",
        title: "Early Termination",
        content: "If Tenant desires to terminate this Lease prior to the Expiration Date, Tenant must provide Landlord with written notice at least ninety (90) days in advance. Tenant shall remain liable for rent payments until the termination date and shall pay a termination fee equal to two (2) months' rent.",
        page: 5,
        section: "5.1",
        paragraph: 1,
        startChar: 1151,
        endChar: 1350
      }
    ]
  },
  {
    id: "employment-contract",
    title: "Employment Contract",
    type: "Employment",
    pages: 10,
    fullText: "",
    sections: [
      {
        id: "emp-1-1",
        documentId: "employment-contract",
        title: "Employment Terms",
        content: "This Employment Agreement (the 'Agreement') is entered into on March 1, 2024, between Innovation Corp, a Delaware corporation ('Company'), and Sarah Johnson ('Employee'). The Company hereby employs Employee, and Employee hereby accepts employment with the Company, on the terms and conditions set forth herein.",
        page: 1,
        section: "1.1",
        paragraph: 1,
        startChar: 0,
        endChar: 300
      },
      {
        id: "emp-2-1",
        documentId: "employment-contract",
        title: "Position and Duties",
        content: "Employee shall serve as Senior Software Engineer and shall perform such duties as are customarily performed by persons in such position and such other duties as may be assigned by the Company from time to time. Employee shall report directly to the Chief Technology Officer.",
        page: 2,
        section: "2.1",
        paragraph: 1,
        startChar: 301,
        endChar: 500
      },
      {
        id: "emp-3-1",
        documentId: "employment-contract",
        title: "Compensation",
        content: "Employee shall receive an annual base salary of One Hundred Twenty-Five Thousand Dollars ($125,000.00), payable in accordance with the Company's normal payroll practices. Employee shall also be eligible for an annual performance bonus of up to 20% of base salary, based on individual and company performance.",
        page: 3,
        section: "3.1",
        paragraph: 1,
        startChar: 501,
        endChar: 750
      },
      {
        id: "emp-4-1",
        documentId: "employment-contract",
        title: "Benefits",
        content: "Employee shall be eligible to participate in the Company's health insurance plan, 401(k) retirement plan, and other employee benefit programs as may be established by the Company from time to time. Employee shall be entitled to twenty (20) days of paid vacation per year.",
        page: 4,
        section: "4.1",
        paragraph: 1,
        startChar: 751,
        endChar: 950
      },
      {
        id: "emp-5-1",
        documentId: "employment-contract",
        title: "Non-Compete Clause",
        content: "During the term of employment and for a period of twelve (12) months following termination, Employee shall not, directly or indirectly, engage in any business that competes with the Company within a fifty (50) mile radius of the Company's principal place of business.",
        page: 5,
        section: "5.1",
        paragraph: 1,
        startChar: 951,
        endChar: 1150
      },
      {
        id: "emp-6-1",
        documentId: "employment-contract",
        title: "Termination",
        content: "Either party may terminate this Agreement with thirty (30) days written notice. The Company may terminate Employee immediately for cause, including but not limited to violation of company policies, poor performance, or misconduct. Upon termination, Employee shall be entitled to accrued but unpaid salary and benefits.",
        page: 6,
        section: "6.1",
        paragraph: 1,
        startChar: 1151,
        endChar: 1350
      }
    ]
  },
  {
    id: "purchase-agreement",
    title: "Purchase Agreement",
    type: "Purchase",
    pages: 8,
    fullText: "",
    sections: [
      {
        id: "purchase-1-1",
        documentId: "purchase-agreement",
        title: "Purchase and Sale",
        content: "This Asset Purchase Agreement (the 'Agreement') is entered into on April 15, 2024, between Seller Corp, a California corporation ('Seller'), and Buyer Inc, a Delaware corporation ('Buyer'). Seller hereby agrees to sell, and Buyer hereby agrees to purchase, the Assets (as defined herein) on the terms and conditions set forth herein.",
        page: 1,
        section: "1.1",
        paragraph: 1,
        startChar: 0,
        endChar: 300
      },
      {
        id: "purchase-2-1",
        documentId: "purchase-agreement",
        title: "Purchase Price",
        content: "The total purchase price for the Assets shall be Two Million Five Hundred Thousand Dollars ($2,500,000.00), payable as follows: (a) Five Hundred Thousand Dollars ($500,000.00) at closing; and (b) Two Million Dollars ($2,000,000.00) in installments over twenty-four (24) months.",
        page: 2,
        section: "2.1",
        paragraph: 1,
        startChar: 301,
        endChar: 550
      },
      {
        id: "purchase-3-1",
        documentId: "purchase-agreement",
        title: "Assets Included",
        content: "The Assets include all equipment, inventory, intellectual property, customer lists, and goodwill related to Seller's software development business, but exclude cash, accounts receivable, and real property. A detailed inventory of Assets is attached as Exhibit A.",
        page: 3,
        section: "3.1",
        paragraph: 1,
        startChar: 551,
        endChar: 750
      },
      {
        id: "purchase-4-1",
        documentId: "purchase-agreement",
        title: "Closing Date",
        content: "The closing of the purchase and sale of the Assets shall take place on May 1, 2024, or such other date as the parties may mutually agree in writing. At closing, Seller shall deliver possession of the Assets to Buyer and Buyer shall deliver the initial payment to Seller.",
        page: 4,
        section: "4.1",
        paragraph: 1,
        startChar: 751,
        endChar: 950
      }
    ]
  },
  {
    id: "service-agreement",
    title: "Service Agreement",
    type: "Service",
    pages: 6,
    fullText: "",
    sections: [
      {
        id: "service-1-1",
        documentId: "service-agreement",
        title: "Service Provider",
        content: "This Service Agreement (the 'Agreement') is entered into on June 1, 2024, between CloudTech Solutions LLC, a Delaware limited liability company ('Provider'), and DataCorp Inc, a California corporation ('Client'). Provider shall provide cloud hosting and maintenance services to Client on the terms and conditions set forth herein.",
        page: 1,
        section: "1.1",
        paragraph: 1,
        startChar: 0,
        endChar: 300
      },
      {
        id: "service-2-1",
        documentId: "service-agreement",
        title: "Services",
        content: "Provider shall provide 24/7 cloud hosting services, including server maintenance, security updates, backup services, and technical support. Provider guarantees 99.9% uptime and shall provide compensation for any downtime below this threshold.",
        page: 2,
        section: "2.1",
        paragraph: 1,
        startChar: 301,
        endChar: 500
      },
      {
        id: "service-3-1",
        documentId: "service-agreement",
        title: "Fees",
        content: "Client shall pay Provider a monthly fee of Fifteen Thousand Dollars ($15,000.00) for the services provided hereunder. Fees are due on the first day of each month and shall be paid by electronic transfer. Late payments shall incur a 5% penalty.",
        page: 3,
        section: "3.1",
        paragraph: 1,
        startChar: 501,
        endChar: 700
      },
      {
        id: "service-4-1",
        documentId: "service-agreement",
        title: "Term and Termination",
        content: "This Agreement shall have an initial term of twelve (12) months, commencing on July 1, 2024. Either party may terminate this Agreement with sixty (60) days written notice. Provider shall assist Client with data migration upon termination.",
        page: 4,
        section: "4.1",
        paragraph: 1,
        startChar: 701,
        endChar: 900
      }
    ]
  },
  {
    id: "partnership-agreement",
    title: "Partnership Agreement",
    type: "Partnership",
    pages: 15,
    fullText: "",
    sections: [
      {
        id: "partnership-1-1",
        documentId: "partnership-agreement",
        title: "Partnership Formation",
        content: "This Partnership Agreement (the 'Agreement') is entered into on July 15, 2024, between John Smith ('Partner A') and Mary Johnson ('Partner B'), collectively referred to as the 'Partners'. The Partners hereby form a general partnership under the laws of the State of California.",
        page: 1,
        section: "1.1",
        paragraph: 1,
        startChar: 0,
        endChar: 300
      },
      {
        id: "partnership-2-1",
        documentId: "partnership-agreement",
        title: "Partnership Name and Purpose",
        content: "The partnership shall be known as 'Smith & Johnson Consulting' and shall engage in the business of management consulting services. The principal place of business shall be located at 456 Business Center, Los Angeles, CA 90210.",
        page: 2,
        section: "2.1",
        paragraph: 1,
        startChar: 301,
        endChar: 500
      },
      {
        id: "partnership-3-1",
        documentId: "partnership-agreement",
        title: "Capital Contributions",
        content: "Partner A shall contribute One Hundred Thousand Dollars ($100,000.00) and Partner B shall contribute One Hundred Fifty Thousand Dollars ($150,000.00) to the partnership capital. Additional contributions may be required by unanimous consent of the Partners.",
        page: 3,
        section: "3.1",
        paragraph: 1,
        startChar: 501,
        endChar: 750
      },
      {
        id: "partnership-4-1",
        documentId: "partnership-agreement",
        title: "Profit and Loss Sharing",
        content: "Profits and losses of the partnership shall be shared equally between the Partners (50% each), regardless of capital contributions. Distributions shall be made quarterly, subject to maintaining adequate working capital.",
        page: 4,
        section: "4.1",
        paragraph: 1,
        startChar: 751,
        endChar: 950
      },
      {
        id: "partnership-5-1",
        documentId: "partnership-agreement",
        title: "Management and Decision Making",
        content: "All major decisions affecting the partnership shall require unanimous consent of the Partners. Day-to-day operations may be managed by either Partner, but expenditures over Ten Thousand Dollars ($10,000.00) require both Partners' approval.",
        page: 5,
        section: "5.1",
        paragraph: 1,
        startChar: 951,
        endChar: 1150
      }
    ]
  }
];

export const sampleQuestions = {
  "lease-agreement": [
    "What's the monthly rent?",
    "What happens if I break the lease early?",
    "Who's responsible for maintenance?",
    "When does the lease expire?",
    "What's the security deposit amount?"
  ],
  "employment-contract": [
    "What's the salary and benefits?",
    "What are the non-compete restrictions?",
    "How much vacation time do I get?",
    "What's the termination process?",
    "What's my job title and reporting structure?"
  ],
  "purchase-agreement": [
    "What's the total purchase price?",
    "What assets are included in the sale?",
    "When is the closing date?",
    "How is the purchase price paid?",
    "What's excluded from the sale?"
  ],
  "service-agreement": [
    "What services are provided?",
    "What's the monthly fee?",
    "What's the uptime guarantee?",
    "How can I terminate the agreement?",
    "What happens if services are late?"
  ],
  "partnership-agreement": [
    "How are profits shared?",
    "What are the capital contributions?",
    "How are decisions made?",
    "What's the partnership name?",
    "What's the business purpose?"
  ]
};
