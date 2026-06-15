import React from 'react';
import { FileText, Search, ShieldCheck, Gavel, FileSignature, Trash2 } from 'lucide-react';

export default function ModeSelector({
  activeMode,
  setActiveMode,
  onClearCache,
  onSelectQuickTemplate,
  onSelectQuickTerm,
  onSelectQuickLawyer,
  hasMessages
}) {
  const modes = [
    { id: 'chat', label: 'Legal Assistant', icon: Gavel, description: 'Ask questions, draft or explain' },
    { id: 'templates', label: 'Document Templates', icon: FileText, description: 'Browse and draft agreements' },
    { id: 'terms', label: 'Legal Term Explainer', icon: Search, description: 'Break down complex jargon' },
    { id: 'lawyers', label: 'Lawyer Finder', icon: ShieldCheck, description: 'Locate nearby affordable lawyers' }
  ];

  const quickTemplates = [
    { name: 'Rent Agreement', code: 'rent_agreement' },
    { name: 'Non-Disclosure Agreement', code: 'nda' },
    { name: 'NOC Letter', code: 'noc' },
    { name: 'Employment Contract', code: 'employment_contract' }
  ];

  const quickTerms = [
    { term: 'Force Majeure', desc: 'Act of God / Unforeseeable circumstances' },
    { term: 'Indemnity', desc: 'Security/protection against financial loss' },
    { term: 'Caveat Emptor', desc: 'Let the buyer beware' }
  ];

  return (
    <aside className="w-80 shrink-0 border-r border-action-blue/10 bg-navy-slate/90 flex flex-col justify-between h-full overflow-y-auto">
      {/* Top Section / Brand */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-tech-blue to-action-blue flex items-center justify-center shadow-lg shadow-action-blue/20">
            <Gavel className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Themis
            </h1>
            <p className="text-xs text-gray-400">Legal Copilot</p>
          </div>
        </div>

        {/* Navigation Modes */}
        <div className="space-y-1.5">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`w-full flex items-start gap-3.5 p-3 rounded-xl transition-all duration-200 text-left border cursor-pointer ${
                  isSelected
                    ? 'bg-tech-blue/30 border-action-blue/30 text-white shadow-md glow-tech-blue'
                    : 'bg-transparent border-transparent hover:bg-action-blue/5 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-action-blue' : 'text-gray-400 group-hover:text-white'}`} />
                <div>
                  <div className="text-sm font-semibold">{mode.label}</div>
                  <div className="text-xs text-gray-400/90 mt-0.5">{mode.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-action-blue/10"></div>

        {/* Dynamic Context Helpers based on Active Mode */}
        {activeMode === 'templates' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Available Templates</h3>
              <div className="space-y-1.5">
                {quickTemplates.map((t) => (
                  <button
                    key={t.code}
                    onClick={() => onSelectQuickTemplate(t.code)}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg bg-charcoal hover:bg-action-blue/10 border border-action-blue/5 hover:border-action-blue/30 text-gray-300 hover:text-white transition-all duration-150 flex items-center gap-2 cursor-pointer"
                  >
                    <FileSignature className="w-3.5 h-3.5 text-action-blue" />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMode === 'terms' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Common Legal Jargon</h3>
              <div className="space-y-2">
                {quickTerms.map((qt) => (
                  <button
                    key={qt.term}
                    onClick={() => onSelectQuickTerm(qt.term)}
                    className="w-full text-left p-2.5 rounded-lg bg-charcoal hover:bg-action-blue/10 border border-action-blue/5 hover:border-action-blue/30 text-gray-300 hover:text-white transition-all duration-150 cursor-pointer"
                  >
                    <div className="font-semibold text-xs text-legal-gold">{qt.term}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{qt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMode === 'lawyers' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Quick Lawyer Search</h3>
              <p className="text-[11px] text-gray-400 mb-3">Filter nearby legal help by location and budget constraints.</p>
              <div className="space-y-2">
                <button
                  onClick={() => onSelectQuickLawyer('mumbai_budget')}
                  className="w-full text-left p-2.5 rounded-lg bg-charcoal hover:bg-action-blue/10 border border-action-blue/5 hover:border-action-blue/30 text-gray-300 hover:text-white transition-all duration-150 text-xs cursor-pointer"
                >
                  <div className="font-semibold">Budget Lawyers in Mumbai</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Family & Property disputes</div>
                </button>
                <button
                  onClick={() => onSelectQuickLawyer('delhi_corporates')}
                  className="w-full text-left p-2.5 rounded-lg bg-charcoal hover:bg-action-blue/10 border border-action-blue/5 hover:border-action-blue/30 text-gray-300 hover:text-white transition-all duration-150 text-xs cursor-pointer"
                >
                  <div className="font-semibold">Corporate Aid in New Delhi</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Contracts, IP & Startup Consultation</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'chat' && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggestions</h3>
            <div className="space-y-1.5">
              <button
                onClick={() => onSelectQuickTemplate('rent_agreement')}
                className="w-full text-left px-3 py-2 text-xs rounded-lg bg-charcoal hover:bg-action-blue/10 text-gray-300 hover:text-white transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <span>Draft a Rent Agreement</span>
              </button>
              <button
                onClick={() => onSelectQuickTerm('Force Majeure')}
                className="w-full text-left px-3 py-2 text-xs rounded-lg bg-charcoal hover:bg-action-blue/10 text-gray-300 hover:text-white transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <span>Explain "Force Majeure"</span>
              </button>
              <button
                onClick={() => onSelectQuickLawyer('mumbai_budget')}
                className="w-full text-left px-3 py-2 text-xs rounded-lg bg-charcoal hover:bg-action-blue/10 text-gray-300 hover:text-white transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <span>Find lawyer under ₹5,000</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions (Cache clearing, details) */}
      <div className="p-4 border-t border-action-blue/10 bg-navy-slate/60">
        <div className="text-[10px] text-gray-400 text-center mb-3">
          All session data is cached in your browser. No data is stored on servers.
        </div>
        {hasMessages && (
          <button
            onClick={onClearCache}
            className="w-full py-2.5 px-3 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear App Cache</span>
          </button>
        )}
      </div>
    </aside>
  );
}
