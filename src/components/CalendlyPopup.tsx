import React from 'react';
import { InlineWidget } from 'react-calendly';
import { X } from 'lucide-react';

interface CalendlyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendlyPopup: React.FC<CalendlyPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Close button INSIDE the card - top right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md border"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Calendly widget container - NO SCROLLING */}
        <div className="w-full h-[650px]">
          <InlineWidget
            url="https://calendly.com/your-username/ai-meeting"
            styles={{
              height: '100%',
              width: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendlyPopup;
