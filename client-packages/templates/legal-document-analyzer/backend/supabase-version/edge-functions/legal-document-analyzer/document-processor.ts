// Document Processor - Legal Document Analyzer Client Package
// Advanced document analysis and summary generation for legal professionals
// Target: Law firms, corporate legal departments, legal professionals

import { LegalDocument, DocumentSection } from './legal-documents-data.ts';

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

interface AnalysisSummary {
  key_points: string[];
  risks_identified: string[];
  compliance_score: number;
  legal_concepts: string[];
  risk_assessment: {
    high_risk_sections: number;
    medium_risk_sections: number;
    low_risk_sections: number;
  };
  recommendations: string[];
}

export class DocumentProcessor {
  private analysisCache: Map<string, AnalysisSummary>;
  private complianceKeywords: string[];
  private riskKeywords: string[];

  constructor() {
    this.analysisCache = new Map();

    // Compliance keywords for legal analysis
    this.complianceKeywords = [
      'compliance', 'regulation', 'statute', 'ordinance', 'code',
      'requirement', 'standard', 'guideline', 'policy', 'procedure',
      'audit', 'certification', 'accreditation', 'licensing', 'permit',
      'gdpr', 'hipaa', 'sox', 'pci', 'fcc', 'epa', 'osha'
    ];

    // Risk assessment keywords
    this.riskKeywords = [
      'high risk', 'material', 'substantial', 'significant', 'critical',
      'unlimited', 'unrestricted', 'absolute', 'total', 'complete',
      'penalty', 'damages', 'liquidated', 'consequential', 'punitive',
      'indemnify', 'hold harmless', 'guarantee', 'warrant', 'assure',
      'liability', 'exposure', 'vulnerability', 'threat', 'danger'
    ];
  }

  /**
   * Generate comprehensive analysis summary for legal professionals
   */
  async generateAnalysisSummary(
    message: string,
    document: LegalDocument,
    citations: ProcessedCitation[]
  ): Promise<AnalysisSummary> {
    const cacheKey = `${document.id}-${message.length}-${citations.length}`;

    // Check cache first
    const cached = this.analysisCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate comprehensive analysis
    const keyPoints = this.extractKeyLegalPoints(document, citations);
    const risksIdentified = this.identifyLegalRisks(document, citations);
    const complianceScore = this.calculateComplianceScore(document, citations);
    const legalConcepts = this.extractLegalConcepts(document, citations);
    const riskAssessment = this.assessOverallRisk(document);
    const recommendations = this.generateLegalRecommendations(document, citations, risksIdentified);

    const analysis: AnalysisSummary = {
      key_points: keyPoints,
      risks_identified: risksIdentified,
      compliance_score: complianceScore,
      legal_concepts: legalConcepts,
      risk_assessment: riskAssessment,
      recommendations: recommendations
    };

    // Cache the analysis
    this.analysisCache.set(cacheKey, analysis);

    return analysis;
  }

  /**
   * Extract key legal points from document and citations
   */
  private extractKeyLegalPoints(document: LegalDocument, citations: ProcessedCitation[]): string[] {
    const keyPoints: string[] = [];

    // Extract from high-relevance citations
    const highRelevanceCitations = citations.filter(c => c.relevance === 'High');

    for (const citation of highRelevanceCitations) {
      // Extract monetary amounts
      const moneyMatch = citation.fullText.match(/\$[\d,]+(?:\.\d{2})?/g);
      if (moneyMatch) {
        keyPoints.push(`Financial terms: ${moneyMatch.join(', ')}`);
      }

      // Extract time periods
      const timeMatch = citation.fullText.match(/(\d+)\s*(days?|months?|years?)/gi);
      if (timeMatch) {
        keyPoints.push(`Timeframes: ${timeMatch.join(', ')}`);
      }

      // Extract legal concepts
      if (citation.legalConcepts.length > 0) {
        keyPoints.push(`Legal concepts: ${citation.legalConcepts.join(', ')}`);
      }
    }

    // Extract from document metadata
    if (document.metadata.practiceArea) {
      keyPoints.push(`Practice area: ${document.metadata.practiceArea}`);
    }

    if (document.metadata.jurisdiction) {
      keyPoints.push(`Jurisdiction: ${document.metadata.jurisdiction}`);
    }

    // Extract document structure
    keyPoints.push(`Document structure: ${document.sections.length} sections across ${document.pages} pages`);

    return keyPoints.length > 0 ? keyPoints : ['Document analysis completed'];
  }

