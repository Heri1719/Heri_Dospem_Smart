import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  PlusCircle,
  Download,
  Moon,
  Sun,
  ShieldCheck,
  HelpCircle,
  FolderOpen,
  Sparkles,
  X,
} from 'lucide-react';
import { ResearchProject } from '../types';

interface NavbarProps {
  currentProject: ResearchProject;
  projects: ResearchProject[];
  onSelectProject: (id: string) => void;
  onNewProjectClick?: () => void;
  onNewProject?: () => void;
  onExportClick?: () => void;
  onOpenExportModal?: () => void;
  onIntegrityClick?: () => void;
  onTerminologyClick?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onNewProjectClick,
  onNewProject,
  onExportClick,
  onOpenExportModal,
  onIntegrityClick,
  onTerminologyClick,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);
  const [showTerminologyModal, setShowTerminologyModal] = useState(false);

  const handleNewProject = () => {
    if (onNewProjectClick) onNewProjectClick();
    else if (onNewProject) onNewProject();
  };

  const handleExport = () => {
    if (onExportClick) onExportClick();
    else if (onOpenExportModal) onOpenExportModal();
  };

  const handleIntegrity = () => {
    if (onIntegrityClick) onIntegrityClick();
    else setShowIntegrityModal(true);
  };

  const handleTerminology = () => {
    if (onTerminologyClick) onTerminologyClick();
    else setShowTerminologyModal(true);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm font-serif text-xl font-bold tracking-tight">
            DS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span id="app-brand-title" className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                DOSPEM SMART
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden md:block">
              Dari Ide Menjadi Proposal Penelitian
            </p>
          </div>
        </div>

        {/* Center: Project Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-1 border border-stone-200 dark:border-stone-700 max-w-[280px] sm:max-w-md">
            <FolderOpen className="w-4 h-4 text-stone-500 dark:text-stone-400 ml-2 shrink-0" />
            <select
              id="project-selector-dropdown"
              value={currentProject.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 px-2 py-1 focus:outline-none truncate cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
                  [{p.degreeLevel}] {p.title?.slice(0, 38) || 'Draft Proyek Baru'}...
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-new-project"
            onClick={handleNewProject}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
            title="Buat Project Penelitian Baru"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Project Baru</span>
          </button>
        </div>

        {/* Right Tools: Degree, Help, Export, Theme */}
        <div className="flex items-center gap-2">
          {/* Degree Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
              currentProject.degreeLevel === 'S2'
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
            }`}
            title={`Jenjang Penelitian: ${currentProject.degreeLevel === 'S2' ? 'S2 / Tesis' : 'S1 / Skripsi'}`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{currentProject.degreeLevel === 'S2' ? 'S2 • Tesis' : 'S1 • Skripsi'}</span>
          </div>

          {/* Terminology Assistant Trigger */}
          <button
            id="btn-terminology-help"
            onClick={handleTerminology}
            className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Kamus Istilah Metodologi (Pengaruh vs Hubungan, dll)"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Academic Integrity Trigger */}
          <button
            id="btn-academic-integrity"
            onClick={handleIntegrity}
            className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Prinsip Integritas Akademik"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleDarkMode}
            className="p-1.5 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Ganti Mode Tampilan"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Export Proposal */}
          <button
            id="btn-header-export"
            onClick={handleExport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Bab 1</span>
          </button>
        </div>
      </div>

      {/* Terminology Modal */}
      {showTerminologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Kamus Istilah Metodologi Penelitian
                </h3>
              </div>
              <button
                onClick={() => setShowTerminologyModal(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <strong className="text-emerald-800 dark:text-emerald-400 text-sm block mb-1">
                  1. "Pengaruh" vs "Hubungan" vs "Efektivitas"
                </strong>
                <p>• <strong>Hubungan (Korelasi):</strong> Menguji apakah dua variabel bergerak bersama tanpa manipulasi (desain observasional/korelasional).</p>
                <p>• <strong>Pengaruh (Regresi/Kausal):</strong> Menguji peran variabel bebas dalam memprediksi atau menyebabkan variasi pada variabel terikat.</p>
                <p>• <strong>Efektivitas:</strong> Menguji hasil dari intervensi atau perlakuan baru dibanding kontrol (desain eksperimen/kuasi-eksperimen).</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <strong className="text-emerald-800 dark:text-emerald-400 text-sm block mb-1">
                  2. Kerangka Teori vs Kerangka Konsep
                </strong>
                <p>• <strong>Kerangka Teori:</strong> Rangkuman teori-teori mapan dari literatur yang mendasari fenomena secara luas.</p>
                <p>• <strong>Kerangka Konsep:</strong> Diagram alur hubungan spesifik antar-variabel yang akan diukur langsung dalam penelitian Anda.</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <strong className="text-emerald-800 dark:text-emerald-400 text-sm block mb-1">
                  3. Research Gap vs Novelty
                </strong>
                <p>• <strong>Gap:</strong> Lubang pengetahuan dalam literatur terdahulu (apa yang belum dijawab atau belum dievaluasi).</p>
                <p>• <strong>Novelty:</strong> Kontribusi atau kebaruan spesifik yang ditawarkan oleh riset Anda untuk mengisi gap tersebut.</p>
              </div>
            </div>
            <button
              onClick={() => setShowTerminologyModal(false)}
              className="w-full py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-semibold"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}

      {/* Academic Integrity Modal */}
      {showIntegrityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Prinsip Integritas RisetFlow AI
                </h3>
              </div>
              <button
                onClick={() => setShowIntegrityModal(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <p className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <strong>Pemberitahuan Etika Akademik:</strong> RisetFlow AI dirancang untuk memandu alur berpikir dan struktur proposal penelitian. Seluruh data empiris, angka prevalensi, dan referensi harus diverifikasi secara nyata oleh mahasiswa.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-300">
                <li>Aplikasi tidak mengarang referensi palsu atau nomor DOI fiktif.</li>
                <li>Setiap klaim angka yang belum didukung bukti akan otomatis diberi penanda <code>[CITATION NEEDED]</code>.</li>
                <li>Mahasiswa tetap bertanggung jawab penuh atas keaslian, keakuratan metodologi, dan pertanggungjawaban di hadapan dosen penguji.</li>
              </ul>
            </div>
            <button
              onClick={() => setShowIntegrityModal(false)}
              className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Saya Mengerti & Berkomitmen Menjaga Integritas
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

