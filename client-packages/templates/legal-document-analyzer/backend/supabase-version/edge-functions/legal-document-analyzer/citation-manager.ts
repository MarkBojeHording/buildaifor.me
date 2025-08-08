// Citation Manager - Legal Document Analyzer Client Package
// Professional citation processing and relevance scoring for legal documents
// Target: Law firms, corporate legal departments, legal professionals

import { LegalDocument, DocumentSection } from './legal-documents-data.ts';

interface Citation {
  documentId: string;
  section: string;
  page: number;
  text: string;
  relevance: 'High' | 'Medium' | 'Low';
}

interface ProcessedCitation {
  documentId: string;
  section: string;
  page: number;
  text: string;
  display: string;
  reference: string;
  fullText: string;
  relevance: 'High' | 'Medium' | 'Low';
  legalConcepts: string[];
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
}

export class CitationManager {
  private citationCache: Map<string, ProcessedCitation[]>;
  private legalTermPatterns: RegExp[];
  private riskKeywords: string[];

  constructor() {
    this.citationCache = new Map();

    // Legal terminology patterns for enhanced citation analysis
    this.legalTermPatterns = [
      /(indemnification|liability|warranty|representation)/i,
      /(termination|breach|default|remedy)/i,
      /(confidentiality|non-compete|intellectual property)/i,
      /(governing law|jurisdiction|dispute resolution)/i,
      /(force majeure|material adverse change|closing conditions)/i,
      /(due diligence|representations|warranties)/i,
      /(severance|non-solicitation|trade secrets)/i,
      /(arbitration|mediation|litigation)/i
    ];

    // Risk assessment keywords
    this.riskKeywords = [
      'high risk', 'material', 'substantial', 'significant',
      'unlimited', 'unrestricted', 'absolute', 'total',
      'penalty', 'damages', 'liquidated', 'consequential',
      'indemnify', 'hold harmless', 'guarantee', 'warrant'
    ];
  }

  /**
   * Process citations with legal relevance scoring and enhancement
   */
  processCitations(citations: Citation[], document: LegalDocument): ProcessedCitation[] {
    const cacheKey = `${document.id}-${citations.length}`;

    // Check cache first
    const cached = this.citationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const processedCitations = citations.map(citation =>
      this.processCitation(citation, document)
    );

    // Sort by relevance score
    processedCitations.sort((a, b) => {
      const scoreA = this.getRelevanceScore(a.relevance);
      const scoreB = this.getRelevanceScore(b.relevance);
      return scoreB - scoreA;
    });

    // Cache the results
    this.citationCache.set(cacheKey, processedCitations);

    return processedCitations;
  }

  /**
   * Process individual citation with legal analysis
   */
  private processCitation(citation: Citation, document: LegalDocument): ProcessedCitation {
    // Find the corresponding document section
    const section = document.sections.find(s =>
      s.title === citation.section || s.id === citation.section
    );

    const legalConcepts = section?.legalConcepts || [];
    const riskLevel = section?.riskLevel || 'medium';
    const fullText = section?.content || citation.text;

    // Generate enhanced display and reference
    const display = this.generateCitationDisplay(citation, section);
    const reference = this.generateCitationReference(citation, section);
    const summary = this.generateCitationSummary(fullText, legalConcepts, riskLevel);

    // Calculate enhanced relevance score
    const relevance = this.calculateEnhancedRelevance(citation, section, legalConcepts, riskLevel);

    return {
      documentId: citation.documentId,
      section: citation.section,
      page: citation.page,
      text: citation.text,
      display: display,
      reference: reference,
      fullText: fullText,
      relevance: relevance,
      legalConcepts: legalConcepts,
      riskLevel: riskLevel,
      summary: summary
    };
  }

