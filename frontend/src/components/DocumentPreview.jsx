import React from 'react';
import { X, FileText, Printer, FileDown, CheckCircle, Edit3 } from 'lucide-react';

export default function DocumentPreview({
  isOpen,
  onClose,
  templateCode,
  formData,
  onFormChange,
  onDownload
}) {
  if (!isOpen) return null;

  const templates = {
    rent_agreement: {
      name: 'Residential Rent Agreement',
      fields: [
        { key: 'landlordName', label: 'Landlord Full Name', placeholder: 'e.g. Ramesh Kumar' },
        { key: 'tenantName', label: 'Tenant Full Name', placeholder: 'e.g. Sunil Sharma' },
        { key: 'propertyAddress', label: 'Property Address', placeholder: 'e.g. Flat 302, Green Glen, Mumbai' },
        { key: 'monthlyRent', label: 'Monthly Rent (₹)', placeholder: 'e.g. 25,000' },
        { key: 'agreementDuration', label: 'Agreement Duration (Months)', placeholder: 'e.g. 11' }
      ]
    },
    nda: {
      name: 'Non-Disclosure Agreement (NDA)',
      fields: [
        { key: 'disclosingParty', label: 'Disclosing Party', placeholder: 'e.g. TechCorp Solutions Inc.' },
        { key: 'receivingParty', label: 'Receiving Party', placeholder: 'e.g. Rajesh Gupta' },
        { key: 'confidentialPurpose', label: 'Confidential Purpose', placeholder: 'e.g. Software Development Project' },
        { key: 'agreementTerm', label: 'Agreement Term (Years)', placeholder: 'e.g. 3' }
      ]
    },
    noc: {
      name: 'No Objection Certificate (NOC)',
      fields: [
        { key: 'issuerName', label: 'Issuing Authority / Company', placeholder: 'e.g. Apex Housing Society' },
        { key: 'recipientName', label: 'Recipient Name', placeholder: 'e.g. Priya Deshmukh' },
        { key: 'nocPurpose', label: 'Purpose of NOC', placeholder: 'e.g. Installation of Solar Panels' },
        { key: 'nocDate', label: 'Certificate Date', placeholder: 'e.g. 12th June 2026' }
      ]
    },
    employment_contract: {
      name: 'Employment Contract',
      fields: [
        { key: 'employerName', label: 'Employer Company', placeholder: 'e.g. Nexa Systems Private Limited' },
        { key: 'employeeName', label: 'Employee Name', placeholder: 'e.g. Rahul Verma' },
        { key: 'employeeRole', label: 'Job Designation', placeholder: 'e.g. Senior Software Engineer' },
        { key: 'annualSalary', label: 'Annual CTC (₹)', placeholder: 'e.g. 12,00,000' },
        { key: 'startDate', label: 'Start Date', placeholder: 'e.g. 1st July 2026' }
      ]
    }
  };

  const activeTemplate = templates[templateCode] || templates.rent_agreement;

  const renderDocumentContent = () => {
    const getValue = (key, fallback) => {
      return formData[key] ? (
        <span className="font-bold text-navy-slate bg-legal-gold/20 px-1 rounded border-b border-legal-gold">
          {formData[key]}
        </span>
      ) : (
        <span className="italic text-red-500/70 bg-red-500/5 px-1.5 py-0.5 rounded border border-dashed border-red-500/30 text-xs">
          [{fallback}]
        </span>
      );
    };

    switch (templateCode) {
      case 'rent_agreement':
        return (
          <div className="space-y-6 text-sm text-gray-800 leading-relaxed text-justify">
            <h2 className="text-center font-bold text-base text-navy-slate underline tracking-wider uppercase mb-8">
              RENT AGREEMENT
            </h2>
            <p>
              This Rent Agreement is made and entered on this day, by and between the Landlord,{' '}
              {getValue('landlordName', 'Enter Landlord Name')}, hereinafter referred to as the "FIRST PARTY", and
              the Tenant, {getValue('tenantName', 'Enter Tenant Name')}, hereinafter referred to as the "SECOND PARTY".
            </p>
            <p>
              WHEREAS the FIRST PARTY is the owner of the residential property situated at{' '}
              {getValue('propertyAddress', 'Enter Property Address')} (hereinafter referred to as the "Premises").
            </p>
            <p>
              AND WHEREAS the SECOND PARTY has approached the FIRST PARTY to lease the Premises for residential use
              for a duration of {getValue('agreementDuration', 'Duration in Months')} months, and the FIRST PARTY
              has agreed to lease the same on the terms hereinafter specified.
            </p>
            <p className="font-semibold text-navy-slate">NOW THIS DEED WITNESSETH AS FOLLOWS:</p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Rent:</strong> The SECOND PARTY shall pay the FIRST PARTY a monthly rent of ₹
                {getValue('monthlyRent', 'Amount')}, payable in advance on or before the 5th day of every calendar
                month.
              </li>
              <li>
                <strong>Use:</strong> The Premises shall be used strictly for residential purposes and the SECOND
                PARTY shall not sub-let or assign the Premises to anyone else.
              </li>
              <li>
                <strong>Maintenance:</strong> The SECOND PARTY shall maintain the Premises in good, sanitary condition
                and bear routine electricity and water charges.
              </li>
            </ol>
            <div className="pt-12 grid grid-cols-2 gap-8">
              <div className="border-t border-gray-400 pt-3 text-center">
                <p className="font-bold text-xs text-navy-slate">FIRST PARTY (LANDLORD)</p>
              </div>
              <div className="border-t border-gray-400 pt-3 text-center">
                <p className="font-bold text-xs text-navy-slate">SECOND PARTY (TENANT)</p>
              </div>
            </div>
          </div>
        );

      case 'nda':
        return (
          <div className="space-y-6 text-sm text-gray-800 leading-relaxed text-justify">
            <h2 className="text-center font-bold text-base text-navy-slate underline tracking-wider uppercase mb-8">
              NON-DISCLOSURE AGREEMENT
            </h2>
            <p>
              This Mutual Non-Disclosure Agreement ("Agreement") is entered into by and between the Disclosing Party,{' '}
              {getValue('disclosingParty', 'Enter Disclosing Party')}, and the Receiving Party,{' '}
              {getValue('receivingParty', 'Enter Receiving Party')}, in connection with the evaluation of a potential
              business relationship.
            </p>
            <p>
              <strong>1. Confidential Information:</strong> Confidential Information means all information disclosed by
              one party to the other that is marked as confidential or is reasonably understood to be confidential,
              including but not limited to technical, commercial, or operational information related to{' '}
              {getValue('confidentialPurpose', 'Purpose of Disclosure')}.
            </p>
            <p>
              <strong>2. Obligations:</strong> The Receiving Party shall restrict access to Confidential Information
              to employees and contractors on a need-to-know basis and shall not disclose it to any third party for a
              period of {getValue('agreementTerm', 'Term in Years')} years from the date of disclosure.
            </p>
            <p>
              <strong>3. Remedies:</strong> In the event of a breach of this Agreement, the Disclosing Party shall be
              entitled to seek injunctive relief in addition to monetary damages.
            </p>
            <div className="pt-12 grid grid-cols-2 gap-8">
              <div className="border-t border-gray-400 pt-3 text-center">
                <p className="font-bold text-xs text-navy-slate">DISCLOSING PARTY SIGNATURE</p>
              </div>
              <div className="border-t border-gray-400 pt-3 text-center">
                <p className="font-bold text-xs text-navy-slate">RECEIVING PARTY SIGNATURE</p>
              </div>
            </div>
          </div>
        );

      case 'noc':
        return (
          <div className="space-y-6 text-sm text-gray-800 leading-relaxed text-justify">
            <h2 className="text-center font-bold text-base text-navy-slate underline tracking-wider uppercase mb-8">
              NO OBJECTION CERTIFICATE
            </h2>
            <div className="text-right text-xs text-gray-600 mb-6">
              <strong>Date:</strong> {getValue('nocDate', 'Select Date')}
            </div>
            <p className="font-semibold text-navy-slate">TO WHOMSOEVER IT MAY CONCERN</p>
            <p>
              This is to certify that {getValue('issuerName', 'Issuing Authority')}, being the lawful owner/authority
              responsible, has no objection, reservations, or claims regarding the proposal submitted by{' '}
              {getValue('recipientName', 'Recipient Name')} for the purpose of{' '}
              {getValue('nocPurpose', 'Purpose details')}.
            </p>
            <p>
              We further certify that we support this application and will provide any necessary permissions required
              by state or local municipal boards to carry out this action.
            </p>
            <div className="pt-16 max-w-xs ml-auto text-center">
              <div className="border-t border-gray-400 pt-3">
                <p className="font-bold text-xs text-navy-slate">AUTHORIZED SIGNATORY</p>
                <p className="text-[10px] text-gray-500">{formData.issuerName || 'Issuing Authority'}</p>
              </div>
            </div>
          </div>
        );

      case 'employment_contract':
        return (
          <div className="space-y-6 text-sm text-gray-800 leading-relaxed text-justify">
            <h2 className="text-center font-bold text-base text-navy-slate underline tracking-wider uppercase mb-8">
              EMPLOYMENT CONTRACT
            </h2>
            <p>
              This Agreement is made on this day between Employer,{' '}
              {getValue('employerName', 'Company Name')} ("Company"), and Employee,{' '}
              {getValue('employeeName', 'Employee Name')} ("Employee").
            </p>
            <p>
              <strong>1. Position:</strong> The Employee is hired for the role of{' '}
              {getValue('employeeRole', 'Designation')}, with tasks matching standard industry roles starting from{' '}
              {getValue('startDate', 'Employment Start Date')}.
            </p>
            <p>
              <strong>2. Compensation:</strong> The Company shall pay the Employee an annual salary package of ₹
              {getValue('annualSalary', 'Amount')}, subject to standard taxes and performance-based reviews.
            </p>
            <p>
              <strong>3. Termination:</strong> Either party can terminate this agreement by providing a 30-day notice
              period or equivalent salary in lieu of notice.
            </p>
            <div className="pt-12 grid grid-cols-2 gap-8">
              <div className="border-t border-gray-400 pt-3 text-center">
                <p className="font-bold text-xs text-navy-slate">EMPLOYER SIGNATURE</p>
              </div>
              <div className="border-t border-gray-400 pt-3 text-center">
                <p className="font-bold text-xs text-navy-slate">EMPLOYEE SIGNATURE</p>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Template not selected</p>;
    }
  };

  return (
    <section className="w-1/2 border-l border-action-blue/15 bg-navy-slate flex flex-col h-full animate-fade-in z-20">
      {/* Header */}
      <div className="h-16 px-6 border-b border-action-blue/10 flex items-center justify-between bg-charcoal/40">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-action-blue" />
          <h2 className="text-sm font-semibold text-white tracking-wide truncate max-w-xs">
            {activeTemplate.name}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-action-blue/10 hover:bg-action-blue/20 text-action-blue border border-action-blue/20 text-xs font-semibold transition-all cursor-pointer hover:shadow-lg hover:shadow-action-blue/5"
            title="Download PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg hover:bg-action-blue/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split-pane Workspace */}
      <div className="flex-1 flex overflow-hidden h-[calc(100%-4rem)]">
        {/* Form Inputs (Left side of pane) */}
        <div className="w-80 shrink-0 border-r border-action-blue/10 bg-charcoal/20 p-5 overflow-y-auto space-y-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-3">
            <Edit3 className="w-3.5 h-3.5 text-action-blue" />
            <span>EDIT TEMPLATE VARIABLES</span>
          </div>

          {activeTemplate.fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-300 block">{field.label}</label>
              <input
                type="text"
                value={formData[field.key] || ''}
                onChange={(e) => onFormChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-charcoal/85 border border-action-blue/10 focus:border-action-blue rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 transition-all focus:outline-none glow-border-blue"
              />
            </div>
          ))}

          <div className="pt-4 p-3 rounded-lg border border-action-blue/10 bg-tech-blue/10 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-action-blue shrink-0 mt-0.5 animate-pulse" />
            <span className="text-[10px] text-gray-300 leading-relaxed">
              Your edits sync directly with the stamp paper draft on the right. Hit Export to save to local storage.
            </span>
          </div>
        </div>

        {/* Paper Previewer (Right side of pane) */}
        <div className="flex-1 bg-navy-slate/85 p-6 overflow-y-auto flex justify-center items-start">
          {/* Virtual Stamp Paper */}
          <div className="w-full max-w-[580px] min-h-[750px] bg-[#FAF8F5] border border-amber-200/50 shadow-2xl p-10 py-12 rounded relative glow-legal-gold">
            {/* Stamp Paper Top Header */}
            <div className="border-4 border-double border-red-700/60 p-1.5 mb-10 text-center relative overflow-hidden">
              <div className="border border-red-700/40 p-3 flex flex-col items-center justify-center bg-[#FDFCF7]">
                <div className="text-red-700 font-black text-xl tracking-[0.25em] uppercase leading-none">
                  INDIAN NON JUDICIAL
                </div>
                <div className="text-xs font-semibold text-red-600 mt-1 uppercase tracking-wider">
                  Government of National Capital Territory
                </div>
                {/* Simulated Stamp Graphics */}
                <div className="my-2 py-0.5 px-3 border border-red-500/20 bg-amber-50 rounded text-red-800 font-serif text-[10px] italic">
                  One Hundred Rupees Only (₹100)
                </div>
                <div className="w-32 h-6 border-b border-red-700/40 flex justify-between px-4 text-[9px] font-mono text-red-600">
                  <span>No. E-029410</span>
                  <span>ID: IN-DL02931</span>
                </div>
              </div>
            </div>

            {/* Document Body */}
            {renderDocumentContent()}
          </div>
        </div>
      </div>
    </section>
  );
}
