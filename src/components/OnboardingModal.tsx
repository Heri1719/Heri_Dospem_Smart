import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  Building,
  Target,
} from 'lucide-react';
import { ResearchProject, DegreeLevel, ResearchDesignType, DataAvailability } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProject: ResearchProject) => void;
}

const FIELD_OPTIONS = [
  'Kesehatan & Keperawatan',
  'Kedokteran & Farmasi',
  'Pendidikan & Keguruan',
  'Ilmu Sosial & Ilmu Politik',
  'Ekonomi, Bisnis & Manajemen',
  'Teknologi Informasi & Ilmu Komputer',
  'Teknik & Rekayasa',
  'Psikologi',
  'Hukum',
  'Lainnya (Tulis Manual)',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>('S1');
  const [field, setField] = useState<string>('Kesehatan & Keperawatan');
  const [customField, setCustomField] = useState<string>('');
  const [program, setProgram] = useState<string>('Keperawatan');
  const [topicInterest, setTopicInterest] = useState<string>('');
  const [populationInterest, setPopulationInterest] = useState<string>('');
  const [phenomenonOrProblem, setPhenomenonOrProblem] = useState<string>('');
  const [settingLocation, setSettingLocation] = useState<string>('');
  const [researchDesignPreference, setResearchDesignPreference] = useState<ResearchDesignType>('Kuantitatif');
  const [dataAvailability, setDataAvailability] = useState<DataAvailability>('perlu mengambil data primer');
  const [targetTimeline, setTargetTimeline] = useState<string>('4 - 6 bulan');

  // Completed Profile Screen flag
  const [showSummaryProfile, setShowSummaryProfile] = useState<boolean>(false);

  if (!isOpen) return null;

  const actualField = field === 'Lainnya (Tulis Manual)' ? customField || 'Umum' : field;

  const handleFinishWizard = () => {
    setShowSummaryProfile(true);
  };

  const handleCommitProject = () => {
    const newProj: ResearchProject = {
      id: `proj-${Date.now()}`,
      title: topicInterest ? `Riset: ${topicInterest}` : 'Proyek Riset Baru',
      degreeLevel,
      field: actualField,
      program: program || 'Program Studi',
      topicInterest,
      populationInterest,
      phenomenonOrProblem,
      settingLocation,
      researchDesignPreference,
      dataAvailability,
      targetTimeline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeStep: 1, // Start at Topic Explorer
      topicExplorer: {
        inputs: {
          field: actualField,
          interest: topicInterest,
          population: populationInterest,
          interestingProblem: phenomenonOrProblem,
          setting: settingLocation,
          technologyOrIntervention: '',
        },
        generatedDirections: [],
      },
      problemCanvas: {
        masalah: phenomenonOrProblem || '',
        dampak: '',
        area: populationInterest || '',
        existingEffort: '',
        gap: '',
        gapStatus: 'unverified',
        notes: '',
      },
      evidence: [],
      literatureMatrix: [],
      gapAnalysis: {
        gaps: [],
        novelty: [],
        summary: '',
      },
      titleCandidates: [],
      selectedTitle: '',
      titleDoctorHistory: [],
      researchCanvas: {
        frameworkType: actualField.includes('Kesehatan') ? 'PICO' : 'PEO',
        title: '',
        phenomenon: phenomenonOrProblem || '',
        problem: '',
        urgency: '',
        population: populationInterest || '',
        exposureOrIntervention: '',
        comparison: '',
        outcome: '',
        independentVariables: [],
        dependentVariables: [],
        confoundingOrOtherVariables: [],
        researchGap: '',
        novelty: '',
        researchQuestion: '',
        objectivesGeneral: '',
        objectivesSpecific: [],
        researchDesign: researchDesignPreference,
        settingLocation: settingLocation || '',
        potentialInstruments: [],
      },
      consistencyCheck: {
        items: [],
        overallSummary: 'Lakukan audit setelah menyusun judul dan variabel.',
      },
      chapter1: {
        outline: [],
        backgroundText: '',
        problemIdentification: '',
        problemLimitation: '',
        researchQuestions: [],
        objectives: {
          general: '',
          specific: [],
        },
        significance: {},
      },
      versionHistory: [],
      supervisorChat: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          content: `Selamat datang di RisetFlow AI! Profil penelitian Anda untuk jenjang ${degreeLevel} di bidang ${actualField} telah disiapkan. Mari kita mulai dengan mengeksplorasi arah topik dan memetakan fenomena masalah secara terstruktur.`,
          structuredFeedback: {
            findings: `Minat penelitian terfokus pada: ${topicInterest || 'Topik baru'}.`,
            reason: 'Penelitian yang baik dimulai dari kejelasan fenomena masalah di lapangan, bukan sekadar memilih judul menarik.',
            suggestion: 'Langkah pertama: Buka modul "01 Temukan Topik" atau "02 Temukan Masalah" untuk merumuskan Problem Canvas.',
            improvementExample: 'Fokuskan pada gap nyata antara kenyataan dan standar ideal.',
          },
        },
      ],
    };

    onCreateProject(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Inisialisasi Proyek Penelitian
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Wizard Pembimbingan Riset Langkah demi Langkah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!showSummaryProfile ? (
            <div className="space-y-6">
              {/* Stepper indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                {[
                  { num: 1, label: 'Jenjang & Bidang' },
                  { num: 2, label: 'Topik & Populasi' },
                  { num: 3, label: 'Fenomena Masalah' },
                  { num: 4, label: 'Metodologi & Waktu' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step === s.num
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : step > s.num
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                      }`}
                    >
                      {s.num}
                    </div>
                    <span
                      className={`text-xs hidden sm:inline ${
                        step === s.num
                          ? 'font-semibold text-stone-900 dark:text-stone-100'
                          : 'text-stone-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Jenjang & Bidang */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                      Pilih Jenjang Akademik Penelitian
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDegreeLevel('S1')}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          degreeLevel === 'S1'
                            ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">S1 / Skripsi</div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Fokus: Feasible, ruang lingkup jelas, variabel terbatas, terukur, dan terjangkau.
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDegreeLevel('S2')}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          degreeLevel === 'S2'
                            ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20'
                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">S2 / Tesis</div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Fokus: Kedalaman teoritis, pengembangan model, intervensi, eksplanatori, atau inovasi.
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Bidang Ilmu Penelitian
                    </label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {FIELD_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {field === 'Lainnya (Tulis Manual)' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Tuliskan Bidang Ilmu Anda
                      </label>
                      <input
                        type="text"
                        value={customField}
                        onChange={(e) => setCustomField(e.target.value)}
                        placeholder="Contoh: Pariwisata, Seni Desain, Agribisnis..."
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Program Studi / Jurusan
                    </label>
                    <input
                      type="text"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      placeholder="Contoh: S1 Keperawatan, S2 Manajemen Rumah Sakit, Pendidikan Matematika..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Topik & Populasi */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Topik atau Area yang Diminati
                    </label>
                    <input
                      type="text"
                      value={topicInterest}
                      onChange={(e) => setTopicInterest(e.target.value)}
                      placeholder="Contoh: Kepatuhan pengobatan TB, efektivitas media gamifikasi, turnover intention karyawan..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Boleh berupa frasa atau topik umum jika Anda belum memiliki judul spesifik.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Populasi atau Subjek yang Diminati
                    </label>
                    <input
                      type="text"
                      value={populationInterest}
                      onChange={(e) => setPopulationInterest(e.target.value)}
                      placeholder="Contoh: Pasien TB dewasa fase lanjutan, siswa SMP kelas 8, perawat rawat inap, nasabah fintech..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Lokasi atau Setting Penelitian (jika sudah diketahui)
                    </label>
                    <input
                      type="text"
                      value={settingLocation}
                      onChange={(e) => setSettingLocation(e.target.value)}
                      placeholder="Contoh: Puskesmas Rawat Inap X, RSUD Kota Y, Sekolah Menengah Z, Komunitas Urban..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Fenomena Masalah */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Fenomena atau Masalah Riil yang Sering Ditemukan di Lapangan
                    </label>
                    <textarea
                      rows={4}
                      value={phenomenonOrProblem}
                      onChange={(e) => setPhenomenonOrProblem(e.target.value)}
                      placeholder="Ceritakan apa yang terjadi di lapangan. Contoh: Banyak pasien berhenti minum obat setelah bulan ke-2 karena merasa sudah membaik, padahal bakteri belum mati dan bisa memicu MDR-TB..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 dark:text-amber-300">
                      <strong>Privasi & Keamanan Etik:</strong> Dilarang memasukkan NIK, nama lengkap pasien/subjek, atau identitas rekam medis rahasia. Masukkan deskripsi fenomena secara umum.
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Metodologi & Target Waktu */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Jenis Desain Penelitian yang Diminati
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(['Kuantitatif', 'Kualitatif', 'Mixed Method', 'R&D', 'Belum tahu'] as ResearchDesignType[]).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setResearchDesignPreference(d)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                            researchDesignPreference === d
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                              : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Ketersediaan Data
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(['sudah tersedia', 'perlu mengambil data primer', 'belum tahu'] as DataAvailability[]).map((da) => (
                        <button
                          key={da}
                          type="button"
                          onClick={() => setDataAvailability(da)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors capitalize ${
                            dataAvailability === da
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                              : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {da}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Target Waktu Penyelesaian Proposal
                    </label>
                    <select
                      value={targetTimeline}
                      onChange={(e) => setTargetTimeline(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="1 - 2 bulan">1 - 2 bulan (Target Cepat)</option>
                      <option value="3 - 4 bulan">3 - 4 bulan (Standar Semester)</option>
                      <option value="5 - 6 bulan">5 - 6 bulan (Komprehensif)</option>
                      <option value="Lebih dari 6 bulan">Lebih dari 6 bulan</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as any)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev + 1) as any)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                  >
                    Selanjutnya
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishWizard}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                  >
                    Lihat Profil Penelitian
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Summary: Profil Penelitian Anda (Jangan langsung memberikan judul!) */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Profil Penelitian Anda Berhasil Disiapkan
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Berikut ringkasan konteks awal penelitian Anda. Sesuai prinsip metodologi akademik, kami tidak langsung melompat ke judul jadi, melainkan mendampingi proses berpikir bertahap.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1">
                  <div className="text-stone-400 font-medium">Jenjang & Program</div>
                  <div className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    {degreeLevel === 'S1' ? 'S1 / Skripsi' : 'S2 / Tesis'} • {program || actualField}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1">
                  <div className="text-stone-400 font-medium">Bidang Ilmu</div>
                  <div className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    {actualField}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1">
                  <div className="text-stone-400 font-medium">Topik & Populasi Sasaran</div>
                  <div className="font-semibold text-stone-800 dark:text-stone-100">
                    {topicInterest || 'Belum spesifik'}
                  </div>
                  <div className="text-stone-500 dark:text-stone-400 text-[11px]">
                    Populasi: {populationInterest || 'Belum ditentukan'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1">
                  <div className="text-stone-400 font-medium">Desain & Waktu</div>
                  <div className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    {researchDesignPreference} • {targetTimeline}
                  </div>
                </div>
              </div>

              {phenomenonOrProblem && (
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
                  <div className="text-stone-400 font-medium">Fenomena di Lapangan</div>
                  <p className="text-stone-700 dark:text-stone-300 italic">
                    "{phenomenonOrProblem}"
                  </p>
                </div>
              )}

              {/* Rekomendasi Langkah Berikutnya */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Rekomendasi Langkah Pembimbingan Pertama:
                </div>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1.5 list-disc list-inside">
                  <li>
                    <strong>Langkah 1:</strong> Buka <em>01 Temukan Topik</em> untuk melihat 6-8 arah riset potensial jika Anda masih ingin memperluas sudut pandang.
                  </li>
                  <li>
                    <strong>Langkah 2:</strong> Atau langsung petakan fenomena ke dalam <em>02 Temukan Masalah (Problem Canvas MDAEG)</em> untuk menguji apakah ada gap riset yang nyata.
                  </li>
                  <li>
                    <strong>Penting:</strong> Jangan langsung menentukan judul final sebelum bukti literatur diverifikasi di Evidence Explorer.
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSummaryProfile(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Edit Kembali
                </button>
                <button
                  type="button"
                  id="btn-confirm-create-project"
                  onClick={handleCommitProject}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all"
                >
                  <span>Mulai Riset di Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
