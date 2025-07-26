// AttorneyMatcher: Matches cases to attorneys
class AttorneyMatcher {
  constructor() {
    this.attorneys = [
      { name: 'Jane Smith', caseTypes: ['personal_injury', 'car_accident'], location: 'NY' },
      { name: 'John Doe', caseTypes: ['slip_and_fall'], location: 'NY' },
      { name: 'Maria Garcia', caseTypes: ['personal_injury'], location: 'CA' }
    ];
  }

  matchAttorney(caseType, location = 'NY') {
    const match = this.attorneys.find(a => a.caseTypes.includes(caseType) && a.location === location);
    if (match) return match;
    // Fallback: any attorney for the case type
    const fallback = this.attorneys.find(a => a.caseTypes.includes(caseType));
    return fallback || { name: 'Any Available Attorney', caseTypes: [caseType], location };
  }
}

module.exports = { AttorneyMatcher };