  /**
   * Generate citation display for legal professionals
   */
  private generateCitationDisplay(citation: Citation, section?: DocumentSection): string {
    const text = citation.text;

    // Extract monetary amounts with legal context
    const moneyMatch = text.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (moneyMatch) {
      const amount = moneyMatch[0];
      const context = this.getMonetaryContext(text);
      return `💰 ${amount} ${context} - ${citation.section}`;
    }

    // Extract time periods with legal significance
    const timeMatch = text.match(/(\d+)\s*(days?|months?|years?)/i);
    if (timeMatch) {
      const period = timeMatch[0];
      const context = this.getTimeContext(text);
      return `⏰ ${period} ${context} - ${citation.section}`;
    }

    // Extract percentages with legal implications
    const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
    if (percentMatch) {
      const percentage = percentMatch[0];
      const context = this.getPercentageContext(text);
      return `📊 ${percentage} ${context} - ${citation.section}`;
    }

    // Extract legal terms
    const legalTerm = this.extractLegalTerm(text);
    if (legalTerm) {
      return `⚖️ ${legalTerm} - ${citation.section}`;
    }

    // Default display with risk level indicator
    const riskIndicator = section?.riskLevel === 'high' ? '⚠️' :
                         section?.riskLevel === 'medium' ? '⚡' : '📄';
    return `${riskIndicator} ${citation.section} (Page ${citation.page})`;
  }

  /**
   * Generate citation reference for legal professionals
   */
  private generateCitationReference(citation: Citation, section?: DocumentSection): string {
    const sectionTitle = section?.title || citation.section;
    return `${sectionTitle} (Page ${citation.page})`;
  }

  /**
   * Generate citation summary for legal professionals
   */
  private generateCitationSummary(
    fullText: string,
    legalConcepts: string[],
    riskLevel: 'low' | 'medium' | 'high'
  ): string {
    const concepts = legalConcepts.length > 0 ?
      `Key concepts: ${legalConcepts.join(', ')}` :
      'General legal provision';

    const riskAssessment = riskLevel === 'high' ?
      'High-risk provision requiring careful review' :
      riskLevel === 'medium' ?
      'Moderate risk considerations present' :
      'Standard legal provision';

    return `${concepts}. ${riskAssessment}.`;
  }

  /**
   * Calculate enhanced relevance score for legal citations
   */
  private calculateEnhancedRelevance(
    citation: Citation,
    section?: DocumentSection,
    legalConcepts: string[] = [],
    riskLevel: 'low' | 'medium' | 'high' = 'medium'
  ): 'High' | 'Medium' | 'Low' {
    let score = 0;

    // Base relevance from original citation
    score += this.getRelevanceScore(citation.relevance);

    // Legal concept density
    score += legalConcepts.length * 2;

    // Risk level scoring
    if (riskLevel === 'high') score += 3;
    else if (riskLevel === 'medium') score += 2;
    else score += 1;

    // Legal terminology presence
    const legalTerms = this.extractLegalTerms(citation.text);
    score += legalTerms.length;

    // Content length factor (more content = more relevant)
    if (citation.text.length > 200) score += 1;

    // Monetary amounts (high relevance for legal analysis)
    if (/\$[\d,]+/.test(citation.text)) score += 2;

    // Time periods (important for legal deadlines)
    if (/(\d+)\s*(days?|months?|years?)/i.test(citation.text)) score += 1;

    // Risk keywords
    const riskWords = this.riskKeywords.filter(word =>
      citation.text.toLowerCase().includes(word)
    );
    score += riskWords.length;

    if (score >= 8) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  }

  /**
   * Get monetary context for citation display
   */
  private getMonetaryContext(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('rent') || lowerText.includes('lease')) return 'monthly rent';
    if (lowerText.includes('salary') || lowerText.includes('compensation')) return 'annual salary';
    if (lowerText.includes('bonus') || lowerText.includes('incentive')) return 'bonus amount';
    if (lowerText.includes('deposit') || lowerText.includes('security')) return 'security deposit';
    if (lowerText.includes('purchase') || lowerText.includes('price')) return 'purchase price';
    if (lowerText.includes('fee') || lowerText.includes('payment')) return 'service fee';

