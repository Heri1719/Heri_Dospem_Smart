import React from 'react';
import {
  LayoutDashboard,
  Compass,
  AlertCircle,
  Search,
  TableProperties,
  Sparkles,
  Heading,
  Layers,
  CheckCircle2,
  FileText,
  UserCheck,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ResearchProject, WorkflowStepId } from '../types';
import { calculateProjectProgress } from '../utils/helpers';

interface SidebarProps {
  project?: ResearchProject;
  currentProject?: ResearchProject;
  currentStep?: WorkflowStepId | string | number;
  activeStep?: WorkflowStepId | string | number;
  onSelectStep: (step: WorkflowStepId) => void;
  onResetDemo?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenExportModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  project,
  currentProject,
  currentStep,
  activeStep,
  onSelectStep,
  onResetDemo,
  isOpenMobile = false,
  onCloseMobile = () => {},
  isCollapsed = false,
  onToggleCollapse,
  onOpenExportModal,
}) => {
  const activeProj = project || currentProject;
  const { percentage, completedSteps, totalSteps, checklist } = calculateProjectProgress(activeProj);

  // Normalize active step id
  const currentStepId: string = String(currentStep || activeStep || 'dashboard');

  const menuItems: Array<{
    stepId: WorkflowStepId;
    label: string;
    icon: any;
    tag: string;
    checklistIndex?: number;
  }> = [
    { stepId: 'dashboard', label: 'Dashboard Riset', icon: LayoutDashboard, tag: 'Overview' },
    { stepId: 'topic-explorer', label: '01 Temukan Topik', icon: Compass, tag: 'Ide', checklistIndex: 0 },
    { stepId: 'problem-finder', label: '02 Temukan Masalah', icon: AlertCircle, tag: 'MDAEG', checklistIndex: 1 },
    { stepId: 'evidence-explorer', label: '03 Evidence Explorer', icon: Search, tag: 'Bukti', checklistIndex: 2 },
    { stepId: 'literature-matrix', label: '04 Literature Matrix', icon: TableProperties, tag: 'Matriks', checklistIndex: 3 },
    { stepId: 'gap-novelty', label: '05 Gap & Novelty', icon: Sparkles, tag: 'Kebaruan', checklistIndex: 4 },
    { stepId: 'title-generator', label: '06 Judul Penelitian', icon: Heading, tag: 'Judul', checklistIndex: 5 },
    { stepId: 'research-canvas', label: '07 Research Canvas', icon: Layers, tag: '1-Halaman', checklistIndex: 6 },
    { stepId: 'consistency-checker', label: '08 Cek Konsistensi', icon: CheckCircle2, tag: 'Audit', checklistIndex: 7 },
    { stepId: 'bab1-builder', label: '09 Bab 1 Builder', icon: FileText, tag: 'Draf', checklistIndex: 8 },
    { stepId: 'ai-review', label: '10 AI Review', icon: UserCheck, tag: 'Penguji', checklistIndex: 9 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`sticky top-0 z-30 h-[calc(100vh-4rem)] bg-stone-50 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between overflow-y-auto transition-all duration-200 ease-in-out shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64 sm:w-72'
        } ${isOpenMobile ? 'fixed left-0 top-16 z-50 translate-x-0' : 'max-lg:hidden'}`}
      >
        <div className="p-3.5 space-y-4">
          {/* Progress Card (Expanded only) */}
          {!isCollapsed && (
            <div className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                  Progress Riset
                </span>
                <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1.5 flex items-center justify-between">
                <span>{completedSteps} dari {totalSteps} tahapan</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {percentage === 100 ? 'Siap Uji' : 'Proses'}
                </span>
              </p>
            </div>
          )}

          {/* Workflow Navigation */}
          <div>
            {!isCollapsed && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Alur Metodologi Riset
              </div>
            )}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentStepId === item.stepId ||
                  currentStepId === String(item.checklistIndex! + 1);
                const isCheckDone =
                  item.checklistIndex !== undefined ? checklist[item.checklistIndex]?.isDone : false;

                return (
                  <button
                    key={item.stepId}
                    id={`sidebar-step-${item.stepId}`}
                    onClick={() => {
                      onSelectStep(item.stepId);
                      onCloseMobile();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left group ${
                      isActive
                        ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {isCheckDone && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-white' : 'bg-emerald-500'
                            }`}
                            title="Tahap telah terisi"
                          />
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                            isActive
                              ? 'bg-emerald-800 text-emerald-100'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Utility: Reset Demo & Collapse Toggle */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 space-y-2">
          {!isCollapsed && activeProj && (
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
              <span className="truncate max-w-[140px] text-[11px]" title={activeProj.field}>
                {activeProj.field || 'Bidang Umum'}
              </span>
              {onResetDemo && (
                <button
                  id="btn-reset-demo"
                  onClick={onResetDemo}
                  className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                  title="Kembalikan Proyek Demo Tuberkulosis S1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo</span>
                </button>
              )}
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center py-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs transition-colors"
              title={isCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
