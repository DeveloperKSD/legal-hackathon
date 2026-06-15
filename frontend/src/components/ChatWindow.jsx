import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Gavel, FileText, MapPin, Phone, Award, Star, X, Info, HelpCircle } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const LEGAL_GLOSSARY = {
  'force majeure': 'An unforeseeable event (like war, labor strikes, epidemics, or natural disasters) that frees parties from contractual liability or obligations.',
  'indemnity': 'An agreement where one party promises to compensate or protect another party for any loss, liability, or damage suffered.',
  'caveat emptor': "Latin for 'let the buyer beware'. Under this rule, the buyer is responsible for inspecting the quality and safety of goods or property before purchase.",
  'power of attorney': 'A legal authorization giving a designated agent the power to act on behalf of the principal in financial, medical, or legal matters.',
  'amicus curiae': "Latin for 'friend of the court'. An advisor who is not a party to the case but volunteers information on a point of law to assist the court."
};

export default function ChatWindow({
  messages,
  onSendMessage,
  currentLanguage,
  onChangeLanguage,
  onOpenTemplate,
  activeMode
}) {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const glossaryRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Click outside glossary popover closes it
  useEffect(() => {
    function handleClickOutside(event) {
      if (glossaryRef.current && !glossaryRef.current.contains(event.target)) {
        setActiveGlossaryTerm(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!inputText.trim() && attachments.length === 0) return;
    onSendMessage(inputText, attachments);
    setInputText('');
    setAttachments([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => {
      const type = file.type.startsWith('image/') ? 'image' : 'pdf';
      return {
        name: file.name,
        type: type,
        size: (file.size / 1024).toFixed(1) + ' KB',
        url: type === 'image' ? URL.createObjectURL(file) : null
      };
    });
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Parses message text to highlight legal terms and law citations
  const renderMessageContent = (text) => {
    if (!text) return null;

    // Helper regex to find terms case insensitively
    const glossaryTerms = Object.keys(LEGAL_GLOSSARY);
    const termsPattern = glossaryTerms.map(t => `\\b${t}\\b`).join('|');
    
    // Pattern for citations like [S. 43 Rent Act] or [Article 21] or [Sec 12 NDA]
    const citationPattern = `\\[[^\\]]+\\]`;
    
    const combinedRegex = new RegExp(`(${termsPattern}|${citationPattern})`, 'gi');
    const parts = text.split(combinedRegex);

    if (parts.length === 1) return <span>{text}</span>;

    return (
      <span>
        {parts.map((part, i) => {
          const lowerPart = part.toLowerCase();
          
          // Case 1: Legal Term
          if (LEGAL_GLOSSARY[lowerPart]) {
            return (
              <span
                key={i}
                onClick={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setTooltipPos({ x: rect.left, y: rect.bottom + window.scrollY });
                  setActiveGlossaryTerm(lowerPart);
                }}
                className="underline decoration-dotted decoration-legal-gold decoration-2 text-legal-gold hover:text-yellow-400 font-semibold cursor-pointer transition-colors px-0.5 bg-legal-gold/5 rounded"
                title="Click to explain term"
              >
                {part}
              </span>
            );
          }
          
          // Case 2: Citation (starts with [ and ends with ])
          if (part.startsWith('[') && part.endsWith(']')) {
            const citationText = part.slice(1, -1);
            return (
              <a
                key={i}
                href={`https://indiankanoon.org/search/?searchString=${encodeURIComponent(citationText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-legal-gold font-bold hover:underline inline-flex items-center gap-0.5"
                title="View Indian Kanoon Law Link"
              >
                {part}
              </a>
            );
          }

          // Case 3: Regular text
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <section className="flex-1 flex flex-col h-full bg-navy-slate relative overflow-hidden">
      {/* Chat Window Header */}
      <header className="h-16 px-6 border-b border-action-blue/10 flex items-center justify-between bg-charcoal/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8.5 h-8.5 rounded-lg bg-tech-blue/80 border border-action-blue/30 flex items-center justify-center">
              <Gavel className="w-4.5 h-4.5 text-action-blue" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-navy-slate"></div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Themis Copilot</h2>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <span>Legal Assistant</span>
              <span>•</span>
              <span className="capitalize">{activeMode} Mode</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-action-blue/10 border border-action-blue/20 text-[10px] text-action-blue font-semibold uppercase tracking-wider">
            Language: {currentLanguage}
          </div>
          <LanguageSelector currentLanguage={currentLanguage} onChangeLanguage={onChangeLanguage} />
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] animate-fade-in ${
                isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                  isAI
                    ? 'bg-charcoal border-action-blue/20 text-action-blue'
                    : 'bg-tech-blue border-action-blue/40 text-white'
                }`}
              >
                {isAI ? <Gavel className="w-4 h-4" /> : <div className="text-xs font-bold">U</div>}
              </div>

              {/* Message Block */}
              <div className="space-y-1.5 w-full">
                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl border text-sm leading-relaxed shadow-md ${
                    isAI
                      ? 'bg-charcoal border-action-blue/10 text-gray-100 rounded-tl-sm'
                      : 'bg-tech-blue/95 border-action-blue/30 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{renderMessageContent(msg.text)}</p>

                  {/* Render inline template creation prompt button */}
                  {msg.templateRequest && (
                    <div className="mt-4 pt-3 border-t border-action-blue/15 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4.5 h-4.5 text-legal-gold" />
                        <span className="text-xs font-semibold text-gray-300">
                          {msg.templateRequest.name} Template Draft Ready
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenTemplate(msg.templateRequest.code)}
                        className="px-3.5 py-1.5 rounded-lg bg-legal-gold hover:bg-yellow-600 text-navy-slate font-bold text-xs transition-all cursor-pointer shadow-lg shadow-legal-gold/10"
                      >
                        Open Editor
                      </button>
                    </div>
                  )}

                  {/* Render lawyer recommendations inline */}
                  {msg.lawyers && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-action-blue/15">
                      <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-action-blue" />
                        <span>Recommended Legal Advisors Near You:</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.lawyers.map((lawyer, lIdx) => (
                          <div
                            key={lIdx}
                            className="bg-navy-slate/70 border border-action-blue/10 rounded-xl p-3 flex justify-between items-start gap-4 hover:border-action-blue/30 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                                <span>{lawyer.name}</span>
                                <span className="flex items-center text-[10px] text-legal-gold">
                                  <Star className="w-3 h-3 fill-legal-gold inline mr-0.5" />
                                  {lawyer.rating}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-400 font-medium">
                                {lawyer.specialty} • {lawyer.experience} Experience
                              </div>
                              <div className="text-[10px] text-gray-300 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-action-blue" />
                                <span>{lawyer.location} • {lawyer.distance}</span>
                              </div>
                            </div>
                            <div className="text-right flex flex-col justify-between h-full min-h-[50px]">
                              <div className="text-[10px] text-legal-gold font-bold">
                                Est. Fee: {lawyer.budget}
                              </div>
                              <a
                                href={`tel:${lawyer.phone}`}
                                className="mt-2 flex items-center gap-1 px-2.5 py-1 rounded bg-action-blue/15 border border-action-blue/20 text-action-blue hover:bg-action-blue/25 text-[9px] font-bold transition-all"
                              >
                                <Phone className="w-2.5 h-2.5" />
                                <span>Call Agent</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render attachments attached to messages */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-action-blue/15 flex flex-wrap gap-2">
                      {msg.attachments.map((file, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 px-2.5 py-1.5 bg-navy-slate/50 border border-action-blue/20 rounded-lg text-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-action-blue" />
                          <span className="truncate max-w-[120px] font-mono text-[10px] text-gray-300">
                            {file.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-[9px] text-gray-500 font-mono px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef}></div>
      </div>

      {/* Floating Glossary Tooltip */}
      {activeGlossaryTerm && (
        <div
          ref={glossaryRef}
          style={{
            position: 'absolute',
            left: `${Math.min(tooltipPos.x, window.innerWidth - 280)}px`,
            top: `${Math.min(tooltipPos.y - 120, window.innerHeight - 200)}px`
          }}
          className="w-64 bg-charcoal border border-legal-gold/40 rounded-xl shadow-2xl p-3.5 z-40 animate-slide-up text-xs glow-legal-gold"
        >
          <div className="flex items-center justify-between border-b border-legal-gold/20 pb-1.5 mb-2">
            <span className="font-bold text-legal-gold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>Legal Term Breakdown</span>
            </span>
            <button
              onClick={() => setActiveGlossaryTerm(null)}
              className="p-0.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="font-bold text-white mb-1 capitalize text-sm">{activeGlossaryTerm}</div>
          <p className="text-gray-300 leading-relaxed text-[11px]">{LEGAL_GLOSSARY[activeGlossaryTerm]}</p>
        </div>
      )}

      {/* Uploaded File Previews above Input */}
      {attachments.length > 0 && (
        <div className="px-6 py-2.5 bg-charcoal/50 border-t border-action-blue/10 flex flex-wrap gap-2 animate-fade-in">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-navy-slate border border-action-blue/20 rounded-lg text-xs"
            >
              {file.type === 'image' ? (
                <img src={file.url} className="w-6 h-6 object-cover rounded border border-action-blue/10" alt="" />
              ) : (
                <FileText className="w-4 h-4 text-action-blue" />
              )}
              <div className="flex flex-col">
                <span className="truncate max-w-[120px] font-mono text-[10px] text-white leading-none">
                  {file.name}
                </span>
                <span className="text-[9px] text-gray-400 mt-0.5">{file.size}</span>
              </div>
              <button
                onClick={() => removeAttachment(idx)}
                className="p-0.5 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <footer className="p-4 border-t border-action-blue/10 bg-charcoal/20">
        <div className="max-w-4xl mx-auto flex items-end gap-2.5 bg-charcoal/80 border border-action-blue/10 focus-within:border-action-blue rounded-xl p-2.5 transition-all shadow-md focus-within:shadow-lg focus-within:shadow-action-blue/5 glow-border-blue">
          {/* File Attachment Button */}
          <button
            onClick={triggerFileSelect}
            className="p-2 rounded-lg bg-navy-slate hover:bg-action-blue/10 text-gray-400 hover:text-action-blue border border-action-blue/5 hover:border-action-blue/20 transition-all cursor-pointer shrink-0"
            title="Attach Images or PDFs"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,application/pdf"
            className="hidden"
          />

          {/* Text Area */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              activeMode === 'templates'
                ? 'Type details for the template or draft natural request...'
                : activeMode === 'terms'
                ? 'Type legal clause or jargon to break down...'
                : activeMode === 'lawyers'
                ? 'Describe budget, location, and issue e.g., Family dispute in Mumbai under ₹10,000...'
                : 'Ask Themis anything... (e.g. "What is force majeure?")'
            }
            className="flex-1 bg-transparent resize-none border-none text-sm text-white placeholder-gray-500 focus:outline-none max-h-36 min-h-[24px] py-1 font-sans"
            rows={1}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="p-2 rounded-lg bg-action-blue hover:bg-blue-400 text-navy-slate transition-all cursor-pointer shadow-lg shadow-action-blue/10 shrink-0 font-bold"
            title="Send Message"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