    return 'amount';
  }

  /**
   * Get time context for citation display
   */
  private getTimeContext(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('notice') || lowerText.includes('termination')) return 'notice period';
    if (lowerText.includes('lease') || lowerText.includes('term')) return 'lease term';
    if (lowerText.includes('employment') || lowerText.includes('contract')) return 'employment term';
    if (lowerText.includes('payment') || lowerText.includes('due')) return 'payment period';
    if (lowerText.includes('diligence') || lowerText.includes('review')) return 'review period';

    return 'timeframe';
  }

  /**
   * Get percentage context for citation display
   */
  private getPercentageContext(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('bonus') || lowerText.includes('incentive')) return 'bonus rate';
    if (lowerText.includes('interest') || lowerText.includes('rate')) return 'interest rate';
    if (lowerText.includes('commission') || lowerText.includes('fee')) return 'commission rate';
    if (lowerText.includes('penalty') || lowerText.includes('late')) return 'penalty rate';

    return 'percentage';
  }

  /**
   * Extract legal term from text
   */
  private extractLegalTerm(text: string): string | null {
    for (const pattern of this.legalTermPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    return null;
  }

  /**
   * Extract all legal terms from text
   */
  private extractLegalTerms(text: string): string[] {
    const terms: string[] = [];
    for (const pattern of this.legalTermPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        terms.push(...matches);
      }
    }
    return terms;
  }

  /**
   * Get relevance score as number
   */
  private getRelevanceScore(relevance: 'High' | 'Medium' | 'Low'): number {
    switch (relevance) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 1;
    }
  }

  /**
   * Filter citations by relevance threshold
   */
  filterCitationsByRelevance(
    citations: ProcessedCitation[],
    minRelevance: 'High' | 'Medium' | 'Low' = 'Medium'
  ): ProcessedCitation[] {
    const minScore = this.getRelevanceScore(minRelevance);
    return citations.filter(citation =>
      this.getRelevanceScore(citation.relevance) >= minScore
    );
  }

  /**
   * Sort citations by relevance and legal importance
   */
  sortCitationsByLegalImportance(citations: ProcessedCitation[]): ProcessedCitation[] {
    return citations.sort((a, b) => {
      // Primary sort by relevance
      const relevanceA = this.getRelevanceScore(a.relevance);
      const relevanceB = this.getRelevanceScore(b.relevance);

      if (relevanceA !== relevanceB) {
        return relevanceB - relevanceA;
      }

      // Secondary sort by risk level
      const riskA = this.getRiskScore(a.riskLevel);
      const riskB = this.getRiskScore(b.riskLevel);

      if (riskA !== riskB) {
        return riskB - riskA;
      }

      // Tertiary sort by legal concept count
      return b.legalConcepts.length - a.legalConcepts.length;
    });
  }

  /**
   * Get risk score as number
   */
  private getRiskScore(riskLevel: 'low' | 'medium' | 'high'): number {
    switch (riskLevel) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  }

  /**
   * Generate citation summary for legal professionals
   */
  generateCitationSummary(citations: ProcessedCitation[]): string {
    if (citations.length === 0) {
      return 'No relevant citations found.';
    }

    const highRelevance = citations.filter(c => c.relevance === 'High').length;
    const highRisk = citations.filter(c => c.riskLevel === 'high').length;
    const totalConcepts = citations.reduce((sum, c) => sum + c.legalConcepts.length, 0);

    return `Found ${citations.length} relevant citations with ${highRelevance} high-relevance items, ${highRisk} high-risk provisions, and ${totalConcepts} legal concepts identified.`;
  }

  /**
   * Clear citation cache
   */
  clearCache(): void {
    this.citationCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.citationCache.size,
      entries: Array.from(this.citationCache.keys())
    };
  }
}
