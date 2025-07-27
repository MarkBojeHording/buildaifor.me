import { useState } from 'react';
import { InlineWidget } from 'react-calendly';

interface CalendlyPopupProps {
  children: React.ReactNode;
}

const CalendlyPopup = ({ children }: CalendlyPopupProps) => {
  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <>
      <div onClick={() => setShowCalendly(true)}>
        {children}
      </div>

      {/* Calendly Popup Modal */}
      {showCalendly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[600px] relative">
            <button
              onClick={() => setShowCalendly(false)}
              className="absolute top-4 right-4 z-[60] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative z-0">
              <InlineWidget
                url="https://calendly.com/markhording/ai-meeting"
                styles={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendlyPopup;
