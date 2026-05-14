import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ndpr-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('ndpr-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 shadow-xl z-50 flex flex-col sm:flex-row items-center justify-between border-t-4 border-[#f68b1e]">
      <div className="mb-4 sm:mb-0">
        <h3 className="font-bold text-lg mb-1">Privacy & Cookie Notice (NDPR Compliant)</h3>
        <p className="text-sm text-gray-300">
          We use cookies and active data masking to ensure your personal information (like BVN, NIN, and Credit Cards) remains secure. 
          By continuing to use this site, you consent to our privacy framework.
        </p>
      </div>
      <div className="flex space-x-4 shrink-0">
        <button 
          onClick={acceptConsent}
          className="bg-[#f68b1e] hover:bg-orange-600 text-white font-bold py-2 px-6 rounded shadow-lg transition-colors"
        >
          I Accept
        </button>
      </div>
    </div>
  );
}
