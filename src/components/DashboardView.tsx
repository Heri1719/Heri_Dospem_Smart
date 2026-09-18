import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  FileText,
  AlertCircle,
  ShieldCheck,
  Compass,
  Search,
  TableProperties,
  Heading,
  Check,
  ChevronRight,
} from 'lucide-react';
import { ResearchProject, WorkflowStepId } from '../types';
import { calculateProjectProgress, formatDate } from '../utils/helpers';

interface DashboardViewProps {
  project: ResearchProject;
  onNavigateStep?: (stepIndex: number) => void;
  onSelectStep?: (step: WorkflowStepId) => void;
  onNewProjectClick?: () => void;
  onOpenExportModal?: () => void;
  onResetToDemo?: () => void;
}

const STEP_ID_MAP: Record<number, WorkflowStepId> = {
  0: 'dashboard',
  1: 'topic-explorer',
  2: 'problem-finder',
  3: 'evidence-explorer',
  4: 'literature-matrix',
  5: 'gap-novelty',
  6: 'title-generator',
  7: 'research-canvas',
  8: 'consistency-checker',
  9: 'bab1-builder',
  10: 'ai-review',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  onNavigateStep,
  onSelectStep,
  onNewProjectClick,
  onOpenExportModal,
  onResetToDemo,
}) => {
  const { percentage, completedSteps, totalSteps, checklist } = calculateProjectProgress(project);

  const handleGoStep = (stepNumber: number) => {
    if (onSelectStep) {
      const stepId = STEP_ID_MAP[stepNumber] || 'dashboard';
      onSelectStep(stepId);
    } else if (onNavigateStep) {
      onNavigateStep(stepNumber);
    }
  };

  // Workflow stages visual flow
  const workflowStages = [
    { label: 'IDE', step: 1 },
    { label: 'MASALAH', step: 2 },
    { label: 'BUKTI', step: 3 },
    { label: 'RESEARCH GAP', step: 5 },
    { label: 'NOVELTY', step: 5 },
    { label: 'JUDUL', step: 6 },
    { label: 'KONSEP PENELITIAN', step: 7 },
    { label: 'BAB 1', step: 9 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Welcome Hero & Philosophical Workflow */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace Pembimbing Riset Digital</span>
            </div>
            <div className="text-xs text-stone-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>Terakhir diedit: {formatDate(project.updatedAt)}</span>
            </div>
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              {project.selectedTitle || project.title || 'Proyek Riset Tanpa Judul'}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {project.phenomenonOrProblem ||
                'Membantu menyusun penelitian secara bertahap dari identifikasi masalah, evidence literatur, hingga draf Bab 1 siap seminar.'}
            </p>
          </div>

          {/* S1 vs S2 Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <span
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
                project.degreeLevel === 'S2'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-700/50'
                  : 'bg-blue-900/60 text-blue-200 border border-blue-700/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              {project.degreeLevel === 'S2' ? 'Jenjang S2 • Tesis' : 'Jenjang S1 • Skripsi'}
            </span>
            <span className="px-3 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 font-medium">
              {project.field}
            </span>
            <span className="px-3 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 font-medium">
              Desain: {project.researchDesignPreference}
            </span>
            {project.settingLocation && (
              <span className="px-3 py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 font-medium truncate max-w-xs">
                Lokasi: {project.settingLocation}
              </span>
            )}
          </div>

          {/* Step Flow Ribbon */}
          <div className="pt-3 border-t border-stone-800/80">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Filosofi Alur Riset Bertahap (Bukan Sekadar Generator Teks)
            </div>
            <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono">
              {workflowStages.map((wf, idx) => (
                <React.Fragment key={wf.label}>
                  <button
                    onClick={() => handleGoStep(wf.step)}
                    className="px-2.5 py-1 rounded-md bg-stone-800/90 hover:bg-stone-700 border border-stone-700/70 text-stone-200 hover:text-white transition-colors cursor-pointer"
                  >
                    {wf.label}
                  </button>
                  {idx < workflowStages.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Progress Card */}
        <div className="md:col-span-1 p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Kesiapan Proposal
            </h3>
            <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-3 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {completedSteps} dari {totalSteps} tahapan telah diselesaikan. Penelitian Anda berada dalam kondisi{' '}
            <strong>{percentage >= 80 ? 'Sangat Siap' : percentage >= 50 ? 'Berkembang Baik' : 'Tahap Awal'}</strong>.
          </p>

          <button
            onClick={() => handleGoStep(percentage === 100 ? 9 : completedSteps + 1)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <span>{percentage === 100 ? 'Review & Ekspor Bab 1' : 'Lanjutkan Tahapan Riset'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 10-Step Interactive Checklist */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-2">
            <h3 id="dashboard-checklist-heading" className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Checklist 10 Tahap
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Klik tahapan untuk melompat
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {checklist.map((item) => (
              <button
                key={item.stepNumber}
                onClick={() => handleGoStep(item.stepNumber)}
                className={`p-2.5 rounded-xl border text-left flex items-start justify-between gap-2 transition-all ${
                  item.isDone
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-stone-900 dark:text-stone-100 hover:border-emerald-300'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold truncate">
                    {item.isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-400 dark:border-stone-500 shrink-0" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate pl-5">
                    {item.advice}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* S1 vs S2 Methodological Calibration & Academic Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif font-bold text-sm">
            <GraduationCap className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Panduan Kalibrasi Jenjang ({project.degreeLevel === 'S2' ? 'S2 Tesis' : 'S1 Skripsi'})</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {project.degreeLevel === 'S2'
              ? 'Untuk jenjang S2, AI mendorong analisis yang memiliki kedalaman teori, pengembangan model/intervensi, explanatory research, mediation/moderation, atau comparative effectiveness.'
              : 'Untuk jenjang S1, AI memprioritaskan riset yang feasible, ruang lingkup jelas, batasan variabel terukur (bivariat/korelasional/deskriptif), dan dapat diselesaikan dalam 4–6 bulan tanpa model berlebihan.'}
          </p>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
            Mode Kalibrasi: Aktif menyesuaikan Title Generator, Gap Analyzer, dan Bab 1.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Prinsip Integritas & Citation Safety</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            RisetFlow AI menerapkan aturan ketat: dilarang mengarang penulis, jurnal, DOI, atau angka prevalensi palsu. Jika data empiris belum ditemukan, aplikasi menandai dengan <code>[CITATION NEEDED]</code>.
          </p>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            Tanggung jawab validitas akhir tetap berada pada mahasiswa peneliti.
          </div>
        </div>
      </div>
    </div>
  );
};
