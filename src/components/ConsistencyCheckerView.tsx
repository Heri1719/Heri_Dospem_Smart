import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Loader2,
  FileSearch,
} from 'lucide-react';
import { ResearchProject, ConsistencyItem } from '../types';

interface ConsistencyCheckerViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

export const ConsistencyCheckerView: React.FC<ConsistencyCheckerViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkData = project.consistencyCheck || { items: [], overallSummary: '' };
  const items = checkData.items || [];

  const handleRunAudit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/consistency-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectContext: project,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal memeriksa konsistensi penelitian.');
      }

      const data = await res.json();
      onUpdateProject({
        ...project,
        consistencyCheck: {
          overallSummary: data.overallSummary || 'Audit konsistensi selesai dilakukan.',
          items: data.items || [],
        },
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memeriksa konsistensi.');
    } finally {
      setIsLoading(false);
    }
  };

  const consistentCount = items.filter((i) => i.status === 'consistent').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;
  const inconsistentCount = items.filter((i) => i.status === 'inconsistent').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Modul 08: Cek Konsistensi Metodologi Riset
              </h2>
              <p className="text-xs text-stone-500">
                Audit otomatis hubungan antar komponen: Masalah ↔ Gap ↔ Judul ↔ Rumusan ↔ Tujuan ↔ Variabel ↔ Metode.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memeriksa Seluruh Komponen Riset...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audit Ulang Konsistensi dengan AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-1">
          <span className="text-stone-500 font-medium">Total Komponen Diaudit</span>
          <div className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
            {items.length || 7}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 shadow-2xs space-y-1">
          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Konsisten & Selaras
          </span>
          <div className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-300">
            {consistentCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 shadow-2xs space-y-1">
          <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Perlu Penyempurnaan
          </span>
          <div className="text-xl font-bold font-mono text-amber-800 dark:text-amber-300">
            {warningCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-800 shadow-2xs space-y-1">
          <span className="text-red-700 dark:text-red-400 font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Kontradiksi / Inkonsisten
          </span>
          <div className="text-xl font-bold font-mono text-red-800 dark:text-red-300">
            {inconsistentCount}
          </div>
        </div>
      </div>

      {checkData.overallSummary && (
        <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
          <strong className="text-stone-900 dark:text-stone-100 uppercase tracking-wide text-[11px] block">
            Hasil Telaah Audit Metodologi:
          </strong>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {checkData.overallSummary}
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Consistency Items Detailed Cards */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
          Rincian Pemeriksaan Pasangan Komponen ({items.length})
        </h3>

        {items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 space-y-2">
            <FileSearch className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-500">
              Belum ada hasil audit konsistensi. Klik tombol <strong>"Audit Ulang Konsistensi dengan AI"</strong> di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {items.map((item, idx) => {
              const isConsistent = item.status === 'consistent';
              const isWarning = item.status === 'warning';
              const isInconsistent = item.status === 'inconsistent';

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                    isConsistent
                      ? 'border-emerald-200 bg-white dark:bg-stone-800/90 hover:border-emerald-300'
                      : isWarning
                      ? 'border-amber-300 bg-amber-50/20 dark:bg-amber-950/20 hover:border-amber-400'
                      : 'border-red-300 bg-red-50/20 dark:bg-red-950/20 hover:border-red-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100 font-mono">
                        {item.componentPair}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        isConsistent
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {isConsistent && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isWarning && <AlertTriangle className="w-3.5 h-3.5" />}
                      {isInconsistent && <XCircle className="w-3.5 h-3.5" />}
                      <span>
                        {isConsistent
                          ? '✓ Konsisten'
                          : isWarning
                          ? '! Perlu Diperbaiki'
                          : '× Inkonsisten'}
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    <strong>Temuan:</strong> {item.issueFound}
                  </p>

                  <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-800/80 text-xs space-y-0.5">
                    <strong className="text-stone-900 dark:text-stone-100">
                      Rekomendasi Pembimbing:
                    </strong>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <span className="text-xs text-stone-500">
          Setelah semua komponen selaras, Anda siap menyusun draf naratif Bab 1 secara terstruktur.
        </span>

        <button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>Lanjut ke Bab 1 Builder</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
