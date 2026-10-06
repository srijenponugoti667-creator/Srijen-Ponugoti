import React from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';

export const BusinessSetupGuide: React.FC = () => {
  return (
    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900 text-zinc-300">
      <div className="flex items-center gap-2 mb-4 text-amber-500">
        <AlertTriangle className="w-6 h-6" />
        <h2 className="text-xl font-bold text-white">Legal Disclaimer</h2>
      </div>
      <p className="mb-6 text-sm">
        I am an AI, not a lawyer or a Chartered Accountant (CA). This guide is for informational purposes only 
        and does not constitute legal or financial advice. Company registration involves complex legal 
        compliance in India. Please consult with a qualified professional before making any decisions.
      </p>

      <h1 className="text-2xl font-bold text-white mb-6">Business Entity Registration Guide (India)</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">1. Choose Your Entity Type</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Sole Proprietorship:</strong> Easiest to start, but no separate legal entity (full personal liability).</li>
          <li><strong>Limited Liability Partnership (LLP):</strong> Hybrid, flexible, separate legal entity, limited liability. Good for professional services.</li>
          <li><strong>Private Limited (Pvt Ltd):</strong> Most common for startups, separate legal entity, limited liability, required for raising venture capital.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">2. Registration Checklist (Pvt Ltd/LLP focus)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Obtain Digital Signature Certificate (DSC):</strong> Required for electronic filing on the MCA portal.</li>
          <li><strong>Obtain Director Identification Number (DIN):</strong> Mandatory for all directors of a company.</li>
          <li><strong>Name Reservation:</strong> Use the SPICe+ (Part A) form on the MCA portal to reserve your company name.</li>
          <li><strong>Final Incorporation:</strong> File SPICe+ (Part B) including Articles of Association (AoA) and Memorandum of Association (MoA).</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">3. Key Official Resource</h2>
        <a 
          href="https://www.mca.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          Ministry of Corporate Affairs (MCA) Portal <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">4. Post-Incorporation Essentials</h2>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>PAN & TAN Application.</li>
          <li>GST Registration (if applicable).</li>
          <li>Open a Corporate Bank Account.</li>
          <li>Compliance (Board meetings, Annual Filings, etc.).</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-white mb-3">5. MSME/Udyam Registration (5-Step Checklist)</h2>
        <div className="bg-emerald-950/30 border border-emerald-800 p-4 rounded-xl mb-6">
          <p className="text-sm">
            <strong>Crucial Distinction:</strong> Udyam registration is <em>not</em> a substitute for business entity registration (LLP/Pvt Ltd). You must first register your business entity, and then use that entity to apply for MSME/Udyam classification to avail government benefits.
          </p>
        </div>
        
        <ol className="list-decimal pl-5 space-y-3 mb-6">
          <li><strong>Aadhaar Validation:</strong> Visit the portal and validate your Aadhaar number with an OTP.</li>
          <li><strong>PAN & Org Type:</strong> Validate your personal/business PAN and select the correct Organization Type (Proprietorship/Pvt Ltd/LLP).</li>
          <li><strong>Business Details:</strong> Enter official enterprise details, bank account info, and select the correct NIC code (e.g., 6201 for software services).</li>
          <li><strong>Investment & Turnover:</strong> Input your enterprise’s investment and turnover figures (enter 0 if you are pre-revenue).</li>
          <li><strong>Final Submission:</strong> Submit the application, verify with a final OTP, and download your official Udyam Certificate.</li>
        </ol>

        <a 
          href="https://udyamregistration.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
        >
          Proceed to Udyam Registration Portal <ExternalLink className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
};
