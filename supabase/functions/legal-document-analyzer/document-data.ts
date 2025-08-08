// Document Data Module - EXACT REPLICATION from Node.js backend

export interface DocumentSection {
  id: string
  section: string
  page: number
  content: string
}

export interface Document {
  id: string
  title: string
  sections: DocumentSection[]
}

// Enhanced sample document data with comprehensive content - EXACT REPLICATION
export const sampleDocuments: Record<string, Document> = {
  'lease-agreement': {
    id: 'lease-agreement',
    title: 'Commercial Lease Agreement',
    sections: [
      {
        id: 'lease-1-1',
        section: '1.1',
        page: 1,
        content: 'This Commercial Lease Agreement (the "Lease") is entered into on January 15, 2024, between ABC Properties LLC ("Landlord") and TechStart Inc. ("Tenant").'
      },
      {
        id: 'lease-2-1',
        section: '2.1',
        page: 2,
        content: 'Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month, due on the first day of each month during the term of this Lease.'
      },
      {
        id: 'lease-2-2',
        section: '2.2',
        page: 2,
        content: 'Rent shall be paid by check or electronic transfer to Landlord at the address specified in Section 1.1, or such other address as Landlord may designate in writing.'
      },
      {
        id: 'lease-3-1',
        section: '3.1',
        page: 3,
        content: 'The term of this Lease shall be 36 months, commencing on February 1, 2024, and ending on January 31, 2027, unless terminated earlier in accordance with the provisions of this Lease.'
      },
      {
        id: 'lease-4-1',
        section: '4.1',
        page: 4,
        content: 'Tenant shall use the Premises solely for office and administrative purposes and shall not use the Premises for any other purpose without Landlord\'s prior written consent.'
      },
      {
        id: 'lease-5-1',
        section: '5.1',
        page: 5,
        content: 'If Tenant desires to terminate this Lease prior to the Expiration Date, Tenant must provide Landlord with written notice at least ninety (90) days in advance. Tenant shall remain liable for rent payments until the termination date and shall pay a termination fee equal to two (2) months\' rent.'
      },
      {
        id: 'lease-6-1',
        section: '6.1',
        page: 6,
        content: 'Tenant shall be responsible for all utilities, including electricity, water, gas, and internet service. Landlord shall provide heating and air conditioning during normal business hours.'
      },
      {
        id: 'lease-7-1',
        section: '7.1',
        page: 7,
        content: 'Tenant shall maintain the Premises in good condition and repair, ordinary wear and tear excepted. Tenant shall not make any alterations or improvements without Landlord\'s prior written consent.'
      }
    ]
  },
  'employment-contract': {
    id: 'employment-contract',
    title: 'Employment Contract',
    sections: [
      {
        id: 'emp-1-1',
        section: '1.1',
        page: 1,
        content: 'This Employment Agreement (the "Agreement") is entered into on March 1, 2024, between Innovation Corp ("Employer") and Sarah Johnson ("Employee").'
      },
      {
        id: 'emp-2-1',
        section: '2.1',
        page: 2,
        content: 'Employee shall serve as Senior Software Engineer and shall perform such duties as are customarily associated with such position and as may be assigned by Employer from time to time.'
      },
      {
        id: 'emp-3-1',
        section: '3.1',
        page: 3,
        content: 'Employee shall receive an annual base salary of One Hundred Twenty-Five Thousand Dollars ($125,000.00), payable in accordance with the Company\'s normal payroll practices.'
      },
      {
        id: 'emp-3-2',
        section: '3.2',
        page: 3,
        content: 'Employee shall be eligible for an annual performance bonus of up to 20% of base salary, based on individual and company performance metrics.'
      },
      {
        id: 'emp-4-1',
        section: '4.1',
        page: 4,
        content: 'Employee shall be entitled to 20 days of paid vacation per year, in addition to company holidays. Vacation days must be approved in advance by Employee\'s supervisor.'
      },
      {
        id: 'emp-5-1',
        section: '5.1',
        page: 5,
        content: 'Employee shall be entitled to participate in the Company\'s health insurance plan, 401(k) retirement plan, and other employee benefit programs as may be offered from time to time.'
      },
      {
        id: 'emp-6-1',
        section: '6.1',
        page: 6,
        content: 'Either party may terminate this Agreement with thirty (30) days written notice. Employer may terminate immediately for cause, including but not limited to misconduct, violation of company policies, or poor performance.'
      },
      {
        id: 'emp-7-1',
        section: '7.1',
        page: 7,
        content: 'Employee agrees to maintain the confidentiality of all proprietary and confidential information of the Company and shall not disclose such information to any third party during or after employment.'
      },
      {
        id: 'emp-8-1',
        section: '8.1',
        page: 8,
        content: 'Employee agrees not to compete with the Company for a period of 12 months following termination of employment, within a 50-mile radius of the Company\'s primary business location.'
      }
    ]
  },
  'purchase-agreement': {
    id: 'purchase-agreement',
    title: 'Purchase Agreement',
    sections: [
      {
        id: 'purchase-1-1',
        section: '1.1',
        page: 1,
        content: 'This Asset Purchase Agreement (the "Agreement") is entered into on April 15, 2024, between TechAcquire Inc. ("Buyer") and Legacy Software Corp ("Seller").'
      },
      {
        id: 'purchase-2-1',
        section: '2.1',
        page: 2,
        content: 'Seller agrees to sell and Buyer agrees to purchase all assets of the Seller\'s software division, including intellectual property, customer contracts, and equipment, for the sum of Two Million Dollars ($2,000,000.00).'
      },
      {
        id: 'purchase-3-1',
        section: '3.1',
        page: 3,
        content: 'The purchase price shall be paid as follows: Five Hundred Thousand Dollars ($500,000.00) at closing, and the remaining One Million Five Hundred Thousand Dollars ($1,500,000.00) in three equal installments over 12 months.'
      },
      {
        id: 'purchase-4-1',
        section: '4.1',
        page: 4,
        content: 'Closing shall occur on or before May 15, 2024, at the offices of Buyer\'s legal counsel, or such other date and location as the parties may mutually agree.'
      },
      {
        id: 'purchase-5-1',
        section: '5.1',
        page: 5,
        content: 'Seller represents and warrants that it has good and marketable title to all assets being sold, free and clear of all liens, encumbrances, and claims of third parties.'
      },
      {
        id: 'purchase-6-1',
        section: '6.1',
        page: 6,
        content: 'Buyer shall have the right to conduct due diligence on the assets and business operations of Seller for a period of 30 days from the date of this Agreement.'
      },
      {
        id: 'purchase-7-1',
        section: '7.1',
        page: 7,
        content: 'This Agreement may be terminated by either party if the other party materially breaches any provision of this Agreement and fails to cure such breach within 15 days of receiving written notice.'
      }
    ]
  },
  'service-agreement': {
    id: 'service-agreement',
    title: 'Service Agreement',
    sections: [
      {
        id: 'service-1-1',
        section: '1.1',
        page: 1,
        content: 'This Service Agreement (the "Agreement") is entered into on May 1, 2024, between CloudTech Solutions ("Service Provider") and DataCorp Inc. ("Client").'
      },
      {
        id: 'service-2-1',
        section: '2.1',
        page: 2,
        content: 'Service Provider shall provide cloud infrastructure management and technical support services to Client, including 24/7 monitoring, backup management, and system maintenance.'
      },
      {
        id: 'service-3-1',
        section: '3.1',
        page: 3,
        content: 'Client shall pay Service Provider a monthly fee of Fifteen Thousand Dollars ($15,000.00) for the services provided under this Agreement, due on the first day of each month.'
      },
      {
        id: 'service-4-1',
        section: '4.1',
        page: 4,
        content: 'Service Provider shall maintain a 99.9% uptime guarantee for all services provided under this Agreement, excluding scheduled maintenance windows and force majeure events.'
      },
      {
        id: 'service-5-1',
        section: '5.1',
        page: 5,
        content: 'Service Provider shall provide technical support during business hours (8:00 AM to 6:00 PM EST) and emergency support 24/7 for critical system issues.'
      },
      {
        id: 'service-6-1',
        section: '6.1',
        page: 6,
        content: 'Either party may terminate this Agreement with sixty (60) days written notice. Service Provider shall provide transition assistance to Client during the notice period.'
      },
      {
        id: 'service-7-1',
        section: '7.1',
        page: 7,
        content: 'Service Provider shall maintain appropriate security measures to protect Client\'s data and shall comply with all applicable data protection laws and regulations.'
      }
    ]
  },
  'partnership-agreement': {
    id: 'partnership-agreement',
    title: 'Partnership Agreement',
    sections: [
      {
        id: 'partnership-1-1',
        section: '1.1',
        page: 1,
        content: 'This Partnership Agreement (the "Agreement") is entered into on June 1, 2024, between InnovateTech LLC ("Partner A") and Growth Ventures Inc. ("Partner B").'
      },
      {
        id: 'partnership-2-1',
        section: '2.1',
        page: 2,
        content: 'The parties hereby form a general partnership (the "Partnership") for the purpose of developing and marketing innovative software solutions for the healthcare industry.'
      },
      {
        id: 'partnership-3-1',
        section: '3.1',
        page: 3,
        content: 'Partner A shall contribute Two Hundred Fifty Thousand Dollars ($250,000.00) in cash and technical expertise, while Partner B shall contribute One Hundred Fifty Thousand Dollars ($150,000.00) in cash and marketing resources.'
      },
      {
        id: 'partnership-4-1',
        section: '4.1',
        page: 4,
        content: 'Profits and losses of the Partnership shall be shared equally (50/50) between the partners, unless otherwise agreed in writing.'
      },
      {
        id: 'partnership-5-1',
        section: '5.1',
        page: 5,
        content: 'Major decisions affecting the Partnership, including capital expenditures over Fifty Thousand Dollars ($50,000.00), shall require unanimous consent of both partners.'
      },
      {
        id: 'partnership-6-1',
        section: '6.1',
        page: 6,
        content: 'The Partnership shall have an initial term of five (5) years, renewable for additional five-year terms by mutual agreement of the partners.'
      },
      {
        id: 'partnership-7-1',
        section: '7.1',
        page: 7,
        content: 'Either partner may withdraw from the Partnership with ninety (90) days written notice, subject to the terms of this Agreement regarding dissolution and winding up.'
      },
      {
        id: 'partnership-8-1',
        section: '8.1',
        page: 8,
        content: 'Upon dissolution of the Partnership, assets shall be distributed first to creditors, then to partners in proportion to their capital accounts.'
      }
    ]
  }
}

export function getDocumentData(documentId?: string): Document | Record<string, Document> {
  if (documentId) {
    return sampleDocuments[documentId]
  }
  return sampleDocuments
}

export function getDocumentTitles(): Record<string, string> {
  return {
    'lease-agreement': 'lease agreement',
    'employment-contract': 'employment contract',
    'purchase-agreement': 'purchase agreement',
    'service-agreement': 'service agreement',
    'partnership-agreement': 'partnership agreement'
  }
}