  /**
   * Identify legal risks in the document
   */
  private identifyLegalRisks(document: LegalDocument, citations: ProcessedCitation[]): string[] {
    const risks: string[] = [];

    // Analyze high-risk sections
    const highRiskSections = document.sections.filter(s => s.riskLevel === 'high');

    for (const section of highRiskSections) {
      const riskDescription = this.analyzeSectionRisk(section);
      if (riskDescription) {
        risks.push(`${section.title}: ${riskDescription}`);
      }
    }

    // Analyze citations for risk indicators
    for (const citation of citations) {
      if (citation.riskLevel === 'high') {
        const riskIndicators = this.extractRiskIndicators(citation.fullText);
        if (riskIndicators.length > 0) {
          risks.push(`${citation.section}: ${riskIndicators.join(', ')}`);
        }
      }
    }

    // Check for compliance risks
    const complianceRisks = this.identifyComplianceRisks(document);
    risks.push(...complianceRisks);

    return risks.length > 0 ? risks : ['Standard legal provisions identified'];
  }

  /**
   * Analyze risk in a specific section
   */
  private analyzeSectionRisk(section: DocumentSection): string | null {
    const content = section.content.toLowerCase();

    // Check for unlimited liability
    if (content.includes('unlimited') || content.includes('unrestricted')) {
      return 'Unlimited liability exposure';
    }

    // Check for material adverse change
    if (content.includes('material adverse change') || content.includes('mac')) {
      return 'Material adverse change provisions';
    }

    // Check for liquidated damages
    if (content.includes('liquidated damages') || content.includes('penalty')) {
      return 'Liquidated damages or penalty provisions';
    }

    // Check for indemnification
    if (content.includes('indemnify') || content.includes('hold harmless')) {
      return 'Broad indemnification obligations';
    }

    // Check for termination without cause
    if (content.includes('termination') && content.includes('without cause')) {
      return 'Termination without cause provisions';
    }

    return null;
  }

  /**
   * Extract risk indicators from text
   */
  private extractRiskIndicators(text: string): string[] {
    const indicators: string[] = [];
    const lowerText = text.toLowerCase();

    for (const keyword of this.riskKeywords) {
      if (lowerText.includes(keyword)) {
        indicators.push(keyword);
      }
    }

    return indicators;
  }

