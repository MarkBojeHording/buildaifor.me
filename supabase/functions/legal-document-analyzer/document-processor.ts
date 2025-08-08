// Document Processor - EXACT REPLICATION from Node.js backend

import { Document, DocumentSection } from './document-data.ts'

interface AnalysisSummary {
  key_points: string[]
  risks_identified: string[]
  compliance_score: number
}

interface ProcessedCitation {
  section_id: string
  page: number
  title: string
  relevance_score: number
  text?: string
  display?: string
  reference?: string
  fullText?: string
}

export class DocumentProcessor {
  private riskKeywords: string[]
  private complianceKeywords: string[]
  private keyTermPatterns: RegExp[]

  constructor() {
    this.riskKeywords = [
      'liability', 'penalty', 'terminate', 'breach', 'default', 'forfeit',
      'damages', 'indemnify', 'warranty', 'represent', 'guarantee',
      'confidential', 'non-compete', 'restrict', 'prohibit', 'exclusive'
    ]

    this.complianceKeywords = [
      'comply', 'compliance', 'regulation', 'law', 'statute', 'governing',
      'jurisdiction', 'gdpr', 'privacy', 'security', 'data protection',
      'audit', 'inspection', 'certification', 'license', 'permit'
    ]

    this.keyTermPatterns = [
      /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g, // Dollar amounts
      /\d+\s*(days?|months?|years?)/gi, // Time periods
      /(?:shall|must|will|agree to|obligated to)/gi, // Obligations
      /(?:terminate|end|cancel|expire)/gi, // Termination terms
      /(?:confidential|proprietary|trade secret)/gi, // Confidentiality
      /(?:indemnify|hold harmless|defend)/gi, // Indemnification
      /(?:warrant|represent|covenant)/gi // Warranties
    ]
  }

  /**
   * Generate analysis summary - EXACT REPLICATION
   */
  async generateAnalysisSummary(message: string, document: Document, citations: ProcessedCitation[]): Promise<AnalysisSummary> {
    try {
      const keyPoints = this.extractKeyPoints(document, citations)
      const risks = this.identifyRisks(document, citations)
      const complianceScore = this.calculateComplianceScore(document)

      return {
        key_points: keyPoints,
        risks_identified: risks,
        compliance_score: complianceScore
      }
    } catch (error) {
      console.error('Error generating analysis summary:', error)
      return this.getDefaultAnalysisSummary()
    }
  }

  /**
   * Extract key points from document - EXACT REPLICATION
   */
  private extractKeyPoints(document: Document, citations: ProcessedCitation[]): string[] {
    const keyPoints: string[] = []

    // Extract key terms from document content
    const allContent = document.sections.map(s => s.content).join(' ')
    
    // Find dollar amounts
    const amounts = allContent.match(/\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g) || []
    if (amounts.length > 0) {
      keyPoints.push(`Payment amount: ${amounts[0]}`)
    }

    // Find time periods
    const timePeriods = allContent.match(/\d+\s*(days?|months?|years?)/gi) || []
    if (timePeriods.length > 0) {
      keyPoints.push(`Contract duration: ${timePeriods[0]}`)
    }

    // Find termination terms
    if (allContent.toLowerCase().includes('terminate')) {
      keyPoints.push('Contract includes termination provisions')
    }

    // Find confidentiality terms
    if (allContent.toLowerCase().includes('confidential')) {
      keyPoints.push('Confidentiality obligations included')
    }

    // Extract from citations if available
    for (const citation of citations.slice(0, 2)) {
      if (citation.text) {
        const summary = this.summarizeCitation(citation.text)
        if (summary) keyPoints.push(summary)
      }
    }

    return keyPoints.slice(0, 5) // Limit to 5 key points
  }

  /**
   * Identify risks in document - EXACT REPLICATION
   */
  private identifyRisks(document: Document, citations: ProcessedCitation[]): string[] {
    const risks: string[] = []
    const allContent = document.sections.map(s => s.content).join(' ').toLowerCase()

    // Check for high-risk terms
    if (allContent.includes('indemnify') || allContent.includes('hold harmless')) {
      risks.push('Indemnification obligations - potential liability exposure')
    }

    if (allContent.includes('liquidated damages') || allContent.includes('penalty')) {
      risks.push('Liquidated damages or penalties for breach')
    }

    if (allContent.includes('non-compete') || allContent.includes('restrict')) {
      risks.push('Non-compete or restrictive covenants')
    }

    if (allContent.includes('exclusive') && allContent.includes('right')) {
      risks.push('Exclusive rights granted - limits future options')
    }

    if (allContent.includes('warrant') && allContent.includes('represent')) {
      risks.push('Warranties and representations - potential liability')
    }

    if (allContent.includes('confidential') && allContent.includes('proprietary')) {
      risks.push('Confidentiality obligations - breach could result in damages')
    }

    // Check for termination risks
    const terminationMatch = allContent.match(/(\d+)\s*days?\s*notice/i)
    if (terminationMatch) {
      risks.push(`Short termination notice period (${terminationMatch[1]} days)`)
    }

    // Check for payment risks
    if (allContent.includes('late fee') || allContent.includes('interest')) {
      risks.push('Late payment fees or interest charges')
    }

    return risks.slice(0, 5) // Limit to 5 risks
  }

