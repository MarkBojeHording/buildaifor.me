class AttorneyRouter {
  constructor() {
    this.conversationRoutings = new Map(); // Track routing decisions per conversation
  }

  determineAttorney(leadScore, intent, caseStrength, conversationId) {
    // Check if we already made a routing decision for this conversation
    const existingRouting = this.conversationRoutings.get(conversationId);

    if (existingRouting) {
      // Only upgrade attorney level, never downgrade
      const newRouting = this.calculateRouting(leadScore, intent, caseStrength);
      const finalRouting = this.selectHigherLevel(existingRouting, newRouting);
      this.conversationRoutings.set(conversationId, finalRouting);
      return finalRouting;
    }

    // First routing decision
    const routing = this.calculateRouting(leadScore, intent, caseStrength);
    this.conversationRoutings.set(conversationId, routing);
    return routing;
  }

  calculateRouting(leadScore, intent, caseStrength) {
    // Criminal cases - always specialized routing
    if (intent.primary && intent.primary.intent === 'CRIMINAL_DEFENSE') {
      return {
        attorney: 'Criminal Defense Partner',
        level: 'partner',
        reasoning: 'Criminal case requires specialized criminal defense expertise',
        urgency: 'immediate',
        practiceArea: 'criminal_defense',
        specialization: intent.specialization || 'general_criminal'
      };
    }

    // SIMPLIFIED ATTORNEY ROUTING BASED ON SINGLE LEAD SCORE
    if (leadScore >= 71) {
      return {
        attorney: 'Senior Partner',
        level: 'senior_partner',
        reasoning: 'High-value case (score 71-100) - requires senior partner expertise',
        urgency: 'high',
        practiceArea: 'personal_injury'
      };
    }

    if (leadScore >= 41) {
      return {
        attorney: 'Senior Attorney',
        level: 'senior_attorney',
        reasoning: 'Moderate-value case (score 41-70) - suitable for senior attorney',
        urgency: 'medium',
        practiceArea: 'personal_injury'
      };
    }

    // Default for scores 0-40
    return {
      attorney: 'Junior Attorney',
      level: 'junior',
      reasoning: 'Initial consultation case (score 0-40) - junior attorney assessment',
      urgency: 'standard',
      practiceArea: 'general'
    };
  }

  selectHigherLevel(existing, newRouting) {
    const levelHierarchy = {
      'junior': 1,
      'associate': 2,
      'senior_attorney': 3,
      'senior_partner': 4,
      'partner': 4 // Criminal partners at same level as senior partners
    };

    const existingLevel = levelHierarchy[existing.level] || 0;
    const newLevel = levelHierarchy[newRouting.level] || 0;

    if (newLevel > existingLevel) {
      console.log(`🔄 Upgrading attorney routing: ${existing.attorney} → ${newRouting.attorney}`);
      return newRouting;
    } else {
      console.log(`✅ Maintaining attorney routing: ${existing.attorney} (no downgrade)`);
      return existing;
    }
  }

  getAttorneySpecialization(intent) {
    if (intent.primary && intent.primary.intent === 'CRIMINAL_DEFENSE') {
      return intent.specialization || 'general_criminal';
    }

    if (intent.practiceArea === 'personal_injury') {
      return intent.caseType || 'general_injury';
    }

    return 'general';
  }

  shouldEscalate(routing) {
    return routing.urgency === 'immediate' ||
           routing.urgency === 'high' ||
           routing.level === 'partner' ||
           routing.level === 'senior_partner';
  }

  getConsultationPriority(routing) {
    if (routing.urgency === 'immediate') return 'High';
    if (routing.urgency === 'high') return 'High';
    if (routing.level === 'partner' || routing.level === 'senior_partner') return 'High';
    if (routing.level === 'senior_attorney') return 'Medium';
    return 'Low';
  }

  getNextSteps(routing) {
    if (routing.urgency === 'immediate') {
      return 'Immediate attorney contact recommended';
    }
    if (routing.urgency === 'high') {
      return 'Schedule consultation within 24 hours';
    }
    if (routing.level === 'partner' || routing.level === 'senior_partner') {
      return 'Schedule consultation within 48 hours';
    }
    return 'Continue qualification process';
  }
}

module.exports = AttorneyRouter;
