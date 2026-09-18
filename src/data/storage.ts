import { ResearchProject } from '../types';
import { DEMO_PROJECT } from './demoProject';

const STORAGE_KEY = 'risetflow_ai_projects_v1';
const ACTIVE_PROJECT_KEY = 'risetflow_ai_active_project_id_v1';

export function getStoredProjects(): ResearchProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = [DEMO_PROJECT];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      localStorage.setItem(ACTIVE_PROJECT_KEY, DEMO_PROJECT.id);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Auto-sync demo project outline to the latest 5-paragraph structure if needed
      const synced = parsed.map((p: ResearchProject) => {
        if (p.id === DEMO_PROJECT.id && p.chapter1?.outline?.length !== 5) {
          return {
            ...p,
            chapter1: {
              ...p.chapter1,
              outline: DEMO_PROJECT.chapter1.outline,
            },
          };
        }
        return p;
      });
      return synced;
    }
    return [DEMO_PROJECT];
  } catch (err) {
    console.warn('Failed to read from localStorage, using demo project', err);
    return [DEMO_PROJECT];
  }
}

export function saveStoredProjects(projects: ResearchProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage', err);
  }
}

export function getActiveProjectId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (id) return id;
    return DEMO_PROJECT.id;
  } catch {
    return DEMO_PROJECT.id;
  }
}

export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch (err) {
    console.error('Failed to save active project id', err);
  }
}

export function saveProject(project: ResearchProject): void {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  const updatedProject = { ...project, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }
  saveStoredProjects(projects);
}

export function deleteProject(id: string): ResearchProject[] {
  const projects = getStoredProjects();
  const filtered = projects.filter((p) => p.id !== id);
  const result = filtered.length > 0 ? filtered : [DEMO_PROJECT];
  saveStoredProjects(result);
  if (getActiveProjectId() === id) {
    setActiveProjectId(result[0].id);
  }
  return result;
}

export function resetToDemo(): ResearchProject {
  const projects = [DEMO_PROJECT];
  saveStoredProjects(projects);
  setActiveProjectId(DEMO_PROJECT.id);
  return DEMO_PROJECT;
}

export const loadProjects = getStoredProjects;
export const resetToDemoProject = resetToDemo;

export function createEmptyProject(initial?: Partial<ResearchProject>): ResearchProject {
  const newId = `project-${Date.now()}`;
  const newProj: ResearchProject = {
    ...DEMO_PROJECT,
    id: newId,
    title: initial?.title || 'Penelitian Baru Tanpa Judul',
    studentName: initial?.studentName || '',
    studentId: initial?.studentId || '',
    degreeLevel: initial?.degreeLevel || 'S1',
    field: initial?.field || 'Kesehatan & Keperawatan',
    program: initial?.program || '',
    topicInterest: initial?.topicInterest || '',
    populationInterest: initial?.populationInterest || '',
    phenomenonOrProblem: initial?.phenomenonOrProblem || '',
    settingLocation: initial?.settingLocation || '',
    researchDesignPreference: initial?.researchDesignPreference || 'Kuantitatif',
    dataAvailability: initial?.dataAvailability || 'perlu mengambil data primer',
    targetTimeline: initial?.targetTimeline || '6 bulan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activeStep: 1,
    topicExplorer: {
      inputs: {
        field: initial?.field || 'Kesehatan & Keperawatan',
        interest: initial?.topicInterest || '',
        population: initial?.populationInterest || '',
        interestingProblem: initial?.phenomenonOrProblem || '',
        setting: initial?.settingLocation || '',
        technologyOrIntervention: '',
      },
      generatedDirections: [],
    },
    problemCanvas: {
      masalah: initial?.phenomenonOrProblem || '',
      dampak: '',
      area: initial?.populationInterest || '',
      existingEffort: '',
      gap: '',
      gapStatus: 'unverified',
    },
    evidence: [],
    literatureMatrix: [],
    gapAnalysis: {
      gaps: [],
      novelty: [],
      summary: '',
    },
    titleCandidates: [],
    selectedTitle: initial?.title || '',
    titleDoctorHistory: [],
    researchCanvas: {
      frameworkType: 'PICO',
      title: initial?.title || '',
      phenomenon: initial?.phenomenonOrProblem || '',
      problem: '',
      urgency: '',
      population: initial?.populationInterest || '',
      exposureOrIntervention: '',
      comparison: '',
      outcome: '',
      independentVariables: [],
      dependentVariables: [],
      confoundingOrOtherVariables: [],
      researchGap: '',
      novelty: '',
      researchQuestion: '',
      objectivesGeneral: '',
      objectivesSpecific: [],
      researchDesign: initial?.researchDesignPreference || 'Kuantitatif',
      settingLocation: initial?.settingLocation || '',
      potentialInstruments: [],
    },
    consistencyCheck: {
      items: [],
      overallSummary: '',
    },
    chapter1: {
      outline: [],
      backgroundText: '',
      problemIdentification: '',
      problemLimitation: '',
      researchQuestions: [],
      objectives: { general: '', specific: [] },
      significance: {},
    },
    versionHistory: [],
    supervisorChat: [],
    supervisorChatHistory: [],
  };

  saveProject(newProj);
  setActiveProjectId(newId);
  return newProj;
}

