import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Plus,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { ResearchProject, EvidenceSource, LiteratureMatrixRow } from '../types';

interface EvidenceExplorerViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

export const EvidenceExplorerView: React.FC<EvidenceExplorerViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const [searchQuery, setSearchQuery] = useState(
    project.topicInterest
      ? `${project.topicInterest} ${project.problemCanvas?.area || ''} journal study`
      : 'kepatuhan minum obat tuberkulosis jurnal kesehatan'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual Add Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthors, setManualAuthors] = useState('');
  const [manualYear, setManualYear] = useState('2023');
  const [manualSource, setManualSource] = useState('');
  const [manualFindings, setManualFindings] = useState('');
  const [manualUrl, setManualUrl] = useState('');

  const evidenceList = project.evidence || [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/evidence-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          field: project.field,
          topic: project.topicInterest,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal mencari evidence');
      }

      const data = await res.json();
      const newSources: EvidenceSource[] = data.sources || [];

      // Merge avoiding duplicate titles
      const existingTitles = new Set(evidenceList.map((e) => e.title.toLowerCase().trim()));
      const filteredNew = newSources.filter(
        (s) => !existingTitles.has(s.title.toLowerCase().trim())
      );

      const merged = [...evidenceList, ...filteredNew];
      onUpdateProject({
        ...project,
        evidence: merged,
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mencari literatur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvidence = (id: string) => {
    const updated = evidenceList.filter((e) => e.id !== id);
    onUpdateProject({
      ...project,
      evidence: updated,
    });
  };

  const handleAddToMatrix = (ev: EvidenceSource) => {
    const matrixRows = project.literatureMatrix || [];
    const alreadyExists = matrixRows.some(
      (m) => m.title.toLowerCase().trim() === ev.title.toLowerCase().trim()
    );

    if (alreadyExists) {
      alert('Literatur ini sudah ada dalam Literature Matrix.');
      return;
    }

    const newRow: LiteratureMatrixRow = {
      id: `matrix-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      authorYear: `${ev.authors || 'Peneliti'} (${ev.year || '2023'})`,
      title: ev.title,
      population: project.problemCanvas?.area || 'Populasi terkait',
      variables: 'Variabel studi terkait',
      intervention: 'Intervensi atau observasi',
      method: 'Metode / Desain studi',
      instrument: 'Kuesioner / Catatan medis',
      findings: ev.keyFindings || 'Temuan utama',
      limitations: 'Keterbatasan ruang lingkup studi',
      gap: 'Belum mengevaluasi konteks spesifik',
      relevance: ev.relationToStudy || 'Relevan sebagai referensi pendukung latar belakang',
    };

    onUpdateProject({
      ...project,
      literatureMatrix: [...matrixRows, newRow],
    });

    alert('Berhasil ditambahkan ke Literature Matrix!');
  };

  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle) return;

    const newEv: EvidenceSource = {
      id: `manual-ev-${Date.now()}`,
      title: manualTitle,
      authors: manualAuthors || 'Peneliti Terdaftar',
      year: manualYear || '2023',
      journalOrSource: manualSource || 'Jurnal Terakreditasi',
      keyFindings: manualFindings || 'Temuan penting dari studi',
      relationToStudy: 'Referensi manual yang dikumpulkan mahasiswa',
      url: manualUrl || undefined,
      isVerified: true,
    };

    onUpdateProject({
      ...project,
      evidence: [newEv, ...evidenceList],
    });

    setIsManualModalOpen(false);
    setManualTitle('');
    setManualAuthors('');
    setManualYear('2023');
    setManualSource('');
    setManualFindings('');
    setManualUrl('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              Modul 03: Evidence Explorer
            </h2>
          </div>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jurnal Manual</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
          Eksplorasi bukti empiris dan artikel jurnal ilmiah terpercaya dengan Google Search Grounding. Mencegah fabrikasi data atau sitasi fiktif demi integritas karya ilmiah Anda.
        </p>
      </div>

      {/* Citation Safety Rules Badge */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
          <div className="font-bold">Standar Bebas Halusinasi & Anti-Fabrikasi:</div>
          <p className="leading-relaxed">
            AI hanya merekomendasikan bukti ilmiah dengan metadata nyata. Jika sebuah publikasi tidak ditemukan di basis data web terverifikasi, aplikasi tidak akan mengarang nama penulis atau DOI palsu. Jika Anda memerlukan sitasi spesifik, gunakan tanda <code>[CITATION NEEDED]</code> sampai artikel diverifikasi langsung.
          </p>
        </div>
      </div>

      {/* Search Input Form */}
      <form
        onSubmit={handleSearch}
        className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-3"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik topik, kata kunci variabel, atau nama penyakit/fenomena..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mencari Sumber Ilmiah...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Cari Evidence Ilmiah</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Keyword Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
          <span className="font-medium text-stone-400">Pencarian Cepat:</span>
          {[
            'Jurnal Sinta 2 Kemenkes',
            'PubMed adherence tuberculosis',
            'WHO Tuberculosis Report',
            'Crossref health intervention',
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchQuery(`${project.topicInterest || ''} ${tag}`)}
              className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors text-[11px]"
            >
              +{tag}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Evidence Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            Daftar Bukti Empiris & Referensi ({evidenceList.length} Tersimpan)
          </h3>
          <span className="text-xs text-stone-500">
            Minimal kumpulkan 2–3 bukti untuk memperkuat latar belakang
          </span>
        </div>

        {evidenceList.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 space-y-3">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Belum ada bukti ilmiah yang tersimpan. Klik tombol <strong>"Cari Evidence Ilmiah"</strong> di atas atau tambahkan jurnal secara manual.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {evidenceList.map((ev, idx) => (
              <div
                key={ev.id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Terverifikasi
                      </span>
                      <span className="text-xs font-mono text-stone-500">
                        {ev.year ? `Tahun ${ev.year}` : 'Tahun Tidak Diketahui'}
                      </span>
                      {ev.journalOrSource && (
                        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          • {ev.journalOrSource}
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">
                      Penulis: {ev.authors || 'Tidak dicantumkan'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteEvidence(ev.id)}
                    className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Hapus Referensi Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Key Findings */}
                <div className="text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800/80 space-y-1">
                  <div>
                    <strong className="text-stone-800 dark:text-stone-200">Temuan Empiris Kunci:</strong>{' '}
                    {ev.keyFindings}
                  </div>
                  {ev.relationToStudy && (
                    <div className="text-stone-500 dark:text-stone-400 pt-1">
                      <strong className="text-stone-700 dark:text-stone-300">Relevansi Penelitian:</strong>{' '}
                      {ev.relationToStudy}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                      >
                        <span>Lihat Sumber Jurnal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {ev.doi && (
                      <span className="font-mono text-[11px] text-stone-500">
                        DOI: {ev.doi}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToMatrix(ev)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-2xs transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambahkan ke Literature Matrix</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Input Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Tambah Jurnal Ilmiah Manual
            </h3>
            <p className="text-xs text-stone-500">
              Masukkan artikel jurnal yang Anda temukan secara mandiri dari perpustakaan kampus atau repositori resmi.
            </p>

            <form onSubmit={handleAddManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Judul Artikel Jurnal *
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Contoh: Analisis Kepatuhan Minum Obat Pasien Tuberkulosis..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Penulis
                  </label>
                  <input
                    type="text"
                    value={manualAuthors}
                    onChange={(e) => setManualAuthors(e.target.value)}
                    placeholder="Contoh: Rahmawati et al."
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Tahun Terbit
                  </label>
                  <input
                    type="text"
                    value={manualYear}
                    onChange={(e) => setManualYear(e.target.value)}
                    placeholder="2023"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Nama Jurnal / Penerbit
                </label>
                <input
                  type="text"
                  value={manualSource}
                  onChange={(e) => setManualSource(e.target.value)}
                  placeholder="Contoh: Jurnal Keperawatan Indonesia"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Temuan Kunci
                </label>
                <textarea
                  rows={3}
                  value={manualFindings}
                  onChange={(e) => setManualFindings(e.target.value)}
                  placeholder="Temuan statistik atau hasil utama yang relevan..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  URL / DOI (Opsional)
                </label>
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://doi.org/..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Simpan Sumber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>Lanjut ke Literature Matrix & Gap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
