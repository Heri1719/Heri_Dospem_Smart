export type DegreeLevel = 'S1' | 'S2';

export type WorkflowStepId =
  | 'dashboard'
  | 'topic-explorer'
  | 'problem-finder'
  | 'evidence-explorer'
  | 'literature-matrix'
  | 'gap-novelty'
  | 'title-generator'
  | 'research-canvas'
  | 'consistency-checker'
  | 'bab1-builder'
  | 'ai-review';

export type ReviewPersona = 'ramah' | 'kritis' | 'sidang';

export type ResearchDesignType =
  | 'Kuantitatif'
  | 'Kualitatif'
  | 'Mixed Method'
  | 'R&D'
  | 'Belum tahu';

export type DataAvailability =
  | 'sudah tersedia'
  | 'perlu mengambil data primer'
  | 'belum tahu';

export type FrameworkType = 'PICO' | 'PCC' | 'PEO' | 'SPIDER' | 'Kustom';

export type RatingLevel = 'Kurang' | 'Cukup' | 'Baik' | 'Sangat Baik';

export type GapCategory =
  | 'Population Gap'
  | 'Methodological Gap'
  | 'Intervention Gap'
  | 'Contextual Gap'
  | 'Measurement Gap'
  | 'Knowledge Gap'
  | 'Implementation Gap'
  | 'Technology Gap'
  | 'Temporal Gap'
  | 'Theoretical Gap';

export interface TopicDirection {
  id: string;
  topicName: string;
  phenomenon: string;
  coreProblem: string;
  potentialPopulation: string;
  variables: string[];
  rationale: string;
  possibleDesign: string;
  literatureKeywords: string[];
}

export interface ProblemCanvas {
  masalah: string; // M: Apa fenomena utamanya?
  dampak: string; // D: Mengapa masalah tersebut penting?
  area: string; // A: Siapa/populasi mana yang mengalami masalah?
  existingEffort: string; // E: Apa yang sudah dilakukan?
  gap: string; // G: Apa yang masih belum terjawab?
  gapStatus: 'verified' | 'unverified'; // "Gap sementara, perlu diverifikasi melalui literatur" vs diverifikasi
  notes?: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  authors?: string;
  year?: string;
  journalOrSource: string;
  doi?: string;
  url?: string;
  keyFindings: string;
  relationToStudy: string;
  isVerified: boolean;
  isInMatrix?: boolean;
}

export interface LiteratureMatrixRow {
  id: string;
  no?: number;
  authorYear: string;
  title: string;
  population: string;
  variables: string;
  intervention: string;
  method: string;
  instrument: string;
  findings: string;
  limitations: string;
  gap: string;
  relevance: string;
}

export interface IdentifiedGap {
  id: string;
  category: GapCategory;
  description: string;
  supportingEvidence: string;
  whyItsAGap: string;
  relevanceToStudy: string;
  howToAddress: string;
}

export interface NoveltyComparison {
  dimension: string; // Populasi, Intervensi, Variabel, Metode, Teknologi, Setting, Teori, Outcome, Integrasi
  previousStudies: string;
  plannedStudy: string;
  whatIsDifferent: string;
  whatIsNew: string;
  whatStudyAdds: string;
}

export interface TitleCandidate {
  id: string;
  title: string;
  mainProblem: string;
  variables: string[];
  population: string;
  setting: string;
  suggestedMethod: string;
  researchGapAnswered: string;
  novelty: string;
  rationale: string;
  clarity: RatingLevel;
  measurability: RatingLevel;
  feasibility: RatingLevel;
  degreeFit: RatingLevel;
  gapFit: RatingLevel;
}

export interface TitleDoctorResult {
  originalTitle: string;
  isTooBroad: boolean;
  isTooLong: boolean;
  areVariablesClear: boolean;
  isPopulationClear: boolean;
  isOutcomeClear: boolean;
  degreeSuitability: string;
  redundantWords: string[];
  methodMentionAdvice: string;
  identifiedIssues: string[];
  improvementSuggestions: string[];
  alternativeTitles: Array<{
    title: string;
    versionType: string; // misal: "Fokus & Terukur", "Versi Akademik Ringkas", "Eksplanatif S2"
    changesMade: string;
  }>;
}

export interface ResearchCanvasData {
  frameworkType: FrameworkType;
  title: string;
  phenomenon: string;
  problem: string;
  urgency: string;
  // Framework specific
  population: string;
  exposureOrIntervention: string;
  comparison: string;
  outcome: string;
  // Variables
  independentVariables: string[];
  dependentVariables: string[];
  confoundingOrOtherVariables: string[];
  // Research foundation
  researchGap: string;
  novelty: string;
  researchQuestion: string;
  objectivesGeneral: string;
  objectivesSpecific: string[];
  researchDesign: string;
  settingLocation: string;
  potentialInstruments: string[];
}

