import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Check,
  Search,
  Layers,
  AlertCircle,
  Tag,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { ResearchProject, TopicDirection } from '../types';

interface TopicExplorerViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

export const TopicExplorerView: React.FC<TopicExplorerViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const [field, setField] = useState(project.topicExplorer?.inputs?.field || project.field || '');
  const [interest, setInterest] = useState(project.topicExplorer?.inputs?.interest || project.topicInterest || '');
  const [population, setPopulation] = useState(project.topicExplorer?.inputs?.population || project.populationInterest || '');
  const [interestingProblem, setInterestingProblem] = useState(
    project.topicExplorer?.inputs?.interestingProblem || project.phenomenonOrProblem || ''
  );
  const [setting, setSetting] = useState(project.topicExplorer?.inputs?.setting || project.settingLocation || '');
  const [technologyOrIntervention, setTechnologyOrIntervention] = useState(
    project.topicExplorer?.inputs?.technologyOrIntervention || ''
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const directions = project.topicExplorer?.generatedDirections || [];
  const selectedId = project.topicExplorer?.selectedTopicId;

  const handleGenerateTopics = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/topic-explorer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          interest,
          population,
          interestingProblem,
          setting,
          technologyOrIntervention,
          degreeLevel: project.degreeLevel,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menghasilkan arah topik');
      }

      const data = await res.json();
      const generatedDirections: TopicDirection[] = data.directions || [];

      onUpdateProject({
        ...project,
        topicInterest: interest,
        populationInterest: population,
        phenomenonOrProblem: interestingProblem,
        settingLocation: setting,
        topicExplorer: {
          inputs: {
            field,
            interest,
            population,
            interestingProblem,
            setting,
            technologyOrIntervention,
          },
          generatedDirections,
          selectedTopicId: generatedDirections[0]?.id || selectedId,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan teknis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDirection = (dir: TopicDirection) => {
    onUpdateProject({
      ...project,
      topicInterest: dir.topicName,
      populationInterest: dir.potentialPopulation || project.populationInterest,
      phenomenonOrProblem: dir.phenomenon || project.phenomenonOrProblem,
      topicExplorer: {
        ...project.topicExplorer,
        inputs: project.topicExplorer?.inputs || {
          field,
          interest,
          population,
          interestingProblem,
          setting,
          technologyOrIntervention,
        },
        generatedDirections: directions,
        selectedTopicId: dir.id,
      },
      problemCanvas: {
        ...project.problemCanvas,
        masalah: dir.coreProblem || project.problemCanvas.masalah,
        area: dir.potentialPopulation || project.problemCanvas.area,
        gap: dir.rationale || project.problemCanvas.gap,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
            Modul 01: Research Topic Explorer
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
          Eksplorasi arah topik penelitian secara terarah berdasarkan fenomena riil dan variabel terukur, bukan sekadar melempar judul instan. Disesuaikan dengan kalibrasi jenjang {project.degreeLevel === 'S2' ? 'S2 Tesis' : 'S1 Skripsi'}.
        </p>
      </div>

      {/* Input Parameters Form */}
      <form
        onSubmit={handleGenerateTopics}
        className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Parameter Eksplorasi Topik Mahasiswa
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
            Jenjang: {project.degreeLevel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Bidang Ilmu
            </label>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="Contoh: Keperawatan Medikal Bedah, Manajemen Pendidikan..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Minat Penelitian (Area of Interest)
            </label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="Contoh: Kepatuhan minum obat, motivasi belajar siswa..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Populasi Sasaran
            </label>
            <input
              type="text"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              placeholder="Contoh: Pasien TB dewasa, siswa SMA kelas 10, perawat..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Setting / Lokasi Penelitian
            </label>
            <input
              type="text"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="Contoh: Puskesmas rawat jalan di wilayah perkotaan..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Masalah atau Fenomena Riil yang Menarik Perhatian
            </label>
            <input
              type="text"
              value={interestingProblem}
              onChange={(e) => setInterestingProblem(e.target.value)}
              placeholder="Contoh: Tingginya angka drop-out pengobatan TB pada bulan ke-2 akibat kurangnya pendampingan PMO..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Teknologi, Intervensi, atau Media Tertentu (Opsional)
            </label>
            <input
              type="text"
              value={technologyOrIntervention}
              onChange={(e) => setTechnologyOrIntervention(e.target.value)}
              placeholder="Contoh: Aplikasi mobile pengingat minum obat, video edukasi berbasis WhatsApp..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menganalisis & Mengeksplorasi Topik...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Temukan 6-8 Arah Topik Penelitian</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Directions Grid */}
      {directions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Arah Riset Potensial ({directions.length} Pilihan Terarah)
            </h3>
            <span className="text-xs text-stone-500">
              Pilih satu arah topik untuk dilanjutkan ke Problem Canvas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {directions.map((dir, idx) => {
              const isSelected = selectedId === dir.id;
              return (
                <div
                  key={dir.id || idx}
                  className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm ring-2 ring-emerald-600/20'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center text-[10px] font-mono font-bold">
                          {idx + 1}
                        </span>
                        <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                          {dir.topicName}
                        </h4>
                      </div>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                          <Check className="w-3 h-3" /> Terpilih
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1.5">
                      <div>
                        <strong className="text-stone-700 dark:text-stone-200">Fenomena Riil:</strong>{' '}
                        {dir.phenomenon}
                      </div>
                      <div>
                        <strong className="text-stone-700 dark:text-stone-200">Masalah Utama:</strong>{' '}
                        {dir.coreProblem}
                      </div>
                      <div>
                        <strong className="text-stone-700 dark:text-stone-200">Populasi Potensial:</strong>{' '}
                        {dir.potentialPopulation}
                      </div>
                      <div>
                        <strong className="text-stone-700 dark:text-stone-200">Desain Riset:</strong>{' '}
                        <span className="font-mono text-[11px] bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 rounded">
                          {dir.possibleDesign}
                        </span>
                      </div>
                    </div>

                    {/* Variables */}
                    {dir.variables && dir.variables.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                          Variabel Terkait:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {dir.variables.map((v, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[11px] rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Literature keywords */}
                    {dir.literatureKeywords && dir.literatureKeywords.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                          Kata Kunci Literatur:
                        </span>
                        <div className="flex flex-wrap gap-1 text-[10px] text-stone-500">
                          {dir.literatureKeywords.map((kw, i) => (
                            <span key={i} className="italic">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSelectDirection(dir)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-600'
                      }`}
                    >
                      {isSelected ? 'Topik Aktif' : 'Pilih Topik Ini'}
                    </button>

                    {isSelected && (
                      <button
                        type="button"
                        onClick={onNextStep}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                      >
                        <span>Lanjut ke Problem Canvas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