  /**
   * Calculate compliance score - EXACT REPLICATION
   */
  private calculateComplianceScore(document: Document): number {
    let score = 70 // Base score
    const allContent = document.sections.map(s => s.content).join(' ').toLowerCase()

    // Positive compliance indicators
    if (allContent.includes('comply') || allContent.includes('compliance')) score += 10
    if (allContent.includes('governing law') || allContent.includes('jurisdiction')) score += 5
    if (allContent.includes('privacy') || allContent.includes('data protection')) score += 5
    if (allContent.includes('audit') || allContent.includes('inspection')) score += 5
    if (allContent.includes('certification') || allContent.includes('license')) score += 5

    // Negative compliance indicators
    if (allContent.includes('waiver') && allContent.includes('liability')) score -= 10
    if (allContent.includes('disclaim') && allContent.includes('warranty')) score -= 5
    if (allContent.includes('force majeure') && allContent.includes('excuse')) score -= 5

    // Ensure score is within bounds
    return Math.max(0, Math.min(100, score))
  }

  /**
   * Summarize citation text - EXACT REPLICATION
   */
  private summarizeCitation(text: string): string | null {
    if (!text || text.length < 20) return null

    // Extract key information
    const lowerText = text.toLowerCase()
    
    // Look for amounts
    const amounts = text.match(/\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g)
    if (amounts && amounts.length > 0) {
      return `Payment: ${amounts[0]}`
    }

    // Look for time periods
    const timePeriods = text.match(/\d+\s*(days?|months?|years?)/gi)
    if (timePeriods && timePeriods.length > 0) {
      return `Duration: ${timePeriods[0]}`
    }

    // Look for obligations
    if (lowerText.includes('shall') || lowerText.includes('must')) {
      return 'Contains specific obligations'
    }

    // Look for termination
    if (lowerText.includes('terminate') || lowerText.includes('end')) {
      return 'Includes termination provisions'
    }

    // Generic summary
    const words = text.split(' ').slice(0, 8).join(' ')
    return words.length > 20 ? words + '...' : null
  }

  /**
   * Get default analysis summary - EXACT REPLICATION
   */
  private getDefaultAnalysisSummary(): AnalysisSummary {
    return {
      key_points: [
        'Document contains standard legal terms',
        'Review all sections carefully',
        'Consult with legal counsel if needed'
      ],
      risks_identified: [
        'Standard contract risks apply',
        'Review termination provisions',
        'Check payment and liability terms'
      ],
      compliance_score: 75
    }
  }

  /**
   * Analyze document structure - EXACT REPLICATION
   */
  analyzeDocumentStructure(document: Document): {
    totalSections: number
    totalPages: number
    keySections: string[]
    documentType: string
  } {
    const totalSections = document.sections.length
    const totalPages = Math.max(...document.sections.map(s => s.page))
    
    const keySections = document.sections
      .filter(s => parseFloat(s.section) <= 5)
      .map(s => s.section)

    const documentType = this.determineDocumentType(document.title)

    return {
      totalSections,
      totalPages,
      keySections,
      documentType
    }
  }

  /**
   * Determine document type - EXACT REPLICATION
   */
  private determineDocumentType(title: string): string {
    const lowerTitle = title.toLowerCase()
    
    if (lowerTitle.includes('lease')) return 'Lease Agreement'
    if (lowerTitle.includes('employment')) return 'Employment Contract'
    if (lowerTitle.includes('purchase')) return 'Purchase Agreement'
    if (lowerTitle.includes('service')) return 'Service Agreement'
    if (lowerTitle.includes('partnership')) return 'Partnership Agreement'
    
    return 'Legal Contract'
  }

  /**
   * Extract financial terms - EXACT REPLICATION
   */
  extractFinancialTerms(document: Document): {
    amounts: string[]
    paymentTerms: string[]
    penalties: string[]
  } {
    const allContent = document.sections.map(s => s.content).join(' ')
    
    const amounts = allContent.match(/\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g) || []
    const paymentTerms = allContent.match(/(?:payment|rent|salary|fee).*?(?:dollars?|\$)/gi) || []
    const penalties = allContent.match(/(?:penalty|late fee|interest|damages).*?(?:dollars?|\$)/gi) || []

    return {
      amounts: amounts.slice(0, 5),
      paymentTerms: paymentTerms.slice(0, 3),
      penalties: penalties.slice(0, 3)
    }
  }

  /**
   * Extract temporal terms - EXACT REPLICATION
   */
  extractTemporalTerms(document: Document): {
    durations: string[]
    deadlines: string[]
    noticePeriods: string[]
  } {
    const allContent = document.sections.map(s => s.content).join(' ')
    
    const durations = allContent.match(/(?:term|duration|length).*?\d+\s*(?:days?|months?|years?)/gi) || []
    const deadlines = allContent.match(/(?:deadline|due|expire).*?\d+\s*(?:days?|months?|years?)/gi) || []
    const noticePeriods = allContent.match(/(?:notice|terminate).*?\d+\s*(?:days?|months?|years?)/gi) || []

    return {
      durations: durations.slice(0, 3),
      deadlines: deadlines.slice(0, 3),
      noticePeriods: noticePeriods.slice(0, 3)
    }
  }
} 