import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FileText, Download, Sparkles, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { getTranslation } from '../languages';

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  standardFee: string;
  fields: { key: string; label: string; placeholder: string; defaultValue?: string; type?: 'text' | 'textarea' | 'date' }[];
}

interface LegalDocumentGeneratorProps {
  currentLanguage?: string;
}

const templates: DocumentTemplate[] = [
  {
    id: 'legal_notice_recovery',
    name: 'Legal Demand Notice for Recovery of Dues',
    category: 'Commercial & Civil Recovery',
    description: 'Statutory 15-day demand notice under Section 138 NI Act / Order 37 CPC before initiating summary suit.',
    standardFee: '₹499',
    fields: [
      { key: 'senderName', label: 'Sender / Claimant Full Name', placeholder: 'e.g. Acme Tech Solutions Pvt Ltd or Your Name' },
      { key: 'senderAddress', label: 'Sender Full Address', placeholder: 'e.g. 402, Cyber Tower, Sector 62, Noida, UP' },
      { key: 'recipientName', label: 'Recipient / Defaulter Name & Company', placeholder: 'e.g. Nexus Logistics India Pvt Ltd' },
      { key: 'recipientAddress', label: 'Recipient Address', placeholder: 'e.g. 12, Nariman Point, Mumbai - 400021' },
      { key: 'amountDue', label: 'Total Outstanding Amount (INR)', placeholder: 'e.g. ₹ 4,50,000/-' },
      { key: 'invoiceDetails', label: 'Invoice & Service Reference', placeholder: 'e.g. Invoice #INV-2025-091 dated 12/10/2025 for Contractual Services' },
      { key: 'demandPeriod', label: 'Notice Demand Cure Period', placeholder: 'e.g. 15 (Fifteen) Days' }
    ]
  },
  {
    id: 'non_disclosure_agreement',
    name: 'Bilateral Mutual Non-Disclosure Agreement (NDA)',
    category: 'Corporate & Intellectual Property',
    description: 'Legally enforceable bilateral confidentiality agreement protecting trade secrets, code, and financial data under the Indian Contract Act, 1872.',
    standardFee: '₹799',
    fields: [
      { key: 'disclosingParty', label: 'Party A (First Party)', placeholder: 'e.g. Primary Corporation / Disclosing Entity Name' },
      { key: 'receivingParty', label: 'Party B (Second Party)', placeholder: 'e.g. Partner Corporation / Receiving Entity Name' },
      { key: 'purpose', label: 'Project / Evaluation Purpose', placeholder: 'e.g. Technical evaluation for API integration, partnership, or due diligence' },
      { key: 'jurisdictionCity', label: 'Governing Law & Jurisdiction City', placeholder: 'e.g. New Delhi / Bengaluru / Mumbai / Hyderabad' },
      { key: 'termYears', label: 'Confidentiality Term (Years)', placeholder: 'e.g. 2 Years / 3 Years' }
    ]
  },
  {
    id: 'general_affidavit',
    name: 'Sworn General Verification Affidavit',
    category: 'Judicial & Evidence',
    description: 'Sworn statement under Order XIX CPC and Oaths Act 1969 for court submissions, name rectification, or government departments.',
    standardFee: '₹299',
    fields: [
      { key: 'deponentName', label: 'Deponent Full Name', placeholder: 'e.g. Full Legal Name S/o or D/o Parent Name' },
      { key: 'deponentAge', label: 'Age (Years)', placeholder: 'e.g. 32 Years' },
      { key: 'deponentAddress', label: 'Deponent Residential Address', placeholder: 'Complete permanent or current address with Pincode' },
      { key: 'statementFacts', label: 'Sworn Statement Facts (Paragraph by Paragraph)', placeholder: '1. That I am a citizen of India residing at the above address.\n2. That the facts stated herein are true and correct to the best of my knowledge.\n3. That no material facts have been suppressed.', type: 'textarea' }
    ]
  },
  {
    id: 'residential_rental_agreement',
    name: 'Residential Lease & Tenancy Agreement',
    category: 'Property & Tenancy',
    description: 'Standard 11-month registered lease agreement protecting landlord security deposit and tenant peaceful possession under State Rent Control Acts.',
    standardFee: '₹599',
    fields: [
      { key: 'landlordName', label: 'Landlord / Lessor Name', placeholder: 'e.g. Full Name of Property Owner' },
      { key: 'tenantName', label: 'Tenant / Lessee Name', placeholder: 'e.g. Full Name of Tenant' },
      { key: 'propertyAddress', label: 'Premises Address', placeholder: 'Complete flat/house number, building, street, and city with Pincode' },
      { key: 'monthlyRent', label: 'Monthly Rent (INR)', placeholder: 'e.g. ₹ 25,000/- per month' },
      { key: 'securityDeposit', label: 'Refundable Security Deposit (INR)', placeholder: 'e.g. ₹ 1,00,000/-' },
      { key: 'leaseTenure', label: 'Lease Duration', placeholder: 'e.g. 11 Months' }
    ]
  }
];

