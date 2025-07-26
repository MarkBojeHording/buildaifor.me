// LegalKnowledge: Provides legal info, process, docs, timelines, fees
class LegalKnowledge {
  constructor() {
    this.processes = {
      'personal_injury': 'Personal injury cases typically involve proving liability, documenting injuries, and negotiating with insurers. The process may include investigation, medical treatment, settlement talks, and possibly litigation.',
      'car_accident': 'Car accident claims require police reports, medical records, and often involve dealing with insurance companies. Timely documentation is crucial.',
      'slip_and_fall': 'Slip and fall cases require evidence of unsafe conditions, witness statements, and prompt reporting to property owners.'
    };
    this.documents = {
      'personal_injury': ['Police report', 'Medical records', 'Photos of injuries', 'Insurance info'],
      'car_accident': ['Accident report', 'Insurance card', 'Repair estimates'],
      'slip_and_fall': ['Incident report', 'Photos of scene', 'Witness contacts']
    };
    this.timelines = {
      'personal_injury': 'Most cases resolve in 6-18 months, but timelines vary based on complexity and negotiations.',
      'car_accident': 'Car accident claims may resolve in a few months if liability is clear, or take longer if disputed.',
      'slip_and_fall': 'Slip and fall cases can take 6-24 months depending on evidence and negotiations.'
    };
    this.fees = {
      'default': 'Most personal injury attorneys work on a contingency fee basis (typically 33-40% of recovery). No upfront fees in most cases.'
    };
  }

  getProcessInfo(caseType) {
    return this.processes[caseType] || 'Legal process information is not available for this case type.';
  }

  getRequiredDocuments(caseType) {
    return this.documents[caseType] || ['Please provide any relevant documents you have, such as reports, photos, or medical records.'];
  }

  getTimeline(caseType) {
    return this.timelines[caseType] || 'Timeline varies depending on case details. Most cases resolve within 6-24 months.';
  }

  getFeeInfo(caseType) {
    return this.fees[caseType] || this.fees['default'];
  }
}

module.exports = { LegalKnowledge };
