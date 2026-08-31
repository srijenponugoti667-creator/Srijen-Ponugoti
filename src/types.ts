export type UserRole = 'client' | 'lawyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isVerifiedLawyer?: boolean;
  barCouncilNumber?: string;
  stateBarCouncil?: string;
  practiceLocation?: string;
  yearsExperience?: number;
  specialization?: string[];
  membershipActive: boolean;
  membershipPlan?: 'client_annual' | 'advocate_monthly';
  membershipExpiresAt?: string;
  avatar?: string;
  consultationFee?: number;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  casesWon?: number;
}

export interface CaseDocument {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'image' | 'scan';
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  fileCategory: 'Petition' | 'Affidavit' | 'Evidence' | 'Court Order' | 'Vakalatnama' | 'Notice' | 'Forensic Report';
  isRestricted: boolean; // Only verified lawyers can view
  fileUrl?: string;
  documentHash: string;
  pageCount: number;
  summary?: string;
}

export interface Hearing {
  id: string;
  hearingDate: string;
  courtRoom: string;
  judgeName: string;
  stage: string;
  purpose: string;
  notes?: string;
  adjournmentReason?: string;
  status: 'Scheduled' | 'Completed' | 'Adjourned';
}

export interface CaseMatter {
  id: string;
  caseNumber: string;
  cnrNumber: string;
  title: string;
  caseType: 'Commercial Dispute' | 'Constitutional Writ' | 'Cyber Crime' | 'Civil & Property' | 'Corporate Arbitration' | 'Criminal Defense' | 'Family Law';
  filingDate: string;
  courtName: string;
  jurisdiction: string;
  bench: string;
  judgeName: string;
  petitioner: string;
  respondent: string;
  clientId: string; // Used for strict client isolation
  clientName: string;
  clientEmail: string;
  assignedLawyerId?: string;
  assignedLawyerName?: string;
  status: 'Filing' | 'Scrutiny' | 'Notice' | 'Evidence' | 'Arguments' | 'Reserved' | 'Disposed';
  stageDescription: string;
  daysElapsed: number;
  estimatedDisposalDays: number;
  delayRiskScore: 'Low' | 'Moderate' | 'Critical';
  delayDays: number;
  bottleneckReason?: string;
  nextHearingDate?: string;
  hearings: Hearing[];
  documents: CaseDocument[];
  summaryBrief?: string;
}

export interface LawyerReview {
  id: string;
  lawyerId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number; // 1 to 5
  caseType: string;
  caseOutcome: 'Won' | 'Compromised' | 'Ongoing' | 'Lost';
  comment: string;
  courtName?: string;
  verifiedLitigant: boolean;
  createdAt: string;
}

export interface LawyerProfile {
  id: string;
  name: string;
  barCouncilNumber: string;
  stateBarCouncil: string;
  isVerified: boolean;
  specialization: string[];
  experienceYears: number;
  courts: string[];
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  location: string;
  bio: string;
  casesResolved: number;
  activeCasesCount: number;
  casesTotal: number;
  casesWon: number;
  casesLost: number;
  casesCompromised: number;
  casesOngoing: number;
  winRate: number;
  compromiseRate?: number;
  grade: 'A+' | 'A' | 'B+' | 'B';
  tierTitle?: string;
  badges: string[];
  reviews?: LawyerReview[];
  contactEmail: string;
  phone: string;
  availableDays: string[];
  avatar: string;
}

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  planName: string;
  planDuration: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
  transactionId: string;
  paidAt: string;
  expiresAt: string;
}

export interface DelayMetric {
  category: string;
  avgStandardDays: number;
  justiceBridgeAvgDays: number;
  reductionPercentage: number;
}

export interface ConsultationBooking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  lawyerId: string;
  lawyerName: string;
  bookingDate: string;
  timeSlot: string;
  consultationType: 'Video Call' | 'In-Person Chamber' | 'Phone';
  matterSubject: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Rescheduled';
  fee: number;
  meetingLink?: string;
  notes?: string;
  createdAt: string;
}
