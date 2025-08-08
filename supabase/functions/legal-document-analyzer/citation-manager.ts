// Citation Manager - EXACT REPLICATION from Node.js backend

import { Document, DocumentSection } from './document-data.ts'

interface Citation {
  documentId: string
  section: string
  page: number
  text?: string
  display?: string
  reference?: string
  fullText?: string
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

export class CitationManager {
  private citationCache: Map<string, ProcessedCitation[]>

  constructor() {
    this.citationCache = new Map()
  }

  /**
   * Process citations with document context - EXACT REPLICATION
   */
  processCitations(citations: Citation[], document: Document): ProcessedCitation[] {
    try {
      return citations.map(citation => this.processCitation(citation, document))
    } catch (error) {
      console.error('Error processing citations:', error)
      return []
    }
  }

  /**
   * Process individual citation - EXACT REPLICATION
   */
  private processCitation(citation: Citation, document: Document): ProcessedCitation {
    // Find the corresponding section in the document
    const section = document.sections.find(s => s.section === citation.section)
    
    if (!section) {
      return this.createFallbackCitation(citation)
    }

    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(citation, section)

    // Format the citation
    return {
      section_id: citation.section,
      page: citation.page,
      title: this.generateCitationTitle(citation.section, document.title),
      relevance_score: relevanceScore,
      text: citation.text || this.extractKeyText(section.content),
      display: citation.display || `Section ${citation.section}`,
      reference: citation.reference || `Section ${citation.section} on page ${citation.page}`,
      fullText: citation.fullText || section.content
    }
  }

  /**
   * Calculate relevance score for citation - EXACT REPLICATION
   */
  private calculateRelevanceScore(citation: Citation, section: DocumentSection): number {
    let score = 0.5 // Base score

    // Higher score for earlier sections (usually more important)
    const sectionNumber = parseFloat(citation.section)
    if (sectionNumber <= 3) score += 0.3
    else if (sectionNumber <= 5) score += 0.2
    else if (sectionNumber <= 7) score += 0.1

    // Higher score for content length (more detailed)
    const contentLength = section.content.length
    if (contentLength > 200) score += 0.2
    else if (contentLength > 100) score += 0.1

    // Higher score for specific legal terms
    const legalTerms = ['payment', 'terminate', 'liability', 'confidential', 'warrant', 'represent', 'agree', 'shall', 'must']
    const lowerContent = section.content.toLowerCase()
    for (const term of legalTerms) {
      if (lowerContent.includes(term)) score += 0.05
    }

    // Cap the score
    return Math.min(score, 1.0)
  }

  /**
   * Generate citation title - EXACT REPLICATION
   */
  private generateCitationTitle(section: string, documentTitle: string): string {
    const sectionNumber = parseFloat(section)
    
    // Generate descriptive titles based on section number
    const sectionTitles: Record<number, string> = {
      1: 'Introduction and Parties',
      2: 'Payment Terms',
      3: 'Contract Duration',
      4: 'Use and Purpose',
      5: 'Termination',
      6: 'Utilities and Services',
      7: 'Maintenance and Repairs',
      8: 'Additional Terms'
    }

    const sectionTitle = sectionTitles[sectionNumber] || `Section ${section}`
    return `${sectionTitle} - ${documentTitle}`
  }

  /**
   * Extract key text from content - EXACT REPLICATION
   */
  private extractKeyText(content: string): string {
    if (!content) return ''

    // Remove common legal boilerplate
    let keyText = content
      .replace(/This.*?Agreement.*?between.*?and.*?\./i, '')
      .replace(/The parties hereby.*?\./i, '')
      .replace(/This document.*?\./i, '')
      .trim()

    // Clean up extra spaces and punctuation
    keyText = keyText.replace(/\s+/g, ' ').replace(/\.+$/, '')

    // Limit length for display
    if (keyText.length > 150) {
      keyText = keyText.substring(0, 150) + '...'
    }

    return keyText || content.substring(0, 100) + '...'
  }

  /**
   * Create fallback citation - EXACT REPLICATION
   */
  private createFallbackCitation(citation: Citation): ProcessedCitation {
    return {
      section_id: citation.section,
      page: citation.page,
      title: `Section ${citation.section}`,
      relevance_score: 0.3,
      text: citation.text || 'Section content not available',
      display: citation.display || `Section ${citation.section}`,
      reference: citation.reference || `Section ${citation.section} on page ${citation.page}`,
      fullText: citation.fullText || 'Full text not available'
    }
  }

  /**
   * Sort citations by relevance - EXACT REPLICATION
   */
  sortCitationsByRelevance(citations: ProcessedCitation[]): ProcessedCitation[] {
    return citations.sort((a, b) => b.relevance_score - a.relevance_score)
  }

  /**
   * Filter citations by minimum relevance - EXACT REPLICATION
   */
  filterCitationsByRelevance(citations: ProcessedCitation[], minScore: number = 0.3): ProcessedCitation[] {
    return citations.filter(citation => citation.relevance_score >= minScore)
  }

  /**
   * Get citation summary - EXACT REPLICATION
   */
  getCitationSummary(citations: ProcessedCitation[]): string {
    if (citations.length === 0) return 'No relevant citations found.'

    const topCitation = citations[0]
    const count = citations.length

    if (count === 1) {
      return `Based on ${topCitation.title} (Section ${topCitation.section_id})`
    } else {
      return `Based on ${count} relevant sections, including ${topCitation.title} (Section ${topCitation.section_id})`
    }
  }

  /**
   * Validate citation format - EXACT REPLICATION
   */
  validateCitation(citation: ProcessedCitation): boolean {
    return !!(
      citation.section_id &&
      citation.page &&
      citation.title &&
      citation.relevance_score >= 0 &&
      citation.relevance_score <= 1
    )
  }

  /**
   * Cache citations for performance - EXACT REPLICATION
   */
  cacheCitations(documentId: string, citations: ProcessedCitation[]): void {
    this.citationCache.set(documentId, citations)
  }

  /**
   * Get cached citations - EXACT REPLICATION
   */
  getCachedCitations(documentId: string): ProcessedCitation[] | undefined {
    return this.citationCache.get(documentId)
  }

  /**
   * Clear citation cache - EXACT REPLICATION
   */
  clearCache(): void {
    this.citationCache.clear()
  }
} 