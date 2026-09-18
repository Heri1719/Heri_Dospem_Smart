import React, { useState } from 'react';
import {
  Heading,
  Sparkles,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Loader2,
  Check,
  Award,
  Layers,
  FileCheck,
} from 'lucide-react';
import { ResearchProject, TitleCandidate, TitleDoctorResult } from '../types';

interface TitleGeneratorViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

export const TitleGeneratorView: React.FC<TitleGeneratorViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'doctor'>('generate');

  // Generator states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // Doctor states
  const [studentTitleInput, setStudentTitleInput] = useState(
    project.selectedTitle || project.title || ''
  );
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [doctorResult, setDoctorResult] = useState<TitleDoctorResult | null>(
    project.titleDoctorHistory?.[0] || null
  );
  const [doctorError, setDoctorError] = useState<string | null>(null);

  const candidates: TitleCandidate[] = project.titleCandidates || [];
  const selectedTitle = project.selectedTitle || '';

  // Validation: minimum problem & topic
  const hasMinData =
    (!!project.topicInterest && project.topicInterest.length > 3) ||
    (!!project.problemCanvas?.masalah && project.problemCanvas.masalah.length > 10);

  const handleGenerateTitles = async () => {
    if (!hasMinData) {
      setGeneratorError('Data minimum belum lengkap. Mohon lengkapi Topik dan Masalah di Modul 1 & 2 terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setGeneratorError(null);

    try {
      const res = await fetch('/api/ai/title-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectContext: project,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menghasilkan judul penelitian.');
      }

      const data = await res.json();
      const newTitles: TitleCandidate[] = data.titles || [];

      onUpdateProject({
        ...project,
        titleCandidates: newTitles,
        selectedTitle: selectedTitle || newTitles[0]?.title || '',
        researchCanvas: {
          ...project.researchCanvas,
          title: selectedTitle || newTitles[0]?.title || project.researchCanvas.title,
        },
      });
    } catch (err: any) {
      setGeneratorError(err.message || 'Terjadi kesalahan saat membuat judul.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTitle = (candidate: TitleCandidate) => {
    onUpdateProject({
      ...project,
      selectedTitle: candidate.title,
      title: candidate.title,
      researchCanvas: {
        ...project.researchCanvas,
        title: candidate.title,
        problem: candidate.mainProblem || project.researchCanvas.problem,
        independentVariables: candidate.variables ? [candidate.variables[0]] : project.researchCanvas.independentVariables,
        dependentVariables: candidate.variables && candidate.variables[1] ? [candidate.variables[1]] : project.researchCanvas.dependentVariables,
        researchDesign: candidate.suggestedMethod || project.researchCanvas.researchDesign,
      },
    });
  };

  const handleDiagnoseTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentTitleInput.trim()) return;

    setIsDiagnosing(true);
    setDoctorError(null);

    try {
      const res = await fetch('/api/ai/title-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentTitle: studentTitleInput,
          degreeLevel: project.degreeLevel,
          field: project.field,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal mendiagnosis judul.');
      }

      const result: TitleDoctorResult = await res.json();
      setDoctorResult(result);

      onUpdateProject({
        ...project,
        titleDoctorHistory: [result, ...(project.titleDoctorHistory || [])],
      });
    } catch (err: any) {
      setDoctorError(err.message || 'Gagal memeriksa judul.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleAdoptAlternativeTitle = (newTitle: string) => {
    onUpdateProject({
      ...project,
      selectedTitle: newTitle,
      title: newTitle,
      researchCanvas: {
        ...project.researchCanvas,
        title: newTitle,
      },
    });
    setStudentTitleInput(newTitle);
    alert('Judul terpilih berhasil diperbarui!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Heading className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Modul 06: Formulasi Judul & Title Doctor
              </h2>
              <p className="text-xs text-stone-500">
                Menghasilkan kandidat judul terkalibrasi atau membedah judul buatan sendiri bersama "Klinik Judul".
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'generate'
                  ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kandidat Judul Terarah</span>
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'doctor'
                  ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Title Doctor (Klinik Judul)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Selected Title Banner */}
      {selectedTitle && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Judul Utama Penelitian Terpilih ({project.degreeLevel}):
            </span>
            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
              "{selectedTitle}"
            </h3>
          </div>
          <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-emerald-700 text-white font-semibold">
            Aktif di Seluruh Modul
          </span>
        </div>
      )}

      {activeTab === 'generate' ? (
        /* TAB 1: GENERATOR KANDIDAT JUDUL (MAX 5) */
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Generator Judul Terkalibrasi (Maksimal 5 Kandidat Terbaik)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Setiap judul dikalibrasi untuk jenjang <strong>{project.degreeLevel === 'S2' ? 'S2 Tesis' : 'S1 Skripsi'}</strong> berdasarkan masalah dan gap yang telah Anda input.
                </p>
              </div>

              <button
                onClick={handleGenerateTitles}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengkalkulasi 5 Judul Terbaik...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hasilkan 4-5 Kandidat Judul</span>
                  </>
                )}
              </button>
            </div>

            {!hasMinData && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Validasi Wajib: Topik dan Masalah belum terisi cukup. Harap lengkapi Modul 1 atau 2 sebelum membuat judul.
                </span>
              </div>
            )}

            {generatorError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700 rounded-xl">
                {generatorError}
              </div>
            )}
          </div>

          {/* Cards List of Candidates */}
          {candidates.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Pilihan Judul yang Tersedia ({candidates.length})
              </h4>

              <div className="grid grid-cols-1 gap-5">
                {candidates.map((cand, idx) => {
                  const isSelected = selectedTitle === cand.title;
                  return (
                    <div
                      key={cand.id || idx}
                      className={`p-5 rounded-2xl border transition-all space-y-4 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-600/20'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            Kandidat #{idx + 1}
                          </span>
                          <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                            "{cand.title}"
                          </h4>
                        </div>

                        <button
                          onClick={() => handleSelectTitle(cand)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Judul Terpilih</span>
                            </>
                          ) : (
                            'Pilih Judul Ini'
                          )}
                        </button>
                      </div>

                      {/* Variables & Method Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-stone-500 font-medium">Variabel:</span>
                        {cand.variables?.map((v, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium"
                          >
                            {v}
                          </span>
                        ))}
                        {cand.suggestedMethod && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono text-[11px]">
                            Desain: {cand.suggestedMethod}
                          </span>
                        )}
                        {cand.population && (
                          <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                            Populasi: {cand.population}
                          </span>
                        )}
                      </div>

                      {/* Rationale & Novelty */}
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 text-xs space-y-1">
                        <div>
                          <strong className="text-stone-800 dark:text-stone-200">Masalah yang Dijawab:</strong>{' '}
                          {cand.mainProblem}
                        </div>
                        <div>
                          <strong className="text-stone-800 dark:text-stone-200">Alasan Layak Diajukan:</strong>{' '}
                          {cand.rationale}
                        </div>
                        {cand.novelty && (
                          <div className="text-emerald-800 dark:text-emerald-300 pt-0.5">
                            <strong>Kebaruan:</strong> {cand.novelty}
                          </div>
                        )}
                      </div>

                      {/* Quality Score Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-700/60 text-[11px]">
                        <span className="font-semibold text-stone-500">Indikator Kualitas:</span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          Kejelasan: <strong>{cand.clarity || 'Sangat Baik'}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          Keterukuran: <strong>{cand.measurability || 'Baik'}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          Kelayakan: <strong>{cand.feasibility || 'Sangat Baik'}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          Kesesuaian {project.degreeLevel}: <strong>{cand.degreeFit || 'Sangat Baik'}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: TITLE DOCTOR (KLINIK JUDUL) */
        <div className="space-y-6">
          <form
            onSubmit={handleDiagnoseTitle}
            className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Klinik Diagnosis Judul Mahasiswa</span>
            </div>
            <p className="text-xs text-stone-500">
              Ketikkan judul yang sudah Anda buat sendiri. AI akan memeriksa apakah judul terlalu luas, bertele-tele, variabelnya kabur, atau tidak sesuai jenjang {project.degreeLevel}.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={studentTitleInput}
                onChange={(e) => setStudentTitleInput(e.target.value)}
                placeholder="Tempelkan judul penelitian Anda di sini..."
                className="flex-1 px-3 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isDiagnosing}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors shrink-0"
              >
                {isDiagnosing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mendiagnosis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Periksa Judul Saya</span>
                  </>
                )}
              </button>
            </div>

            {doctorError && (
              <div className="text-xs text-red-600 pt-1">{doctorError}</div>
            )}
          </form>

          {/* Doctor Diagnostic Results */}
          {doctorResult && (
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Hasil Diagnosis Judul
                </h4>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {doctorResult.degreeSuitability}
                </span>
              </div>

              {/* Diagnostic checklist pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div
                  className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    !doctorResult.isTooBroad
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : 'border-amber-200 bg-amber-50/50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{doctorResult.isTooBroad ? 'Terlalu Luas' : 'Ruang Lingkup Terfokus'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    !doctorResult.isTooLong
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : 'border-amber-200 bg-amber-50/50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{doctorResult.isTooLong ? 'Terlalu Panjang (>20 kata)' : 'Panjang Judul Ideal'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    doctorResult.areVariablesClear
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : 'border-amber-200 bg-amber-50/50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{doctorResult.areVariablesClear ? 'Variabel Jelas' : 'Variabel Kabur'}</span>
                </div>

                <div
                  className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    doctorResult.isOutcomeClear
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : 'border-amber-200 bg-amber-50/50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{doctorResult.isOutcomeClear ? 'Outcome Terukur' : 'Outcome Belum Terukur'}</span>
                </div>
              </div>

              {/* Redundant words and method advice */}
              {(doctorResult.redundantWords?.length || doctorResult.methodMentionAdvice) && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
                  {doctorResult.redundantWords && doctorResult.redundantWords.length > 0 && (
                    <div>
                      <strong className="text-amber-900 dark:text-amber-300">Kata Redundan yang Ditemukan:</strong>{' '}
                      {doctorResult.redundantWords.join(', ')} (sebaiknya dihilangkan)
                    </div>
                  )}
                  {doctorResult.methodMentionAdvice && (
                    <div className="text-stone-700 dark:text-stone-300">
                      <strong>Saran Pencantuman Metode:</strong> {doctorResult.methodMentionAdvice}
                    </div>
                  )}
                </div>
              )}

              {/* 3 Alternative Refined Titles */}
              <div className="space-y-3 pt-2">
                <h5 className="font-semibold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                  3 Versi Perbaikan Judul yang Disarankan:
                </h5>

                <div className="grid grid-cols-1 gap-3">
                  {doctorResult.alternativeTitles?.map((alt, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/60 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {alt.versionType}
                        </span>
                        <h6 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                          "{alt.title}"
                        </h6>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {alt.changesMade}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAdoptAlternativeTitle(alt.title)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shrink-0 shadow-2xs transition-colors"
                      >
                        Gunakan Judul Ini
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <span className="text-xs text-stone-500">
          Judul terpilih akan otomatis menjadi acuan bagi Research Canvas dan Rumusan Masalah Bab 1.
        </span>

        <button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>Lanjut ke Research Canvas 1-Halaman</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
