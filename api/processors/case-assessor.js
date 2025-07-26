// CaseAssessor: Evaluates legal case details for strength, value, and statute of limitations
class CaseAssessor {
  assessCase(caseDetails = {}) {
    const strength = this.assessStrength(caseDetails);
    const estimatedValue = this.estimateValue(caseDetails);
    const statuteStatus = this.checkStatuteOfLimitations(caseDetails);
    return {
      strength,
      estimatedValue,
      statuteStatus,
      summary: this.generateSummary(strength, estimatedValue, statuteStatus, caseDetails)
    };
  }

  assessStrength(caseDetails) {
    // Simple heuristic: more details = stronger case
    let score = 0;
    if (caseDetails.injuryType) score += 2;
    if (caseDetails.incidentDate) score += 2;
    if (caseDetails.liabilityAdmitted) score += 2;
    if (caseDetails.medicalTreatment) score += 1;
    if (caseDetails.witnesses) score += 1;
    if (caseDetails.damages) score += 1;
    if (caseDetails.insurance) score += 1;
    if (score >= 7) return 'Strong';
    if (score >= 4) return 'Moderate';
    return 'Weak';
  }

  estimateValue(caseDetails) {
    // Very basic estimation based on damages and injury
    let base = 0;
    if (caseDetails.damages && typeof caseDetails.damages === 'number') base += caseDetails.damages;
    if (caseDetails.injuryType) {
      if (/fracture|broken|surgery|hospital/i.test(caseDetails.injuryType)) base += 10000;
      if (/soft tissue|bruise|sprain/i.test(caseDetails.injuryType)) base += 2000;
    }
    if (caseDetails.lostWages && typeof caseDetails.lostWages === 'number') base += caseDetails.lostWages;
    return base > 0 ? `Estimated $${base.toLocaleString()}` : 'Unknown';
  }

  checkStatuteOfLimitations(caseDetails) {
    // Assume 3 years for personal injury (example, not legal advice)
    if (!caseDetails.incidentDate) return 'Unknown';
    try {
      const incident = new Date(caseDetails.incidentDate);
      const now = new Date();
      const diffYears = (now - incident) / (1000 * 60 * 60 * 24 * 365.25);
      if (diffYears > 3) return 'Expired';
      if (diffYears > 2.5) return 'Nearing expiration';
      return 'Valid';
    } catch {
      return 'Unknown';
    }
  }

  generateSummary(strength, estimatedValue, statuteStatus, caseDetails) {
    return `Case Strength: ${strength}. Estimated Value: ${estimatedValue}. Statute of Limitations: ${statuteStatus}.`;
  }
}

module.exports = { CaseAssessor };
