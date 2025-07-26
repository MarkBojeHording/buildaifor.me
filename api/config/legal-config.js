// Legal config for law firm chatbot
const legalConfig = {
  statutes: {
    personal_injury: '3 years from date of injury (varies by state)',
    car_accident: '3 years from date of accident (varies by state)',
    slip_and_fall: '3 years from date of incident (varies by state)'
  },
  fees: {
    personal_injury: 'Contingency fee (33-40% of recovery)',
    car_accident: 'Contingency fee (33-40% of recovery)',
    slip_and_fall: 'Contingency fee (33-40% of recovery)'
  }
};

module.exports = legalConfig;
