import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the advocate verification process work?",
    answer: "JusticeBridge uses a multi-layered verification process. Advocates submit their Bar Council credentials, which are initially validated by our AI-powered compliance system. If credentials meet our automated quality standards, they are verified instantly. Otherwise, the request is placed in a secure queue for manual audit by our legal compliance team."
  },
  {
    question: "Why do I see a 'pending' status for my verification?",
    answer: "A 'pending' status means your request is currently in the secure audit queue. This happens if our automated system requires a human compliance officer to review the uploaded document proofs against the State Bar Council registries to ensure maximum accuracy."
  },
  {
    question: "What are the benefits of the client annual membership?",
    answer: "Our client annual membership provides 24/7 access to full case files, priority consultation bookings with highly-rated advocates, automated case status alerts, and access to our AI-powered judicial strategy advisor to help streamline your legal matters."
  },
  {
    question: "Are my documents secure on the platform?",
    answer: "Absolutely. All documents are stored in encrypted buckets with restricted access. Only you and your specifically assigned counsel have access to your case files. Furthermore, we maintain tamper-proof audit logs for all data access."
  },
  {
    question: "How can I check the status of my filed case?",
    answer: "Once logged in, navigate to the 'My Cases' dashboard. You will see real-time status updates, next hearing dates, and any documents filed by your advocate."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-white font-cinzel">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left text-white font-semibold hover:bg-zinc-800/50 transition-colors"
              >
                {item.question}
                {openIndex === index ? <ChevronUp className="w-5 h-5 text-red-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-zinc-800 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
