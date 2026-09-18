import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Save,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Tag,
  BookOpen,
} from 'lucide-react';
import { ResearchProject, ResearchCanvas, FrameworkType } from '../types';

interface ResearchCanvasViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

const FRAMEWORKS: FrameworkType[] = ['PICO', 'PEO', 'PCC', 'SPIDER', 'Kustom'];

export const ResearchCanvasView: React.FC<ResearchCanvasViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const canvas: ResearchCanvas = project.researchCanvas || {
    frameworkType: 'PICO',
    title: project.selectedTitle || project.title || '',
    phenomenon: project.phenomenonOrProblem || '',
    problem: project.problemCanvas?.masalah || '',
    urgency: project.problemCanvas?.dampak || '',
    population: project.problemCanvas?.area || project.populationInterest || '',
    exposureOrIntervention: '',
    comparison: '',
    outcome: '',
    independentVariables: [],
    dependentVariables: [],
    confoundingOrOtherVariables: [],
    researchGap: project.gapAnalysis?.summary || project.problemCanvas?.gap || '',
    novelty: '',
    researchQuestion: '',
    objectivesGeneral: '',
    objectivesSpecific: [],
    researchDesign: project.researchDesignPreference || 'Kuantitatif',
    settingLocation: project.settingLocation || '',
    potentialInstruments: [],
  };

  const [framework, setFramework] = useState<FrameworkType>(canvas.frameworkType || 'PICO');
  const [phenomenon, setPhenomenon] = useState(canvas.phenomenon);
  const [problem, setProblem] = useState(canvas.problem);
  const [urgency, setUrgency] = useState(canvas.urgency);
  const [population, setPopulation] = useState(canvas.population);
  const [exposureOrIntervention, setExposureOrIntervention] = useState(canvas.exposureOrIntervention);
  const [comparison, setComparison] = useState(canvas.comparison);
  const [outcome, setOutcome] = useState(canvas.outcome);
  const [indepVars, setIndepVars] = useState(canvas.independentVariables?.join(', ') || '');
  const [depVars, setDepVars] = useState(canvas.dependentVariables?.join(', ') || '');
  const [otherVars, setOtherVars] = useState(canvas.confoundingOrOtherVariables?.join(', ') || '');
  const [gap, setGap] = useState(canvas.researchGap);
  const [novelty, setNovelty] = useState(canvas.novelty);
  const [question, setQuestion] = useState(canvas.researchQuestion);
  const [generalObj, setGeneralObj] = useState(canvas.objectivesGeneral);
  const [specificObjs, setSpecificObjs] = useState(canvas.objectivesSpecific?.join('\n') || '');
  const [design, setDesign] = useState(canvas.researchDesign);
  const [setting, setSetting] = useState(canvas.settingLocation);
  const [instruments, setInstruments] = useState(canvas.potentialInstruments?.join(', ') || '');

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (overrides?: Partial<ResearchCanvas>) => {
    const updatedCanvas: ResearchCanvas = {
      frameworkType: framework,
      title: project.selectedTitle || project.title || canvas.title,
      phenomenon,
      problem,
      urgency,
      population,
      exposureOrIntervention,
      comparison,
      outcome,
      independentVariables: indepVars.split(',').map((s) => s.trim()).filter(Boolean),
      dependentVariables: depVars.split(',').map((s) => s.trim()).filter(Boolean),
      confoundingOrOtherVariables: otherVars.split(',').map((s) => s.trim()).filter(Boolean),
      researchGap: gap,
      novelty,
      researchQuestion: question,
      objectivesGeneral: generalObj,
      objectivesSpecific: specificObjs.split('\n').map((s) => s.trim()).filter(Boolean),
      researchDesign: design,
      settingLocation: setting,
      potentialInstruments: instruments.split(',').map((s) => s.trim()).filter(Boolean),
      ...overrides,
    };

    onUpdateProject({
      ...project,
      researchCanvas: updatedCanvas,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAssistWithAI = async () => {
    setIsLoadingAI(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/research-canvas-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectContext: project,
          framework,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal memanggil asisten kanvas.');
      }

      const data = await res.json();
      setPhenomenon(data.phenomenon || phenomenon);
      setProblem(data.problem || problem);
      setUrgency(data.urgency || urgency);
      setPopulation(data.population || population);
      setExposureOrIntervention(data.exposureOrIntervention || exposureOrIntervention);
      setComparison(data.comparison || comparison);
      setOutcome(data.outcome || outcome);
      if (Array.isArray(data.independentVariables)) {
        setIndepVars(data.independentVariables.join(', '));
      }
      if (Array.isArray(data.dependentVariables)) {
        setDepVars(data.dependentVariables.join(', '));
      }
      if (Array.isArray(data.confoundingOrOtherVariables)) {
        setOtherVars(data.confoundingOrOtherVariables.join(', '));
      }
      setGap(data.researchGap || gap);
      setNovelty(data.novelty || novelty);
      setQuestion(data.researchQuestion || question);
      setGeneralObj(data.objectivesGeneral || generalObj);
      if (Array.isArray(data.objectivesSpecific)) {
        setSpecificObjs(data.objectivesSpecific.join('\n'));
      }
      setDesign(data.researchDesign || design);
      setSetting(data.settingLocation || setting);
      if (Array.isArray(data.potentialInstruments)) {
        setInstruments(data.potentialInstruments.join(', '));
      }

      handleSave({
        phenomenon: data.phenomenon || phenomenon,
        problem: data.problem || problem,
        urgency: data.urgency || urgency,
        population: data.population || population,
        exposureOrIntervention: data.exposureOrIntervention || exposureOrIntervention,
        comparison: data.comparison || comparison,
        outcome: data.outcome || outcome,
        researchGap: data.researchGap || gap,
        novelty: data.novelty || novelty,
        researchQuestion: data.researchQuestion || question,
        objectivesGeneral: data.objectivesGeneral || generalObj,
        researchDesign: data.researchDesign || design,
        settingLocation: data.settingLocation || setting,
      });
    } catch (err: any) {
      setError(err.message || 'Gagal menghasilkan Research Canvas.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Modul 07: Research Canvas (Kerangka Konseptual 1-Halaman)
              </h2>
              <p className="text-xs text-stone-500">
                Peta utuh penelitian dalam satu pandangan mata. Menjaga keterkaitan logis dari masalah hingga instrumen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAssistWithAI}
              disabled={isLoadingAI}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors"
            >
              {isLoadingAI ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Bantu Susun Kanvas dengan AI</span>
            </button>

            <button
              onClick={() => handleSave()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-xl transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Kanvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Framework Selector & Active Title */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Pilih Kerangka Kerja (Framework):
          </span>
          <div className="flex gap-1 bg-stone-100 dark:bg-stone-700 p-1 rounded-lg">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw}
                onClick={() => {
                  setFramework(fw);
                  handleSave({ frameworkType: fw });
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  framework === fw
                    ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-stone-500 font-mono">
          Judul Aktif: <strong>{project.selectedTitle || project.title || 'Belum dipilih'}</strong>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* The 1-Page Canvas Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Box 1: Fenomena & Masalah */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            1. Fenomena & Masalah Utama
          </div>
          <textarea
            rows={4}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Deskripsi fenomena riil dan masalah inti..."
            className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Box 2: Urgensi & Dampak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            2. Urgensi & Dampak
          </div>
          <textarea
            rows={4}
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Konsekuensi serius jika masalah ini dibiarkan..."
            className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Box 3: Research Gap & Novelty */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            3. Research Gap & Novelty
          </div>
          <textarea
            rows={4}
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Celah riset yang dijawab dan apa yang baru..."
            className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Box 4: Framework Breakdown (PICO / PEO / SPIDER) - Span 3 */}
        <div className="md:col-span-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
            <span>4. Rincian Komponen Framework ({framework})</span>
            <span className="text-[11px] text-stone-500 font-normal">
              Petakan secara spesifik untuk mempermudah formulasi rumusan masalah
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Population / Problem (P)
              </label>
              <input
                type="text"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Pasien TB dewasa..."
                className="w-full px-2.5 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Intervention / Exposure (I / E)
              </label>
              <input
                type="text"
                value={exposureOrIntervention}
                onChange={(e) => setExposureOrIntervention(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Edukasi audiovisual / PMO..."
                className="w-full px-2.5 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Comparison / Control (C)
              </label>
              <input
                type="text"
                value={comparison}
                onChange={(e) => setComparison(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Edukasi konvensional leaflet..."
                className="w-full px-2.5 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Outcome Terukur (O)
              </label>
              <input
                type="text"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Skor kepatuhan MMAS-8..."
                className="w-full px-2.5 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Box 5: Pemetaan Variabel */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            5. Variabel Penelitian
          </div>
          <div className="space-y-1.5">
            <div>
              <label className="text-[11px] text-stone-500 block">Variabel Bebas (Independen):</label>
              <input
                type="text"
                value={indepVars}
                onChange={(e) => setIndepVars(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Pisahkan dengan koma"
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-500 block">Variabel Terikat (Dependen):</label>
              <input
                type="text"
                value={depVars}
                onChange={(e) => setDepVars(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Pisahkan dengan koma"
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-500 block">Variabel Kontrol / Perancu:</label>
              <input
                type="text"
                value={otherVars}
                onChange={(e) => setOtherVars(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Usia, tingkat pendidikan..."
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Box 6: Rumusan & Tujuan */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            6. Rumusan Masalah & Tujuan
          </div>
          <div className="space-y-1.5">
            <div>
              <label className="text-[11px] text-stone-500 block">Rumusan Masalah Utama:</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Apakah terdapat pengaruh..."
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-500 block">Tujuan Umum:</label>
              <input
                type="text"
                value={generalObj}
                onChange={(e) => setGeneralObj(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Mengetahui pengaruh..."
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-500 block">Tujuan Khusus (1 per baris):</label>
              <textarea
                rows={2}
                value={specificObjs}
                onChange={(e) => setSpecificObjs(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="1. Mengidentifikasi...&#10;2. Menganalisis..."
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Box 7: Metode, Setting & Instrumen */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-2">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            7. Desain, Setting & Instrumen
          </div>
          <div className="space-y-1.5">
            <div>
              <label className="text-[11px] text-stone-500 block">Desain Penelitian:</label>
              <input
                type="text"
                value={design}
                onChange={(e) => setDesign(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Quasi-experimental pre-post..."
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-500 block">Setting / Lokasi:</label>
              <input
                type="text"
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Puskesmas X Kota Y..."
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] text-stone-500 block">Instrumen Pengukuran Baku:</label>
              <input
                type="text"
                value={instruments}
                onChange={(e) => setInstruments(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Kuesioner MMAS-8, Lembar Observasi..."
                className="w-full px-2 py-1.5 bg-stone-50 dark:bg-stone-900 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <div className="text-xs text-stone-500">
          {saveSuccess && (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Research Canvas tersimpan
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>Lanjut ke Audit Cek Konsistensi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
