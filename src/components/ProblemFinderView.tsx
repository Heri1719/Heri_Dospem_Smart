import React, { useState } from 'react';
import {
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Loader2,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';
import { ResearchProject, ProblemCanvas } from '../types';

interface ProblemFinderViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

export const ProblemFinderView: React.FC<ProblemFinderViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const canvas: ProblemCanvas = project.problemCanvas || {
    masalah: '',
    dampak: '',
    area: '',
    existingEffort: '',
    gap: '',
    gapStatus: 'unverified',
    notes: '',
  };

  const [masalah, setMasalah] = useState(canvas.masalah);
  const [dampak, setDampak] = useState(canvas.dampak);
  const [area, setArea] = useState(canvas.area);
  const [existingEffort, setExistingEffort] = useState(canvas.existingEffort);
  const [gap, setGap] = useState(canvas.gap);
  const [gapStatus, setGapStatus] = useState(canvas.gapStatus || 'unverified');
  const [notes, setNotes] = useState(canvas.notes || '');

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (updatedFields?: Partial<ProblemCanvas>) => {
    const updatedCanvas: ProblemCanvas = {
      masalah: updatedFields?.masalah !== undefined ? updatedFields.masalah : masalah,
      dampak: updatedFields?.dampak !== undefined ? updatedFields.dampak : dampak,
      area: updatedFields?.area !== undefined ? updatedFields.area : area,
      existingEffort: updatedFields?.existingEffort !== undefined ? updatedFields.existingEffort : existingEffort,
      gap: updatedFields?.gap !== undefined ? updatedFields.gap : gap,
      gapStatus: updatedFields?.gapStatus !== undefined ? updatedFields.gapStatus : gapStatus,
      notes: updatedFields?.notes !== undefined ? updatedFields.notes : notes,
    };

    onUpdateProject({
      ...project,
      phenomenonOrProblem: updatedCanvas.masalah,
      populationInterest: updatedCanvas.area || project.populationInterest,
      problemCanvas: updatedCanvas,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAIAssist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/problem-canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: project.topicInterest || project.title,
          degreeLevel: project.degreeLevel,
          field: project.field,
          population: area || project.populationInterest,
          existingNotes: `${masalah} ${existingEffort}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal memanggil AI');
      }

      const data = await res.json();
      setMasalah(data.masalah || masalah);
      setDampak(data.dampak || dampak);
      setArea(data.area || area);
      setExistingEffort(data.existingEffort || existingEffort);
      setGap(data.gap || gap);
      setGapStatus('unverified');
      setNotes(data.notes || notes);

      handleSave({
        masalah: data.masalah || masalah,
        dampak: data.dampak || dampak,
        area: data.area || area,
        existingEffort: data.existingEffort || existingEffort,
        gap: data.gap || gap,
        gapStatus: 'unverified',
        notes: data.notes || notes,
      });
    } catch (err: any) {
      setError(err.message || 'Gagal merumuskan Problem Canvas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Module Title */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              Modul 02: Problem Finder (Problem Canvas MDAEG)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAIAssist}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Bantu Lengkapi MDAEG dengan AI</span>
            </button>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
          Penelitian yang bernilai tinggi berakar dari masalah nyata (kesenjangan harapan vs kenyataan). Rumuskan fenomena masalah Anda menggunakan kerangka kerja MDAEG.
        </p>
      </div>

      {/* Privacy Guard Notice */}
      <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
          <strong>Perhatian Etika & Privasi:</strong> Jangan pernah memasukkan nama pasien, Nomor Induk Kependudukan (NIK), nomor rekam medis rahasia, atau data pribadi yang dapat mengidentifikasi subjek penelitian. Deskripsikan fenomena dalam kategori agregat atau anonim.
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Problem Canvas Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* M - Masalah */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold font-mono text-xs flex items-center justify-center">
                M
              </span>
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Masalah (Problem)
              </label>
            </div>
            <span className="text-[11px] text-stone-400">Harapan vs Kenyataan</span>
          </div>
          <p className="text-xs text-stone-500">
            Apa fenomena atau kesenjangan utama yang terjadi antara kondisi ideal dan kenyataan di lapangan?
          </p>
          <textarea
            rows={4}
            value={masalah}
            onChange={(e) => setMasalah(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Contoh: Kepatuhan minum obat pasien TB masih di bawah target 90%..."
            className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* D - Dampak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold font-mono text-xs flex items-center justify-center">
                D
              </span>
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Dampak (Impact & Urgency)
              </label>
            </div>
            <span className="text-[11px] text-stone-400">Konsekuensi jika dibiarkan</span>
          </div>
          <p className="text-xs text-stone-500">
            Mengapa masalah ini mendesak untuk diselesaikan? Apa dampak klinis, sosial, atau ekonomisnya?
          </p>
          <textarea
            rows={4}
            value={dampak}
            onChange={(e) => setDampak(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Contoh: Ketidakpatuhan memicu resistensi obat (MDR-TB), kegagalan terapi, dan transmisi bakteri..."
            className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* A - Area / Population */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold font-mono text-xs flex items-center justify-center">
                A
              </span>
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Area & Populasi (Who & Where)
              </label>
            </div>
            <span className="text-[11px] text-stone-400">Kelompok terdampak</span>
          </div>
          <p className="text-xs text-stone-500">
            Siapa subjek yang mengalami masalah ini? Di setting/lokasi mana fenomena ini teramati?
          </p>
          <textarea
            rows={4}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Contoh: Pasien tuberkulosis paru dewasa fase lanjutan di wilayah kerja Puskesmas perkotaan..."
            className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* E - Existing Effort */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold font-mono text-xs flex items-center justify-center">
                E
              </span>
              <label className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Existing Effort (Upaya Saat Ini)
              </label>
            </div>
            <span className="text-[11px] text-stone-400">Solusi yang sudah ada</span>
          </div>
          <p className="text-xs text-stone-500">
            Program, intervensi, atau kebijakan apa yang sudah pernah dijalankan untuk menangani masalah ini?
          </p>
          <textarea
            rows={4}
            value={existingEffort}
            onChange={(e) => setExistingEffort(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Contoh: Program Pengawas Menelan Obat (PMO) dari keluarga dan kartu kontrol fisik puskesmas..."
            className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* G - Gap (Span 2 columns) */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-stone-800/90 border-2 border-emerald-600/40 dark:border-emerald-500/40 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-700 text-white font-bold font-mono text-xs flex items-center justify-center">
                G
              </span>
              <label className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Gap (Kesenjangan / Celah Penelitian)
              </label>
            </div>

            {/* Gap Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Status Validasi Gap:</span>
              <button
                type="button"
                onClick={() => {
                  const nextStatus = gapStatus === 'verified' ? 'unverified' : 'verified';
                  setGapStatus(nextStatus);
                  handleSave({ gapStatus: nextStatus });
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  gapStatus === 'verified'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
                title="Klik untuk mengubah status setelah memverifikasi literatur"
              >
                {gapStatus === 'verified' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terverifikasi Literatur</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Gap Sementara (Perlu Verifikasi Literatur)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-stone-500">
            Apa kekurangan dari upaya yang ada? Mengapa masalah masih terjadi? Bagian mana yang belum terjawab atau belum efektif ditangani?
          </p>

          <textarea
            rows={3}
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Contoh: PMO keluarga sering lupa atau sibuk bekerja, serta belum ada sistem pemantauan minum obat interaktif real-time berbasis mobile..."
            className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          {notes && (
            <div className="p-3 bg-stone-100 dark:bg-stone-900/60 rounded-xl text-xs text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
              <strong className="text-stone-800 dark:text-stone-100">Catatan Pembimbing AI:</strong>{' '}
              {notes}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <div className="text-xs text-stone-500">
          {saveSuccess ? (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Problem Canvas tersimpan
            </span>
          ) : (
            'Tersimpan otomatis saat fokus beralih'
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl transition-colors"
          >
            Simpan Perubahan
          </button>

          <button
            type="button"
            onClick={onNextStep}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
          >
            <span>Verifikasi di Evidence Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
