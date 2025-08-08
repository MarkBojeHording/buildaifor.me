// Legal Documents Data - Professional Client Package
// 5 comprehensive legal document types with 29+ sections
// Target: Law firms, corporate legal departments, legal professionals

export interface DocumentSection {
  id: string;
  title: string;
  page: number;
  content: string;
  legalConcepts: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface LegalDocument {
  id: string;
  title: string;
  type: 'Commercial Lease' | 'Employment' | 'Purchase' | 'Service' | 'Partnership';
  pages: number;
  sections: DocumentSection[];
  metadata: {
    jurisdiction?: string;
    effectiveDate?: string;
    parties: string[];
    practiceArea: string;
    complexity: 'basic' | 'standard' | 'complex';
  };
}

export const legalDocuments: Record<string, LegalDocument> = {
  'commercial-lease': {
    id: 'commercial-lease',
    title: 'Commercial Lease Agreement',
    type: 'Commercial Lease',
    pages: 18,
    sections: [
      {
        id: 'lease-1-1',
        title: 'Parties and Premises',
        page: 1,
        content: 'This Commercial Lease Agreement (the "Lease") is entered into on January 15, 2024, between ABC Properties LLC ("Landlord") and TechStart Inc. ("Tenant"). The Premises consists of approximately 2,500 square feet of office space located at 123 Business Park Drive, Suite 200, Anytown, CA 90210.',
        legalConcepts: ['contract formation', 'parties identification', 'premises description'],
        riskLevel: 'low'
      },
      {
        id: 'lease-2-1',
        title: 'Rent and Payment Terms',
        page: 2,
        content: 'Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month, due on the first day of each month during the term of this Lease. Rent shall be paid by check or electronic transfer to Landlord at the address specified in Section 1.1, or such other address as Landlord may designate in writing.',
        legalConcepts: ['rental payment', 'payment method', 'due dates'],
        riskLevel: 'medium'
      },
      {
        id: 'lease-3-1',
        title: 'Lease Term',
        page: 3,
        content: 'The term of this Lease shall be 36 months, commencing on February 1, 2024, and ending on January 31, 2027, unless terminated earlier in accordance with the provisions of this Lease. Tenant shall have the option to renew this Lease for one additional 24-month period upon written notice to Landlord at least 90 days prior to the expiration date.',
        legalConcepts: ['lease term', 'renewal option', 'notice requirements'],
        riskLevel: 'medium'
      },
      {
        id: 'lease-4-1',
        title: 'Use of Premises',
        page: 4,
        content: 'Tenant shall use the Premises solely for office and administrative purposes and shall not use the Premises for any other purpose without Landlord\'s prior written consent. Tenant shall not conduct any business that violates any applicable laws, regulations, or zoning ordinances.',
        legalConcepts: ['permitted use', 'zoning compliance', 'landlord consent'],
        riskLevel: 'high'
      },
      {
        id: 'lease-5-1',
        title: 'Early Termination',
        page: 5,
        content: 'If Tenant desires to terminate this Lease prior to the Expiration Date, Tenant must provide Landlord with written notice at least ninety (90) days in advance. Tenant shall remain liable for rent payments until the termination date and shall pay a termination fee equal to two (2) months\' rent.',
        legalConcepts: ['early termination', 'notice period', 'termination fee'],
        riskLevel: 'high'
      },
      {
        id: 'lease-6-1',
        title: 'Utilities and Services',
        page: 6,
        content: 'Tenant shall be responsible for all utilities, including electricity, water, gas, and internet service. Landlord shall provide heating and air conditioning during normal business hours. Tenant shall pay all utility charges directly to the utility providers.',
        legalConcepts: ['utility responsibility', 'service provision', 'payment obligations'],
        riskLevel: 'medium'
      },
      {
        id: 'lease-7-1',
        title: 'Maintenance and Repairs',
        page: 7,
        content: 'Tenant shall maintain the Premises in good condition and repair, ordinary wear and tear excepted. Tenant shall not make any alterations or improvements without Landlord\'s prior written consent. Landlord shall be responsible for structural repairs and major system maintenance.',
        legalConcepts: ['maintenance obligations', 'alterations consent', 'structural repairs'],
        riskLevel: 'medium'
      },
      {
        id: 'lease-8-1',
        title: 'Security Deposit',
        page: 8,
        content: 'Tenant shall deposit with Landlord the sum of Seventeen Thousand Dollars ($17,000.00) as a security deposit. The security deposit shall be held by Landlord as security for Tenant\'s faithful performance of all terms and conditions of this Lease.',
        legalConcepts: ['security deposit', 'performance security', 'deposit terms'],
        riskLevel: 'medium'
      }
    ],
    metadata: {
      jurisdiction: 'California',
      effectiveDate: '2024-01-15',
      parties: ['ABC Properties LLC', 'TechStart Inc.'],
      practiceArea: 'Real Estate Law',
      complexity: 'standard'
    }
  },
  'employment-contract': {
    id: 'employment-contract',
    title: 'Employment Agreement',
    type: 'Employment',
    pages: 12,
    sections: [
      {
        id: 'emp-1-1',
        title: 'Employment Terms',
        page: 1,
        content: 'This Employment Agreement (the "Agreement") is entered into on March 1, 2024, between Innovation Corp ("Employer") and Sarah Johnson ("Employee"). Employee shall serve as Senior Software Engineer and shall perform such duties as are customarily associated with such position.',
        legalConcepts: ['employment relationship', 'job title', 'duties definition'],
        riskLevel: 'low'
      },
      {
        id: 'emp-2-1',
        title: 'Compensation and Benefits',
        page: 2,
        content: 'Employee shall receive an annual base salary of One Hundred Twenty-Five Thousand Dollars ($125,000.00), payable in accordance with the Company\'s normal payroll practices. Employee shall be eligible for an annual performance bonus of up to 20% of base salary, based on individual and company performance metrics.',
        legalConcepts: ['salary terms', 'bonus eligibility', 'performance metrics'],
        riskLevel: 'medium'
      },
      {
        id: 'emp-3-1',
        title: 'Termination Provisions',
        page: 3,
        content: 'Either party may terminate this Agreement with thirty (30) days written notice. Employer may terminate Employee immediately for cause, including but not limited to: violation of company policies, poor performance, or misconduct. Employee shall be entitled to severance pay equal to two weeks\' salary for each year of service.',
        legalConcepts: ['termination notice', 'cause termination', 'severance pay'],
        riskLevel: 'high'
      },
      {
        id: 'emp-4-1',
        title: 'Non-Compete and Confidentiality',
        page: 4,
        content: 'Employee agrees not to compete with Employer for a period of 12 months following termination. Employee shall maintain the confidentiality of all proprietary information and trade secrets. This obligation survives termination of employment.',
        legalConcepts: ['non-compete clause', 'confidentiality', 'trade secrets'],
        riskLevel: 'high'
      },
      {
        id: 'emp-5-1',
        title: 'Intellectual Property',
        page: 5,
        content: 'All inventions, discoveries, and intellectual property created by Employee during employment shall be the sole and exclusive property of Employer. Employee shall execute all documents necessary to perfect Employer\'s ownership rights.',
        legalConcepts: ['IP ownership', 'work for hire', 'assignment rights'],
        riskLevel: 'high'
      },
      {
        id: 'emp-6-1',
        title: 'Dispute Resolution',
        page: 6,
        content: 'Any disputes arising under this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The prevailing party shall be entitled to recover reasonable attorney fees.',
        legalConcepts: ['arbitration clause', 'attorney fees', 'dispute resolution'],
        riskLevel: 'medium'
      }
    ],
    metadata: {
      jurisdiction: 'California',
      effectiveDate: '2024-03-01',
      parties: ['Innovation Corp', 'Sarah Johnson'],
      practiceArea: 'Employment Law',
      complexity: 'standard'
    }
  },
  'purchase-agreement': {
    id: 'purchase-agreement',
    title: 'Asset Purchase Agreement',
    type: 'Purchase',
    pages: 15,
    sections: [
      {
        id: 'purchase-1-1',
        title: 'Purchase and Sale',
        page: 1,
        content: 'Seller agrees to sell and Buyer agrees to purchase substantially all of the assets of Seller\'s business for the Purchase Price of Two Million Dollars ($2,000,000.00). The transaction shall close on or before June 30, 2024, subject to satisfaction of all conditions precedent.',
        legalConcepts: ['asset purchase', 'purchase price', 'closing date'],
        riskLevel: 'medium'
      },
      {
        id: 'purchase-2-1',
        title: 'Due Diligence',
        page: 2,
        content: 'Buyer shall have 45 days from the date of this Agreement to conduct due diligence. Seller shall provide Buyer with access to all books, records, and financial statements. Buyer may terminate this Agreement if due diligence reveals material adverse information.',
        legalConcepts: ['due diligence', 'access rights', 'termination rights'],
        riskLevel: 'high'
      },
      {
        id: 'purchase-3-1',
        title: 'Representations and Warranties',
        page: 3,
        content: 'Seller represents and warrants that: (a) it has good title to all assets; (b) financial statements are accurate; (c) there are no undisclosed liabilities; and (d) all material contracts are in full force and effect. These representations survive closing for 18 months.',
        legalConcepts: ['representations', 'warranties', 'survival period'],
        riskLevel: 'high'
      },
      {
        id: 'purchase-4-1',
        title: 'Indemnification',
        page: 4,
        content: 'Seller shall indemnify Buyer for any breach of representations, warranties, or covenants. Buyer shall indemnify Seller for any breach of Buyer\'s obligations. Indemnification claims must be made within 18 months of closing.',
        legalConcepts: ['indemnification', 'breach claims', 'time limitations'],
        riskLevel: 'high'
      },
      {
        id: 'purchase-5-1',
        title: 'Closing Conditions',
        page: 5,
        content: 'Closing is subject to: (a) all regulatory approvals; (b) no material adverse change; (c) all representations being true; and (d) delivery of required documents. Either party may terminate if conditions are not satisfied by closing date.',
        legalConcepts: ['closing conditions', 'regulatory approval', 'material adverse change'],
        riskLevel: 'high'
      }
    ],
    metadata: {
      jurisdiction: 'Delaware',
      effectiveDate: '2024-04-15',
      parties: ['TechCorp Inc.', 'Acquisition LLC'],
      practiceArea: 'Corporate Law',
      complexity: 'complex'
    }
  },
  'service-agreement': {
    id: 'service-agreement',
    title: 'Professional Services Agreement',
    type: 'Service',
    pages: 10,
    sections: [
      {
        id: 'service-1-1',
        title: 'Services and Scope',
        page: 1,
        content: 'Provider shall provide consulting services including strategic planning, process optimization, and technology implementation. Services shall be performed in accordance with the Statement of Work attached as Exhibit A. Provider shall use reasonable efforts to complete services within the agreed timeline.',
        legalConcepts: ['service scope', 'statement of work', 'performance standards'],
        riskLevel: 'medium'
      },
      {
        id: 'service-2-1',
        title: 'Payment Terms',
        page: 2,
        content: 'Client shall pay Provider at the rate of $250 per hour for all services rendered. Invoices shall be submitted monthly and are due within 30 days of receipt. Late payments shall bear interest at 1.5% per month.',
        legalConcepts: ['hourly rates', 'payment terms', 'late fees'],
        riskLevel: 'medium'
      },
      {
        id: 'service-3-1',
        title: 'Intellectual Property',
        page: 3,
        content: 'Provider retains ownership of all pre-existing intellectual property. Work product created specifically for Client shall be owned by Client upon full payment. Provider may use general knowledge and experience gained from the engagement.',
        legalConcepts: ['IP ownership', 'work product', 'general knowledge'],
        riskLevel: 'high'
      },
      {
        id: 'service-4-1',
        title: 'Limitation of Liability',
        page: 4,
        content: 'Provider\'s total liability shall not exceed the amount paid by Client in the 12 months preceding the claim. Provider shall not be liable for indirect, incidental, or consequential damages. This limitation does not apply to intentional misconduct.',
        legalConcepts: ['liability cap', 'damage limitations', 'intentional misconduct'],
        riskLevel: 'medium'
      }
    ],
    metadata: {
      jurisdiction: 'New York',
      effectiveDate: '2024-02-01',
      parties: ['Consulting Solutions LLC', 'Global Industries Inc.'],
      practiceArea: 'Business Law',
      complexity: 'standard'
    }
  },
  'partnership-agreement': {
    id: 'partnership-agreement',
    title: 'General Partnership Agreement',
    type: 'Partnership',
    pages: 14,
    sections: [
      {
        id: 'partnership-1-1',
        title: 'Partnership Formation',
        page: 1,
        content: 'The undersigned parties hereby form a general partnership under the laws of the State of California. The Partnership shall be known as "Innovation Partners" and shall commence business on July 1, 2024. The principal place of business shall be 456 Innovation Drive, San Francisco, CA 94105.',
        legalConcepts: ['partnership formation', 'business name', 'principal place'],
        riskLevel: 'low'
      },
      {
        id: 'partnership-2-1',
        title: 'Capital Contributions',
        page: 2,
        content: 'Partner A shall contribute $500,000 in cash and Partner B shall contribute $300,000 in cash and $200,000 in intellectual property. Additional capital contributions may be required by unanimous consent. No partner shall be entitled to interest on capital contributions.',
        legalConcepts: ['capital contributions', 'unanimous consent', 'interest prohibition'],
        riskLevel: 'medium'
      },
      {
        id: 'partnership-3-1',
        title: 'Profit and Loss Sharing',
        page: 3,
        content: 'Profits and losses shall be shared equally between the partners (50% each). Distributions shall be made quarterly, subject to maintaining adequate working capital. No partner shall be entitled to a salary or guaranteed payment.',
        legalConcepts: ['profit sharing', 'distributions', 'working capital'],
        riskLevel: 'medium'
      },
      {
        id: 'partnership-4-1',
        title: 'Management and Decision Making',
        page: 4,
        content: 'All major decisions affecting the partnership shall require unanimous consent of all partners. Major decisions include: hiring employees, entering into contracts over $25,000, borrowing money, and selling partnership assets.',
        legalConcepts: ['unanimous consent', 'major decisions', 'management authority'],
        riskLevel: 'high'
      },
      {
        id: 'partnership-5-1',
        title: 'Partnership Dissolution',
        page: 5,
        content: 'The partnership may be dissolved by unanimous agreement or upon the death, incapacity, or withdrawal of any partner. Upon dissolution, assets shall be liquidated and proceeds distributed in accordance with capital account balances.',
        legalConcepts: ['dissolution events', 'liquidation', 'distribution'],
        riskLevel: 'high'
      },
      {
        id: 'partnership-6-1',
        title: 'Dispute Resolution',
        page: 6,
        content: 'Any disputes between partners shall be resolved through mediation, followed by binding arbitration if mediation is unsuccessful. The prevailing party shall be entitled to recover reasonable attorney fees and costs.',
        legalConcepts: ['mediation', 'arbitration', 'attorney fees'],
        riskLevel: 'medium'
      }
    ],
    metadata: {
      jurisdiction: 'California',
      effectiveDate: '2024-07-01',
      parties: ['Partner A LLC', 'Partner B Corp'],
      practiceArea: 'Partnership Law',
      complexity: 'standard'
    }
  }
};

export function getLegalDocuments(): Record<string, LegalDocument> {
  return legalDocuments;
}

export function getDocumentTypes(): string[] {
  return Object.keys(legalDocuments);
}

export function getDocumentById(id: string): LegalDocument | null {
  return legalDocuments[id] || null;
}

export function getDocumentsByType(type: LegalDocument['type']): LegalDocument[] {
  return Object.values(legalDocuments).filter(doc => doc.type === type);
}

export function getDocumentsByPracticeArea(practiceArea: string): LegalDocument[] {
  return Object.values(legalDocuments).filter(doc => doc.metadata.practiceArea === practiceArea);
}
