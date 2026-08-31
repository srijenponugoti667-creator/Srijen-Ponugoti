export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechLocale: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechLocale: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechLocale: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechLocale: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechLocale: 'ur-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', speechLocale: 'sa-IN' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', speechLocale: 'kok-IN' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', speechLocale: 'mai-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', speechLocale: 'mni-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', speechLocale: 'ne-NP' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', speechLocale: 'brx-IN' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', speechLocale: 'doi-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', speechLocale: 'ks-IN' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', speechLocale: 'sat-IN' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', speechLocale: 'sd-IN' },
  { code: 'bgc', name: 'Haryanvi', nativeName: 'हरियाणवी', speechLocale: 'hi-IN' }
];

export interface TranslationDictionary {
  // Navigation
  overview: string;
  findLawyer: string;
  findCase: string;
  myCases: string;
  delayAnalytics: string;
  legalDocs: string;
  aiCounsel: string;
  voiceCaseFiler: string;
  consultations: string;
  membership: string;
  tagline: string;

  // Language Header
  chooseLanguage: string;
  availableIn24: string;

  // Membership Banner
  membershipNotification: string;
  clientAccount: string;
  advocateAccount: string;
  clientMembershipMsg: string;
  advocateMembershipMsg: string;
  payClientFeeBtn: string;
  payAdvocateFeeBtn: string;
  activeMembership: string;

  // Hero Section
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroHeadline3: string;
  heroSubtitle: string;
  btnSpeakToFileCase: string;
  btnFindLawyer: string;
  btnFindCase: string;
  btnClientVault: string;
  btnJoinAdvocate: string;
  heroQuickSearchPlaceholder: string;
  quickLookup: string;
  openAdvocateVault: string;
  viewMyIsolatedCases: string;

  // 3 Pillar Highlights
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  strictRule1: string;
  strictRule2: string;
  daysSaved: string;

  // Home Featured Preview Teasers
  advocateDirectory: string;
  connectVerifiedCounsels: string;
  filterAdvocatesDesc: string;
  browseAdvocatesBtn: string;
  caseTrackingDelayMonitor: string;
  trackLitigationsTitle: string;
  trackLitigationsDesc: string;
  searchCaseByCnrBtn: string;
  judicialDataSecurity: string;
  engineeredForConfidentiality: string;
  securityRule1Title: string;
  securityRule1Desc: string;
  securityRule2Title: string;
  securityRule2Desc: string;

  // Search & Filters
  searchPlaceholder: string;
  filterByCourt: string;
  filterByCity: string;
  filterByPractice: string;
  consultFee: string;
  bookConsultation: string;
  verifiedAdvocate: string;

  // Lawyer Directory Specifics
  noAdvocatesFound: string;
  noAdvocatesDesc: string;
  resetFilters: string;
  allCourtsJurisdictions: string;
  anyExperience: string;
  sortHighestRated: string;
  sortExperience: string;
  sortConsultFee: string;
  sortCasesWon: string;
  sortFeeDesc: string;
  verifiedOnly: string;
  bciVerifiedDirectoryBadge: string;
  completeBarVerificationBtn: string;
  yearsExperience: string;
  yearsActive: string;
  ratingLabel: string;
  verifiedBadge: string;
  pendingBadge: string;
  per30MinConsultation: string;
  queryingAdvocates: string;
  barEnrollment: string;
  experienceLabel: string;
  appearsBefore: string;
  detailsBtn: string;
  consultBtn: string;
  viewProfile: string;
  barVerified: string;
  verificationInProgress: string;
  practiceProfile: string;
  appearingCourts: string;
  availableSchedule: string;
  initialLegalAdvisoryFee: string;
  bookConsultationNow: string;
  advocatesCount: string;
  practiceAreaFilter: string;

  // Case Tracker
  enterCnrOrNumber: string;
  searchCaseBtn: string;
  caseTrackerTitle: string;
  caseTrackerSubtitle: string;
  caseTrackerBadge: string;
  btnFileNewCasePetition: string;
  searchCaseInputPlaceholder: string;
  allCaseCategories: string;
  allRiskLevels: string;
  criticalDelay: string;
  moderateDelay: string;
  lowDelay: string;
  judicialLookupDesc: string;
  sortByDelay: string;
  sortByRecent: string;
  sortByNextHearing: string;
  noCasesFound: string;
  noCasesDesc: string;
  clearSearchQuery: string;
  caseStage: string;
  delayRiskScore: string;
  nextHearing: string;
  inspectCaseVault: string;
  searchingCauseLists: string;

  // My Cases Vault
  myCasesTitleClient: string;
  myCasesTitleLawyer: string;
  myCasesSubtitleClient: string;
  myCasesSubtitleLawyer: string;
  rule2BannerClient: string;
  rule1BannerLawyer: string;
  rule2ClientDesc: string;
  rule1LawyerDesc: string;
  rule1UnverifiedDesc: string;
  noActiveCasesYet: string;
  noActiveCasesDesc: string;
  btnFileFirstPetition: string;
  btnFileNewPetition: string;
  btnVoiceCaseFiler: string;
  totalCases: string;
  mattersCount: string;
  aiDelayAnalysis: string;
  analyzingDelay: string;
  openIsolatedVault: string;
  requestAdvocateInspection: string;

  // Delay Analytics
  delayAnalyticsTitle: string;
  delayAnalyticsSubtitle: string;
  delayAnalyticsBadge: string;
  delayDisclaimer: string;
  targetDelayReduction: string;
  timelineCompression: string;
  hearingTrackingSpeed: string;
  verifiedAdvocatesStat: string;
  litigationMattersActive: string;
  onboarded: string;
  realTime: string;
  disposalTimelinesTitle: string;
  disposalTimelinesDesc: string;
  traditional: string;
  delayCut: string;
  interactiveCalculatorTitle: string;
  interactiveCalculatorDesc: string;
  litigationType: string;
  courtTribunal: string;
  traditionalDisposalTime: string;
  timelineReduction: string;
  estimatedDisposal: string;
  estimatedTimeSaved: string;
  monthsCount: string;

  // Membership
  membershipTitle: string;
  membershipSubtitle: string;
  transparentMembership: string;
  clientJusticePass: string;
  annualClientMembership: string;
  advocatePracticePass: string;
  monthlyAdvocateMembership: string;
  yourAccountTier: string;
  perYearGst: string;
  perMonthGst: string;
  subscribeClientBtn: string;
  subscribeAdvocateBtn: string;

  // Legal Document Generator
  legalDocEngineBadge: string;
  legalDocGeneratorTitle: string;
  legalDocGeneratorSubtitle: string;
  selectDocType: string;

  // Advocate Performance & Grading Slide
  grading: string;
  lawyerGradingTitle: string;
  lawyerGradingSubtitle: string;
  casesTakenTotal: string;
  casesWon: string;
  casesLost: string;
  casesCompromised: string;
  casesOngoing: string;
  winRate: string;
  compromiseRate: string;
  clientReviews: string;
  gradingStarsBadges: string;
  writeReviewBtn: string;
  submitReview: string;
  ratingScore: string;
  caseOutcomeLabel: string;
  verifiedLitigantBadge: string;
  allOutcomes: string;
  gradeTier: string;
  originalAdvocatesTitle: string;
  performanceBreakdown: string;
  reviewPlaceholder: string;
  courtTribunalLabel: string;
  shareFeedback: string;
  yourRating: string;
  caseTypeLabel: string;
  selectOutcome: string;
  outcomeWon: string;
  outcomeCompromised: string;
  outcomeOngoing: string;
  outcomeLost: string;
  gradeAplusBadge: string;
  gradeABadge: string;
  gradeBplusBadge: string;
  gradeBBadge: string;
  viewGradingSlide: string;
  performanceStats: string;
  clientReviewsCount: string;
  badgesTitle: string;
  allGrades: string;
  sortByGrade: string;
  sortByWinRate: string;
  sortByCompromised: string;

  // Footer & Compliance
  terms: string;
  privacy: string;
  refunds: string;
  grievanceContact: string;
  copyright: string;
  platformServices: string;
  legalCompliance: string;
  merchantSupport: string;
  verifiedAdvocatesDir: string;
  nationalCaseRegistry: string;
  multiTenantVault: string;
  automatedNoticeGen: string;
  aiStatutoryCounsel: string;
  dpdpActPrivacy: string;
  refundCancelPolicy: string;
  grievanceOfficer: string;
  operationalHours: string;
}

