import React, { useState, useRef, useEffect } from 'react';
import { Settings, Globe, Check, AlertCircle } from 'lucide-react';

export default function LanguageSelector({ currentLanguage, onChangeLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLanguageLabel = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.label} (${lang.native})` : 'Select Language';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-lg bg-charcoal border border-action-blue/20 hover:border-action-blue text-action-blue hover:bg-action-blue/10 transition-all duration-300 shadow-md focus:outline-none glow-tech-blue cursor-pointer"
        aria-label="Settings and Language"
        title="Settings & Language"
      >
        <Settings className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-action-blue/20 bg-charcoal/95 backdrop-blur-md shadow-2xl p-2 z-50 animate-slide-up">
          <div className="px-3 py-2 border-b border-action-blue/10 text-xs font-semibold text-gray-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-action-blue" />
            <span>PROMPT LANGUAGE PREFERENCE</span>
          </div>

          <div className="mt-1 space-y-1">
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChangeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left cursor-pointer ${
                    isSelected
                      ? 'bg-tech-blue/40 text-action-blue border border-action-blue/30 font-medium'
                      : 'hover:bg-action-blue/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.label}</span>
                    <span className="text-xs text-gray-400">{lang.native}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-action-blue" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 p-2 bg-navy-slate/60 border border-legal-gold/20 rounded-lg text-[10px] text-legal-gold flex gap-1.5 items-start">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              This preference will automatically prepend system instructions inside the API prompt to respond in the selected language.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
