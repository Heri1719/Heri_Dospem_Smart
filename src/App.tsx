import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { ExportModal } from './components/ExportModal';

import { DashboardView } from './components/DashboardView';
import { TopicExplorerView } from './components/TopicExplorerView';
import { ProblemFinderView } from './components/ProblemFinderView';
import { EvidenceExplorerView } from './components/EvidenceExplorerView';
import { LiteratureMatrixView } from './components/LiteratureMatrixView';
import { GapNoveltyView } from './components/GapNoveltyView';
import { TitleGeneratorView } from './components/TitleGeneratorView';
import { ResearchCanvasView } from './components/ResearchCanvasView';
import { ConsistencyCheckerView } from './components/ConsistencyCheckerView';
import { Bab1BuilderView } from './components/Bab1BuilderView';
import { AIReviewView } from './components/AIReviewView';

import {
  loadProjects,
  saveProject,
  createEmptyProject,
  resetToDemoProject,
  getActiveProjectId,
  setActiveProjectId,
  deleteProject,
} from './data/storage';
import { ResearchProject, WorkflowStepId } from './types';

export default function App() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [currentProject, setCurrentProject] = useState<ResearchProject | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStepId>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize projects on mount
  useEffect(() => {
    const stored = loadProjects();
    setProjects(stored);

    const activeId = getActiveProjectId();
    const found = stored.find((p) => p.id === activeId) || stored[0];
    if (found) {
      setCurrentProject(found);
    } else {
      // If no project exists at all, open onboarding
      setIsOnboardingOpen(true);
    }

    // Check system or saved dark mode
    const savedTheme = localStorage.getItem('risetflow_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update HTML class when dark mode changes
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('risetflow_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('risetflow_theme', 'light');
      }
      return next;
    });
  };

  // Switch active project
  const handleSelectProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setCurrentProject(found);
      setActiveProjectId(found.id);
    }
  };

  // Update current project state & persist to local storage
  const handleUpdateProject = (updated: ResearchProject) => {
    setCurrentProject(updated);
    saveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Create new project
  const handleCreateProject = (projectData: Partial<ResearchProject>) => {
    const created = createEmptyProject(projectData);
    const updatedList = [created, ...projects];
    setProjects(updatedList);
    setCurrentProject(created);
    setActiveProjectId(created.id);
    setCurrentStep('topic-explorer');
    setIsOnboardingOpen(false);
  };

  // Reset to demo project
  const handleResetDemo = () => {
    if (confirm('Muat ulang data riset contoh (Studi Kepatuhan TB Paru)? Data modifikasi pada proyek demo akan dikembalikan ke awal.')) {
      const demo = resetToDemoProject();
      const updatedList = [demo, ...projects.filter((p) => p.id !== demo.id)];
      setProjects(updatedList);
      setCurrentProject(demo);
      setActiveProjectId(demo.id);
      setCurrentStep('dashboard');
    }
  };

  // Import project from JSON
  const handleImportProject = (imported: ResearchProject) => {
    saveProject(imported);
    const updatedList = [imported, ...projects.filter((p) => p.id !== imported.id)];
    setProjects(updatedList);
    setCurrentProject(imported);
    setActiveProjectId(imported.id);
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-4">
        <OnboardingModal
          isOpen={true}
          onClose={() => {}}
          onCreateProject={handleCreateProject}
        />
      </div>
    );
  }

  // Render the corresponding active workflow step view
  const renderCurrentView = () => {
    switch (currentStep) {
      case 'dashboard':
        return (
          <DashboardView
            project={currentProject}
            onSelectStep={setCurrentStep}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onResetToDemo={handleResetDemo}
          />
        );
      case 'topic-explorer':
        return (
          <TopicExplorerView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('problem-finder')}
          />
        );
      case 'problem-finder':
        return (
          <ProblemFinderView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('evidence-explorer')}
          />
        );
      case 'evidence-explorer':
        return (
          <EvidenceExplorerView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('literature-matrix')}
          />
        );
      case 'literature-matrix':
        return (
          <LiteratureMatrixView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('gap-novelty')}
          />
        );
      case 'gap-novelty':
        return (
          <GapNoveltyView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('title-generator')}
          />
        );
      case 'title-generator':
        return (
          <TitleGeneratorView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('research-canvas')}
          />
        );
      case 'research-canvas':
        return (
          <ResearchCanvasView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('consistency-checker')}
          />
        );
      case 'consistency-checker':
        return (
          <ConsistencyCheckerView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('bab1-builder')}
          />
        );
      case 'bab1-builder':
        return (
          <Bab1BuilderView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onNextStep={() => setCurrentStep('ai-review')}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        );
      case 'ai-review':
        return (
          <AIReviewView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        );
      default:
        return (
          <DashboardView
            project={currentProject}
            onSelectStep={setCurrentStep}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onResetToDemo={handleResetDemo}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <Navbar
        currentProject={currentProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        onNewProject={() => setIsOnboardingOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Step-by-step Workflow Sidebar */}
        <Sidebar
          project={currentProject}
          currentProject={currentProject}
          currentStep={currentStep}
          onSelectStep={setCurrentStep}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onResetDemo={handleResetDemo}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Dynamic Content Main Stage */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6">
          {renderCurrentView()}
        </main>
      </div>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Export (DOCX, JSON, Text) Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={currentProject}
        onImportProject={handleImportProject}
      />
    </div>
  );
}
