import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Wand2,
  Download,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  Save,
  Globe,
  Calendar,
  BookmarkCheck,
  Check,
  Lightbulb,
} from 'lucide-react';
import { ResearchProject, Chapter1Data, ParagraphOutlineItem, ResearchQuestionItem, SpecificObjectiveItem, VersionHistoryItem } from '../types';
import { countWords } from '../utils/helpers';

interface Bab1BuilderViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
  onOpenExportModal: () => void;
}

export const Bab1BuilderView: React.FC<Bab1BuilderViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
  onOpenExportModal,
}) => {
  const [activeSection, setActiveSection] = useState<'1.1' | '1.2' | '1.3' | '1.4' | '1.5' | 'preview'>('1.1');

  const ch1: Chapter1Data = project.chapter1 || {
    outline: [],
    backgroundText: '',
    problemIdentification: '',
    problemLimitation: '',
    researchQuestions: [],
    objectives: { general: '', specific: [] },
    significance: {},
  };

  const outline = ch1.outline || [];
  const questions = ch1.researchQuestions || [];
  const objectives = ch1.objectives || { general: '', specific: [] };
  const significance = ch1.significance || {};

  // Coach modal / floating action
  const [selectedParagraph, setSelectedParagraph] = useState<ParagraphOutlineItem | null>(null);
  const [coachAction, setCoachAction] = useState<string>('academic_style');
  const [customCoachInstruction, setCustomCoachInstruction] = useState<string>('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState<{ improved: string; explanation: string } | null>(null);

  // Loading states
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isDraftingSingle, setIsDraftingSingle] = useState<string | null>(null);
  const [isGeneratingSections, setIsGeneratingSections] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<'all' | 'masalah' | 'skala_urgensi' | 'kronologi' | 'solusi_novelty'>('all');

  // Helper to determine which of the 4 pillars a paragraph belongs to
  const getPillarInfo = (item: ParagraphOutlineItem, index: number) => {
    if (
      item.pillar === 'masalah' ||
      item.pillarLabel?.toLowerCase().includes('masalah') ||
      item.funnelStage.toLowerCase().includes('definisi') ||
      (index === 0 && !item.pillar)
    ) {
      return {
        key: 'masalah' as const,
        num: 1,
        title: 'Pilar 1: Masalah',
        desc: 'Definisi konsep & fenomena inti masalah',
        color: 'emerald',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        dotClass: 'bg-emerald-600',
      };
    }
    if (
      item.pillar === 'skala_urgensi' ||
      item.pillarLabel?.toLowerCase().includes('skala') ||
      item.funnelStage.toLowerCase().includes('skala') ||
      item.funnelStage.toLowerCase().includes('dunia') ||
      item.funnelStage.toLowerCase().includes('global') ||
      item.funnelStage.toLowerCase().includes('urgensi') ||
      ((index === 1 || index === 2) && !item.pillar)
    ) {
      const isUrgency = item.funnelStage.toLowerCase().includes('urgensi') || index === 2;
      return {
        key: 'skala_urgensi' as const,
        num: 2,
        title: isUrgency ? 'Pilar 2: Urgensi Masalah' : 'Pilar 2: Skala Masalah',
        desc: isUrgency
          ? 'Dampak fatal & kondisi setting spesifik lokasi'
          : 'Besarnya masalah di tingkat dunia hingga nasional/regional',
        color: 'blue',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
        dotClass: 'bg-blue-600',
      };
    }
    if (
      item.pillar === 'kronologi' ||
      item.pillarLabel?.toLowerCase().includes('kronologi') ||
      item.funnelStage.toLowerCase().includes('kronologi') ||
      item.funnelStage.toLowerCase().includes('gap') ||
      item.funnelStage.toLowerCase().includes('upaya') ||
      (index === 3 && !item.pillar)
    ) {
      return {
        key: 'kronologi' as const,
        num: 3,
        title: 'Pilar 3: Kronologi & Gap',
        desc: 'Kronologi penyebab, evaluasi upaya saat ini & research gap',
        color: 'amber',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        dotClass: 'bg-amber-600',
      };
    }
    return {
      key: 'solusi_novelty' as const,
      num: 4,
      title: 'Pilar 4: Solusi & Novelty',
      desc: 'Solusi ide penelitian, novelty riset & penegasan judul',
      color: 'purple',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
      dotClass: 'bg-purple-600',
    };
  };

  // Generate 6-8 Funnel Outline
  const handleGenerateOutline = async () => {
    setIsGeneratingOutline(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/chapter1-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectContext: project }),
      });

      if (!res.ok) throw new Error('Gagal menghasilkan outline latar belakang.');

      const data = await res.json();
      const newOutline: ParagraphOutlineItem[] = data.outline || [];

      onUpdateProject({
        ...project,
        chapter1: {
          ...ch1,
          outline: newOutline,
        },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Draft a specific single paragraph with source-aware rules
  const handleDraftParagraph = async (pItem: ParagraphOutlineItem) => {
    setIsDraftingSingle(pItem.id);
    setError(null);

    try {
      const res = await fetch('/api/ai/chapter1-draft-paragraph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphInfo: pItem,
          projectContext: project,
        }),
      });

      if (!res.ok) throw new Error('Gagal mendraf paragraf.');

      const data = await res.json();
      const updatedOutline = outline.map((item) =>
        item.id === pItem.id
          ? {
              ...item,
              draftContent: data.draftContent,
              hasCitationNeeded: data.hasCitationNeeded,
              citationSources: data.citationSources || item.citationSources,
              pillar: data.pillar || item.pillar,
              pillarLabel: data.pillarLabel || item.pillarLabel,
            }
          : item
      );

      onUpdateProject({
        ...project,
        chapter1: {
          ...ch1,
          outline: updatedOutline,
        },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDraftingSingle(null);
    }
  };

  // Generate Rumusan, Tujuan, Manfaat
  const handleGenerateOtherSections = async () => {
    setIsGeneratingSections(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/chapter1-rumusan-tujuan-manfaat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectContext: project }),
      });

      if (!res.ok) throw new Error('Gagal menghasilkan rumusan & tujuan.');

      const data = await res.json();
      onUpdateProject({
        ...project,
        chapter1: {
          ...ch1,
          problemIdentification: data.problemIdentification || ch1.problemIdentification,
          problemLimitation: data.problemLimitation || ch1.problemLimitation,
          researchQuestions: data.researchQuestions || ch1.researchQuestions,
          objectives: data.objectives || ch1.objectives,
          significance: data.significance || ch1.significance,
        },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingSections(false);
    }
  };

  // Run Paragraph Coach (Revisi Sesuai Arahan)
  const handleRunCoach = async () => {
    if (!selectedParagraph || !selectedParagraph.draftContent) return;
    setCoachLoading(true);

    try {
      const res = await fetch('/api/ai/paragraph-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphText: selectedParagraph.draftContent,
          actionType: coachAction,
          customInstruction: customCoachInstruction.trim() || undefined,
          projectContext: project,
        }),
      });

      if (!res.ok) throw new Error('Gagal merevisi paragraf sesuai arahan.');

      const data = await res.json();
      setCoachFeedback({
        improved: data.improvedParagraph,
        explanation: data.explanationOfChanges,
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCoachLoading(false);
    }
  };

  const handleApplyCoachedParagraph = () => {
    if (!selectedParagraph || !coachFeedback) return;
    const updatedOutline = outline.map((item) =>
      item.id === selectedParagraph.id
        ? {
            ...item,
            draftContent: coachFeedback.improved,
          }
        : item
    );

    // Save to version history
    const newVersion: VersionHistoryItem = {
      id: `ver-${Date.now()}`,
      timestamp: new Date().toISOString(),
      label: `Revisi Paragraf (${customCoachInstruction ? 'Arahan Khusus' : coachAction})`,
      section: selectedParagraph.funnelStage,
      originalText: selectedParagraph.draftContent,
      suggestionText: coachFeedback.improved,
      finalText: coachFeedback.improved,
    };

    onUpdateProject({
      ...project,
      chapter1: {
        ...ch1,
        outline: updatedOutline,
      },
      versionHistory: [newVersion, ...(project.versionHistory || [])],
    });

    setSelectedParagraph(null);
    setCoachFeedback(null);
    setCustomCoachInstruction('');
  };

  // Calculate full chapter words
  const fullText = [
    outline.map((o) => o.draftContent).join('\n\n'),
    ch1.problemIdentification,
    ch1.problemLimitation,
    questions.map((q) => q.question).join('\n'),
    objectives.general,
    objectives.specific?.map((s) => s.text).join('\n'),
    Object.values(significance).join('\n'),
  ].join('\n\n');

  const totalWords = countWords(fullText);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Modul 09: Bab 1 Proposal Builder
              </h2>
              <p className="text-xs text-stone-500">
                Latar Belakang (Pendekatan Corong), Rumusan Masalah, Tujuan & Manfaat Kontekstual.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              {totalWords} kata total
            </span>

            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-xl transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Proposal</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 text-xs font-medium border-t border-stone-100 dark:border-stone-800/80 mt-3">
          {[
            { id: '1.1', label: '1.1 Latar Belakang' },
            { id: '1.2', label: '1.2 Identifikasi Masalah' },
            { id: '1.3', label: '1.3 Rumusan Masalah' },
            { id: '1.4', label: '1.4 Tujuan Penelitian' },
            { id: '1.5', label: '1.5 Manfaat Penelitian' },
            { id: 'preview', label: 'Draf Utuh Bab 1' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeSection === sec.id
                  ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* SECTION 1.1: LATAR BELAKANG */}
      {activeSection === '1.1' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  1.1 Latar Belakang
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Format 4 Pilar Wajib
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Alur logis: Masalah, Skala & Urgensi, Kronologi Masalah, serta Solusi & Novelty (Sitasi mutakhir ≤ 5 tahun).
              </p>
            </div>

            <button
              onClick={handleGenerateOutline}
              disabled={isGeneratingOutline}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
            >
              {isGeneratingOutline ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyusun Paragraf...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Susun Paragraf dengan AI</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Pilar Metodologi & Aturan Sitasi Mutakhir (≤ 5 Tahun) */}
          <div className="p-4 bg-gradient-to-br from-emerald-50/70 via-stone-50 to-blue-50/50 dark:from-stone-900 dark:via-stone-800/90 dark:to-stone-900 border border-emerald-200/80 dark:border-stone-700 rounded-2xl shadow-2xs space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  4P
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    Struktur Wajib 4 Pilar & Sitasi Mutakhir (Maksimal 5 Tahun Terakhir: 2021–2026)
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">
                    Setiap paragraf wajib merujuk pustaka primer mutakhir (≤ 5 tahun) dan disusun berjenjang:
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sitasi: 2021 – 2026</span>
              </div>
            </div>

            {/* 4 Grid Pilar Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] flex items-center justify-center font-mono">1</span>
                  <span>Masalah</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight">
                  Definisi konsep dan fenomena inti masalah substantif yang diangkat.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-blue-200 dark:border-blue-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] flex items-center justify-center font-mono">2</span>
                  <span>Skala & Urgensi</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight">
                  Prevalensi global (WHO), nasional (Kemenkes/BPS), lokasi sasaran & urgensi fatal bila diabaikan.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-amber-200 dark:border-amber-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-[10px] flex items-center justify-center font-mono">3</span>
                  <span>Kronologi Masalah</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight">
                  Dinamika determinan, dampak komplikasi, evaluasi upaya saat ini & research gap.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-purple-200 dark:border-purple-800/50 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-800 dark:text-purple-300 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-[10px] flex items-center justify-center font-mono">4</span>
                  <span>Solusi & Novelty</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight">
                  Solusi terintegrasi, rasional variabel, kebaruan (novelty) riset & rumusan judul.
                </p>
              </div>
            </div>
          </div>

          {/* Outline items list */}
          {outline.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-2xl text-stone-500 text-xs">
              Outline belum dibuat. Klik <strong>"Susun Paragraf dengan AI"</strong> untuk memulai penyusunan latar belakang 4 pilar.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quick Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-stone-200 dark:border-stone-700 text-xs">
                <button
                  onClick={() => setSelectedPillarFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedPillarFilter === 'all'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  Semua Paragraf ({outline.length})
                </button>
                <button
                  onClick={() => setSelectedPillarFilter('masalah')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedPillarFilter === 'masalah'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  Pilar 1: Masalah ({outline.filter((it, idx) => getPillarInfo(it, idx).key === 'masalah').length})
                </button>
                <button
                  onClick={() => setSelectedPillarFilter('skala_urgensi')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedPillarFilter === 'skala_urgensi'
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100'
                  }`}
                >
                  Pilar 2: Skala & Urgensi ({outline.filter((it, idx) => getPillarInfo(it, idx).key === 'skala_urgensi').length})
                </button>
                <button
                  onClick={() => setSelectedPillarFilter('kronologi')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedPillarFilter === 'kronologi'
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                  }`}
                >
                  Pilar 3: Kronologi & Gap ({outline.filter((it, idx) => getPillarInfo(it, idx).key === 'kronologi').length})
                </button>
                <button
                  onClick={() => setSelectedPillarFilter('solusi_novelty')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedPillarFilter === 'solusi_novelty'
                      ? 'bg-purple-700 text-white'
                      : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100'
                  }`}
                >
                  Pilar 4: Solusi & Novelty ({outline.filter((it, idx) => getPillarInfo(it, idx).key === 'solusi_novelty').length})
                </button>
              </div>

              {outline
                .map((item, originalIdx) => ({ item, originalIdx }))
                .filter(({ item, originalIdx }) => {
                  if (selectedPillarFilter === 'all') return true;
                  return getPillarInfo(item, originalIdx).key === selectedPillarFilter;
                })
                .map(({ item, originalIdx }) => {
                  const pillar = getPillarInfo(item, originalIdx);
                  return (
                    <div
                      key={item.id || originalIdx}
                      className="p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {originalIdx + 1}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${pillar.badgeClass}`}>
                              {pillar.title}
                            </span>
                            <h4 className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                              {item.funnelStage}
                            </h4>
                            {item.hasCitationNeeded && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300">
                                Perlu Data Lokal / Sitasi
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-300 pl-7">
                            <strong>Ide Pokok:</strong> {item.coreIdea}
                          </p>
                          <p className="text-[11px] text-stone-400 pl-7">
                            <strong>Kebutuhan Rujukan:</strong> {item.requiredEvidenceTypes}
                          </p>

                          {/* Citation Sources Pills (≤ 5 Tahun) */}
                          <div className="flex flex-wrap items-center gap-1.5 pl-7 pt-0.5">
                            <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Sitasi Mutakhir (≤ 5 Th):
                            </span>
                            {item.citationSources && item.citationSources.length > 0 ? (
                              item.citationSources.map((cit, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-medium"
                                >
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>{cit}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-stone-400 italic">
                                {item.hasCitationNeeded ? 'Lengkapi sumber statistik / data puskesmas riil' : 'Sitasi terintegrasi dalam paragraf'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleDraftParagraph(item)}
                            disabled={isDraftingSingle === item.id}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                          >
                            {isDraftingSingle === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Wand2 className="w-3 h-3" />
                            )}
                            <span>Susun Paragraf dengan AI</span>
                          </button>

                          {item.draftContent && (
                            <button
                              onClick={() => {
                                setSelectedParagraph(item);
                                setCoachFeedback(null);
                              }}
                              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1"
                              title="Bina Paragraf (Paragraph Coach)"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>Coach</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Draft content editor */}
                      <div>
                        <textarea
                          rows={4}
                          value={item.draftContent || ''}
                          onChange={(e) => {
                            const updated = outline.map((o) =>
                              o.id === item.id ? { ...o, draftContent: e.target.value } : o
                            );
                            onUpdateProject({
                              ...project,
                              chapter1: { ...ch1, outline: updated },
                            });
                          }}
                          placeholder="Draf teks paragraf ilmiah 4 pilar..."
                          className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-serif leading-relaxed text-stone-800 dark:text-stone-200"
                        />
                        <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1 px-1">
                          <span>{countWords(item.draftContent || '')} kata</span>
                          <span>Dapat diedit manual secara bebas • Sitasi wajib 5 tahun terakhir</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 1.2: IDENTIFIKASI & BATASAN MASALAH */}
      {activeSection === '1.2' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                1.2 Identifikasi & Pembatasan Masalah
              </h3>
              <p className="text-xs text-stone-500">
                Poin-poin masalah yang teridentifikasi di lapangan dan batasan agar penelitian tetap fokus dan feasible.
              </p>
            </div>
            <button
              onClick={handleGenerateOtherSections}
              disabled={isGeneratingSections}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl"
            >
              {isGeneratingSections ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Sinkronkan dari Canvas</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Identifikasi Masalah (Poin-poin fenomena di lapangan):
              </label>
              <textarea
                rows={5}
                value={ch1.problemIdentification || ''}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    chapter1: { ...ch1, problemIdentification: e.target.value },
                  })
                }
                placeholder="1. Kepatuhan minum obat pasien TB masih di bawah target nasional...&#10;2. Pendampingan PMO keluarga belum optimal...&#10;3. Belum tersedianya media pengingat digital..."
                className="w-full p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Pembatasan Masalah (Ruang lingkup variabel, subjek, dan lokasi):
              </label>
              <textarea
                rows={4}
                value={ch1.problemLimitation || ''}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    chapter1: { ...ch1, problemLimitation: e.target.value },
                  })
                }
                placeholder="Penelitian ini dibatasi pada evaluasi pengaruh edukasi berbasis media X terhadap tingkat kepatuhan minum obat pada pasien TB dewasa fase intensif di wilayah Puskesmas Y..."
                className="w-full p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1.3: RUMUSAN MASALAH */}
      {activeSection === '1.3' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                1.3 Rumusan Masalah Penelitian
              </h3>
              <p className="text-xs text-stone-500">
                Diturunkan secara konsisten dari Research Gap dan variabel judul tanpa memperkenalkan variabel liar baru.
              </p>
            </div>
            <button
              onClick={handleGenerateOtherSections}
              disabled={isGeneratingSections}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl"
            >
              {isGeneratingSections ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Sinkronkan dari Canvas</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/60 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                    Pertanyaan #{idx + 1}
                  </span>
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const updated = questions.map((item) =>
                      item.id === q.id ? { ...item, question: e.target.value } : item
                    );
                    onUpdateProject({
                      ...project,
                      chapter1: { ...ch1, researchQuestions: updated },
                    });
                  }}
                  className="w-full p-2.5 font-semibold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 border rounded-lg focus:outline-none"
                />
                {q.derivedFromGap && (
                  <p className="text-[11px] text-stone-500 italic">
                    Diturunkan dari: {q.derivedFromGap}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 1.4: TUJUAN PENELITIAN */}
      {activeSection === '1.4' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                1.4 Tujuan Penelitian
              </h3>
              <p className="text-xs text-stone-500">
                Tujuan Umum dan Tujuan Khusus yang terukur, dipetakan ke dalam rencana analisis statistik.
              </p>
            </div>
            <button
              onClick={handleGenerateOtherSections}
              disabled={isGeneratingSections}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl"
            >
              {isGeneratingSections ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Sinkronkan dari Canvas</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1">
                1.4.1 Tujuan Umum
              </label>
              <textarea
                rows={2}
                value={objectives.general || ''}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    chapter1: {
                      ...ch1,
                      objectives: { ...objectives, general: e.target.value },
                    },
                  })
                }
                placeholder="Mengetahui pengaruh intervensi X terhadap variabel Y..."
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-stone-900 dark:text-stone-100">
                1.4.2 Tujuan Khusus & Pemetaan Analisis
              </label>
              <div className="space-y-2.5">
                {objectives.specific?.map((obj, idx) => (
                  <div
                    key={obj.id || idx}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/60 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {idx + 1}. {obj.text}
                      </div>
                      {obj.potentialAnalysis && (
                        <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                          Rencana Analisis: {obj.potentialAnalysis}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1.5: MANFAAT PENELITIAN */}
      {activeSection === '1.5' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                1.5 Manfaat Penelitian Kontekstual
              </h3>
              <p className="text-xs text-stone-500">
                Bebas dari kalimat klise (seperti "menambah wawasan peneliti"). Menjawab kontribusi nyata teoretis dan praktis.
              </p>
            </div>
            <button
              onClick={handleGenerateOtherSections}
              disabled={isGeneratingSections}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl"
            >
              {isGeneratingSections ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Sinkronkan dari Canvas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 bg-stone-50 dark:bg-stone-900/60">
              <label className="font-bold block text-stone-900 dark:text-stone-100">
                Manfaat Teoretis
              </label>
              <textarea
                rows={3}
                value={significance.theoretical || ''}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    chapter1: {
                      ...ch1,
                      significance: { ...significance, theoretical: e.target.value },
                    },
                  })
                }
                placeholder="Pengembangan model konseptual keperawatan/pendidikan..."
                className="w-full p-2 bg-white dark:bg-stone-800 border rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 bg-stone-50 dark:bg-stone-900/60">
              <label className="font-bold block text-stone-900 dark:text-stone-100">
                Bagi Subjek / Masyarakat
              </label>
              <textarea
                rows={3}
                value={significance.population || ''}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    chapter1: {
                      ...ch1,
                      significance: { ...significance, population: e.target.value },
                    },
                  })
                }
                placeholder="Meningkatkan kemandirian pasien dalam mematuhi dosis obat..."
                className="w-full p-2 bg-white dark:bg-stone-800 border rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 bg-stone-50 dark:bg-stone-900/60">
              <label className="font-bold block text-stone-900 dark:text-stone-100">
                Bagi Institusi / Layanan
              </label>
              <textarea
                rows={3}
                value={significance.institution || ''}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    chapter1: {
                      ...ch1,
                      significance: { ...significance, institution: e.target.value },
                    },
                  })
                }
                placeholder="Masukan operasional bagi SOP pendampingan pasien..."
                className="w-full p-2 bg-white dark:bg-stone-800 border rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1 bg-stone-50 dark:bg-stone-900/60">
              <label className="font-bold block text-stone-900 dark:text-stone-100">
                Bagi Peneliti Selanjutnya
              </label>
              <textarea
                rows={3}
                value={significance.futureResearch || ''}
                onChange={(e) =>
                  onUpdateProject({
                    ...project,
                    chapter1: {
                      ...ch1,
                      significance: { ...significance, futureResearch: e.target.value },
                    },
                  })
                }
                placeholder="Dasar rujukan studi intervensi lanjutan dengan sampel multisentris..."
                className="w-full p-2 bg-white dark:bg-stone-800 border rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION PREVIEW UTUH BAB 1 */}
      {activeSection === 'preview' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-sm font-serif space-y-6 text-stone-900 dark:text-stone-100 leading-relaxed max-w-4xl mx-auto">
          <div className="text-center space-y-1 border-b pb-4">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
              {project.selectedTitle || project.title || 'PROPOSAL PENELITIAN'}
            </h2>
            <div className="text-xs text-stone-500 font-sans">
              Jenjang {project.degreeLevel} • Program Studi {project.program}
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-bold text-base">BAB I</h3>
            <h3 className="font-bold text-base">PENDAHULUAN</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <h4 className="font-bold font-sans">1.1 Latar Belakang Masalah</h4>
            {outline.length > 0 ? (
              outline.map((p, i) => (
                <p key={i} className="indent-8 text-justify">
                  {p.draftContent || `[Paragraf ${i + 1}: ${p.coreIdea}]`}
                </p>
              ))
            ) : (
              <p className="italic text-stone-400">Belum ada draf latar belakang.</p>
            )}

            {ch1.problemIdentification && (
              <>
                <h4 className="font-bold font-sans pt-3">1.2 Identifikasi Masalah</h4>
                <div className="whitespace-pre-line pl-4">{ch1.problemIdentification}</div>
              </>
            )}

            {ch1.problemLimitation && (
              <>
                <h4 className="font-bold font-sans pt-3">1.3 Pembatasan Masalah</h4>
                <p className="indent-8 text-justify">{ch1.problemLimitation}</p>
              </>
            )}

            <h4 className="font-bold font-sans pt-3">1.4 Rumusan Masalah</h4>
            <div className="space-y-1 pl-4">
              {questions.map((q, idx) => (
                <div key={idx}>
                  {idx + 1}. {q.question}
                </div>
              ))}
            </div>

            <h4 className="font-bold font-sans pt-3">1.5 Tujuan Penelitian</h4>
            {objectives.general && (
              <div className="pl-4">
                <strong>1.5.1 Tujuan Umum:</strong>
                <p className="indent-4">{objectives.general}</p>
              </div>
            )}
            {objectives.specific && objectives.specific.length > 0 && (
              <div className="pl-4">
                <strong>1.5.2 Tujuan Khusus:</strong>
                {objectives.specific.map((obj, idx) => (
                  <div key={idx} className="indent-4">
                    {idx + 1}. {obj.text}
                  </div>
                ))}
              </div>
            )}

            <h4 className="font-bold font-sans pt-3">1.6 Manfaat Penelitian</h4>
            <div className="space-y-2 pl-4">
              {significance.theoretical && (
                <div>
                  <strong>Manfaat Teoretis:</strong> {significance.theoretical}
                </div>
              )}
              {significance.population && (
                <div>
                  <strong>Manfaat bagi Subjek:</strong> {significance.population}
                </div>
              )}
              {significance.institution && (
                <div>
                  <strong>Manfaat bagi Institusi:</strong> {significance.institution}
                </div>
              )}
              {significance.futureResearch && (
                <div>
                  <strong>Bagi Peneliti Selanjutnya:</strong> {significance.futureResearch}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PARAGRAPH COACH MODAL */}
      {selectedParagraph && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Paragraph Coach (Bina Paragraf Akademik)</span>
              </div>
              <button
                onClick={() => setSelectedParagraph(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-stone-700 dark:text-stone-300">
                Tahap Corong: {selectedParagraph.funnelStage}
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border italic text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                "{selectedParagraph.draftContent}"
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300 block">
                Pilih Arahan Pembinaan Dosen:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'four_pillars_citations', label: '4 Pilar & Sitasi ≤ 5 Th' },
                  { id: 'academic_style', label: 'Perbaiki Gaya Akademik' },
                  { id: 'clarify', label: 'Perjelas Argumen' },
                  { id: 'shorten', label: 'Persingkat / Ringkas' },
                  { id: 'strengthen_argument', label: 'Perkuat Logika & Urgensi' },
                  { id: 'find_unsupported_claims', label: 'Cari Klaim Tanpa Rujukan' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setCoachAction(act.id)}
                    className={`px-3 py-2 rounded-lg border text-center transition-colors ${
                      coachAction === act.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>

              {/* Custom direction input */}
              <div className="pt-2 space-y-1">
                <label className="font-medium text-stone-700 dark:text-stone-300 block text-[11px]">
                  Atau Masukkan Arahan Revisi Spesifik dari Dosen / Pembimbing:
                </label>
                <textarea
                  rows={2}
                  value={customCoachInstruction}
                  onChange={(e) => setCustomCoachInstruction(e.target.value)}
                  placeholder="Contoh: Mulai dari skala dunia ke nasional, gabungkan urgensi dengan kondisi puskesmas, dan pastikan sitasi 5 tahun terakhir..."
                  className="w-full p-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleRunCoach}
                disabled={coachLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs"
              >
                {coachLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Merevisi Sesuai Arahan...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Revisi Sesuai Arahan</span>
                  </>
                )}
              </button>
            </div>

            {coachFeedback && (
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3 text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-300">
                  Hasil Paragraf Setelah Revisi Sesuai Arahan:
                </div>
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 font-serif leading-relaxed text-stone-900 dark:text-stone-100">
                  {coachFeedback.improved}
                </div>
                <div className="text-stone-600 dark:text-stone-400">
                  <strong>Penjelasan Perubahan:</strong> {coachFeedback.explanation}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCoachFeedback(null)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleApplyCoachedParagraph}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Gunakan Paragraf Ini di Draf
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor Dokumen (DOCX / TXT)</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>Lanjut ke Evaluasi Dosen (AI Review)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
