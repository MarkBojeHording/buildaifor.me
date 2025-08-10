import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setCookiesAccepted(consent === 'accepted');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setCookiesAccepted(true);
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setCookiesAccepted(false);
    setShowBanner(false);
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Small Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies.
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={acceptCookies}
              size="sm"
              className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700"
            >
              Accept
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1"
            >
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Button>
            <Button
              onClick={declineCookies}
              variant="ghost"
              size="sm"
              className="text-xs px-3 py-1 text-gray-500"
            >
              Decline
            </Button>
          </div>
        </div>
      )}

      {/* Small Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cookie Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Essential Cookies</p>
                  <p className="text-xs text-gray-500">Required for the website to function properly</p>
                </div>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Analytics Cookies</p>
                  <p className="text-xs text-gray-500">Help us improve our website</p>
                </div>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Marketing Cookies</p>
                  <p className="text-xs text-gray-500">Used for personalized advertising</p>
                </div>
                <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => {
                  acceptCookies();
                  setShowSettings(false);
                }}
                size="sm"
                className="flex-1"
              >
                Accept All
              </Button>
              <Button
                onClick={() => {
                  declineCookies();
                  setShowSettings(false);
                }}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Decline All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
