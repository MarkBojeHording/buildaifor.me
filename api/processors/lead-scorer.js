// LeadScorer: Scores legal leads for qualification and urgency
class LeadScorer {
  scoreLead(caseAssessment = {}, userInfo = {}) {
    // Simple rules: strong case + valid statute + contact info = Hot
    let score = 0;
    if (caseAssessment.strength === 'Strong') score += 3;
    if (caseAssessment.strength === 'Moderate') score += 2;
    if (caseAssessment.statuteStatus === 'Valid') score += 2;
    if (caseAssessment.statuteStatus === 'Nearing expiration') score += 1;
    if (userInfo.phone || userInfo.email) score += 2;
    if (userInfo.name) score += 1;
    if (caseAssessment.estimatedValue && /\$\d+/.test(caseAssessment.estimatedValue)) score += 1;
    // Label assignment
    let label = 'Cold';
    if (score >= 7) label = 'Hot';
    else if (score >= 5) label = 'Qualified';
    else if (score >= 3) label = 'Warm';
    return { label, score };
  }
}

module.exports = { LeadScorer };