export const TRANSLATIONS: Record<string, Partial<TranslationDictionary>> = {
  en: {
    overview: 'Overview',
    findLawyer: 'Find a Lawyer',
    findCase: 'Find a Case',
    myCases: 'My Case Vault',
    delayAnalytics: 'Delay Analytics',
    legalDocs: 'Legal Docs',
    aiCounsel: 'AI Counsel',
    voiceCaseFiler: 'Voice Case Filing (For All Citizens)',
    consultations: 'Consultations',
    membership: 'Membership',
    tagline: 'Bridging lawyers • Empowering clients • Reducing delays',

    chooseLanguage: 'Choose Language / Select Your Mother Tongue',
    availableIn24: 'Available in 24 Indian Languages with Voice Judicial Assistance',

    membershipNotification: 'Membership Notification',
    clientAccount: 'Client Account',
    advocateAccount: 'Advocate Practice Account',
    clientMembershipMsg: 'Clients: Please pay your membership fee of ₹ 2,999 Rupees per year to unlock complete isolated case tracking, encrypted document vault, and instant verified advocate consultations.',
    advocateMembershipMsg: 'Advocates: Please pay your membership fee of ₹ 3,999 Rupees per month to access client litigation files, manage case notes, and accept client appointments.',
    payClientFeeBtn: 'Pay ₹ 2,999 / Year',
    payAdvocateFeeBtn: 'Pay ₹ 3,999 / Month',
    activeMembership: 'Active Membership',

    heroBadge: 'Judicial Technology Platform &bull; Bar Council Verified Advocates',
    heroHeadline1: 'BRIDGING LAWYERS.',
    heroHeadline2: 'EMPOWERING CLIENTS.',
    heroHeadline3: 'REDUCING DELAYS.',
    heroSubtitle: 'JusticeBridge is the premier legal platform connecting clients with verified Bar Council advocates, safeguarding confidential litigation files through strict tenant isolation, and actively cutting court hearing delays.',
    btnSpeakToFileCase: 'Speak to File Case (Voice E-Filing)',
    btnFindLawyer: 'Find a Lawyer',
    btnFindCase: 'Find a Case',
    btnClientVault: 'Client Case Vault',
    btnJoinAdvocate: 'Join as Advocate',
    heroQuickSearchPlaceholder: 'Search by Case CNR (e.g. DLHC01-004182-2026), Title, or Court...',
    quickLookup: 'Quick Lookup',
    openAdvocateVault: 'Open Advocate Vault',
    viewMyIsolatedCases: 'View My Isolated Cases',

    pillar1Title: 'Verified Bar Advocates',
    pillar1Desc: 'Every advocate profile is verified against State Bar Councils. Only verified advocates receive credentials to inspect confidential case filings.',
    pillar2Title: 'Complete Client Isolation',
    pillar2Desc: 'Bank-grade multi-tenant architecture ensures strict isolation. No client can ever view, query, or leak another client’s legal matters or confidential filings.',
    pillar3Title: 'Active Delay Reduction',
    pillar3Desc: 'Real-time bottleneck telemetry, electronic discovery tracking, and AI hearing acceleration strategies cut avoidable adjournments by up to 68%.',
    strictRule1: 'Strict Rule 1 Access Control',
    strictRule2: 'Strict Rule 2 Tenant Boundary',
    daysSaved: 'Avg. 84 Days Saved Per Matter',

    advocateDirectory: 'Advocate Directory',
    connectVerifiedCounsels: 'Connect with Verified High Court & Supreme Court Counsels',
    filterAdvocatesDesc: 'Filter verified senior advocates across commercial litigation, civil disputes, constitutional writs, and cyber law. Check active Bar Council enrollment and book consultations directly.',
    browseAdvocatesBtn: 'Browse Verified Advocates',
    caseTrackingDelayMonitor: 'Case Tracking & Delay Monitor',
    trackLitigationsTitle: 'Track Litigations, CNR Numbers & Delay Risk Scores',
    trackLitigationsDesc: 'Instant docket search across High Courts and specialized tribunals. Monitor stage transitions from initial e-filing to notice, evidence cross-examinations, and final judgments.',
    searchCaseByCnrBtn: 'Search Case Matters by CNR',
    judicialDataSecurity: 'Judicial Data Security & Compliance',
    engineeredForConfidentiality: 'Engineered for Strict Legal Confidentiality',
    securityRule1Title: 'Rule 1: Only Verified Lawyers Can View Case Files',
    securityRule1Desc: 'Unverified lawyers or external viewers receive a strict 403 Forbidden rejection when attempting to access confidential case discovery, evidence affidavits, or client work-product.',
    securityRule2Title: 'Rule 2: Complete Client Isolation',
    securityRule2Desc: 'Multi-tenant partition strictly prevents cross-client visibility. Rohan Verma cannot view or query Priya Nair’s property dispute, guaranteeing absolute litigation privacy.',

    searchPlaceholder: 'Search by advocate name, city, or bar ID...',
    filterByCourt: 'All Jurisdictions / Courts',
    filterByCity: 'All Jurisdictions / Cities',
    filterByPractice: 'All Practice Areas',
    consultFee: 'Consultation Fee',
    bookConsultation: 'Book Consultation',
    verifiedAdvocate: 'Verified Advocate',

    noAdvocatesFound: 'No Advocates Found',
    noAdvocatesDesc: 'Try adjusting your search query, selecting different practice areas, or toggling off the strict verification filter.',
    resetFilters: 'Reset Filters',
    allCourtsJurisdictions: 'All Courts & Jurisdictions',
    anyExperience: 'Any Experience',
    sortHighestRated: 'Sort: Highest Rated ⭐',
    sortExperience: 'Sort: Most Experienced ⚖️',
    sortConsultFee: 'Sort: Fee (Lowest First)',
    sortCasesWon: 'Sort: Most Cases Resolved 🏆',
    sortFeeDesc: 'Sort: Fee (Highest First)',
    verifiedOnly: 'Verified Only',
    bciVerifiedDirectoryBadge: 'Bar Council of India Verified Directory',
    completeBarVerificationBtn: 'Complete Bar Council Verification',
    yearsExperience: 'Years Exp.',
    yearsActive: 'Years Active',
    ratingLabel: 'Rating',
    verifiedBadge: 'Verified',
    pendingBadge: 'Pending',
    per30MinConsultation: 'per 30 min consultation',
    queryingAdvocates: 'Querying certified judicial advocate repository...',
    barEnrollment: 'Bar Enrollment:',
    experienceLabel: 'Experience:',
    appearsBefore: 'Appears before:',
    detailsBtn: 'Details',
    consultBtn: 'Consult',
    viewProfile: 'View Full Profile',
    barVerified: 'Bar Verified',
    verificationInProgress: 'Verification In Progress',
    practiceProfile: 'Practice Profile',
    appearingCourts: 'Appearing Courts',
    availableSchedule: 'Available Schedule',
    initialLegalAdvisoryFee: 'Initial Legal Advisory Fee',
    bookConsultationNow: 'Book Consultation Now',
    advocatesCount: 'Advocates',
    practiceAreaFilter: 'Area:',

    enterCnrOrNumber: 'Enter CNR Number (e.g. JB01-849201-2026) or Case Number (ARB/2026/104)...',
    searchCaseBtn: 'Search Docket',
    caseTrackerTitle: 'Find a Case Matter',
    caseTrackerSubtitle: 'Lookup any High Court, Supreme Court, or District Tribunal proceeding by CNR number, filing party, or case ID. Track hearing timelines and delay risk scores.',
    caseTrackerBadge: 'National Judicial Case Registry & Delay Tracker',
    btnFileNewCasePetition: 'File New Case Petition',
    searchCaseInputPlaceholder: 'Search by CNR, Case ID, Petitioner...',
    allCaseCategories: 'All Case Categories',
    allRiskLevels: 'All Risk Levels',
    criticalDelay: 'Critical Delay ⚠️',
    moderateDelay: 'Moderate Delay',
    lowDelay: 'Low / On Track ✓',
    judicialLookupDesc: 'Supports all 25 High Courts, Supreme Court & District Tribunals',
    sortByDelay: 'Highest Delay Days',
    sortByRecent: 'Most Recent Filing',
    sortByNextHearing: 'Upcoming Hearing Date',
    noCasesFound: 'No Registered Cases in Registry',
    noCasesDesc: 'Search with a valid 16-character Case CNR Number (e.g., from e-Courts cause list) or file a new legal matter to begin tracking.',
    clearSearchQuery: 'Clear Search Query',
    caseStage: 'Stage',
    delayRiskScore: 'Delay Risk',
    nextHearing: 'Next Hearing',
    inspectCaseVault: 'Inspect Case Files',
    searchingCauseLists: 'Searching judicial cause lists and e-filing repositories...',

    myCasesTitleClient: 'My Active Legal Matters',
    myCasesTitleLawyer: 'Assigned Case Matters & Cause List',
    myCasesSubtitleClient: 'Directly track your petitions, next hearing dates, and court notices.',
    myCasesSubtitleLawyer: 'Review pending filings, schedule hearings, and access verified evidence discovery.',
    rule2BannerClient: 'Rule 2: Client Isolation Enforced',
    rule1BannerLawyer: 'Rule 1: Verified Advocate Access Control',
    rule2ClientDesc: 'Active workspace is isolated. Zero-knowledge tenancy guarantees no other client can query your confidential litigation.',
    rule1LawyerDesc: 'Full case files and evidence discovery unlocked for verified counsel.',
    rule1UnverifiedDesc: 'Rule 1 active: Case evidence vaults are locked until Bar Council e-KYC is approved.',
    noActiveCasesYet: 'No Active Cases Filed Yet',
    noActiveCasesDesc: 'You currently have no registered litigation matters in your isolated workspace. File a new petition or consult a verified advocate to begin.',
    btnFileFirstPetition: 'File First Legal Petition',
    btnFileNewPetition: 'File New Petition',
    btnVoiceCaseFiler: 'Voice Case Filing',
    totalCases: 'Total Cases',
    mattersCount: 'Matters',
    aiDelayAnalysis: 'AI Delay Risk Analysis',
    analyzingDelay: 'Analyzing Bench Delays...',
    openIsolatedVault: 'Open Isolated Vault',
    requestAdvocateInspection: 'Request Advocate Inspection',

    delayAnalyticsTitle: 'Reducing Delays Across Indian Courts',
    delayAnalyticsSubtitle: 'Comparative benchmarks and workflow compression models engineered to streamline case management, document discovery, and hearing preparedness.',
    delayAnalyticsBadge: 'Judicial Acceleration Intelligence',
    delayDisclaimer: '*Notice: All timeline estimates are analytical benchmark simulations for workflow planning. Actual judicial disposal rests solely within the discretion of the presiding judicial bench.',
    targetDelayReduction: 'Target Delay Reduction',
    timelineCompression: 'Timeline Compression',
    hearingTrackingSpeed: 'Hearing Tracking Speed',
    verifiedAdvocatesStat: 'Verified Bar Advocates',
    litigationMattersActive: 'Litigation Matters Active',
    onboarded: 'Onboarded',
    realTime: 'Real-Time',
    disposalTimelinesTitle: 'Disposal Timelines: Traditional vs JusticeBridge',
    disposalTimelinesDesc: 'Empirical disposal benchmarks recorded across High Courts and specialized tribunals.',
    traditional: 'Traditional',
    delayCut: 'Delay Cut',
    interactiveCalculatorTitle: 'Estimate Case Acceleration',
    interactiveCalculatorDesc: 'Calculate the expected timeline compression for your pending or prospective litigation.',
    litigationType: 'Litigation Type',
    courtTribunal: 'Court / Tribunal',
    traditionalDisposalTime: 'Traditional Expected Disposal Time',
    timelineReduction: 'Timeline Reduction',
    estimatedDisposal: 'Estimated Disposal',
    estimatedTimeSaved: 'Estimated time saved',
    monthsCount: 'Months',

    membershipTitle: 'JusticeBridge Membership Tiers',
    membershipSubtitle: 'Designed to maintain high-integrity advocate verification and secure isolated infrastructure for litigants.',
    transparentMembership: 'Transparent Judicial Membership',
    clientJusticePass: 'Client Justice Pass',
    annualClientMembership: 'Annual Client Membership',
    advocatePracticePass: 'Advocate Practice Pass',
    monthlyAdvocateMembership: 'Monthly Advocate Practice Membership',
    yourAccountTier: 'Your Account Tier',
    perYearGst: '/ year (18% GST incl.)',
    perMonthGst: '/ month (18% GST incl.)',
    subscribeClientBtn: 'Subscribe as Client (₹2,999/yr)',
    subscribeAdvocateBtn: 'Subscribe as Advocate (₹3,999/mo)',

    legalDocEngineBadge: 'Real Legal Document Engine',
    legalDocGeneratorTitle: 'Automated Legal Document Generator',
    legalDocGeneratorSubtitle: 'Generate, customize, and export court-ready legal notices, non-disclosure agreements, affidavits, and lease deeds into downloadable PDFs instantly.',
    selectDocType: 'Select Legal Document Type',

    // Advocate Performance & Grading Slide
    grading: 'Grading & Performance',
    lawyerGradingTitle: 'Advocate Performance, Cases & Grading Index',
    lawyerGradingSubtitle: 'Transparent litigation track records: verified case disposal stats, win rates, settlement compromises, ongoing trials, and certified client ratings with grading badges.',
    casesTakenTotal: 'Total Cases Handled',
    casesWon: 'Cases Won',
    casesLost: 'Cases Lost',
    casesCompromised: 'Compromised / Settled',
    casesOngoing: 'Still Going On',
    winRate: 'Win Rate',
    compromiseRate: 'Compromise / Settlement Rate',
    clientReviews: 'Client Reviews & Ratings',
    gradingStarsBadges: 'Grading Stars & Badges',
    writeReviewBtn: 'Write a Client Review',
    submitReview: 'Submit Case Review & Rating',
    ratingScore: 'Rating Score',
    caseOutcomeLabel: 'Case Outcome',
    verifiedLitigantBadge: 'Verified Litigant Client',
    allOutcomes: 'All Case Outcomes',
    gradeTier: 'Advocate Grading Tier',
    originalAdvocatesTitle: 'Original & Verified Bar Council Advocates',
    performanceBreakdown: 'Performance Breakdown',
    reviewPlaceholder: 'Share your experience with this advocate (e.g. courtroom preparedness, strategy, speed of disposal, communication)...',
    courtTribunalLabel: 'Court / Tribunal Name',
    shareFeedback: 'Leave Verified Case Feedback',
    yourRating: 'Your Rating (1 to 5 Stars)',
    caseTypeLabel: 'Case Category',
    selectOutcome: 'Select Legal Outcome',
    outcomeWon: 'Won (Favorable Judgment/Order)',
    outcomeCompromised: 'Compromised / Settled (Mediation/Lok Adalat)',
    outcomeOngoing: 'Still Going On (In Trial/Arguments)',
    outcomeLost: 'Lost (Dismissed/Unfavorable)',
    gradeAplusBadge: 'Grade A+ • Senior Master Litigator',
    gradeABadge: 'Grade A • High-Efficiency Counsel',
    gradeBplusBadge: 'Grade B+ • Fast-Track Advocate',
    gradeBBadge: 'Grade B • Active Trial Practitioner',
    viewGradingSlide: 'View Grading & Performance Slide',
    performanceStats: 'Litigation Performance Statistics',
    clientReviewsCount: 'Client Reviews',
    badgesTitle: 'Earned Excellence Badges',
    allGrades: 'All Grades (A+, A, B+, B)',
    sortByGrade: 'Sort: Highest Grade (A+ -> B)',
    sortByWinRate: 'Sort: Highest Win Rate 🏆',
    sortByCompromised: 'Sort: Most Compromised / Settled 🤝',

    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy (DPDP Act 2023)',
    refunds: 'Refund & Cancellation Policy',
    grievanceContact: 'Grievance Officer & Contact',
    copyright: '© 2026 JusticeBridge Legal Technologies. All rights reserved.',
    platformServices: 'Platform Services',
    legalCompliance: 'Legal & Compliance',
    merchantSupport: 'Merchant Contact & Support',
    verifiedAdvocatesDir: 'Verified Advocate Directory',
    nationalCaseRegistry: 'National Case Registry & CNR Tracker',
    multiTenantVault: 'Multi-Tenant Evidence Vault',
    automatedNoticeGen: 'Automated Legal Notice Generator',
    aiStatutoryCounsel: 'AI Statutory Counsel (Gemini 2.5)',
    dpdpActPrivacy: 'Privacy Policy (DPDP Act 2023)',
    refundCancelPolicy: 'Refund & Cancellation Policy',
    grievanceOfficer: 'Grievance Officer & Contact',
    operationalHours: 'Mon – Sat, 9:00 AM – 6:00 PM IST'
  },

  ta: {
    overview: 'கண்ணோட்டம்',
    findLawyer: 'வழக்கறிஞரைத் தேடுங்கள்',
    findCase: 'வழக்கைத் தேடுங்கள்',
    myCases: 'என் வழக்கு பெட்டகம்',
    delayAnalytics: 'தாமத பகுப்பாய்வு',
    legalDocs: 'சட்ட ஆவணங்கள்',
    aiCounsel: 'AI சட்ட ஆலோசகர்',
    voiceCaseFiler: 'குரல் மூலம் வழக்கு பதிவு (அனைத்து மக்களுக்கும்)',
    consultations: 'ஆலோசனைகள்',
    membership: 'உறுப்பினர் கட்டணம்',
    tagline: 'வழக்கறிஞர்களை இணைத்தல் • குடிமக்களுக்கு அதிகாரம் • தாமதங்களை குறைத்தல்',

    chooseLanguage: 'மொழியைத் தேர்வுசெய்க / உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும்',
    availableIn24: '24 இந்திய மொழிகளில் குரல் வழி சட்ட உதவி மற்றும் வழக்கு பதிவு வசதி',

    membershipNotification: 'உறுப்பினர் கட்டண அறிவிப்பு',
    clientAccount: 'வாடிக்கையாளர் கணக்கு',
    advocateAccount: 'வழக்கறிஞர் தொழில் கணக்கு',
    clientMembershipMsg: 'வாடிக்கையாளர்கள்: தனிப்பயனாக்கப்பட்ட வழக்கு கண்காணிப்பு, பாதுகாப்பான ஆவண பெட்டகம் மற்றும் வழக்கறிஞர் ஆலோசனைகளை அணுக ஆண்டு உறுப்பினர் கட்டணம் ₹ 2,999 செலுத்தவும்.',
    advocateMembershipMsg: 'வழக்கறிஞர்கள்: வாடிக்கையாளர் வழக்கு கோப்புகளைப் பார்க்கவும் மற்றும் சந்திப்புகளை ஏற்கவும் மாத சந்தா ₹ 3,999 செலுத்தவும்.',
    payClientFeeBtn: 'கட்டணம் ₹ 2,999 / ஆண்டு',
    payAdvocateFeeBtn: 'கட்டணம் ₹ 3,999 / மாதம்',
    activeMembership: 'செயலில் உள்ள உறுப்பினர் சந்தா',

    heroBadge: 'நீதித்துறை தொழில்நுட்ப தளம் • பார் கவுன்சில் சரிபார்க்கப்பட்ட வழக்கறிஞர்கள்',
    heroHeadline1: 'வழக்கறிஞர்களை இணைத்தல்.',
    heroHeadline2: 'குடிமக்களுக்கு அதிகாரம்.',
    heroHeadline3: 'நீதிமன்ற தாமதங்களை தவிர்த்தல்.',
    heroSubtitle: 'இந்தியாவின் முன்னணி சட்ட தளம்: பார் கவுன்சில் சரிபார்க்கப்பட்ட வழக்கறிஞர்களுடன் குடிமக்களை இணைக்கிறது, பாதுகாப்பான வழக்கு பெட்டகம் மற்றும் 24 இந்திய மொழிகளில் குரல் மூலம் வழக்கு பதிவு செய்யும் வசதியை வழங்குகிறது.',
    btnSpeakToFileCase: 'பேசி வழக்கு பதிவு செய்க (Voice E-Filing)',
    btnFindLawyer: 'வழக்கறிஞரைத் தேடுங்கள்',
    btnFindCase: 'வழக்கைத் தேடுங்கள்',
    btnClientVault: 'என் வழக்கு பெட்டகம்',
    btnJoinAdvocate: 'வழக்கறிஞராக இணையுங்கள்',
    heroQuickSearchPlaceholder: 'வழக்கு CNR எண் (எ.கா. DLHC01-004182-2026), பெயர் அல்லது நீதிமன்றம் மூலம் தேடுங்கள்...',
    quickLookup: 'விரைவு தேடல்',
    openAdvocateVault: 'வழக்கறிஞர் பெட்டகத்தை திறக்கவும்',
    viewMyIsolatedCases: 'என் பாதுகாப்பான வழக்குகளைப் பார்க்கவும்',

    pillar1Title: 'சரிபார்க்கப்பட்ட வழக்கறிஞர்கள்',
    pillar1Desc: 'அனைத்து வழக்கறிஞர்களும் மாநில பார் கவுன்சில் மூலம் சரிபார்க்கப்படுகிறார்கள். சரிபார்க்கப்பட்ட வழக்கறிஞர்கள் மட்டுமே வழக்குகளை அணுக முடியும்.',
    pillar2Title: 'முழுமையான வழக்கு தனிமைப்படுத்தல்',
    pillar2Desc: 'வங்கி தரத்திலான பாதுகாப்பு. ஒரு வாடிக்கையாளரின் வழக்கு கோப்புகளை மற்றவர்கள் ஒருபோதும் பார்க்க முடியாது.',
    pillar3Title: 'நீதிமன்ற தாமதங்களை குறைத்தல்',
    pillar3Desc: 'AI தொழில்நுட்பம் மூலம் விசாரணைகளை விரைவுபடுத்தி 68% வரை தேவையில்லாத தாமதங்களை தவிர்க்கிறது.',
    strictRule1: 'விதி 1: கடுமையான அணுகல் கட்டுப்பாடு',
    strictRule2: 'விதி 2: முழுமையான ரகசிய எல்லை',
    daysSaved: 'ஒரு வழக்குக்கு சராசரியாக 84 நாட்கள் சேமிப்பு',

    advocateDirectory: 'வழக்கறிஞர்கள் அடைவு',
    connectVerifiedCounsels: 'உயர் நீதிமன்றம் மற்றும் உச்ச நீதிமன்ற வழக்கறிஞர்களுடன் இணையுங்கள்',
    filterAdvocatesDesc: 'வணிக, சிவில், குற்றவியல் மற்றும் சைபர் சட்ட மூத்த வழக்கறிஞர்களைத் தேடி நேரடியாக ஆலோசனை முன்பதிவு செய்யுங்கள்.',
    browseAdvocatesBtn: 'சரிபார்க்கப்பட்ட வழக்கறிஞர்களைப் பார்க்கவும்',
    caseTrackingDelayMonitor: 'வழக்கு கண்காணிப்பு & தாமத பகுப்பாய்வு',
    trackLitigationsTitle: 'வழக்குகள், CNR எண்கள் & தாமத அபாயக் குறியீட்டைக் கண்காணிக்கவும்',
    trackLitigationsDesc: 'உயர் நீதிமன்றங்கள் மற்றும் தீர்ப்பாயங்களில் உள்ள வழக்குகளை உடனடி தேடல் மூலம் ஆரம்ப தாக்கல் முதல் இறுதி தீர்ப்பு வரை கண்காணிக்கவும்.',
    searchCaseByCnrBtn: 'CNR மூலம் வழக்குகளைத் தேடுங்கள்',
    judicialDataSecurity: 'நீதித்துறை தரவு பாதுகாப்பு & இணக்கம்',
    engineeredForConfidentiality: 'கடுமையான சட்ட ரகசியத்தன்மைக்காக வடிவமைக்கப்பட்டது',
    securityRule1Title: 'விதி 1: சரிபார்க்கப்பட்ட வழக்கறிஞர்கள் மட்டுமே கோப்புகளைப் பார்க்க முடியும்',
    securityRule1Desc: 'சரிபார்க்கப்படாதவர்கள் வழக்கு ஆவணங்களை அணுக முயற்சிக்கும்போது 403 Forbidden பிழை வழங்கப்படுகிறது.',
    securityRule2Title: 'விதி 2: முழுமையான வாடிக்கையாளர் தனிமைப்படுத்தல்',
    securityRule2Desc: 'ரோகன் வர்மா பிரியா நாயரின் சொத்து தகராறை பார்க்கவோ அல்லது தேடவோ முடியாது.',

    searchPlaceholder: 'வழக்கறிஞர் பெயர், துறை அல்லது பார் கவுன்சில் எண் மூலம் தேடுங்கள்...',
    filterByCourt: 'அனைத்து நீதிமன்றங்கள்',
    filterByCity: 'அனைத்து நகரங்கள்',
    filterByPractice: 'அனைத்து சட்டப் பிரிவுகள்',
    consultFee: 'ஆலோசனை கட்டணம்',
    bookConsultation: 'ஆலோசனை முன்பதிவு',
    verifiedAdvocate: 'சரிபார்க்கப்பட்ட வழக்கறிஞர்',

    noAdvocatesFound: 'வழக்கறிஞர்கள் யாரும் கிடைக்கவில்லை',
    noAdvocatesDesc: 'உங்கள் தேடல் சொல்லை மாற்றவும், வேறு சட்டப் பிரிவுகளைத் தேர்ந்தெடுக்கவும் அல்லது சரிபார்ப்பு வடிப்பானை மாற்றவும்.',
    resetFilters: 'வடிப்பான்களை மீட்டமைக்க',
    allCourtsJurisdictions: 'அனைத்து நீதிமன்றங்கள் & அதிகார வரம்புகள்',
    anyExperience: 'அனைத்து அனுபவம்',
    sortHighestRated: 'வரிசை: அதிக மதிப்பீடு ⭐',
    sortExperience: 'வரிசை: அதிக அனுபவம் ⚖️',
    sortConsultFee: 'வரிசை: குறைந்த கட்டணம்',
    sortCasesWon: 'வரிசை: அதிக தீர்க்கப்பட்ட வழக்குகள் 🏆',
    sortFeeDesc: 'வரிசை: அதிக கட்டணம்',
    verifiedOnly: 'சரிபார்க்கப்பட்டவர்கள் மட்டும்',
    bciVerifiedDirectoryBadge: 'இந்திய பார் கவுன்சில் சரிபார்க்கப்பட்ட அடைவு',
    completeBarVerificationBtn: 'பார் கவுன்சில் சரிபார்ப்பை முடிக்கவும்',
    yearsExperience: 'ஆண்டுகள் அனுபவம்',
    yearsActive: 'ஆண்டுகள் செயலில்',
    ratingLabel: 'மதிப்பீடு',
    verifiedBadge: 'சரிபார்க்கப்பட்டது',
    pendingBadge: 'நிலுவையில் உள்ளது',
    per30MinConsultation: '30 நிமிட ஆலோசனைக்கு',
    queryingAdvocates: 'சான்றளிக்கப்பட்ட நீதித்துறை வழக்கறிஞர்களைத் தேடுகிறது...',
    barEnrollment: 'பார் கவுன்சில் பதிவு:',
    experienceLabel: 'அனுபவம்:',
    appearsBefore: 'முன்னிலையாகும் நீதிமன்றங்கள்:',
    detailsBtn: 'விவரங்கள்',
    consultBtn: 'ஆலோசனை',
    viewProfile: 'முழு சுயவிவரத்தைக் காண்க',
    barVerified: 'பார் சரிபார்க்கப்பட்டது',
    verificationInProgress: 'சரிபார்ப்பு பரிசீலனையில் உள்ளது',
    practiceProfile: 'பயிற்சி சுயவிவரம்',
    appearingCourts: 'முன்னிலையாகும் நீதிமன்றங்கள்',
    availableSchedule: 'கிடைக்கும் அட்டவணை',
    initialLegalAdvisoryFee: 'ஆரம்ப சட்ட ஆலோசனை கட்டணம்',
    bookConsultationNow: 'இப்போதே ஆலோசனை முன்பதிவு செய்க',
    advocatesCount: 'வழக்கறிஞர்கள்',
    practiceAreaFilter: 'சட்டப் பிரிவு:',

    enterCnrOrNumber: 'CNR எண் அல்லது வழக்கு எண்ணை உள்ளிடவும்...',
    searchCaseBtn: 'வழக்கு நிலையை தேடுங்கள்',
    caseTrackerTitle: 'வழக்கைத் தேடுங்கள்',
    caseTrackerSubtitle: 'உயர் நீதிமன்றம், உச்ச நீதிமன்றம் அல்லது தீர்ப்பாய வழக்குகளை CNR எண், தரப்பினர் பெயர் அல்லது வழக்கு ஐடி மூலம் தேடுங்கள். விசாரணை காலவரிசை மற்றும் தாமத அபாயத்தை அறியவும்.',
    caseTrackerBadge: 'தேசிய நீதித்துறை வழக்கு பதிவேடு & தாமத கண்காணிப்பாளர்',
    btnFileNewCasePetition: 'புதிய வழக்கு மனு தாக்கல் செய்க',
    searchCaseInputPlaceholder: 'CNR எண், வழக்கு ஐடி அல்லது மனுதாரர் பெயர் மூலம் தேடுங்கள்...',
    allCaseCategories: 'அனைத்து வழக்கு வகைகள்',
    allRiskLevels: 'அனைத்து அபாய நிலைகள்',
    criticalDelay: 'அதிக தாமதம் ⚠️',
    moderateDelay: 'மிதமான தாமதம்',
    lowDelay: 'குறைந்த தாமதம் / சரியான பாதையில் ✓',
    judicialLookupDesc: '25 உயர் நீதிமன்றங்கள், உச்ச நீதிமன்றம் மற்றும் மாவட்ட தீர்ப்பாயங்களை ஆதரிக்கிறது',
    sortByDelay: 'அதிக தாமத நாட்கள்',
    sortByRecent: 'சமீபத்திய தாக்கல்',
    sortByNextHearing: 'அடுத்த விசாரணை தேதி',
    noCasesFound: 'பதிவேட்டில் வழக்குகள் எதுவும் கிடைக்கவில்லை',
    noCasesDesc: '16 இலக்க சரியான CNR எண்ணை உள்ளிட்டு தேடவும் அல்லது புதிய சட்ட விவகாரத்தை பதிவு செய்யவும்.',
    clearSearchQuery: 'தேடலை அழிக்கவும்',
    caseStage: 'வழக்கு நிலை',
    delayRiskScore: 'தாமத அபாயம்',
    nextHearing: 'அடுத்த விசாரணை',
    inspectCaseVault: 'வழக்கு கோப்புகளை திறக்கவும்',
    searchingCauseLists: 'நீதிமன்ற வழக்கு பட்டியல்கள் மற்றும் மின்-தாக்கல் களஞ்சியங்களை தேடுகிறது...',

    myCasesTitleClient: 'என் செயலில் உள்ள வழக்குகள்',
    myCasesTitleLawyer: 'ஒதுக்கப்பட்ட வழக்குகள் & நீதிமன்ற பட்டியல்',
    myCasesSubtitleClient: 'உங்கள் மனுக்கள், அடுத்த விசாரணை தேதிகள் மற்றும் நீதிமன்ற அறிவிப்புகளை நேரடியாக கண்காணிக்கவும்.',
    myCasesSubtitleLawyer: 'நிலுவையில் உள்ள தாக்கல்களை மதிப்பாய்வு செய்யவும் மற்றும் சான்றுகளை அணுகவும்.',
    rule2BannerClient: 'விதி 2: வாடிக்கையாளர் தனிமைப்படுத்தல் செயல்படுத்தப்பட்டுள்ளது',
    rule1BannerLawyer: 'விதி 1: சரிபார்க்கப்பட்ட வழக்கறிஞர் அணுகல் கட்டுப்பாடு',
    rule2ClientDesc: 'உங்கள் வழக்கு பகுதி தனிமைப்படுத்தப்பட்டுள்ளது. உங்கள் ரகசிய வழக்குகளை வேறு யாரும் அணுக முடியாது.',
    rule1LawyerDesc: 'முழு வழக்கு கோப்புகள் மற்றும் சான்றுகள் திறக்கப்பட்டுள்ளன.',
    rule1UnverifiedDesc: 'விதி 1 செயலில் உள்ளது: பார் கவுன்சில் சரிபார்ப்பு முடியும் வரை வழக்கு கோப்புகள் பூட்டப்பட்டுள்ளன.',
    noActiveCasesYet: 'செயலில் உள்ள வழக்குகள் எதுவும் இதுவரை தாக்கல் செய்யப்படவில்லை',
    noActiveCasesDesc: 'உங்கள் பாதுகாப்பான பணியிடத்தில் வழக்குகள் எதுவும் இல்லை. புதிய மனுவை தாக்கல் செய்யவும் அல்லது வழக்கறிஞரை அணுகவும்.',
    btnFileFirstPetition: 'முதல் சட்ட மனுவை தாக்கல் செய்க',
    btnFileNewPetition: 'புதிய மனு தாக்கல் செய்க',
    btnVoiceCaseFiler: 'குரல் மூலம் வழக்கு பதிவு',
    totalCases: 'மொத்த வழக்குகள்',
    mattersCount: 'வழக்குகள்',
    aiDelayAnalysis: 'AI தாமத அபாய பகுப்பாய்வு',
    analyzingDelay: 'நீதிமன்ற தாமதங்களை பகுப்பாய்வு செய்கிறது...',
    openIsolatedVault: 'பாதுகாப்பான பெட்டகத்தை திறக்கவும்',
    requestAdvocateInspection: 'வழக்கறிஞர் ஆய்வைக் கோருங்கள்',

    delayAnalyticsTitle: 'இந்திய நீதிமன்றங்களில் தாமதங்களை குறைத்தல்',
    delayAnalyticsSubtitle: 'வழக்கு மேலாண்மை, ஆவண கண்டறிதல் மற்றும் விசாரணை தயார்நிலையை ஒழுங்குபடுத்துவதற்கான பகுப்பாய்வு மாதிரிகள்.',
    delayAnalyticsBadge: 'நீதித்துறை முடுக்க நுண்ணறிவு',
    delayDisclaimer: '*அறிவிப்பு: அனைத்து கால மதிப்பீடுகளும் பணி திட்டமிடலுக்கான மாதிரி உருவகப்படுத்துதல்களாகும். உண்மையான முடிவு நீதிமன்ற அமர்வை சார்ந்தது.',
    targetDelayReduction: 'இலக்கு தாமத குறைப்பு',
    timelineCompression: 'காலவரிசை சுருக்கம்',
    hearingTrackingSpeed: 'விசாரணை கண்காணிப்பு வேகம்',
    verifiedAdvocatesStat: 'சரிபார்க்கப்பட்ட வழக்கறிஞர்கள்',
    litigationMattersActive: 'செயலில் உள்ள வழக்குகள்',
    onboarded: 'இணைக்கப்பட்டுள்ளனர்',
    realTime: 'நிகழ்நேரம்',
    disposalTimelinesTitle: 'வழக்கு தீர்வு காலவரிசை: பாரம்பரியம் vs JusticeBridge',
    disposalTimelinesDesc: 'உயர் நீதிமன்றங்கள் மற்றும் தீர்ப்பாயங்களில் பதிவு செய்யப்பட்ட தீர்வு ஒப்பீடுகள்.',
    traditional: 'பாரம்பரிய முறை',
    delayCut: 'தாமத குறைப்பு',
    interactiveCalculatorTitle: 'வழக்கு விரைவுபடுத்தல் கால கணிப்பொறி',
    interactiveCalculatorDesc: 'உங்கள் வழக்குக்கான எதிர்பார்க்கப்படும் கால சுருக்கத்தை கணக்கிடுங்கள்.',
    litigationType: 'வழக்கு வகை',
    courtTribunal: 'நீதிமன்றம் / தீர்ப்பாயம்',
    traditionalDisposalTime: 'பாரம்பரிய வழக்கமான தீர்வு காலம்',
    timelineReduction: 'கால அளவு குறைப்பு',
    estimatedDisposal: 'எதிர்பார்க்கப்படும் புதிய தீர்வு காலம்',
    estimatedTimeSaved: 'சேமிக்கப்படும் தோராய காலம்',
    monthsCount: 'மாதங்கள்',

    membershipTitle: 'JusticeBridge உறுப்பினர் திட்டங்கள்',
    membershipSubtitle: 'உயர் ஒருமைப்பாடு வழக்கறிஞர் சரிபார்ப்பு மற்றும் வழக்குதாரர்களுக்கு பாதுகாப்பான தனிமைப்படுத்தப்பட்ட உள்கட்டமைப்பை பராமரிக்க வடிவமைக்கப்பட்டுள்ளது.',
    transparentMembership: 'வெளிப்படையான நீதித்துறை உறுப்பினர் சந்தா',
    clientJusticePass: 'வாடிக்கையாளர் நீதி பாஸ்',
    annualClientMembership: 'ஆண்டு வாடிக்கையாளர் உறுப்பினர் திட்டம்',
    advocatePracticePass: 'வழக்கறிஞர் தொழில் பாஸ்',
    monthlyAdvocateMembership: 'மாதாந்திர வழக்கறிஞர் தொழில் உறுப்பினர் திட்டம்',
    yourAccountTier: 'உங்கள் கணக்கு நிலை',
    perYearGst: '/ ஆண்டு (18% ஜிஎஸ்டி உட்பட)',
    perMonthGst: '/ மாதம் (18% ஜிஎஸ்டி உட்பட)',
    subscribeClientBtn: 'வாடிக்கையாளராக இணையுங்கள் (₹2,999/ஆண்டு)',
    subscribeAdvocateBtn: 'வழக்கறிஞராக இணையுங்கள் (₹3,999/மாதம்)',

    legalDocEngineBadge: 'உண்மையான சட்ட ஆவண இயந்திரம்',
    legalDocGeneratorTitle: 'தானியங்கி சட்ட ஆவண ஜெனரேட்டர்',
    legalDocGeneratorSubtitle: 'நீதிமன்றத்திற்கு ஏற்ற சட்ட அறிவிப்புகள், ரகசியத்தன்மை ஒப்பந்தங்கள், உறுதிமொழிப் பத்திரங்கள் மற்றும் வாடகை ஒப்பந்தங்களை உடனடியாக PDF வடிவில் பதிவிறக்கம் செய்யுங்கள்.',
    selectDocType: 'சட்ட ஆவண வகையைத் தேர்ந்தெடுக்கவும்',

    // Advocate Performance & Grading Slide
    grading: 'தரவரிசை & செயல்திறன்',
    lawyerGradingTitle: 'வழக்கறிஞர் செயல்திறன், வழக்குகள் மற்றும் தரவரிசை பட்டியல்',
    lawyerGradingSubtitle: 'முழுமையான வழக்கறிஞர் வரலாற்று விவரங்கள்: தீர்க்கப்பட்ட வழக்குகள், வெற்றி விகிதம், சமரச தீர்வுகள், நடந்து கொண்டிருக்கும் வழக்குகள், வாடிக்கையாளர் மதிப்பீடுகள் மற்றும் தர பேட்ஜ்கள்.',
    casesTakenTotal: 'எடுத்த மொத்த வழக்குகள்',
    casesWon: 'வென்ற வழக்குகள்',
    casesLost: 'தோற்ற வழக்குகள்',
    casesCompromised: 'சமரசம் / தீர்க்கப்பட்டவை',
    casesOngoing: 'இன்னும் தொடரும் வழக்குகள்',
    winRate: 'வெற்றி விகிதம்',
    compromiseRate: 'சமரச தீர்வு விகிதம்',
    clientReviews: 'வாடிக்கையாளர் மதிப்புரைகள் & மதிப்பீடுகள்',
    gradingStarsBadges: 'தர நட்சத்திரங்கள் & பதக்கங்கள்',
    writeReviewBtn: 'மதிப்புரை எழுதவும்',
    submitReview: 'மதிப்புரையைச் சமர்ப்பிக்கவும்',
    ratingScore: 'மதிப்பீட்டு புள்ளி',
    caseOutcomeLabel: 'வழக்கு முடிவு',
    verifiedLitigantBadge: 'சரிபார்க்கப்பட்ட வாடிக்கையாளர்',
    allOutcomes: 'அனைத்து வழக்கு முடிவுகள்',
    gradeTier: 'வழக்கறிஞர் தர நிலை',
    originalAdvocatesTitle: 'அசல் & பார் கவுன்சில் சரிபார்க்கப்பட்ட வழக்கறிஞர்கள்',
    performanceBreakdown: 'செயல்திறன் முறிவு',
    reviewPlaceholder: 'இந்த வழக்கறிஞருடனான உங்கள் அனுபவத்தைப் பகிர்ந்து கொள்ளுங்கள் (நீதிமன்ற வாதம், வேகம், தொடர்பு)...',
    courtTribunalLabel: 'நீதிமன்றம் / தீர்ப்பாயம்',
    shareFeedback: 'சரிபார்க்கப்பட்ட கருத்தைப் பகிரவும்',
    yourRating: 'உங்கள் மதிப்பீடு (1 முதல் 5 நட்சத்திரங்கள்)',
    caseTypeLabel: 'வழக்கு பிரிவு',
    selectOutcome: 'சட்ட முடிவைத் தேர்ந்தெடுக்கவும்',
    outcomeWon: 'வெற்றி (சாதகமான தீர்ப்பு)',
    outcomeCompromised: 'சமரசம் / தீர்க்கப்பட்டது (மத்தியஸ்தம் / லோக் அதாலத்)',
    outcomeOngoing: 'இன்னும் தொடர்கிறது (விசாரணையில் உள்ளது)',
    outcomeLost: 'தோல்வி (தள்ளுபடி செய்யப்பட்டது)',
    gradeAplusBadge: 'கிரேடு A+ • மூத்த தலைமை வழக்கறிஞர்',
    gradeABadge: 'கிரேடு A • உயர் திறன் வழக்கறிஞர்',
    gradeBplusBadge: 'கிரேடு B+ • விரைவு வழக்கு வழக்கறிஞர்',
    gradeBBadge: 'கிரேடு B • செயலில் உள்ள வழக்கறிஞர்',
    viewGradingSlide: 'தரவரிசை மற்றும் செயல்திறன் ஸ்லைடைப் பார்க்கவும்',
    performanceStats: 'வழக்கு செயல்திறன் புள்ளிவிவரங்கள்',
    clientReviewsCount: 'வாடிக்கையாளர் மதிப்புரைகள்',
    badgesTitle: 'பெற்ற சிறப்பு பதக்கங்கள்',
    allGrades: 'அனைத்து தரங்கள் (A+, A, B+, B)',
    sortByGrade: 'வரிசை: அதிக தரம் (A+ -> B)',
    sortByWinRate: 'வரிசை: அதிக வெற்றி விகிதம் 🏆',
    sortByCompromised: 'வரிசை: அதிக சமரசம் / தீர்வு 🤝',

    terms: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
    privacy: 'தனியுரிமைக் கொள்கை (DPDP சட்டம்)',
    refunds: 'ரத்து மற்றும் பணத்தைத் திரும்பப்பெறும் கொள்கை',
    grievanceContact: 'வாடிக்கையாளர் குறைதீர்க்கும் மையம்',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    platformServices: 'தள சேவைகள்',
    legalCompliance: 'சட்டம் & இணக்கம்',
    merchantSupport: 'வணிக தொடர்பு & ஆதரவு',
    verifiedAdvocatesDir: 'சரிபார்க்கப்பட்ட வழக்கறிஞர்கள் அடைவு',
    nationalCaseRegistry: 'தேசிய வழக்கு பதிவேடு & CNR டிராக்கர்',
    multiTenantVault: 'பாதுகாப்பான பல பயனர் சான்று பெட்டகம்',
    automatedNoticeGen: 'தானியங்கி சட்ட அறிவிப்பு ஜெனரேட்டர்',
    aiStatutoryCounsel: 'AI சட்ட ஆலோசகர் (Gemini 2.5)',
    dpdpActPrivacy: 'தனியுரிமைக் கொள்கை (DPDP சட்டம் 2023)',
    refundCancelPolicy: 'ரத்து மற்றும் பணத்தைத் திரும்பப்பெறும் கொள்கை',
    grievanceOfficer: 'குறைதீர்க்கும் அதிகாரி & தொடர்பு',
    operationalHours: 'திங்கள் - சனி, காலை 9:00 - மாலை 6:00 IST'
  },

  te: {
    overview: 'ముఖ్య వివరాలు',
    findLawyer: 'న్యాయవాదిని కనుగొనండి',
    findCase: 'కేస్ శోధన',
    myCases: 'నా కేసులు',
    delayAnalytics: 'కేస్ ఆలస్య విశ్లేషణ',
    legalDocs: 'చట్టపరమైన పత్రాలు',
    aiCounsel: 'AI న్యాయ సలహాదారు',
    voiceCaseFiler: 'వాయిస్ కేస్ ఫైలింగ్ (ప్రజలందరికీ)',
    consultations: 'సమావేశాలు',
    membership: 'సభ్యత్వం',
    tagline: 'న్యాయవాదులను అనుసంధానించడం • పౌరులను బలోపేతం చేయడం • ఆలస్యాలను తగ్గించడం',

    chooseLanguage: 'భాషను ఎంచుకోండి / మీ మాతృభాషను ఎంచుకోండి',
    availableIn24: '24 భారతీయ భాషల్లో వాయిస్ కేస్ ఫైలింగ్ మరియు న్యాయ సేవలు అందుబాటులో ఉన్నాయి',

    membershipNotification: 'సభ్యత్వ రుసుము నోటిఫికేషన్',
    clientAccount: 'కక్షిదారు ఖాతా',
    advocateAccount: 'న్యాయవాది ప్రాక్టీస్ ఖాతా',
    clientMembershipMsg: 'కక్షిదారులు: సురక్షితమైన కేస్ ట్రాకింగ్, ఎన్‌క్రిప్టెడ్ పత్రాల వాల్ట్ మరియు న్యాయవాదుల సంప్రదింపులను పొందడానికి సంవత్సర సభ్యత్వ రుసుము ₹ 2,999 చెల్లించండి.',
    advocateMembershipMsg: 'న్యాయవాదులు: క్లయింట్ కేసు ఫైళ్లను పరిశీలించడానికి మరియు అపాయింట్‌మెంట్‌లను స్వీకరించడానికి నెలవారీ రుసుము ₹ 3,999 చెల్లించండి.',
    payClientFeeBtn: 'చెల్లించండి ₹ 2,999 / సంవత్సరం',
    payAdvocateFeeBtn: 'చెల్లించండి ₹ 3,999 / నెలకు',
    activeMembership: 'యాక్టివ్ మెంబర్‌షిప్',

    heroBadge: 'న్యాయ సాంకేతిక వేదిక • బార్ కౌన్సిల్ ధృవీకరించబడిన న్యాయవాదులు',
    heroHeadline1: 'న్యాయవాదుల అనుసంధానం.',
    heroHeadline2: 'పౌరుల సాధికారత.',
    heroHeadline3: 'కోర్టు ఆలస్యాల నిర్మూలన.',
    heroSubtitle: 'భారతదేశపు అగ్రగామి న్యాయ వేదిక: ధృవీకరించబడిన న్యాయవాదులతో కక్షిదారులను అనుసంధానిస్తుంది, రహస్య కేసు పత్రాలను భద్రపరుస్తుంది మరియు 24 భారతీయ భాషల్లో మాట్లాడి కేసు నమోదు చేసే సౌకర్యాన్ని కల్పిస్తుంది.',
    btnSpeakToFileCase: 'మాట్లాడి కేసు నమోదు చేయండి (Voice E-Filing)',
    btnFindLawyer: 'న్యాయవాదిని కనుగొనండి',
    btnFindCase: 'కేస్ శోధన',
    btnClientVault: 'నా కేసుల వాల్ట్',
    btnJoinAdvocate: 'న్యాయవాదిగా చేరండి',
    heroQuickSearchPlaceholder: 'కేసు CNR నంబర్ (ఉదా: DLHC01-004182-2026), శీర్షిక లేదా కోర్టు ద్వారా వెతకండి...',
    quickLookup: 'త్వరిత శోధన',
    openAdvocateVault: 'న్యాయవాది వాల్ట్ తెరవండి',
    viewMyIsolatedCases: 'నా సురక్షిత కేసులను చూడండి',

    pillar1Title: 'ధృవీకరించబడిన న్యాయవాదులు',
    pillar1Desc: 'ప్రతి న్యాయవాది ప్రొఫైల్ రాష్ట్ర బార్ కౌన్సిల్ ద్వారా ధృవీకరించబడుతుంది. ధృవీకరించబడిన న్యాయవాదులు మాత్రమే కేసు పత్రాలను చూడగలరు.',
    pillar2Title: 'పూర్తి కక్షిదారు గోప్యత',
    pillar2Desc: 'బ్యాంక్-గ్రేడ్ భద్రతా నిర్మాణం. ఒక కక్షిదారుని పత్రాలు మరొకరికి ఏమాత్రం కనిపించకుండా పూర్తి రక్షణ ఉంటుంది.',
    pillar3Title: 'కోర్టు ఆలస్యాల తగ్గింపు',
    pillar3Desc: 'AI సాంకేతికత ద్వారా విచారణలను వేగవంతం చేసి, 68% వరకు అనవసరమైన వాయిదాలను నివారిస్తుంది.',
    strictRule1: 'నిబంధన 1: కఠినమైన యాక్సెస్ నియంత్రణ',
    strictRule2: 'నిబంధన 2: పూర్తి క్లయింట్ ఐసోలేషన్',
    daysSaved: 'ప్రతి కేసులో సగటున 84 రోజులు ఆదా',

    advocateDirectory: 'న్యాయవాదుల డైరెక్టరీ',
    connectVerifiedCounsels: 'హైకోర్టు మరియు సుప్రీంకోర్టు సీనియర్ న్యాయవాదులతో సంప్రదించండి',
    filterAdvocatesDesc: 'వాణిజ్య, సివిల్, క్రిమినల్ మరియు సైబర్ చట్టాలలో నిపుణులైన సీనియర్ న్యాయవాదులను కనుగొని నేరుగా అపాయింట్‌మెంట్ తీసుకోండి.',
    browseAdvocatesBtn: 'ధృవీకరించబడిన న్యాయవాదులను చూడండి',
    caseTrackingDelayMonitor: 'కేస్ ట్రాకింగ్ & ఆలస్య విశ్లేషణ',
    trackLitigationsTitle: 'వ్యాజ్యాలు, CNR నంబర్లు & ఆలస్య ప్రమాద స్కోరును ట్రాక్ చేయండి',
    trackLitigationsDesc: 'హైకోర్టులు మరియు ట్రిబ్యునళ్లలో గల కేసులను తక్షణమే శోధించి, పిటిషన్ దాఖలు నుండి తుది తీర్పు వరకు దశలను పర్యవేక్షించండి.',
    searchCaseByCnrBtn: 'CNR ద్వారా కేసులను శోధించండి',
    judicialDataSecurity: 'న్యాయ డేటా భద్రత & నిబంధనలు',
    engineeredForConfidentiality: 'కఠినమైన చట్టపరమైన గోప్యత కొరకు రూపొందించబడింది',
    securityRule1Title: 'నిబంధన 1: ధృవీకరించబడిన న్యాయవాదులు మాత్రమే ఫైళ్లను చూడగలరు',
    securityRule1Desc: 'ధృవీకరించబడని వారు కేసు పత్రాలను యాక్సెస్ చేయడానికి ప్రయత్నించినప్పుడు 403 Forbidden రక్షణ నిరోధిస్తుంది.',
    securityRule2Title: 'నిబంధన 2: పూర్తి క్లయింట్ ఐసోలేషన్',
    securityRule2Desc: 'రోహన్ వర్మ ప్రియా నాయర్ యొక్క ఆస్తి వివాదాన్ని ఏమాత్రం చూడలేరు లేదా ప్రశ్నించలేరు.',

    searchPlaceholder: 'న్యాయవాది పేరు, నైపుణ్యం లేదా బార్ కౌన్సిల్ నంబర్ ద్వారా వెతకండి...',
    filterByCourt: 'అన్ని కోర్టులు',
    filterByCity: 'అన్ని నగరాలు',
    filterByPractice: 'అన్ని న్యాయ రంగాలు',
    consultFee: 'సంప్రదింపు ఫీజు',
    bookConsultation: 'సమయం కేటాయించండి',
    verifiedAdvocate: 'ధృవీకరించబడిన న్యాయవాది',

    noAdvocatesFound: 'ఎవరూ న్యాయవాదులు కనుగొనబడలేదు',
    noAdvocatesDesc: 'మీ శోధన పదాన్ని మార్చండి, వేరే న్యాయ విభాగాలను ఎంచుకోండి లేదా ధృవీకరణ ఫిల్టర్‌ను తొలగించండి.',
    resetFilters: 'ఫిల్టర్లను రీసెట్ చేయండి',
    allCourtsJurisdictions: 'అన్ని కోర్టులు & అధికార పరిధులు',
    anyExperience: 'ఏదైనా అనుభవం',
    sortHighestRated: 'క్రమబద్ధీకరణ: అత్యధిక రేటింగ్ ⭐',
    sortExperience: 'క్రమబద్ధీకరణ: అత్యంత అనుభవజ్ఞులు ⚖️',
    sortConsultFee: 'క్రమబద్ధీకరణ: తక్కువ ఫీజు',
    sortCasesWon: 'క్రమబద్ధీకరణ: అత్యధిక పరిష్కరించిన కేసులు 🏆',
    sortFeeDesc: 'క్రమబద్ధీకరణ: ఎక్కువ ఫీజు',
    verifiedOnly: 'ధృవీకరించబడిన వారు మాత్రమే',
    bciVerifiedDirectoryBadge: 'బార్ కౌన్సిల్ ఆఫ్ ఇండియా ధృవీకరించిన డైరెక్టరీ',
    completeBarVerificationBtn: 'బార్ కౌన్సిల్ ధృవీకరణ పూర్తి చేయండి',
    yearsExperience: 'సంవత్సరాల అనుభవం',
    yearsActive: 'సంవత్సరాలుగా ప్రాక్టీస్',
    ratingLabel: 'రేటింగ్',
    verifiedBadge: 'ధృవీకరించబడింది',
    pendingBadge: 'పరిశీలనలో ఉంది',
    per30MinConsultation: '30 నిమిషాల సంప్రదింపులకు',
    queryingAdvocates: 'ధృవీకరించబడిన న్యాయవాదుల వివరాలను శోధిస్తోంది...',
    barEnrollment: 'బార్ నమోదు సంఖ్య:',
    experienceLabel: 'అనుభవం:',
    appearsBefore: 'హాజరయ్యే న్యాయస్థానాలు:',
    detailsBtn: 'వివరాలు',
    consultBtn: 'సంప్రదించండి',
    viewProfile: 'పూర్తి ప్రొఫైల్ చూడండి',
    barVerified: 'బార్ ధృవీకరించబడింది',
    verificationInProgress: 'ధృవీకరణ ప్రక్రియలో ఉంది',
    practiceProfile: 'ప్రాక్టీస్ ప్రొఫైల్',
    appearingCourts: 'హాజరయ్యే న్యాయస్థానాలు',
    availableSchedule: 'అందుబాటు సమయం',
    initialLegalAdvisoryFee: 'ప్రాథమిక న్యాయ సలహా ఫీజు',
    bookConsultationNow: 'ఇప్పుడే అపాయింట్‌మెంట్ బుక్ చేయండి',
    advocatesCount: 'న్యాయవాదులు',
    practiceAreaFilter: 'రంగం:',

    enterCnrOrNumber: 'CNR నంబర్ లేదా కేసు నంబర్ నమోదు చేయండి...',
    searchCaseBtn: 'కేస్ స్థితిని శోధించండి',

    // Advocate Performance & Grading Slide
    grading: 'గ్రేడింగ్ & పనితీరు',
    lawyerGradingTitle: 'న్యాయవాది పనితీరు, కేసులు మరియు గ్రేడింగ్ సూచిక',
    lawyerGradingSubtitle: 'పూర్తి పారదర్శక న్యాయవాది పనితీరు వివరాలు: గెలిచిన కేసులు, ఓడిన కేసులు, రాజీ పరిష్కారాలు, ఇంకా నడుస్తున్న కేసులు, కక్షిదారుల సమీక్షలు మరియు గ్రేడింగ్ బ్యాడ్జీలు.',
    casesTakenTotal: 'మొత్తం తీసుకున్న కేసులు',
    casesWon: 'గెలిచిన కేసులు',
    casesLost: 'ఓడిపోయిన కేసులు',
    casesCompromised: 'రాజీ / పరిష్కారమైనవి',
    casesOngoing: 'ఇంకా నడుస్తున్న కేసులు',
    winRate: 'గెలుపు శాతం',
    compromiseRate: 'రాజీ పరిష్కార రేటు',
    clientReviews: 'కక్షిదారుల సమీక్షలు & రేటింగ్‌లు',
    gradingStarsBadges: 'గ్రేడింగ్ నక్షత్రాలు & బ్యాడ్జీలు',
    writeReviewBtn: 'సమీక్ష రాయండి',
    submitReview: 'సమీక్షను సమర్పించండి',
    ratingScore: 'రేటింగ్ స్కోరు',
    caseOutcomeLabel: 'కేసు ఫలితం',
    verifiedLitigantBadge: 'ధృవీకరించబడిన కక్షిదారు',
    allOutcomes: 'అన్ని కేసు ఫలితాలు',
    gradeTier: 'న్యాయవాది గ్రేడ్ స్థాయి',
    originalAdvocatesTitle: 'నిజమైన & బార్ కౌన్సిల్ ధృవీకరించబడిన న్యాయవాదులు',
    performanceBreakdown: 'పనితీరు విభజన',
    reviewPlaceholder: 'ఈ న్యాయవాదితో మీ అనుభవాన్ని పంచుకోండి (కోర్టు వాదన, సమయపాలన, కమ్యూనికేషన్)...',
    courtTribunalLabel: 'కోర్టు / ట్రిబ్యునల్ పేరు',
    shareFeedback: 'ధృవీకరించబడిన అభిప్రాయాన్ని పంచుకోండి',
    yourRating: 'మీ రేటింగ్ (1 నుండి 5 నక్షత్రాలు)',
    caseTypeLabel: 'కేసు వర్గం',
    selectOutcome: 'చట్టపరమైన ఫలితాన్ని ఎంచుకోండి',
    outcomeWon: 'గెలుపు (అనుకూల తీర్పు)',
    outcomeCompromised: 'రాజీ / పరిష్కారం (మధ్యవర్తిత్వం / లోక్ అదాలత్)',
    outcomeOngoing: 'ఇంకా నడుస్తోంది (విచారణలో ఉంది)',
    outcomeLost: 'ఓటమి (కొట్టివేయబడింది)',
    gradeAplusBadge: 'గ్రేడ్ A+ • సీనియర్ మాస్టర్ లిటిగేటర్',
    gradeABadge: 'గ్రేడ్ A • ఉన్నత సామర్థ్య న్యాయవాది',
    gradeBplusBadge: 'గ్రేడ్ B+ • ఫాస్ట్-ట్రాక్ న్యాయవాది',
    gradeBBadge: 'గ్రేడ్ B • చురుకైన ప్రాక్టీషనర్',
    viewGradingSlide: 'గ్రేడింగ్ & పనితీరు స్లైడ్ చూడండి',
    performanceStats: 'కేసుల పనితీరు గణాంకాలు',
    clientReviewsCount: 'కక్షిదారుల సమీక్షలు',
    badgesTitle: 'సాధించిన ప్రతిష్టాత్మక బ్యాడ్జీలు',
    allGrades: 'అన్ని గ్రేడ్‌లు (A+, A, B+, B)',
    sortByGrade: 'క్రమం: అత్యధిక గ్రేడ్ (A+ -> B)',
    sortByWinRate: 'క్రమం: అత్యధిక గెలుపు శాతం 🏆',
    sortByCompromised: 'క్రమం: అత్యధిక రాజీ పరిష్కారాలు 🤝',

    terms: 'నిబంధనలు మరియు షరతులు',
    privacy: 'గోప్యతా విధానం (DPDP చట్టం)',
    refunds: 'రద్దు మరియు వాపసు విధానం',
    grievanceContact: 'సహాయ కేంద్రం & ఫిర్యాదుల విభాగం',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd. సర్వహక్కులు ప్రత్యేకించబడినవి.'
  },

  hi: {
    overview: 'अवलोकन',
    findLawyer: 'वकील खोजें',
    findCase: 'केस खोजें',
    myCases: 'मेरे केस',
    delayAnalytics: 'केस विलंब विश्लेषण',
    legalDocs: 'कानूनी दस्तावेज',
    aiCounsel: 'AI कानूनी सलाहकार',
    voiceCaseFiler: 'बोलकर केस दर्ज करें (सभी नागरिकों हेतु)',
    consultations: 'परामर्श',
    membership: 'सदस्यता',
    tagline: 'वकीलों को जोड़ना • नागरिकों को सशक्त बनाना • न्याय में देरी घटाना',

    chooseLanguage: 'भाषा चुनें / अपनी मातृभाषा का चयन करें',
    availableIn24: '24 भारतीय भाषाओं में वॉयस केस फाइलिंग और न्यायिक सहायता',

    membershipNotification: 'सदस्यता शुल्क सूचना',
    clientAccount: 'मुवक्किल खाता',
    advocateAccount: 'अधिवक्ता प्रैक्टिस खाता',
    clientMembershipMsg: 'मुवक्किल: सुरक्षित केस ट्रैकिंग, एन्क्रिप्टेड दस्तावेज़ वॉल्ट और सत्यापित वकीलों से परामर्श हेतु वार्षिक सदस्यता शुल्क ₹ 2,999 का भुगतान करें।',
    advocateMembershipMsg: 'अधिवक्ता: मुवक्किल केस फाइलों को देखने और परामर्श अनुरोध स्वीकार करने हेतु मासिक शुल्क ₹ 3,999 का भुगतान करें।',
    payClientFeeBtn: 'भुगतान करें ₹ 2,999 / वर्ष',
    payAdvocateFeeBtn: 'भुगतान करें ₹ 3,999 / माह',
    activeMembership: 'सक्रिय सदस्यता',

    heroBadge: 'न्यायिक प्रौद्योगिकी मंच • बार काउंसिल सत्यापित अधिवक्ता',
    heroHeadline1: 'वकीलों का सशक्त नेटवर्क।',
    heroHeadline2: 'नागरिकों का सशक्तिकरण।',
    heroHeadline3: 'न्याय में देरी का खात्मा।',
    heroSubtitle: 'भारत का अग्रणी कानूनी मंच जो नागरिकों को सत्यापित अधिवक्ताओं से जोड़ता है, गोपनीय केस फाइलों की सुरक्षा करता है और 24 भारतीय भाषाओं में बोलकर केस दर्ज करने की सुविधा देता है।',
    btnSpeakToFileCase: 'बोलकर केस दर्ज करें (Voice E-Filing)',
    btnFindLawyer: 'वकील खोजें',
    btnFindCase: 'केस खोजें',
    btnClientVault: 'मेरा केस वॉल्ट',
    btnJoinAdvocate: 'वकील के रूप में जुड़ें',
    heroQuickSearchPlaceholder: 'केस CNR नंबर (जैसे DLHC01-004182-2026), शीर्षक या न्यायालय से खोजें...',
    quickLookup: 'त्वरित खोज',
    openAdvocateVault: 'वकील वॉल्ट खोलें',
    viewMyIsolatedCases: 'मेरे सुरक्षित केस देखें',

    pillar1Title: 'सत्यापित अधिवक्ता',
    pillar1Desc: 'प्रत्येक वकील की प्रोफाइल स्टेट बार काउंसिल से सत्यापित होती है। केवल सत्यापित वकील ही गोपनीय केस फाइलें देख सकते हैं।',
    pillar2Title: 'पूर्ण मुवक्किल गोपनीयता',
    pillar2Desc: 'बैंक-स्तरीय सुरक्षा वास्तुकला। एक मुवक्किल के दस्तावेज दूसरा कोई कभी नहीं देख सकता।',
    pillar3Title: 'न्याय में देरी घटाना',
    pillar3Desc: 'AI तकनीक से सुनवाई में तेजी लाई जाती है जिससे अनावश्यक स्थगन में 68% तक की कमी आती है।',
    strictRule1: 'नियम 1: सख्त अभिगम नियंत्रण',
    strictRule2: 'नियम 2: पूर्ण मुवक्किल पृथक्करण',
    daysSaved: 'प्रति केस औसतन 84 दिनों की बचत',

    advocateDirectory: 'अधिवक्ता निर्देशिका',
    connectVerifiedCounsels: 'उच्च न्यायालय एवं सर्वोच्च न्यायालय के वकीलों से जुड़ें',
    filterAdvocatesDesc: 'व्यावसायिक, नागरिक, आपराधिक और साइबर कानून में विशेषज्ञ वरिष्ठ वकीलों को खोजें और सीधे परामर्श बुक करें।',
    browseAdvocatesBtn: 'सत्यापित अधिवक्ता देखें',
    caseTrackingDelayMonitor: 'केस ट्रैकिंग एवं विलंब मॉनिटर',
    trackLitigationsTitle: 'मुकदमों, CNR नंबरों और विलंब जोखिम स्कोर को ट्रैक करें',
    trackLitigationsDesc: 'उच्च न्यायालयों और न्यायाधिकरणों में दर्ज केसों को तुरंत खोजें और याचिका से अंतिम फैसले तक की स्थिति जानें।',
    searchCaseByCnrBtn: 'CNR नंबर से केस खोजें',
    judicialDataSecurity: 'न्यायिक डेटा सुरक्षा एवं अनुपालन',
    engineeredForConfidentiality: 'सख्त कानूनी गोपनीयता हेतु निर्मित',
    securityRule1Title: 'नियम 1: केवल सत्यापित वकील ही फाइलें देख सकते हैं',
    securityRule1Desc: 'गैर-सत्यापित वकीलों को केस दस्तावेजों तक पहुंचने पर सख्त 403 Forbidden अस्वीकृति मिलती है।',
    securityRule2Title: 'नियम 2: पूर्ण मुवक्किल पृथक्करण',
    securityRule2Desc: 'रोहन वर्मा कभी भी प्रिया नायर के संपत्ति विवाद को नहीं देख सकते।',

    searchPlaceholder: 'वकील का नाम, विशेषज्ञता या बार काउंसिल नंबर से खोजें...',
    filterByCourt: 'सभी न्यायालय',
    filterByCity: 'सभी शहर',
    filterByPractice: 'सभी क्षेत्र',
    consultFee: 'परामर्श शुल्क',
    bookConsultation: 'परामर्श बुक करें',
    verifiedAdvocate: 'सत्यापित अधिवक्ता',

    noAdvocatesFound: 'कोई अधिवक्ता नहीं मिला',
    noAdvocatesDesc: 'कृपया अपना खोज शब्द बदलें, अन्य कानूनी क्षेत्र चुनें, या सत्यापन फ़िल्टर को हटाएं।',
    resetFilters: 'फ़िल्टर रीसेट करें',
    allCourtsJurisdictions: 'सभी न्यायालय और क्षेत्राधिकार',
    anyExperience: 'कोई भी अनुभव',
    sortHighestRated: 'क्रम: उच्चतम रेटिंग ⭐',
    sortExperience: 'क्रम: सर्वाधिक अनुभवी ⚖️',
    sortConsultFee: 'क्रम: न्यूनतम शुल्क',
    sortCasesWon: 'क्रम: सर्वाधिक निस्तारित केस 🏆',
    sortFeeDesc: 'क्रम: अधिकतम शुल्क',
    verifiedOnly: 'केवल सत्यापित',
    bciVerifiedDirectoryBadge: 'बार काउंसिल ऑफ इंडिया सत्यापित निर्देशिका',
    completeBarVerificationBtn: 'बार काउंसिल सत्यापन पूरा करें',
    yearsExperience: 'वर्षों का अनुभव',
    yearsActive: 'वर्षों से सक्रिय',
    ratingLabel: 'रेटिंग',
    verifiedBadge: 'सत्यापित',
    pendingBadge: 'प्रक्रियाधीन',
    per30MinConsultation: '30 मिनट परामर्श हेतु',
    queryingAdvocates: 'सत्यापित न्यायिक अधिवक्ताओं की सूची खोजी जा रही है...',
    barEnrollment: 'बार नामांकन संख्या:',
    experienceLabel: 'अनुभव:',
    appearsBefore: 'उपस्थित होने वाले न्यायालय:',
    detailsBtn: 'विवरण',
    consultBtn: 'परामर्श',
    viewProfile: 'पूर्ण प्रोफ़ाइल देखें',
    barVerified: 'बार सत्यापित',
    verificationInProgress: 'सत्यापन समीक्षाधीन',
    practiceProfile: 'प्रैक्टिस प्रोफ़ाइल',
    appearingCourts: 'अभ्यास न्यायालय',
    availableSchedule: 'उपलब्ध समय',
    initialLegalAdvisoryFee: 'प्रारंभिक कानूनी परामर्श शुल्क',
    bookConsultationNow: 'अभी परामर्श बुक करें',
    advocatesCount: 'अधिवक्ता',
    practiceAreaFilter: 'क्षेत्र:',

    enterCnrOrNumber: 'CNR नंबर या केस नंबर दर्ज करें...',
    searchCaseBtn: 'केस की स्थिति ट्रैक करें',

    // Advocate Performance & Grading Slide
    grading: 'ग्रेडिंग एवं प्रदर्शन',
    lawyerGradingTitle: 'अधिवक्ता प्रदर्शन, केस रिकॉर्ड एवं ग्रेडिंग सूचकांक',
    lawyerGradingSubtitle: 'पारदर्शी मुकदमेबाजी रिकॉर्ड: जीते गए केस, हारे गए केस, समझौते/सुलह, वर्तमान में चल रहे केस, मुवक्किल समीक्षाएं एवं ग्रेडिंग बैज।',
    casesTakenTotal: 'कुल लिए गए केस',
    casesWon: 'जीते गए केस',
    casesLost: 'हारे गए केस',
    casesCompromised: 'समझौता / सुलझाए गए केस',
    casesOngoing: 'अभी चल रहे केस',
    winRate: 'जीतने की दर',
    compromiseRate: 'समझौता / सुलह दर',
    clientReviews: 'मुवक्किल समीक्षाएं एवं रेटिंग',
    gradingStarsBadges: 'ग्रेडिंग सितारे एवं बैज',
    writeReviewBtn: 'समीक्षा लिखें',
    submitReview: 'समीक्षा एवं रेटिंग सबमिट करें',
    ratingScore: 'रेटिंग स्कोर',
    caseOutcomeLabel: 'केस परिणाम',
    verifiedLitigantBadge: 'सत्यापित मुवक्किल',
    allOutcomes: 'सभी केस परिणाम',
    gradeTier: 'अधिवक्ता ग्रेड स्तर',
    originalAdvocatesTitle: 'मूल एवं बार काउंसिल सत्यापित अधिवक्ता',
    performanceBreakdown: 'प्रदर्शन विवरण',
    reviewPlaceholder: 'इस अधिवक्ता के साथ अपना अनुभव साझा करें (अदालती तैयारी, रणनीति, गति, संचार)...',
    courtTribunalLabel: 'न्यायालय / न्यायाधिकरण का नाम',
    shareFeedback: 'सत्यापित फीडबैक दर्ज करें',
    yourRating: 'आपकी रेटिंग (1 से 5 सितारे)',
    caseTypeLabel: 'केस श्रेणी',
    selectOutcome: 'कानूनी परिणाम चुनें',
    outcomeWon: 'जीत (अनुकूल निर्णय/आदेश)',
    outcomeCompromised: 'समझौता / सुलझाया गया (मध्यस्थता/लोक अदालत)',
    outcomeOngoing: 'अभी चल रहा है (बहस/ट्रायल जारी)',
    outcomeLost: 'हार (खारिज/प्रतिकूल आदेश)',
    gradeAplusBadge: 'ग्रेड A+ • वरिष्ठ मास्टर मुकदमेबाज',
    gradeABadge: 'ग्रेड A • उच्च दक्षता अधिवक्ता',
    gradeBplusBadge: 'ग्रेड B+ • फास्ट-ट्रैक अधिवक्ता',
    gradeBBadge: 'ग्रेड B • सक्रिय प्रैक्टिसिंग वकील',
    viewGradingSlide: 'ग्रेडिंग एवं प्रदर्शन स्लाइड देखें',
    performanceStats: 'केस प्रदर्शन सांख्यिकी',
    clientReviewsCount: 'मुवक्किल समीक्षाएं',
    badgesTitle: 'अर्जित उत्कृष्टता बैज',
    allGrades: 'सभी ग्रेड (A+, A, B+, B)',
    sortByGrade: 'क्रम: उच्चतम ग्रेड (A+ -> B)',
    sortByWinRate: 'क्रम: उच्चतम जीत दर 🏆',
    sortByCompromised: 'क्रम: सर्वाधिक समझौता / सुलह 🤝',

    terms: 'नियम एवं शर्तें',
    privacy: 'गोपनीयता नीति (DPDP अधिनियम)',
    refunds: 'रद्दीकरण एवं रिफंड नीति',
    grievanceContact: 'शिकायत निवारण एवं सहायता केंद्र',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd. सर्वाधिकार सुरक्षित।'
  },

  pa: {
    overview: 'ਸੰਖੇਪ',
    findLawyer: 'ਵਕੀਲ ਲੱਭੋ',
    findCase: 'ਕੇਸ ਲੱਭੋ',
    myCases: 'ਮੇਰੇ ਕੇਸ',
    delayAnalytics: 'ਦੇਰੀ ਵਿਸ਼ਲੇਸ਼ਣ',
    legalDocs: 'ਕਾਨੂੰਨੀ ਦਸਤਾਵੇਜ਼',
    aiCounsel: 'AI ਕਾਨੂੰਨੀ ਸਲਾਹਕਾਰ',
    voiceCaseFiler: 'ਬੋਲ ਕੇ ਕੇਸ ਦਰਜ ਕਰੋ (ਸਾਰੇ ਨਾਗਰਿਕਾਂ ਲਈ)',
    consultations: 'ਸਲਾਹ',
    membership: 'ਮੈਂਬਰਸ਼ਿਪ',
    tagline: 'ਵਕੀਲਾਂ ਨਾਲ ਸੰਪਰਕ • ਤੇਜ਼ ਇਨਸਾਫ਼ • ਦੇਰੀ ਦਾ ਖਾਤਮਾ',

    chooseLanguage: 'ਬੋਲੀ ਚੁਣੋ / ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਚੁਣੋ',
    availableIn24: '24 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਵੌਇਸ ਕੇਸ ਫਾਈਲਿੰਗ ਦੀ ਸਹੂਲਤ',

    membershipNotification: 'ਮੈਂਬਰਸ਼ਿਪ ਫੀਸ ਦੀ ਸੂਚਨਾ',
    clientAccount: 'ਮੁਵੱਕਲ ਖਾਤਾ',
    advocateAccount: 'ਵਕੀਲ ਪ੍ਰੈਕਟਿਸ ਖਾਤਾ',
    clientMembershipMsg: 'ਮੁਵੱਕਲ: ਸੁਰੱਖਿਅਤ ਕੇਸ ਟਰੈਕਿੰਗ ਅਤੇ ਵਕੀਲਾਂ ਨਾਲ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਲਈ ਸਾਲਾਨਾ ਮੈਂਬਰਸ਼ਿਪ ਫੀਸ ₹ 2,999 ਅਦਾ ਕਰੋ।',
    advocateMembershipMsg: 'ਵਕੀਲ: ਮੁਵੱਕਲਾਂ ਦੇ ਕੇਸ ਦੇਖਣ ਅਤੇ ਮੁਲਾਕਾਤਾਂ ਸਵੀਕਾਰ ਕਰਨ ਲਈ ਮਹੀਨਾਵਾਰ ਫੀਸ ₹ 3,999 ਅਦਾ ਕਰੋ।',
    payClientFeeBtn: 'ਅਦਾ ਕਰੋ ₹ 2,999 / ਸਾਲ',
    payAdvocateFeeBtn: 'ਅਦਾ ਕਰੋ ₹ 3,999 / ਮਹੀਨਾ',
    activeMembership: 'ਐਕਟਿਵ ਮੈਂਬਰਸ਼ਿਪ',

    heroBadge: 'ਕਾਨੂੰਨੀ ਤਕਨਾਲੋਜੀ ਮੰਚ • ਬਾਰ ਕੌਂਸਲ ਪ੍ਰਮਾਣਿਤ ਵਕੀਲ',
    heroHeadline1: 'ਵਕੀਲਾਂ ਦਾ ਨੈੱਟਵਰਕ।',
    heroHeadline2: 'ਨਾਗਰਿਕਾਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ।',
    heroHeadline3: 'ਦੇਰੀ ਦਾ ਖਾਤਮਾ।',
    heroSubtitle: 'ਭਾਰਤ ਦਾ ਪ੍ਰਮੁੱਖ ਕਾਨੂੰਨੀ ਪਲੇਟਫਾਰਮ ਜੋ ਨਾਗਰਿਕਾਂ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਵਕੀਲਾਂ ਨਾਲ ਜੋੜਦਾ ਹੈ ਅਤੇ 24 ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਬੋਲ ਕੇ ਕੇਸ ਦਾਇਰ ਕਰਨ ਦੀ ਸਹੂਲਤ ਦਿੰਦਾ ਹੈ।',
    btnSpeakToFileCase: 'ਬੋਲ ਕੇ ਕੇਸ ਦਰਜ ਕਰੋ (Voice E-Filing)',
    btnFindLawyer: 'ਵਕੀਲ ਲੱਭੋ',
    btnFindCase: 'ਕੇਸ ਲੱਭੋ',
    btnClientVault: 'ਮੇਰਾ ਕੇਸ ਵਾਲਟ',
    btnJoinAdvocate: 'ਵਕੀਲ ਵਜੋਂ ਜੁੜੋ',
    heroQuickSearchPlaceholder: 'ਕੇਸ CNR ਨੰਬਰ (ਜਿਵੇਂ DLHC01-004182-2026) ਜਾਂ ਅਦਾਲਤ ਤੋਂ ਖੋਜੋ...',
    quickLookup: 'ਤੁਰੰਤ ਖੋਜ',
    openAdvocateVault: 'ਵਕੀਲ ਵਾਲਟ ਖੋਲ੍ਹੋ',
    viewMyIsolatedCases: 'ਮੇਰੇ ਸੁਰੱਖਿਅਤ ਕੇਸ ਵੇਖੋ',

    pillar1Title: 'ਪ੍ਰਮਾਣਿਤ ਵਕੀਲ',
    pillar1Desc: 'ਹਰ ਵਕੀਲ ਦੀ ਪ੍ਰੋਫਾਈਲ ਸਟੇਟ ਬਾਰ ਕੌਂਸਲ ਰਾਹੀਂ ਪ੍ਰਮਾਣਿਤ ਹੁੰਦੀ ਹੈ।',
    pillar2Title: 'ਪੂਰੀ ਗੁਪਤਤਾ ਅਤੇ ਸੁਰੱਖਿਆ',
    pillar2Desc: 'ਬੈਂਕ-ਗ੍ਰੇਡ ਸੁਰੱਖਿਆ। ਇੱਕ ਮੁਵੱਕਲ ਦੇ ਦਸਤਾਵੇਜ਼ ਦੂਜੇ ਨੂੰ ਕਦੇ ਨਜ਼ਰ ਨਹੀਂ ਆਉਂਦੇ।',
    pillar3Title: 'ਅਦਾਲਤੀ ਦੇਰੀ ਦਾ ਖਾਤਮਾ',
    pillar3Desc: 'AI ਤਕਨੀਕ ਰਾਹੀਂ ਕੇਸਾਂ ਦੀ ਸੁਣਵਾਈ ਤੇਜ਼ ਹੁੰਦੀ ਹੈ ਅਤੇ ਬੇਲੋੜੀ ਦੇਰੀ 68% ਤੱਕ ਘਟਦੀ ਹੈ।',
    strictRule1: 'ਨਿਯਮ 1: ਸਖ਼ਤ ਪਹੁੰਚ ਕੰਟਰੋਲ',
    strictRule2: 'ਨਿਯਮ 2: ਪੂਰਾ ਮੁਵੱਕਲ ਵਖਰੇਵਾਂ',
    daysSaved: 'ਹਰ ਕੇਸ ਵਿੱਚ ਔਸਤਨ 84 ਦਿਨਾਂ ਦੀ ਬੱਚਤ',

    advocateDirectory: 'ਵਕੀਲਾਂ ਦੀ ਡਾਇਰੈਕਟਰੀ',
    connectVerifiedCounsels: 'ਹਾਈ ਕੋਰਟ ਅਤੇ ਸੁਪਰੀਮ ਕੋਰਟ ਦੇ ਵਕੀਲਾਂ ਨਾਲ ਜੁੜੋ',
    filterAdvocatesDesc: 'ਦੀਵਾਨੀ, ਫੌਜਦਾਰੀ, ਕਾਰੋਬਾਰੀ ਅਤੇ ਸਾਈਬਰ ਕਾਨੂੰਨ ਦੇ ਮਾਹਰ ਸੀਨੀਅਰ ਵਕੀਲਾਂ ਨੂੰ ਲੱਭੋ ਅਤੇ ਸਲਾਹ ਬੁੱਕ ਕਰੋ।',
    browseAdvocatesBtn: 'ਪ੍ਰਮਾਣਿਤ ਵਕੀਲ ਵੇਖੋ',
    caseTrackingDelayMonitor: 'ਕੇਸ ਟਰੈਕਿੰਗ ਅਤੇ ਦੇਰੀ ਮਾਨੀਟਰ',
    trackLitigationsTitle: 'ਕੇਸਾਂ, CNR ਨੰਬਰਾਂ ਅਤੇ ਦੇਰੀ ਜੋਖਮ ਨੂੰ ਟਰੈਕ ਕਰੋ',
    trackLitigationsDesc: 'ਹਾਈ ਕੋਰਟਾਂ ਅਤੇ ਟ੍ਰਿਬਿਊਨਲਾਂ ਵਿੱਚ ਦਰਜ ਕੇਸਾਂ ਦੀ ਸਥਿਤੀ ਤੁਰੰਤ ਜਾਣੋ।',
    searchCaseByCnrBtn: 'CNR ਨੰਬਰ ਰਾਹੀਂ ਕੇਸ ਲੱਭੋ',
    judicialDataSecurity: 'ਨਿਆਂਇਕ ਡੇਟਾ ਸੁਰੱਖਿਆ',
    engineeredForConfidentiality: 'ਸਖ਼ਤ ਕਾਨੂੰਨੀ ਗੁਪਤਤਾ ਲਈ ਤਿਆਰ',
    securityRule1Title: 'ਨਿਯਮ 1: ਕੇਵਲ ਪ੍ਰਮਾਣਿਤ ਵਕੀਲ ਹੀ ਫਾਈਲਾਂ ਵੇਖ ਸਕਦੇ ਹਨ',
    securityRule1Desc: 'ਗੈਰ-ਪ੍ਰਮਾਣਿਤ ਲੋਕਾਂ ਨੂੰ ਕੇਸ ਫਾਈਲਾਂ ਤੱਕ ਪਹੁੰਚਣ ਤੋਂ 403 Forbidden ਰਾਹੀਂ ਰੋਕਿਆ ਜਾਂਦਾ ਹੈ।',
    securityRule2Title: 'ਨਿਯਮ 2: ਪੂਰਾ ਮੁਵੱਕਲ ਵਖਰੇਵਾਂ',
    securityRule2Desc: 'ਰੋਹਨ ਵਰਮਾ ਕਦੇ ਵੀ ਪ੍ਰਿਆ ਨਾਇਰ ਦੇ ਕੇਸ ਨੂੰ ਨਹੀਂ ਵੇਖ ਸਕਦੇ।',

    searchPlaceholder: 'ਵਕੀਲ ਦਾ ਨਾਮ ਜਾਂ ਬਾਰ ਨੰਬਰ ਲਿਖੋ...',
    filterByCourt: 'ਸਾਰੀਆਂ ਅਦਾਲਤਾਂ',
    filterByCity: 'ਸਾਰੇ ਸ਼ਹਿਰ',
    filterByPractice: 'ਸਾਰੇ ਖੇਤਰ',
    consultFee: 'ਸਲਾਹ ਫੀਸ',
    bookConsultation: 'ਸਲਾਹ ਬੁੱਕ ਕਰੋ',
    verifiedAdvocate: 'ਪ੍ਰਮਾਣਿਤ ਵਕੀਲ',

    enterCnrOrNumber: 'CNR ਨੰਬਰ ਦਰਜ ਕਰੋ...',
    searchCaseBtn: 'ਕੇਸ ਦੀ ਸਥਿਤੀ ਵੇਖੋ',

    terms: 'ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ',
    privacy: 'ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ',
    refunds: 'ਰਿਫੰਡ ਨੀਤੀ',
    grievanceContact: 'ਹੈਲਪਲਾਈਨ',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd.'
  },

  kn: {
    overview: 'ಅವಲೋಕನ',
    findLawyer: 'ವಕೀಲರನ್ನು ಹುಡುಕಿ',
    findCase: 'ಕೇಸ್ ಹುಡುಕಿ',
    myCases: 'ನನ್ನ ಕೇಸ್ ವಾಲ್ಟ್',
    delayAnalytics: 'ವಿಳಂಬ ವಿಶ್ಲೇಷಣೆ',
    legalDocs: 'ಕಾನೂನು ದಾಖಲೆಗಳು',
    aiCounsel: 'AI ಕಾನೂನು ಸಲಹೆಗಾರ',
    voiceCaseFiler: 'ಧ್ವನಿ ಮೂಲಕ ಕೇಸ್ ದಾಖಲಿಸಿ (ಎಲ್ಲಾ ನಾಗರಿಕರಿಗೆ)',
    consultations: 'ಸಮಾಲೋಚನೆಗಳು',
    membership: 'ಸದಸ್ಯತ್ವ',
    tagline: 'ವಕೀಲರ ಸಂಪರ್ಕ • ನಾಗರಿಕರ ಸಬಲೀಕರಣ • ವಿಳಂಬ ಕಡಿತ',

    chooseLanguage: 'ಭಾಷೆಯನ್ನು ಆರಿಸಿ / ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    availableIn24: '24 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ಮೂಲಕ ಕೇಸ್ ದಾಖಲಿಸುವ ಸೌಲಭ್ಯ',

    membershipNotification: 'ಸದಸ್ಯತ್ವ ಶುಲ್ಕ ಸೂಚನೆ',
    clientAccount: 'ಕ್ಲೈಂಟ್ ಖಾತೆ',
    advocateAccount: 'ವಕೀಲರ ಖಾತೆ',
    clientMembershipMsg: 'ಕ್ಲೈಂಟ್‌ಗಳು: ಕೇಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ವಕೀಲರ ಸಮಾಲೋಚನೆಗಾಗಿ ವಾರ್ಷಿಕ ಸದಸ್ಯತ್ವ ಶುಲ್ಕ ₹ 2,999 ಪಾವತಿಸಿ.',
    advocateMembershipMsg: 'ವಕೀಲರು: ಕೇಸ್ ಫೈಲ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮತ್ತು ಸಮಾಲೋಚನೆಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ಮಾಸಿಕ ಶುಲ್ಕ ₹ 3,999 ಪಾವತಿಸಿ.',
    payClientFeeBtn: 'ಪಾವತಿಸಿ ₹ 2,999 / ವರ್ಷ',
    payAdvocateFeeBtn: 'ಪಾವತಿಸಿ ₹ 3,999 / ತಿಂಗಳು',
    activeMembership: 'ಸಕ್ರಿಯ ಸದಸ್ಯತ್ವ',

    heroBadge: 'ನ್ಯಾಯಾಂಗ ತಂತ್ರಜ್ಞಾನ ವೇದಿಕೆ • ಬಾರ್ ಕೌನ್ಸಿಲ್ ಪರಿಶೀಲಿತ ವಕೀಲರು',
    heroHeadline1: 'ವಕೀಲರ ಸಂಪರ್ಕ.',
    heroHeadline2: 'ನಾಗರಿಕರ ಸಬಲೀಕರಣ.',
    heroHeadline3: 'ವಿಳಂಬಗಳ ನಿವಾರಣೆ.',
    heroSubtitle: 'ಪರಿಶೀಲಿಸಿದ ವಕೀಲರೊಂದಿಗೆ ನಾಗರಿಕರನ್ನು ಸಂಪರ್ಕಿಸುವ, ಗೌಪ್ಯ ದಾಖಲೆಗಳನ್ನು ರಕ್ಷಿಸುವ ಮತ್ತು 24 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ಮೂಲಕ ಕೇಸ್ ದಾಖಲಿಸಲು ನೆರವಾಗುವ ಭಾರತದ ಪ್ರಮುಖ ಕಾನೂನು ವೇದಿಕೆ.',
    btnSpeakToFileCase: 'ಮಾತನಾಡಿ ಕೇಸ್ ದಾಖಲಿಸಿ (Voice E-Filing)',
    btnFindLawyer: 'ವಕೀಲರನ್ನು ಹುಡುಕಿ',
    btnFindCase: 'ಕೇಸ್ ಹುಡುಕಿ',
    btnClientVault: 'ನನ್ನ ಕೇಸ್ ವಾಲ್ಟ್',
    btnJoinAdvocate: 'ವಕೀಲರಾಗಿ ಸೇರಿ',
    heroQuickSearchPlaceholder: 'ಕೇಸ್ CNR ಸಂಖ್ಯೆ (ಉದಾ: DLHC01-004182-2026) ಅಥವಾ ನ್ಯಾಯಾಲಯದಿಂದ ಹುಡುಕಿ...',
    quickLookup: 'ತ್ವರಿತ ಹುಡುಕಾಟ',
    openAdvocateVault: 'ವಕೀಲರ ವಾಲ್ಟ್ ತೆರೆಯಿರಿ',
    viewMyIsolatedCases: 'ನನ್ನ ಸುರಕ್ಷಿತ ಕೇಸ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ',

    pillar1Title: 'ಪರಿಶೀಲಿತ ವಕೀಲರು',
    pillar1Desc: 'ಪ್ರತಿ ವಕೀಲರ ಪ್ರೊಫೈಲ್ ರಾಜ್ಯ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಲ್ಪಡುತ್ತದೆ.',
    pillar2Title: 'ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆ ಮತ್ತು ರಕ್ಷಣೆ',
    pillar2Desc: 'ಬ್ಯಾಂಕ್-ದರ್ಜೆಯ ಭದ್ರತೆ. ಒಬ್ಬರ ದಾಖಲೆಗಳನ್ನು ಮತ್ತೊಬ್ಬರು ವೀಕ್ಷಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    pillar3Title: 'ವಿಳಂಬಗಳ ನಿವಾರಣೆ',
    pillar3Desc: 'AI ತಂತ್ರಜ್ಞಾನವು ವಿಚಾರಣೆಯನ್ನು ವೇಗಗೊಳಿಸಿ ಅನಗತ್ಯ ವಿಳಂಬಗಳನ್ನು ಶೇ.68 ರಷ್ಟು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
    strictRule1: 'ನಿಯಮ 1: ಕಟ್ಟುನಿಟ್ಟಾದ ಪ್ರವೇಶ ನಿಯಂತ್ರಣ',
    strictRule2: 'ನಿಯಮ 2: ಸಂಪೂರ್ಣ ಪ್ರತ್ಯೇಕತೆ',
    daysSaved: 'ಪ್ರತಿ ಪ್ರಕರಣದಲ್ಲಿ ಸರಾಸರಿ 84 ದಿನಗಳ ಉಳಿತಾಯ',

    advocateDirectory: 'ವಕೀಲರ ಡೈರೆಕ್ಟರಿ',
    connectVerifiedCounsels: 'ಹೈಕೋರ್ಟ್ ಮತ್ತು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಹಿರಿಯ ವಕೀಲರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
    filterAdvocatesDesc: 'ಸಿವಿಲ್, ಕ್ರಿಮಿನಲ್, ವಾಣಿಜ್ಯ ಮತ್ತು ಸೈಬರ್ ಕಾನೂನು ತಜ್ಞರನ್ನು ಹುಡುಕಿ ಮತ್ತು ಸಮಾಲೋಚನೆ ಬುಕ್ ಮಾಡಿ.',
    browseAdvocatesBtn: 'ಪರಿಶೀಲಿತ ವಕೀಲರನ್ನು ವೀಕ್ಷಿಸಿ',
    caseTrackingDelayMonitor: 'ಕೇಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ & ವಿಳಂಬ ಮಾನಿಟರ್',
    trackLitigationsTitle: 'ಪ್ರಕರಣಗಳು, CNR ಸಂಖ್ಯೆಗಳು ಮತ್ತು ವಿಳಂಬ ಅಪಾಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    trackLitigationsDesc: 'ಹೈಕೋರ್ಟ್‌ಗಳು ಮತ್ತು ನ್ಯಾಯಾಧಿಕರಣಗಳಲ್ಲಿ ದಾಖಲಾದ ಕೇಸ್‌ಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಶೋಧಿಸಿ.',
    searchCaseByCnrBtn: 'CNR ಮೂಲಕ ಕೇಸ್ ಹುಡುಕಿ',
    judicialDataSecurity: 'ನ್ಯಾಯಾಂಗ ಡೇಟಾ ಭದ್ರತೆ',
    engineeredForConfidentiality: 'ಕಾನೂನು ಗೌಪ್ಯತೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ',
    securityRule1Title: 'ನಿಯಮ 1: ಪರಿಶೀಲಿತ ವಕೀಲರು ಮಾತ್ರ ಫೈಲ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಬಹುದು',
    securityRule1Desc: 'ಪರಿಶೀಲಿಸದವರಿಗೆ 403 Forbidden ಮೂಲಕ ದಾಖಲೆಗಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗುತ್ತದೆ.',
    securityRule2Title: 'ನಿಯಮ 2: ಸಂಪೂರ್ಣ ಕ್ಲೈಂಟ್ ಪ್ರತ್ಯೇಕತೆ',
    securityRule2Desc: 'ರೋಹನ್ ವರ್ಮಾ ಪ್ರಿಯಾ ನಾಯರ್ ಅವರ ಪ್ರಕರಣವನ್ನು ಎಂದಿಗೂ ನೋಡಲು ಸಾಧ್ಯವಿಲ್ಲ.',

    searchPlaceholder: 'ವಕೀಲರ ಹೆಸರು ಅಥವಾ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಸಂಖ್ಯೆಯಿಂದ ಹುಡುಕಿ...',
    filterByCourt: 'ಎಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳು',
    filterByCity: 'ಎಲ್ಲಾ ನಗರಗಳು',
    filterByPractice: 'ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು',
    consultFee: 'ಸಮಾಲೋಚನಾ ಶುಲ್ಕ',
    bookConsultation: 'ಸಮಾಲೋಚನೆ ಬುಕ್ ಮಾಡಿ',
    verifiedAdvocate: 'ಪರಿಶೀಲಿತ ವಕೀಲರು',

    enterCnrOrNumber: 'CNR ಸಂಖ್ಯೆ ಅಥವಾ ಕೇಸ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ...',
    searchCaseBtn: 'ಕೇಸ್ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',

    terms: 'ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು',
    privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ (DPDP ಕಾಯ್ದೆ)',
    refunds: 'ರದ್ದತಿ ಮತ್ತು ಮರುಪಾವತಿ ನೀತಿ',
    grievanceContact: 'ಗ್ರಾಹಕ ದೂರು ನಿವಾರಣೆ ಮತ್ತು ಸಹಾಯವಾಣಿ',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.'
  },

  ml: {
    overview: 'അവലോകനം',
    findLawyer: 'വക്കീലിനെ കണ്ടെത്തുക',
    findCase: 'കേസ് തിരയുക',
    myCases: 'എന്റെ കേസുകൾ',
    delayAnalytics: 'കാലതാമസ വിശകലനം',
    legalDocs: 'നിയമ രേഖകൾ',
    aiCounsel: 'AI ലീഗల్ കൗൺസൽ',
    voiceCaseFiler: 'സംസാരിച്ച് കേസ് ഫയൽ ചെയ്യുക',
    consultations: 'കൺസൾട്ടേഷനുകൾ',
    membership: 'അംഗത്വം',
    tagline: 'നീതിയിലേക്കുള്ള വഴി • വേഗത്തിലുള്ള പരിഹാരം',

    chooseLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക / മാതൃഭാഷ തിരഞ്ഞെടുക്കുക',
    availableIn24: '24 ഇന്ത്യൻ ഭാഷകളിൽ വോയ്‌സ് കേസ് ഫയലിംഗ് സൗകര്യം',

    membershipNotification: 'അംഗത്വ ഫീസ് അറിയിപ്പ്',
    clientAccount: 'ക്ലയന്റ് അക്കൗണ്ട്',
    advocateAccount: 'അഭിഭാഷക അക്കൗണ്ട്',
    clientMembershipMsg: 'ക്ലയന്റുകൾ: കേസ് ട്രാക്കിംഗിനും അഭിഭാഷകരുമായുള്ള കൺസൾട്ടേഷനും വാർഷിക ഫീസ് ₹ 2,999 അടയ്ക്കുക.',
    advocateMembershipMsg: 'അഭിഭാഷകർ: കേസ് ഫയലുകൾ പരിശോധിക്കാനും കൺസൾട്ടേഷൻ സ്വീകരിക്കാനും പ്രതിമാസ ഫീസ് ₹ 3,999 അടയ്ക്കുക.',
    payClientFeeBtn: 'അടയ്ക്കുക ₹ 2,999 / വർഷം',
    payAdvocateFeeBtn: 'അടയ്ക്കുക ₹ 3,999 / മാസം',
    activeMembership: 'സജീവ അംഗത്വം',

    heroBadge: 'ജുഡീഷ്യൽ പ്ലാറ്റ്‌ഫോം • ബാർ കൗൺസിൽ വെരിഫൈഡ് അഡ്വക്കേറ്റുകൾ',
    heroHeadline1: 'വക്കീലന്മാരെ ബന്ധിപ്പിക്കുന്നു.',
    heroHeadline2: 'പൗരന്മാരെ ശാക്തീകരിക്കുന്നു.',
    heroHeadline3: 'കാലതാമസം ഒഴിവാക്കുന്നു.',
    heroSubtitle: 'പൗരന്മാർക്ക് വിശ്വസ്തരായ അഭിഭാഷകരെ കണ്ടെത്താനും 24 ഇന്ത്യൻ ഭാഷകളിൽ സംസാരിച്ച് കേസ് ഫയൽ ചെയ്യാനുമുള്ള ആധുനിക നിയമ പ്ലാറ്റ്‌ഫോം.',
    btnSpeakToFileCase: 'സംസാരിച്ച് കേസ് ഫയൽ ചെയ്യുക (Voice E-Filing)',
    btnFindLawyer: 'വക്കീലിനെ കണ്ടെത്തുക',
    btnFindCase: 'കേസ് തിരയുക',
    btnClientVault: 'എന്റെ കേസ് വാൾട്ട്',
    btnJoinAdvocate: 'അഭിഭാഷകനായി ചേരുക',
    heroQuickSearchPlaceholder: 'കേസ് CNR നമ്പർ നൽകി തിരയുക...',
    quickLookup: 'ദ്രുത തിരച്ചിൽ',
    openAdvocateVault: 'അഭിഭാഷക വാൾട്ട് തുറക്കുക',
    viewMyIsolatedCases: 'എന്റെ കേസുകൾ കാണുക',

    pillar1Title: 'പരിശോധിച്ച അഭിഭാഷകർ',
    pillar1Desc: 'സംസ്ഥാന ബാർ കൗൺസിൽ അംഗീകാരം പൂർണ്ണമായി പരിശോധിക്കുന്നു.',
    pillar2Title: 'സുരക്ഷിത കേസ് വാൾട്ട്',
    pillar2Desc: 'കേസ് രേഖകളുടെ കർശനമായ സ്വകാര്യത ഉറപ്പാക്കുന്നു.',
    pillar3Title: 'കാലതാമസം ഒഴിവാക്കൽ',
    pillar3Desc: 'AI സാങ്കേതികവിദ്യ വഴി നടപടികൾ വേഗത്തിലാക്കുന്നു.',
    strictRule1: 'നിയമം 1: കർശന പ്രവേശന നിയന്ത്രണം',
    strictRule2: 'നിയമം 2: പൂർണ്ണ സ്വകാര്യത',
    daysSaved: 'കേസുകളിൽ ശരാശരി 84 ദിവസത്തെ ലാഭം',

    advocateDirectory: 'അഭിഭാഷക ഡയറക്ടറി',
    connectVerifiedCounsels: 'ഹൈക്കോടതി, സുപ്രീം കോടതി അഭിഭാഷകരുമായി ബന്ധപ്പെടുക',
    filterAdvocatesDesc: 'സിവിൽ, ക്രിമിനൽ, കോർപ്പറേറ്റ് വിദഗ്ധരെ കണ്ടെത്തി കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക.',
    browseAdvocatesBtn: 'പരിശോധിച്ച അഭിഭാഷകരെ കാണുക',
    caseTrackingDelayMonitor: 'കേസ് ട്രാക്കിംഗ് & ഡിലേ മോണിറ്റർ',
    trackLitigationsTitle: 'കേസുകളും CNR നമ്പറുകളും ട്രാക്ക് ചെയ്യുക',
    trackLitigationsDesc: 'കോടതി കേസുകളുടെ വിവരങ്ങൾ തത്സമയം അറിയുക.',
    searchCaseByCnrBtn: 'CNR വഴി കേസ് തിരയുക',
    judicialDataSecurity: 'ഡാറ്റാ സുരക്ഷ',
    engineeredForConfidentiality: 'രഹസ്യസ്വഭാവം ഉറപ്പാക്കുന്നു',
    securityRule1Title: 'നിയമം 1: വെരിഫൈഡ് അഭിഭാഷകർക്ക് മാത്രം പ്രവേശനം',
    securityRule1Desc: 'അംഗീകാരമില്ലാത്തവർക്ക് 403 Forbidden വഴി പ്രവേശനം തടയുന്നു.',
    securityRule2Title: 'നിയമം 2: പൂർണ്ണ ക്ലയന്റ് ഐസൊലേഷൻ',
    securityRule2Desc: 'മറ്റുള്ളവരുടെ കേസ് ഫയലുകൾ ആർക്കും കാണാൻ കഴിയില്ല.',

    searchPlaceholder: 'വക്കീലിന്റെ പേര് അല്ലെങ്കിൽ ബാർ കൗൺസിൽ നമ്പർ നൽകുക...',
    filterByCourt: 'എല്ലാ കോടതികളും',
    filterByCity: 'എല്ലാ നഗരങ്ങളും',
    filterByPractice: 'എല്ലാ മേഖലകളും',
    consultFee: 'ഫീസ്',
    bookConsultation: 'ബുക്ക് ചെയ്യുക',
    verifiedAdvocate: 'വെരിഫൈഡ് അഡ്വക്കേറ്റ്',

    enterCnrOrNumber: 'CNR നമ്പർ നൽകുക...',
    searchCaseBtn: 'കേസ് നില പരിശോധിക്കുക',

    terms: 'നിബന്ധനകളും വ്യവസ്ഥകളും',
    privacy: 'സ്വകാര്യതാ നയം (DPDP നിയമം)',
    refunds: 'റീഫണ്ട് നയം',
    grievanceContact: 'ഹെൽപ്‌ഡെസ്ക്',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.'
  },

  mr: {
    overview: 'आढावा',
    findLawyer: 'वकील शोधा',
    findCase: 'केस शोधा',
    myCases: 'माझ्या केसेस',
    delayAnalytics: 'विलंब विश्लेषण',
    legalDocs: 'कायदेशीर कागदपत्रे',
    aiCounsel: 'AI कायदेशीर सल्लागार',
    voiceCaseFiler: 'बोलून केस दाखल करा (सर्व नागरिकांसाठी)',
    consultations: 'सल्लामसलत',
    membership: 'सदस्यत्व',
    tagline: 'वकिलांना जोडणे • नागरिकांचे सक्षमीकरण • विलंब कमी करणे',

    chooseLanguage: 'भाषा निवडा / आपली मातृभाषा निवडा',
    availableIn24: '24 भारतीय भाषांमध्ये व्हॉइस केस फाइलिंग सुविधा',

    membershipNotification: 'सदस्यत्व शुल्क सूचना',
    clientAccount: 'मुवक्किल खाते',
    advocateAccount: 'वकील खाते',
    clientMembershipMsg: 'मुवक्किल: सुरक्षित केस ट्रॅकिंग आणि वकिलांशी सल्लामसलतीसाठी वार्षिक फी ₹ 2,999 भरा.',
    advocateMembershipMsg: 'वकील: केस फाइल्स पाहण्यासाठी आणि सल्लामसलत स्वीकारण्यासाठी मासिक फी ₹ 3,999 भरा.',
    payClientFeeBtn: 'भरा ₹ 2,999 / वर्ष',
    payAdvocateFeeBtn: 'भरा ₹ 3,999 / महिना',
    activeMembership: 'सक्रिय सदस्यत्व',

    heroBadge: 'न्यायिक तंत्रज्ञान व्यासपीठ • बार कौन्सिल सत्यापित वकील',
    heroHeadline1: 'वकिलांचे जाळे.',
    heroHeadline2: 'नागरिकांचे सक्षमीकरण.',
    heroHeadline3: 'न्यायातील विलंब नष्ट करणे.',
    heroSubtitle: 'भारतातील आघाडीचे व्यासपीठ जे नागरिकांना सत्यापित वकिलांशी जोडते आणि 24 भारतीय भाषांमध्ये बोलून केस दाखल करण्याची सुविधा देते.',
    btnSpeakToFileCase: 'बोलून केस दाखल करा (Voice E-Filing)',
    btnFindLawyer: 'वकील शोधा',
    btnFindCase: 'केस शोधा',
    btnClientVault: 'माझे केस वॉल्ट',
    btnJoinAdvocate: 'वकील म्हणून सामील व्हा',
    heroQuickSearchPlaceholder: 'केस CNR नंबर (उदा. DLHC01-004182-2026) किंवा कोर्टाने शोधा...',
    quickLookup: 'त्वरित शोध',
    openAdvocateVault: 'वकील वॉल्ट उघडा',
    viewMyIsolatedCases: 'माझ्या सुरक्षित केसेस पहा',

    pillar1Title: 'सत्यापित वकील',
    pillar1Desc: 'स्टेट बार कौन्सिल नोंदणी आणि COP ची खात्री.',
    pillar2Title: 'सुरक्षित केस वॉल्ट',
    pillar2Desc: 'केस कागदपत्रांची पूर्ण गोपनीयता.',
    pillar3Title: 'विलंब कमी करणे',
    pillar3Desc: 'AI तंत्रज्ञानामुळे सुनावणी जलद होते.',
    strictRule1: 'नियम 1: कडक प्रवेश नियंत्रण',
    strictRule2: 'नियम 2: पूर्ण मुवक्किल पृथक्करण',
    daysSaved: 'प्रति केस सरासरी 84 दिवसांची बचत',

    advocateDirectory: 'वकील निर्देशिका',
    connectVerifiedCounsels: 'हायकोर्ट आणि सुप्रीम कोर्टातील वकिलांशी संपर्क साधा',
    filterAdvocatesDesc: 'दिवाणी, फौजदारी, व्यावसायिक आणि सायबर तज्ज्ञ वकिलांना शोधा आणि सल्ला बुक करा.',
    browseAdvocatesBtn: 'सत्यापित वकील पहा',
    caseTrackingDelayMonitor: 'केस ट्रॅकिंग आणि विलंब मॉनिटर',
    trackLitigationsTitle: 'केस आणि CNR नंबर ट्रॅक करा',
    trackLitigationsDesc: 'न्यायालयांमधील केसेसची सद्यस्थिती त्वरित शोधा.',
    searchCaseByCnrBtn: 'CNR द्वारे केस शोधा',
    judicialDataSecurity: 'डेटा सुरक्षा',
    engineeredForConfidentiality: 'कायदेशीर गोपनीयतेसाठी तयार',
    securityRule1Title: 'नियम 1: केवळ सत्यापित वकीलच फाइल्स पाहू शकतात',
    securityRule1Desc: 'इतरांना 403 Forbidden द्वारे प्रवेश नाकारला जातो.',
    securityRule2Title: 'नियम 2: पूर्ण मुवक्किल पृथक्करण',
    securityRule2Desc: 'कोणीही दुसऱ्याची केस पाहू शकत नाही.',

    searchPlaceholder: 'वकिलाचे नाव किंवा बार कौन्सिल नंबर टाका...',
    filterByCourt: 'सर्व न्यायालये',
    filterByCity: 'सर्व शहरे',
    filterByPractice: 'सर्व कायदेशीर क्षेत्रे',
    consultFee: 'सल्ला शुल्क',
    bookConsultation: 'सल्ला बुक करा',
    verifiedAdvocate: 'सत्यापित वकील',

    enterCnrOrNumber: 'CNR नंबर टाका...',
    searchCaseBtn: 'केस स्थिती शोधा',

    terms: 'अटी व शर्ती',
    privacy: 'गोपनीयता धोरण (DPDP कायदा)',
    refunds: 'रिफंड धोरण',
    grievanceContact: 'मदत केंद्र',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd. सर्व हक्क राखीव.'
  },

  bn: {
    overview: 'ওভারভিউ',
    findLawyer: 'উকিল খুঁজুন',
    findCase: 'কেস খুঁজুন',
    myCases: 'আমার মামলাসমূহ',
    delayAnalytics: 'দেরি বিশ্লেষণ',
    legalDocs: 'আইনি নথি',
    aiCounsel: 'AI আইনি উপদেষ্টা',
    voiceCaseFiler: 'মুখে বলে মামলা দায়ের করুন',
    consultations: 'পরামর্শ',
    membership: 'মেম্বারশিপ',
    tagline: 'আইনি সহায়তা • ন্যায়বিচারে গতি • দেরির অবসান',

    chooseLanguage: 'ভাষা বেছে নিন / আপনার মাতৃভাষা নির্বাচন করুন',
    availableIn24: '২৪টি ভারতীয় ভাষায় ভয়েস কেস ফাইলিং সুবিধা',

    membershipNotification: 'সদস্যপদ ফি বিজ্ঞপ্তি',
    clientAccount: 'মক্কেল অ্যাকাউন্ট',
    advocateAccount: 'আইনজীবী অ্যাকাউন্ট',
    clientMembershipMsg: 'মক্কেল: নিরাপদ কেস ট্র্যাকিং এবং আইনজীবীর পরামর্শের জন্য বার্ষিক ফি ₹ ২,৯৯৯ প্রদান করুন।',
    advocateMembershipMsg: 'আইনজীবী: কেস ফাইল দেখতে এবং পরামর্শ অনুরোধ গ্রহণ করতে মাসিক ফি ₹ ৩,৯৯৯ প্রদান করুন।',
    payClientFeeBtn: 'পরিশোধ করুন ₹ ২,৯৯৯ / বছর',
    payAdvocateFeeBtn: 'পরিশোধ করুন ₹ ৩,৯৯৯ / মাস',
    activeMembership: 'সক্রিয় সদস্যপদ',

    heroBadge: 'আইনি প্রযুক্তি প্ল্যাটফর্ম • বার কাউন্সিল ভেরিফাইড আইনজীবী',
    heroHeadline1: 'আইনজীবীদের সংযোগ।',
    heroHeadline2: 'নাগরিকের ক্ষমতায়ন।',
    heroHeadline3: 'দেরি দূরীকরণ।',
    heroSubtitle: 'ভারতের প্রধান আইনি প্ল্যাটফর্ম যা যাচাইকৃত আইনজীবীদের সাথে নাগরিকদের যুক্ত করে এবং ২৪টি ভারতীয় ভাষায় কথা বলে মামলা দায়ের করার সুবিধা দেয়।',
    btnSpeakToFileCase: 'কথা বলে মামলা দায়ের করুন (Voice E-Filing)',
    btnFindLawyer: 'উকিল খুঁজুন',
    btnFindCase: 'কেস খুঁজুন',
    btnClientVault: 'আমার কেস ভল্ট',
    btnJoinAdvocate: 'আইনজীবী হিসেবে যুক্ত হোন',
    heroQuickSearchPlaceholder: 'CNR নম্বর (যেমন DLHC01-004182-2026) দিয়ে খুঁজুন...',
    quickLookup: 'দ্রুত অনুসন্ধান',
    openAdvocateVault: 'আইনজীবী ভল্ট খুলুন',
    viewMyIsolatedCases: 'আমার মামলাগুলো দেখুন',

    pillar1Title: 'যাচাইকৃত আইনজীবী',
    pillar1Desc: 'স্টেট বার কাউন্সিল ও সিওপি যাচাইকৃত।',
    pillar2Title: 'নিরাপদ কেস ভল্ট',
    pillar2Desc: 'মামলার নথিপত্রের সম্পূর্ণ গোপনীয়তা।',
    pillar3Title: 'দেরি দূরীকরণ',
    pillar3Desc: 'AI প্রযুক্তির মাধ্যমে বিচার দ্রুত নিষ্পত্তি হয়।',
    strictRule1: 'নিয়ম ১: কঠোর অ্যাক্সেਸ নিয়ন্ত্রণ',
    strictRule2: 'নিয়ম ২: সম্পূর্ণ মক্কেল সুরক্ষা',
    daysSaved: 'প্রতি মামলায় গড়ে ৮৪ দিন সাশ্রয়',

    advocateDirectory: 'আইনজীবী ডিরেক্টরি',
    connectVerifiedCounsels: 'হাইকোর্ট এবং সুপ্রিম কোর্টের আইনজীবীদের সাথে যুক্ত হন',
    filterAdvocatesDesc: 'দেওয়ানি, ফৌজদারি এবং সাইবার বিশেষজ্ঞ সিনিয়র আইনজীবীদের খুঁজুন এবং পরামর্শ বুক করুন।',
    browseAdvocatesBtn: '১,৪২০+ যাচাইকৃত আইনজীবী দেখুন',
    caseTrackingDelayMonitor: 'কেস ট্র্যাকিং এবং বিলম্ব মনিটর',
    trackLitigationsTitle: 'মামলা এবং CNR নম্বর ট্র্যাক করুন',
    trackLitigationsDesc: 'আদালতের মামলার বর্তমান অবস্থা তাৎক্ষণিকভাবে অনুসন্ধান করুন।',
    searchCaseByCnrBtn: 'CNR দিয়ে মামলা খুঁজুন',
    judicialDataSecurity: 'তথ্য নিরাপত্তা',
    engineeredForConfidentiality: 'আইনি গোপনীয়তার জন্য নির্মিত',
    securityRule1Title: 'নিয়ম ১: কেবল যাচাইকৃত উকিলরাই ফাইল দেখতে পারেন',
    securityRule1Desc: 'অন্যদের জন্য 403 Forbidden সুরক্ষা কার্যকর।',
    securityRule2Title: 'নিয়ম ২: সম্পূর্ণ মক্কেল গোপনীয়তা',
    securityRule2Desc: 'কেউ অন্যের মামলা দেখতে পারবে না।',

    searchPlaceholder: 'আইনজীবীর নাম বা বার নম্বর দিন...',
    filterByCourt: 'সব আদালত',
    filterByCity: 'সব শহর',
    filterByPractice: 'সব ক্ষেত্র',
    consultFee: 'ফি',
    bookConsultation: 'পরামর্শ বুক করুন',
    verifiedAdvocate: 'যাচাইকৃত আইনজীবী',

    enterCnrOrNumber: 'CNR নম্বর দিন...',
    searchCaseBtn: 'কেসের অবস্থা খুঁজুন',

    terms: 'নিয়ম ও শর্তাবলী',
    privacy: 'গোপনীয়তা নীতি',
    refunds: 'রিফান্ড নীতি',
    grievanceContact: 'হেল্পডেস্ক',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd.'
  },

  gu: {
    overview: 'ઝાંખી',
    findLawyer: 'વકીલ શોધો',
    findCase: 'કેસ શોધો',
    myCases: 'મારા કેસો',
    delayAnalytics: 'વિલંબ વિશ્લેષણ',
    legalDocs: 'કાનૂની દસ્તાવેજો',
    aiCounsel: 'AI કાનૂની સલાહકાર',
    voiceCaseFiler: 'બોલીને કેસ દાખલ કરો',
    consultations: 'પરામર્શ',
    membership: 'સભ્યપદ',
    tagline: 'વકીલોનું જોડાણ • ઝડપી ન્યાય',

    chooseLanguage: 'ભાષા પસંદ કરો / તમારી માતૃભાષા પસંદ કરો',
    availableIn24: '24 ભારતીય ભાષાઓમાં વોઇસ કેસ ફાઇલિંગ સુવિધા',

    membershipNotification: 'સભ્યપદ ફી સૂચના',
    clientAccount: 'અસીલ ખાતું',
    advocateAccount: 'વકીલ ખાતું',
    clientMembershipMsg: 'અસીલ: સુરક્ષિત કેસ ટ્રેકિંગ અને વકીલ પરામર્શ માટે વાર્ષિક ફી ₹ 2,999 ચૂકવો.',
    advocateMembershipMsg: 'વકીલ: કેસ ફાઇલો જોવા અને પરામર્શ સ્વીકારવા માટે માસિક ફી ₹ 3,999 ચૂકવો.',
    payClientFeeBtn: 'ચૂકવો ₹ 2,999 / વર્ષ',
    payAdvocateFeeBtn: 'ચૂકવો ₹ 3,999 / મહિનો',
    activeMembership: 'સક્રિય સભ્યપદ',

    heroBadge: 'ન્યાયિક મંચ • બાર કાઉન્સિલ ચકાસાયેલ વકીલો',
    heroHeadline1: 'વકીલોનું નેટવર્ક.',
    heroHeadline2: 'નાગરિકોનું સશક્તિકરણ.',
    heroHeadline3: 'વિલંબનો અંત.',
    heroSubtitle: 'ચકાસાયેલ વકીલો સાથે નાગરિકોને જોડતું અને 24 ભાષાઓમાં બોલીને કેસ દાખલ કરવાની સુવિધા આપતું ભારતનું અગ્રણી પ્લેટફોર્મ.',
    btnSpeakToFileCase: 'બોલીને કેસ દાખલ કરો (Voice E-Filing)',
    btnFindLawyer: 'વકીલ શોધો',
    btnFindCase: 'કેસ શોધો',
    btnClientVault: 'મારો કેસ વોલ્ટ',
    btnJoinAdvocate: 'વકીલ તરીકે જોડાઓ',
    heroQuickSearchPlaceholder: 'CNR નંબર (દા.ત. DLHC01-004182-2026) થી શોધો...',
    quickLookup: 'ઝડપી શોધ',
    openAdvocateVault: 'વકીલ વોલ્ટ ખોલો',
    viewMyIsolatedCases: 'મારા કેસો જુઓ',

    pillar1Title: 'ચકાસાયેલ વકીલો',
    pillar1Desc: 'સ્ટેટ બાર કાઉન્સિલ નોંધણીની સંપૂર્ણ ચકાસણી.',
    pillar2Title: 'સુરક્ષિત કેસ વોલ્ટ',
    pillar2Desc: 'દસ્તાવેજોની સંપૂર્ણ ગુપ્તતા.',
    pillar3Title: 'વિલંબ ઘટાડો',
    pillar3Desc: 'AI ટેકનોલોજી દ્વારા ઝડપી ન્યાય.',
    strictRule1: 'નિયમ 1: કડક ઍક્સેસ નિયંત્રણ',
    strictRule2: 'નિયમ 2: સંપૂર્ણ ગુપ્તતા',
    daysSaved: 'પ્રતિ કેસ સરેરાશ 84 દિવસની બચત',

    advocateDirectory: 'વકીલ ડિરેક્ટરી',
    connectVerifiedCounsels: 'હાઇકોર્ટ અને સુપ્રીમ કોર્ટના વકીલો સાથે જોડાઓ',
    filterAdvocatesDesc: 'દિવાની, ફોજદારી અને સાયબર કાયદાના વરિષ્ઠ વકીલો શોધો અને પરામર્શ બુક કરો.',
    browseAdvocatesBtn: 'ચકાસાયેલ વકીલો જુઓ',
    caseTrackingDelayMonitor: 'કેસ ટ્રેકિંગ અને વિલંબ મોનિટર',
    trackLitigationsTitle: 'કેસ અને CNR નંબર ટ્રેક કરો',
    trackLitigationsDesc: 'અદાલતોમાં ચાલી રહેલા કેસોની સ્થિતિ તાત્કાલિક જાણો.',
    searchCaseByCnrBtn: 'CNR દ્વારા કેસ શોધો',
    judicialDataSecurity: 'ડેટા સુરક્ષા',
    engineeredForConfidentiality: 'કાનૂની ગુપ્તતા માટે નિર્મિત',
    securityRule1Title: 'નિયમ 1: માત્ર ચકાસાયેલ વકીલો ફાઇલો જોઈ શકે છે',
    securityRule1Desc: 'અન્ય લોકો માટે 403 Forbidden સુરક્ષા.',
    securityRule2Title: 'નિયમ 2: સંપૂર્ણ અસીલ ગુપ્તતા',
    securityRule2Desc: 'કોઈ અન્યનો કેસ જોઈ શકતું નથી.',

    searchPlaceholder: 'વકીલનું નામ અથવા બાર નંબર...',
    filterByCourt: 'તમામ અદાલતો',
    filterByCity: 'તમામ શહેરો',
    filterByPractice: 'તમામ વિભાગો',
    consultFee: 'પરામર્શ ફી',
    bookConsultation: 'બુક કરો',
    verifiedAdvocate: 'ચકાસાયેલ વકીલ',

    enterCnrOrNumber: 'CNR નંબર દાખલ કરો...',
    searchCaseBtn: 'સ્થિતિ તપાસો',

    terms: 'નિયમો અને શરતો',
    privacy: 'ગોપनीयતા નીતિ',
    refunds: 'રિફંડ નીતિ',
    grievanceContact: 'હેલ્પડેસ્ક',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd.'
  },

  ur: {
    overview: 'جائزہ',
    findLawyer: 'وکیل تلاش کریں',
    findCase: 'مقدمہ تلاش کریں',
    myCases: 'میرے مقدمات',
    delayAnalytics: 'تاخیر کا تجزیہ',
    legalDocs: 'قانونی دستاویزات',
    aiCounsel: 'AI قانونی مشیر',
    voiceCaseFiler: 'بول کر مقدمہ درج کروائیں',
    consultations: 'مشاورت',
    membership: 'رکنیت',
    tagline: 'وکلاء کا رابطہ • شہریوں کی مدد • تاخیر کا خاتمہ',

    chooseLanguage: 'زبان منتخب کریں / اپنی مادری زبان کا انتخاب کریں',
    availableIn24: '24 ہندوستانی زبانوں میں وائس کیس فائلنگ کی سہولت',

    membershipNotification: 'رکنیت فیس کی اطلاع',
    clientAccount: 'موکل اکاؤنٹ',
    advocateAccount: 'وکیل پریکٹس اکاؤنٹ',
    clientMembershipMsg: 'موکلین: کیس ٹریکنگ اور تصدیق شدہ وکلاء سے مشاورت کے لیے سالانہ فیس ₹ 2,999 ادا کریں۔',
    advocateMembershipMsg: 'وکلاء: کیس فائلیں دیکھنے اور مشاورت قبول کرنے کے لیے ماہانہ فیس ₹ 3,999 ادا کریں۔',
    payClientFeeBtn: 'ادائیگی کریں ₹ 2,999 / سال',
    payAdvocateFeeBtn: 'ادائیگی کریں ₹ 3,999 / ماہ',
    activeMembership: 'فعال رکنیت',

    heroBadge: 'عدالتی ٹیکنالوجی پلیٹ فارم • بار کونسل سے تصدیق شدہ وکلاء',
    heroHeadline1: 'وکلاء کا نیٹ ورک۔',
    heroHeadline2: 'شہریوں کا بااختیار بنانا۔',
    heroHeadline3: 'عدالتی تاخیر کا خاتمہ۔',
    heroSubtitle: 'ہندوستان کا معروف قانونی پلیٹ فارم جو شہریوں کو تصدیق شدہ وکلاء سے جوڑتا ہے اور 24 زبانوں میں بول کر مقدمہ درج کرنے کی سہولت فراہم کرتا ہے۔',
    btnSpeakToFileCase: 'بول کر مقدمہ درج کروائیں (Voice E-Filing)',
    btnFindLawyer: 'وکیل تلاش کریں',
    btnFindCase: 'مقدمہ تلاش کریں',
    btnClientVault: 'میرا کیس والٹ',
    btnJoinAdvocate: 'بطور وکیل شامل ہوں',
    heroQuickSearchPlaceholder: 'CNR نمبر (جیسے DLHC01-004182-2026) سے تلاش کریں...',
    quickLookup: 'فوری تلاش',
    openAdvocateVault: 'وکیل والٹ کھولیں',
    viewMyIsolatedCases: 'میرے محفوظ مقدمات دیکھیں',

    pillar1Title: 'تصدیق شدہ وکلاء',
    pillar1Desc: 'اسٹیٹ بار کونسل رجسٹریشن کی مکمل توثیق।',
    pillar2Title: 'محفوظ کیس والٹ',
    pillar2Desc: 'دستاویزات کی مکمل رازداری।',
    pillar3Title: 'تاخیر کا خاتمہ',
    pillar3Desc: 'AI ٹیکنالوجی کے ذریعے تیز تر فیصلے।',
    strictRule1: 'قاعدہ 1: سخت رسائی کا کنٹرول',
    strictRule2: 'قاعدہ 2: مکمل موکل کی رازداری',
    daysSaved: 'ہر مقدمے میں اوسطاً 84 دن کی بچت',

    advocateDirectory: 'وکلاء کی ڈائرکٹری',
    connectVerifiedCounsels: 'ہائی کورٹ اور سپریم کورٹ کے وکلاء سے رابطہ کریں',
    filterAdvocatesDesc: 'دیوانی، فوجداری اور سائبر قانون کے ماہر وکلاء تلاش کریں اور وقت بک کریں۔',
    browseAdvocatesBtn: 'تصدیق شدہ وکلاء دیکھیں',
    caseTrackingDelayMonitor: 'کیس ٹریکنگ اور تاخیر مانیٹر',
    trackLitigationsTitle: 'مقدمات اور CNR نمبرز ٹریک کریں',
    trackLitigationsDesc: 'عدالتوں میں درج مقدمات کی فوری صورتحال معلوم کریں۔',
    searchCaseByCnrBtn: 'CNR سے مقدمہ تلاش کریں',
    judicialDataSecurity: 'ڈیٹا کی حفاظت',
    engineeredForConfidentiality: 'قانونی رازداری کے لیے تیار کردہ',
    securityRule1Title: 'قاعدہ 1: صرف تصدیق شدہ وکلاء فائلیں دیکھ سکتے ہیں',
    securityRule1Desc: 'دوسروں کے لیے 403 Forbidden کے ذریعے رسائی بند۔',
    securityRule2Title: 'قاعدہ 2: مکمل موکل کی رازداری',
    securityRule2Desc: 'کوئی بھی دوسرے کا مقدمہ نہیں دیکھ سکتا۔',

    searchPlaceholder: 'وکیل کا نام یا بار نمبر درج کریں...',
    filterByCourt: 'تمام عدالتیں',
    filterByCity: 'تمام شہر',
    filterByPractice: 'تمام شعبے',
    consultFee: 'مشاورت فیس',
    bookConsultation: 'وقت بک کریں',
    verifiedAdvocate: 'تصدیق شدہ وکیل',

    enterCnrOrNumber: 'CNR نمبر درج کریں...',
    searchCaseBtn: 'کیس کی صورتحال دیکھیں',

    terms: 'شرائط و ضوابط',
    privacy: 'رازداری کی پالیسی',
    refunds: 'واپسی کی پالیسی',
    grievanceContact: 'شکایات کا ازالہ',
    copyright: '© 2026 JusticeBridge Legal Technologies Pvt Ltd. جملہ حقوق محفوظ ہیں۔'
  }
};

export function getTranslation(langCode: string, key: keyof TranslationDictionary): string {
  const currentDict = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
  if (currentDict && currentDict[key]) {
    return currentDict[key];
  }
  return TRANSLATIONS['en'][key] || String(key);
}