  /**
   * Identify compliance risks
   */
  private identifyComplianceRisks(document: LegalDocument): string[] {
    const risks: string[] = [];
    const content = document.sections.map(s => s.content).join(' ').toLowerCase();

    // Check for regulatory compliance
    for (const keyword of this.complianceKeywords) {
      if (content.includes(keyword)) {
        risks.push(`Regulatory compliance: ${keyword} requirements`);
      }
    }

    // Check for jurisdiction-specific requirements
    if (document.metadata.jurisdiction) {
      risks.push(`Jurisdiction-specific requirements: ${document.metadata.jurisdiction}`);
    }

    return risks;
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(document: LegalDocument, citations: ProcessedCitation[]): number {
    let score = 70; // Base score

    // Add points for compliance keywords
    const content = document.sections.map(s => s.content).join(' ').toLowerCase();
    const complianceMatches = this.complianceKeywords.filter(keyword =>
      content.includes(keyword)
    );
    score += complianceMatches.length * 2;

    // Add points for jurisdiction specification
    if (document.metadata.jurisdiction) {
      score += 5;
    }

    // Add points for practice area specification
    if (document.metadata.practiceArea) {
      score += 3;
    }

    // Deduct points for high-risk sections
    const highRiskSections = document.sections.filter(s => s.riskLevel === 'high');
    score -= highRiskSections.length * 3;

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Extract legal concepts from document and citations
   */
  private extractLegalConcepts(document: LegalDocument, citations: ProcessedCitation[]): string[] {
    const concepts = new Set<string>();

    // Extract from document sections
    for (const section of document.sections) {
      section.legalConcepts.forEach(concept => concepts.add(concept));
    }

    // Extract from citations
    for (const citation of citations) {
      citation.legalConcepts.forEach(concept => concepts.add(concept));
    }

    return Array.from(concepts);
  }

  /**
   * Assess overall risk of the document
   */
  private assessOverallRisk(document: LegalDocument): {
    high_risk_sections: number;
    medium_risk_sections: number;
    low_risk_sections: number;
  } {
    const highRisk = document.sections.filter(s => s.riskLevel === 'high').length;
    const mediumRisk = document.sections.filter(s => s.riskLevel === 'medium').length;
    const lowRisk = document.sections.filter(s => s.riskLevel === 'low').length;

    return {
      high_risk_sections: highRisk,
      medium_risk_sections: mediumRisk,
      low_risk_sections: lowRisk
    };
  }

  /**
   * Generate legal recommendations
   */
  private generateLegalRecommendations(
    document: LegalDocument,
    citations: ProcessedCitation[],
    risksIdentified: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Risk-based recommendations
    const highRiskSections = document.sections.filter(s => s.riskLevel === 'high');
    if (highRiskSections.length > 0) {
      recommendations.push('Review high-risk sections with qualified legal counsel');
    }

    // Compliance recommendations
    if (document.metadata.jurisdiction) {
      recommendations.push(`Ensure compliance with ${document.metadata.jurisdiction} laws and regulations`);
    }

    // Practice area recommendations
    if (document.metadata.practiceArea) {
      recommendations.push(`Consult with ${document.metadata.practiceArea} specialist for complex provisions`);
    }

    // Citation-based recommendations
    const highRelevanceCitations = citations.filter(c => c.relevance === 'High');
    if (highRelevanceCitations.length > 0) {
      recommendations.push('Focus on high-relevance provisions for detailed review');
    }

    // General recommendations
    recommendations.push('Consider obtaining legal opinion for material transactions');
    recommendations.push('Review document for consistency with business objectives');

    return recommendations;
  }

  /**
   * Generate document overview for legal professionals
   */
  generateDocumentOverview(document: LegalDocument): string {
    const riskAssessment = this.assessOverallRisk(document);
    const totalSections = document.sections.length;

    let overview = `📋 **Document Overview**: ${document.title}\n\n`;
    overview += `**Type**: ${document.type}\n`;
    overview += `**Pages**: ${document.pages}\n`;
    overview += `**Sections**: ${totalSections}\n`;

    if (document.metadata.jurisdiction) {
      overview += `**Jurisdiction**: ${document.metadata.jurisdiction}\n`;
    }

    if (document.metadata.practiceArea) {
      overview += `**Practice Area**: ${document.metadata.practiceArea}\n`;
    }

    overview += `**Risk Profile**: ${riskAssessment.high_risk_sections} high-risk, ${riskAssessment.medium_risk_sections} medium-risk, ${riskAssessment.low_risk_sections} low-risk sections\n`;

    overview += `**Complexity**: ${document.metadata.complexity}\n\n`;

    overview += `**Key Sections**:\n`;
    document.sections.forEach(section => {
      const riskIndicator = section.riskLevel === 'high' ? '⚠️' :
                           section.riskLevel === 'medium' ? '⚡' : '📄';
      overview += `${riskIndicator} ${section.title} (Page ${section.page})\n`;
    });

    return overview;
  }

  /**
   * Generate section-by-section analysis
   */
  generateSectionAnalysis(document: LegalDocument): string {
    let analysis = `📊 **Section-by-Section Analysis**\n\n`;

    for (const section of document.sections) {
      analysis += `**${section.title}** (Page ${section.page})\n`;
      analysis += `Risk Level: ${section.riskLevel.toUpperCase()}\n`;

      if (section.legalConcepts.length > 0) {
        analysis += `Legal Concepts: ${section.legalConcepts.join(', ')}\n`;
      }

      // Extract key information
      const keyInfo = this.extractSectionKeyInfo(section.content);
      if (keyInfo) {
        analysis += `Key Information: ${keyInfo}\n`;
      }

      analysis += `\n`;
    }

    return analysis;
  }

  /**
   * Extract key information from section content
   */
  private extractSectionKeyInfo(content: string): string | null {
    const info: string[] = [];

    // Extract monetary amounts
    const moneyMatch = content.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (moneyMatch) {
      info.push(`Amounts: ${moneyMatch.join(', ')}`);
    }

    // Extract time periods
    const timeMatch = content.match(/(\d+)\s*(days?|months?|years?)/gi);
    if (timeMatch) {
      info.push(`Timeframes: ${timeMatch.join(', ')}`);
    }

    // Extract percentages
    const percentMatch = content.match(/(\d+(?:\.\d+)?)\s*%/g);
    if (percentMatch) {
      info.push(`Percentages: ${percentMatch.join(', ')}`);
    }

    return info.length > 0 ? info.join('; ') : null;
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.analysisCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.analysisCache.size,
      entries: Array.from(this.analysisCache.keys())
    };
  }
}
