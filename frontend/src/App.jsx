import React, { useState, useEffect } from 'react';
import ModeSelector from './components/ModeSelector';
import ChatWindow from './components/ChatWindow';
import DocumentPreview from './components/DocumentPreview';

// Default welcome/intro messages showing features
const DEFAULT_MESSAGES = [
  {
    id: 'msg-init-1',
    sender: 'ai',
    text: 'Welcome to Themis! ⚖️\n\nI am your interactive Legal Assistant. You can use me to:\n1. Draft and edit legal documents using interactive templates.\n2. Access laws and citations like [S. 43 Rent Act] or constitutional [Article 21].\n3. Translate and break down complex legal terms like [force majeure] or [indemnity].\n4. Locate nearby affordable legal advice based on your budget & location.',
    timestamp: Date.now() - 3600000
  },
  {
    id: 'msg-init-2',
    sender: 'ai',
    text: 'How can I assist you today? You can select a mode from the sidebar or click any suggestion below to start!',
    timestamp: Date.now() - 3500000
  }
];

export default function App() {
  const [activeMode, setActiveMode] = useState(() => {
    return localStorage.getItem('themis_mode') || 'chat';
  });

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('themis_lang') || 'en';
  });

  const [messages, setMessages] = useState(() => {
    const cached = localStorage.getItem('themis_messages');
    return cached ? JSON.parse(cached) : DEFAULT_MESSAGES;
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(() => {
    return localStorage.getItem('themis_preview_open') === 'true';
  });

  const [previewTemplate, setPreviewTemplate] = useState(() => {
    return localStorage.getItem('themis_preview_template') || 'rent_agreement';
  });

  const [formData, setFormData] = useState(() => {
    const cached = localStorage.getItem('themis_form_data');
    return cached ? JSON.parse(cached) : {
      landlordName: '',
      tenantName: '',
      propertyAddress: '',
      monthlyRent: '',
      agreementDuration: '',
      disclosingParty: '',
      receivingParty: '',
      confidentialPurpose: '',
      agreementTerm: '',
      issuerName: '',
      recipientName: '',
      nocPurpose: '',
      nocDate: '',
      employerName: '',
      employeeName: '',
      employeeRole: '',
      annualSalary: '',
      startDate: ''
    };
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('themis_mode', activeMode);
  }, [activeMode]);

  useEffect(() => {
    localStorage.setItem('themis_lang', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('themis_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('themis_preview_open', isPreviewOpen ? 'true' : 'false');
  }, [isPreviewOpen]);

  useEffect(() => {
    localStorage.setItem('themis_preview_template', previewTemplate);
  }, [previewTemplate]);

  useEffect(() => {
    localStorage.setItem('themis_form_data', JSON.stringify(formData));
  }, [formData]);

  // Handle language change
  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    
    // Add info message about language selection
    const langNames = { en: 'English', hi: 'Hindi (हिन्दी)', mr: 'Marathi (मराठी)' };
    const alertMsg = {
      id: `msg-lang-${Date.now()}`,
      sender: 'ai',
      text: `Language preference switched to: ${langNames[lang]}.\nFuture API prompts will include instructions to output legal content in this language.`,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, alertMsg]);
  };

  // Form input changes inside DocumentPreview
  const handleFormChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Simulate AI Response based on input/actions
  const simulateAIResponse = (userText, userAttachments = []) => {
    // 1. Add User Message
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      attachments: userAttachments,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);

    // 2. Generate simulated AI reply after delay
    setTimeout(() => {
      let replyText = '';
      let templateRequest = null;
      let lawyers = null;

      const lowerText = userText.toLowerCase();

      // Case A: Document template creation requested
      if (lowerText.includes('rent') || lowerText.includes('agreement') || lowerText.includes('nda') || lowerText.includes('noc') || lowerText.includes('contract')) {
        let code = 'rent_agreement';
        let name = 'Residential Rent Agreement';

        if (lowerText.includes('nda') || lowerText.includes('disclosure')) {
          code = 'nda';
          name = 'Non-Disclosure Agreement (NDA)';
        } else if (lowerText.includes('noc') || lowerText.includes('objection')) {
          code = 'noc';
          name = 'No Objection Certificate (NOC)';
        } else if (lowerText.includes('contract') || lowerText.includes('employ')) {
          code = 'employment_contract';
          name = 'Employment Contract';
        }

        replyText = `Certainly! I've loaded the ${name} template. You can now fill out the details using the split editor pane on the right.\n\nType the values here or enter them directly into the form fields. As you type, the legal stamp paper preview will update in real-time.`;
        templateRequest = { code, name };

        // Auto open preview panel
        setPreviewTemplate(code);
        setIsPreviewOpen(true);
      }
      // Case B: Term explainer requested
      else if (lowerText.includes('explain') || lowerText.includes('term') || lowerText.includes('force majeure') || lowerText.includes('indemnity') || lowerText.includes('caveat')) {
        replyText = `Legal terms can be tricky! In contracts, words like [force majeure] protect parties when unpredictable events occur, and [indemnity] clauses outline who covers financial losses.\n\nYou can click on any gold-dotted term inside my replies to open a definition card summarizing it in simple, everyday language.`;
      }
      // Case C: Lawyer Finder requested
      else if (lowerText.includes('lawyer') || lowerText.includes('budget') || lowerText.includes('mumbai') || lowerText.includes('delhi')) {
        replyText = `Based on your query, I searched for legal help nearby matching your budget criteria. Here are verified options from the bar association:`;
        lawyers = [
          {
            name: 'Adv. Anjali Deshmukh',
            rating: '4.8',
            specialty: 'Family Law & Rent Disputes',
            experience: '8 Yrs',
            location: 'Bandra West, Mumbai',
            distance: '1.2 km away',
            budget: '₹3,000 - ₹5,000 / Session',
            phone: '+919876543210'
          },
          {
            name: 'Adv. Suresh Mehta',
            rating: '4.9',
            specialty: 'Civil & Land Tenancy',
            experience: '15 Yrs',
            location: 'Andheri East, Mumbai',
            distance: '3.4 km away',
            budget: '₹4,500 / consultation',
            phone: '+919876543211'
          }
        ];
      }
      // Case D: General Welcome/Fallback
      else {
        replyText = `I understand. I can help with that. Since this is the UI demo mode, let me remind you that you can:\n- Toggle different modes using the sidebar.\n- Upload images or PDFs (e.g., contracts to analyze).\n- Change language settings to English, Hindi, or Marathi.\n\nLet me know if you would like me to draft a rent agreement or search for a nearby lawyer!`;
      }

      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        templateRequest,
        lawyers,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 900);
  };

  // Quick Action triggers from Sidebar
  const handleQuickTemplate = (code) => {
    const names = {
      rent_agreement: 'Draft Rent Agreement',
      nda: 'Draft Non-Disclosure Agreement (NDA)',
      noc: 'Draft No Objection Certificate (NOC)',
      employment_contract: 'Draft Employment Contract'
    };
    simulateAIResponse(names[code]);
  };

  const handleQuickTerm = (term) => {
    simulateAIResponse(`Explain the legal term: ${term}`);
  };

  const handleQuickLawyer = (searchCode) => {
    if (searchCode === 'mumbai_budget') {
      simulateAIResponse('Find budget lawyer in Mumbai under ₹5,000 for rent dispute');
    } else {
      simulateAIResponse('Find corporate law advisor in Delhi');
    }
  };

  // Clear data
  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all chat history and active documents from your browser?')) {
      localStorage.clear();
      setMessages(DEFAULT_MESSAGES);
      setIsPreviewOpen(false);
      setPreviewTemplate('rent_agreement');
      setFormData({
        landlordName: '',
        tenantName: '',
        propertyAddress: '',
        monthlyRent: '',
        agreementDuration: '',
        disclosingParty: '',
        receivingParty: '',
        confidentialPurpose: '',
        agreementTerm: '',
        issuerName: '',
        recipientName: '',
        nocPurpose: '',
        nocDate: '',
        employerName: '',
        employeeName: '',
        employeeRole: '',
        annualSalary: '',
        startDate: ''
      });
      setActiveMode('chat');
    }
  };

  const handleOpenTemplateFromChat = (code) => {
    setPreviewTemplate(code);
    setIsPreviewOpen(true);
  };

  const handleDownloadPDF = () => {
    alert('Simulating PDF Export...\n\nYour drafted variables and stamp paper formatting have been packaged into a client-side layout. (In production, this triggers jsPDF or prints to system PDF writer).');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-navy-slate font-sans">
      {/* Left Mode Selection Sidebar */}
      <ModeSelector
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onClearCache={handleClearCache}
        onSelectQuickTemplate={handleQuickTemplate}
        onSelectQuickTerm={handleQuickTerm}
        onSelectQuickLawyer={handleQuickLawyer}
        hasMessages={messages.length > 0}
      />

      {/* Main Container (Chat + Split Preview) */}
      <div className="flex-1 flex overflow-hidden">
        <ChatWindow
          messages={messages}
          onSendMessage={simulateAIResponse}
          currentLanguage={currentLanguage}
          onChangeLanguage={handleLanguageChange}
          onOpenTemplate={handleOpenTemplateFromChat}
          activeMode={activeMode}
        />

        {/* Sliding Stamp-Paper Preview Panel */}
        <DocumentPreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          templateCode={previewTemplate}
          formData={formData}
          onFormChange={handleFormChange}
          onDownload={handleDownloadPDF}
        />
      </div>
    </div>
  );
}