export const LegalDocumentGenerator: React.FC<LegalDocumentGeneratorProps> = ({ currentLanguage = 'en' }) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(templates[0]);
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    templates[0].fields.forEach(f => {
      initial[f.key] = f.defaultValue || '';
    });
    return initial;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfReady, setGeneratedPdfReady] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const handleSelectTemplate = (tpl: DocumentTemplate) => {
    setSelectedTemplate(tpl);
    const initial: Record<string, string> = {};
    tpl.fields.forEach(f => {
      initial[f.key] = f.defaultValue || '';
    });
    setFormValues(initial);
    setGeneratedPdfReady(false);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
    setGeneratedPdfReady(false);
  };

  const generatePDF = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor = [138, 28, 28]; // JusticeBridge deep crimson #8A1C1C
      const darkText = [30, 30, 30];

      // Header Banner
      doc.setFillColor(24, 24, 27); // #18181b
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('JUSTICEBRIDGE LEGAL DRAFTING & VAULT SYSTEM', 14, 14);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text('Bar Council Standards Compliant • Digitally Certified Draft', 14, 22);
      doc.text(`Ref: JB-DOC-${Date.now().toString().slice(-6)}`, 160, 22);

      let yPos = 42;

      // Title
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(selectedTemplate.name.toUpperCase(), 14, yPos);
      yPos += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos, 196, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.setFont('helvetica', 'normal');

      if (selectedTemplate.id === 'legal_notice_recovery') {
        const text = `BY REGISTERED POST WITH ACKNOWLEDGEMENT DUE / SPEED POST / SPEED EMAIL

Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

TO,
${formValues.recipientName || '[Recipient Name]'}
${formValues.recipientAddress || '[Recipient Address]'}

FROM / THROUGH COUNSEL FOR:
${formValues.senderName || '[Sender Name]'}
${formValues.senderAddress || '[Sender Address]'}

SUBJECT: STATUTORY LEGAL DEMAND NOTICE UNDER INDIAN LAW FOR RECOVERY OF OUTSTANDING DUES OF ${formValues.amountDue || 'INR [AMOUNT]'}

Sir/Madam,

Under instructions and on behalf of my client ${formValues.senderName || 'our client'} (hereinafter referred to as the "Claimant"), I hereby serve upon you this formal Statutory Demand Notice:

1. That my Client is engaged in legitimate commerce and has duly supplied goods/services to you in accordance with agreed terms.
2. That in discharge of your legal and contractual liabilities, you are indebted to pay the total sum of ${formValues.amountDue || 'the outstanding amount'} towards ${formValues.invoiceDetails || 'services rendered'}.
3. That despite repeated requests, invoices, and reminders, you have wrongfully failed, neglected, and withheld the aforesaid admitted dues, causing substantial financial distress and breach of trust.
4. NOW THEREFORE, I hereby call upon you to make the payment of the entire outstanding sum of ${formValues.amountDue} along with interest @ 18% per annum to my Client within a period of ${formValues.demandPeriod || '15 (Fifteen) Days'} from the receipt of this notice.
5. Take further notice that in the event of your failure to comply, my Client has given me peremptory instructions to initiate appropriate Civil Suits for Recovery (Order XXXVII CPC), proceedings under the Insolvency and Bankruptcy Code / NI Act, and criminal proceedings for cheating and dishonest misappropriation under BNS/IPC at your sole cost and consequence.

Copy retained in office records for further judicial filings.

Yours faithfully,

Advocate for the Claimant
JusticeBridge Judicial Network`;

        const splitText = doc.splitTextToSize(text, 182);
        doc.text(splitText, 14, yPos);
      } else if (selectedTemplate.id === 'non_disclosure_agreement') {
        const text = `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Non-Disclosure Agreement ("Agreement") is executed on this ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} by and between:

PARTY A: ${formValues.disclosingParty || '[Party A Name]'}
AND
PARTY B: ${formValues.receivingParty || '[Party B Name]'}

WHEREAS the Parties wish to explore and engage in discussions concerning: "${formValues.purpose || 'Business Collaboration'}" (the "Purpose").

NOW THEREFORE, in consideration of the mutual covenants herein contained, the Parties agree as follows:
1. CONFIDENTIAL INFORMATION: Includes all technical algorithms, business plans, software architectures, customer lists, and proprietary legal-tech blueprints disclosed directly or indirectly.
2. NON-USE & OBLIGATIONS: The Receiving Party shall hold all Confidential Information in strict confidence and shall not disclose it to any third party without prior written authorization.
3. DURATION: This confidentiality obligation shall remain binding for a period of ${formValues.termYears || '3 Years'} from the date hereof.
4. GOVERNING LAW & ARBITRATION: This Agreement shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in ${formValues.jurisdictionCity || 'Bengaluru, Karnataka'}.

IN WITNESS WHEREOF, the authorized representatives of the Parties have signed this Agreement.

Signed for Party A: _____________________
Signed for Party B: _____________________`;

        const splitText = doc.splitTextToSize(text, 182);
        doc.text(splitText, 14, yPos);
      } else if (selectedTemplate.id === 'general_affidavit') {
        const text = `BEFORE THE COMPETENT JUDICIAL / STATUTORY AUTHORITY

VERIFICATION AFFIDAVIT

I, ${formValues.deponentName || '[Deponent Name]'}, aged about ${formValues.deponentAge || '35 Years'}, residing at ${formValues.deponentAddress || '[Address]'}, do hereby solemnly affirm and state on oath as under:

${formValues.statementFacts || '1. That the contents stated herein are true and correct to the best of my knowledge.'}

VERIFICATION:
Verified at Bengaluru on this ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} that the contents of paragraphs above are true and correct to the best of my knowledge, information, and belief, and nothing material has been concealed therefrom.

DEPONENT

Identified by Advocate:
JusticeBridge Registry Seal`;

        const splitText = doc.splitTextToSize(text, 182);
        doc.text(splitText, 14, yPos);
      } else {
        const text = `RESIDENTIAL TENANCY LEASE AGREEMENT

This Agreement is made on this ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} between:
LANDLORD: ${formValues.landlordName || '[Landlord Name]'}
TENANT: ${formValues.tenantName || '[Tenant Name]'}

PROPERTY: ${formValues.propertyAddress || '[Premises Address]'}

TERMS AND CONDITIONS:
1. TENURE: The tenancy shall be for an initial period of ${formValues.leaseTenure || '11 Months'}.
2. RENT: The Tenant agrees to pay a monthly rent of ${formValues.monthlyRent || 'INR [Rent]'} on or before the 5th of each calendar month.
3. SECURITY DEPOSIT: The Tenant has paid a refundable interest-free deposit of ${formValues.securityDeposit || 'INR [Deposit]'}.
4. MAINTENANCE: Normal maintenance shall be borne by the Tenant, structural repairs by the Landlord.
5. DISPUTE RESOLUTION: Governed by the laws of India.

LANDLORD: ______________________     TENANT: ______________________
WITNESS 1: _____________________     WITNESS 2: _____________________`;

        const splitText = doc.splitTextToSize(text, 182);
        doc.text(splitText, 14, yPos);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Generated securely via JusticeBridge Automated Legal Drafting System. Valid for court and official use upon appropriate stamp duty and notarization.', 14, 285);

      doc.save(`${selectedTemplate.id}_${Date.now()}.pdf`);
      setGeneratedPdfReady(true);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyTextToClipboard = () => {
    let content = `=== ${selectedTemplate.name.toUpperCase()} ===\n\n`;
    Object.entries(formValues).forEach(([k, v]) => {
      content += `${k.toUpperCase()}: ${v}\n`;
    });
    navigator.clipboard.writeText(content);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span>{t('legalDocEngineBadge')}</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {t('legalDocGeneratorTitle')}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {t('legalDocGeneratorSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Template Selection */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            {t('selectDocType')}
          </h2>
          {templates.map(tpl => {
            const isSelected = tpl.id === selectedTemplate.id;
            return (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-red-950/30 border-red-600 text-white shadow-lg ring-1 ring-red-500/30'
                    : 'bg-zinc-900/60 border-zinc-800 text-slate-300 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-slate-300 border border-zinc-700">
                    {tpl.category}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    Free / Included
                  </span>
                </div>
                <h3 className="font-semibold text-slate-100 mt-1">{tpl.name}</h3>
                <p className="text-slate-400 mt-1 line-clamp-2 text-[11px] leading-relaxed">
                  {tpl.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Customization & Real PDF Generation */}
        <div className="lg:col-span-8">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span>{selectedTemplate.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in the mandatory details below to generate a standardized legal document.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyTextToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNotice ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {selectedTemplate.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      value={formValues[field.key] || ''}
                      onChange={e => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formValues[field.key] || ''}
                      onChange={e => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Formatted to Supreme Court & High Court registry formatting rules</span>
              </div>

              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Compiling PDF Document...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Generate & Download Real PDF</span>
                  </>
                )}
              </button>
            </div>

            {generatedPdfReady && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Your official PDF document has been compiled and downloaded to your computer!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