export interface ConsistencyItem {
  componentPair: string; // e.g., "Masalah ↔ Gap", "Judul ↔ Rumusan Masalah", etc.
  status: 'consistent' | 'warning' | 'inconsistent'; // ✓ Konsisten, ! Perlu diperbaiki, × Tidak konsisten
  issueFound: string;
  recommendation: string;
}

export interface OutlineParagraph {
  id: string;
  order: number;
  funnelStage: string; // e.g. "Paragraf 1: Definisi & Fenomena Inti Masalah"
  pillar?: 'masalah' | 'skala_urgensi' | 'kronologi' | 'solusi_novelty' | string;
  pillarLabel?: string; // e.g. "Pilar 1: Masalah", "Pilar 2: Skala & Urgensi", etc.
  coreIdea: string;
  requiredEvidenceTypes: string; // e.g. "Data statistik WHO (2023) / Kemenkes RI (2023)"
  draftContent: string;
  hasCitationNeeded: boolean;
  citationSources?: string[]; // e.g. ["WHO (2023)", "Kemenkes RI (2023)"] - maksimal 5 tahun terakhir
}

export interface Chapter1Data {
  outline: OutlineParagraph[];
  backgroundText: string;
  problemIdentification: string;
  problemLimitation: string;
  researchQuestions: Array<{
    id: string;
    question: string;
    derivedFromGap: string;
  }>;
  objectives: {
    general: string;
    specific: Array<{
      id: string;
      text: string;
      mappedQuestion: string;
      variableOrConcept: string;
      potentialAnalysis: string;
    }>;
  };
  significance: {
    theoretical?: string;
    practical?: string;
    population?: string;
    institution?: string;
    profession?: string;
    futureResearch?: string;
  };
}

export interface DocumentVersion {
  id: string;
  timestamp: string;
  label: string;
  section: string;
  originalText: string;
  suggestionText?: string;
  finalText: string;
}

export interface AiReviewResult {
  scoreSummary: string;
  wellDone: string[];
  needsImprovement: string[];
  coreIssues: string[];
  concreteSuggestions: string[];
  prioritizedRevisions: Array<{
    priority: number;
    title: string;
    description: string;
    actionableStep: string;
  }>;
}

export interface SupervisorChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  structuredFeedback?: {
    findings: string;
    reason: string;
    suggestion: string;
    improvementExample: string;
  };
}

export type ResearchGapItem = IdentifiedGap;
export type ResearchCanvas = ResearchCanvasData;
export type ParagraphOutlineItem = OutlineParagraph;
export type ResearchQuestionItem = { id: string; question: string; derivedFromGap: string };
export type SpecificObjectiveItem = {
  id: string;
  text: string;
  mappedQuestion?: string;
  variableOrConcept?: string;
  potentialAnalysis?: string;
};
export type VersionHistoryItem = DocumentVersion;

export interface ProposalReviewResult {
  score: number;
  verdict: string;
  overallFeedback: string;
  aspects: Array<{
    aspectName: string;
    score: number;
    analysis: string;
    recommendation: string;
  }>;
  potentialDefenseQuestions: Array<{
    question: string;
    howToAnswer: string;
  }>;
}

export interface SupervisorMessage {
  id: string;
  sender: 'student' | 'supervisor';
  text: string;
  timestamp: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  studentName?: string;
  studentId?: string;
  degreeLevel: DegreeLevel;
  field: string;
  program: string;
  topicInterest: string;
  populationInterest: string;
  phenomenonOrProblem: string;
  settingLocation: string;
  researchDesignPreference: ResearchDesignType;
  dataAvailability: DataAvailability;
  targetTimeline: string;
  createdAt: string;
  updatedAt: string;

  // Workflow states & artifacts
  activeStep: number; // 0: Dashboard, 1: Topic, 2: Problem, 3: Evidence, 4: Literature Matrix, 5: Gap & Novelty, 6: Judul, 7: Canvas, 8: Konsistensi, 9: Bab 1, 10: AI Review, 11: Export

  topicExplorer: {
    inputs: {
      field: string;
      interest: string;
      population: string;
      interestingProblem: string;
      setting: string;
      technologyOrIntervention: string;
    };
    generatedDirections: TopicDirection[];
    selectedTopicId?: string;
  };

  problemCanvas: ProblemCanvas;

  evidence: EvidenceSource[];

  literatureMatrix: LiteratureMatrixRow[];

  gapAnalysis: {
    gaps: IdentifiedGap[];
    novelty: NoveltyComparison[];
    summary: string;
  };

  titleCandidates: TitleCandidate[];
  selectedTitle?: string;
  titleDoctorHistory: TitleDoctorResult[];

  researchCanvas: ResearchCanvasData;

  consistencyCheck: {
    lastChecked?: string;
    items: ConsistencyItem[];
    overallSummary: string;
  };

  chapter1: Chapter1Data;

  versionHistory: DocumentVersion[];

  aiReview?: AiReviewResult;
  latestReview?: ProposalReviewResult;

  supervisorChat: SupervisorChatMessage[];
  supervisorChatHistory?: SupervisorMessage[];
}

