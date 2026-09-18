import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { ResearchProject, ResearchGapItem, NoveltyComparison, GapCategory } from '../types';

interface GapNoveltyViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

const GAP_CATEGORIES: GapCategory[] = [
  'Contextual Gap',
  'Intervention Gap',
  'Population Gap',
  'Methodological Gap',
  'Technology Gap',
  'Implementation Gap',
  'Measurement Gap',
  'Knowledge Gap',
  'Temporal Gap',
  'Theoretical Gap',
];

export const GapNoveltyView: React.FC<GapNoveltyViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gapAnalysis = project.gapAnalysis || { gaps: [], novelty: [], summary: '' };
  const gaps = gapAnalysis.gaps || [];
  const novelties = gapAnalysis.novelty || [];

  const handleAnalyzeGapAndNovelty = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/gap-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectContext: project,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menganalisis gap penelitian.');
      }

      const data = await res.json();
      onUpdateProject({
        ...project,
        gapAnalysis: {
          summary: data.summary || 'Analisis Gap dan Novelty teridentifikasi.',
          gaps: data.gaps || [],
          novelty: data.novelty || [],
        },
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menganalisis gap.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Modul 05: Research Gap & Novelty Builder
              </h2>
              <p className="text-xs text-stone-500">
                Mengidentifikasi 10 kategori celah riset akademik dan membuktikan kebaruan (novelty) tanpa klaim berlebihan.
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyzeGapAndNovelty}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menganalisis Literatur & Gap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analisis Gap & Novelty dengan AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Academic Safety Notice */}
      <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          <strong>Aturan Bahasa Akademik:</strong> Dilarang menggunakan klaim mutlak seperti <em>"Penelitian ini belum pernah dilakukan oleh siapa pun di dunia"</em>. Gunakan frasa ilmiah yang terukur dan dapat dipertanggungjawabkan, seperti: <em>"Masih terbatas bukti mengenai..."</em> atau <em>"Sebagian besar penelitian terdahulu berfokus pada..."</em>.
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* 10 Gap Categories Showcase */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
          10 Kategori Research Gap Akademik
        </span>
        <div className="flex flex-wrap gap-1.5">
          {GAP_CATEGORIES.map((cat) => {
            const isMatched = gaps.some((g) => g.category === cat);
            return (
              <span
                key={cat}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isMatched
                    ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-600/70'
                }`}
              >
                {cat} {isMatched && '✓'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Summary of Gap Analysis */}
      {gapAnalysis.summary && (
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1">
          <span className="font-bold text-emerald-900 dark:text-emerald-200 block uppercase tracking-wide text-[11px]">
            Ringkasan Posisi Gap Riset Anda:
          </span>
          <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
            {gapAnalysis.summary}
          </p>
        </div>
      )}

      {/* Detected Gaps List */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
          Research Gap Teridentifikasi ({gaps.length})
        </h3>

        {gaps.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 space-y-2">
            <Layers className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-500">
              Belum ada gap yang dianalisis. Klik tombol <strong>"Analisis Gap & Novelty dengan AI"</strong> di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {gaps.map((gapItem, idx) => (
              <div
                key={gapItem.id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                    Kategori: {gapItem.category}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    Gap #{idx + 1}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                  {gapItem.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800/80">
                  <div>
                    <strong className="text-stone-800 dark:text-stone-200 block mb-0.5">
                      Mengapa Ini Menjadi Gap?
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400">{gapItem.whyItsAGap}</p>
                  </div>
                  <div>
                    <strong className="text-stone-800 dark:text-stone-200 block mb-0.5">
                      Cara Penelitian Menjawab:
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400">{gapItem.howToAddress}</p>
                  </div>
                  {gapItem.supportingEvidence && (
                    <div className="sm:col-span-2 pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
                      <strong className="text-stone-700 dark:text-stone-300 block mb-0.5">
                        Bukti Empiris Pendukung:
                      </strong>
                      <p className="text-stone-500 italic">{gapItem.supportingEvidence}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Novelty Comparison Matrix */}
      <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            Novelty Builder (Komparasi Kebaruan Penelitian)
          </h3>
          <p className="text-xs text-stone-500">
            Membandingkan secara spesifik apa yang membedakan penelitian Anda dengan penelitian sebelumnya.
          </p>
        </div>

        {novelties.length === 0 ? (
          <div className="p-6 text-center border border-dashed rounded-xl text-xs text-stone-500">
            Novelty belum dibuat. Jalankan analisis AI untuk menghasilkan matriks komparasi kebaruan.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="bg-stone-100 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 font-semibold">
                <tr>
                  <th className="p-3 w-36">Dimensi Komparasi</th>
                  <th className="p-3 w-56">Penelitian Terdahulu</th>
                  <th className="p-3 w-56">Penelitian Yang Direncanakan</th>
                  <th className="p-3">What Does This Study Add?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700 text-stone-800 dark:text-stone-200">
                {novelties.map((nov, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/70 dark:hover:bg-stone-750">
                    <td className="p-3 font-semibold text-stone-900 dark:text-stone-100">
                      {nov.dimension}
                    </td>
                    <td className="p-3 text-stone-600 dark:text-stone-300">
                      {nov.previousStudies}
                    </td>
                    <td className="p-3 font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20">
                      {nov.plannedStudy}
                    </td>
                    <td className="p-3 text-stone-700 dark:text-stone-300 leading-relaxed">
                      <strong>{nov.whatStudyAdds}</strong>
                      {nov.whatIsDifferent && (
                        <div className="text-[11px] text-stone-500 mt-1">
                          Perbedaan: {nov.whatIsDifferent}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <span className="text-xs text-stone-500">
          Gap dan Novelty ini kini siap ditransformasikan menjadi formulasi Judul Penelitian yang presisi.
        </span>

        <button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>Lanjut ke Formulasi Judul Penelitian</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
