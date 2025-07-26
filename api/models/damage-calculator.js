// DamageCalculator: Estimates damages for legal cases
class DamageCalculator {
  calculateDamages(caseDetails = {}) {
    // Simple formula: sum of medical bills, lost wages, pain/suffering multiplier
    const medical = caseDetails.medicalBills || 0;
    const wages = caseDetails.lostWages || 0;
    // Pain and suffering: 1x-3x medical bills depending on injury
    let painMultiplier = 1;
    if (caseDetails.injuryType) {
      if (/fracture|broken|surgery|hospital/i.test(caseDetails.injuryType)) painMultiplier = 3;
      else if (/soft tissue|bruise|sprain/i.test(caseDetails.injuryType)) painMultiplier = 1.5;
    }
    const painAndSuffering = medical * painMultiplier;
    const total = medical + wages + painAndSuffering;
    return {
      medical,
      wages,
      painAndSuffering,
      total,
      breakdown: `Medical: $${medical}, Wages: $${wages}, Pain/Suffering: $${painAndSuffering}`
    };
  }
}

module.exports = { DamageCalculator };
