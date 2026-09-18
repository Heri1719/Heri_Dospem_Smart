import React, { useState } from 'react';
import {
  TableProperties,
  Plus,
  Sparkles,
  ArrowRight,
  Edit2,
  Trash2,
  FileText,
  Loader2,
  Check,
  X,
  Download,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  FileDown,
} from 'lucide-react';
import { ResearchProject, LiteratureMatrixRow } from '../types';

interface LiteratureMatrixViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onNextStep: () => void;
}

export const LiteratureMatrixView: React.FC<LiteratureMatrixViewProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const matrix = project.literatureMatrix || [];

  // Determine active/selected title
  const activeTitle =
    project.selectedTitle ||
    project.title ||
    project.researchCanvas?.title ||
    (project.topicExplorer?.selectedTopicId
      ? project.topicExplorer.generatedDirections?.find(
          (d) => d.id === project.topicExplorer.selectedTopicId
        )?.topicName
      : '') ||
    project.topicInterest ||
    '';

  // Search 5 Literature Modal
  const [isSearch5ModalOpen, setIsSearch5ModalOpen] = useState(false);
  const [targetTitleInput, setTargetTitleInput] = useState(activeTitle);
  const [replaceOrAppend, setReplaceOrAppend] = useState<'append' | 'replace'>('append');
  const [isSearching5, setIsSearching5] = useState(false);
  const [search5Error, setSearch5Error] = useState<string | null>(null);
  const [searchProgressStep, setSearchProgressStep] = useState<number>(1);
  const [searchSuccessMessage, setSearchSuccessMessage] = useState<string | null>(null);

  // Edit / Add modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<LiteratureMatrixRow | null>(null);

  // Extract from Abstract modal
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [abstractText, setAbstractText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const handleOpenSearch5 = () => {
    setTargetTitleInput(activeTitle || project.topicInterest || '');
    setSearch5Error(null);
    setIsSearch5ModalOpen(true);
  };

  const handleSearch5Literature = async (overrideTitle?: string) => {
    const queryTitle = (overrideTitle || targetTitleInput || activeTitle).trim();
    if (!queryTitle) {
      setSearch5Error('Silakan tulis atau pilih judul penelitian terlebih dahulu.');
      return;
    }

    setIsSearching5(true);
    setSearch5Error(null);
    setSearchProgressStep(1);

    const timer1 = setTimeout(() => setSearchProgressStep(2), 1500);
    const timer2 = setTimeout(() => setSearchProgressStep(3), 3200);

    try {
      const res = await fetch('/api/ai/literature-matrix-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: queryTitle,
          degreeLevel: project.degreeLevel,
          field: project.field,
          topic: project.topicInterest,
          problem: project.problemCanvas?.masalah,
          population: project.problemCanvas?.area || project.populationInterest,
          variables:
            project.researchCanvas?.independentVariables?.concat(
              project.researchCanvas?.dependentVariables || []
            ) || [],
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal mencari literatur');
      }

      const data = await res.json();
      const articles: LiteratureMatrixRow[] = data.articles || [];

      if (articles.length === 0) {
        throw new Error('Tidak ada artikel literatur yang ditemukan.');
      }

      const updatedMatrix =
        replaceOrAppend === 'replace' || matrix.length === 0
          ? articles
          : [...matrix, ...articles];

      onUpdateProject({
        ...project,
        selectedTitle: project.selectedTitle || queryTitle,
        literatureMatrix: updatedMatrix,
      });

      setIsSearch5ModalOpen(false);
      setSearchSuccessMessage(
        data.notice ||
          `Berhasil memetakan 5 literatur empiris yang sesuai dengan judul: "${queryTitle}"!`
      );
      setTimeout(() => setSearchSuccessMessage(null), 6000);
    } catch (err: any) {
      setSearch5Error(err.message || 'Terjadi kesalahan saat mencari literatur.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsSearching5(false);
    }
  };

  const handleOpenEdit = (row?: LiteratureMatrixRow) => {
    if (row) {
      setEditingRow(row);
    } else {
      setEditingRow({
        id: `row-${Date.now()}`,
        authorYear: '',
        title: '',
        population: '',
        variables: '',
        intervention: '',
        method: '',
        instrument: '',
        findings: '',
        limitations: '',
        gap: '',
        relevance: '',
      });
    }
    setIsEditModalOpen(true);
  };

  const handleSaveRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    const existingIndex = matrix.findIndex((r) => r.id === editingRow.id);
    let updated: LiteratureMatrixRow[];

    if (existingIndex >= 0) {
      updated = [...matrix];
      updated[existingIndex] = editingRow;
    } else {
      updated = [...matrix, editingRow];
    }

    onUpdateProject({
      ...project,
      literatureMatrix: updated,
    });

    setIsEditModalOpen(false);
    setEditingRow(null);
  };

  const handleDeleteRow = (id: string) => {
    if (!confirm('Hapus baris matriks ini?')) return;
    const updated = matrix.filter((r) => r.id !== id);
    onUpdateProject({
      ...project,
      literatureMatrix: updated,
    });
  };

  const handleExtractFromAbstract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!abstractText) return;
    setIsExtracting(true);
    setExtractError(null);

    try {
      const res = await fetch('/api/ai/literature-matrix-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText: abstractText,
          degreeLevel: project.degreeLevel,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengekstrak data dari teks.');
      }

      const extracted = await res.json();
      const newRow: LiteratureMatrixRow = {
        id: `ext-${Date.now()}`,
        authorYear: extracted.authorYear || 'Peneliti (Tahun)',
        title: extracted.title || 'Judul Hasil Ekstraksi',
        population: extracted.population || '-',
        variables: extracted.variables || '-',
        intervention: extracted.intervention || 'Tidak ada',
        method: extracted.method || 'Observasional',
        instrument: extracted.instrument || '-',
        findings: extracted.findings || '-',
        limitations: extracted.limitations || '-',
        gap: extracted.gap || '-',
        relevance: extracted.relevance || '-',
      };

      onUpdateProject({
        ...project,
        literatureMatrix: [...matrix, newRow],
      });

      setIsExtractModalOpen(false);
      setAbstractText('');
    } catch (err: any) {
      setExtractError(err.message || 'Terjadi kesalahan saat ekstraksi.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImportFromEvidence = () => {
    const evidenceList = project.evidence || [];
    if (evidenceList.length === 0) return;

    const existingTitles = new Set(matrix.map((m) => m.title.toLowerCase().trim()));
    const newRows: LiteratureMatrixRow[] = [];

    evidenceList.forEach((ev, idx) => {
      if (!existingTitles.has(ev.title.toLowerCase().trim())) {
        newRows.push({
          id: `ev-imp-${Date.now()}-${idx}`,
          authorYear: ev.authors ? `${ev.authors} (${ev.year || '2023'})` : `Peneliti (${ev.year || '2023'})`,
          title: ev.title,
          population: project.problemCanvas?.area || 'Populasi terkait',
          variables: project.topicInterest || '-',
          intervention: 'Tidak ada (observasional)',
          method: 'Kuantitatif / Telaah Literatur',
          instrument: 'Kuesioner / Data Sekunder',
          findings: ev.keyFindings || '-',
          limitations: 'Batasan sampel & setting studi terdahulu',
          gap: 'Perlu verifikasi lebih lanjut pada populasi lokal',
          relevance: ev.relationToStudy || 'Mendukung telaah pustaka',
        });
      }
    });

    if (newRows.length > 0) {
      onUpdateProject({
        ...project,
        literatureMatrix: [...matrix, ...newRows],
      });
      setSearchSuccessMessage(`Berhasil mengimpor ${newRows.length} literatur dari Evidence Explorer!`);
      setTimeout(() => setSearchSuccessMessage(null), 5000);
    }
  };

  const handleExportCSV = () => {
    if (matrix.length === 0) return;
    const headers = [
      'No',
      'Penulis & Tahun',
      'Judul Artikel',
      'Populasi/Sampel',
      'Variabel/Intervensi',
      'Metode & Desain',
      'Temuan Kunci',
      'Gap & Limitasi',
      'Relevansi',
    ];
    const rows = matrix.map((r, i) => [
      i + 1,
      `"${r.authorYear.replace(/"/g, '""')}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.population.replace(/"/g, '""')}"`,
      `"${(r.variables + (r.intervention ? ` | Intervensi: ${r.intervention}` : '')).replace(/"/g, '""')}"`,
      `"${r.method.replace(/"/g, '""')}"`,
      `"${r.findings.replace(/"/g, '""')}"`,
      `"${(r.gap + (r.limitations ? ` [Limitasi: ${r.limitations}]` : '')).replace(/"/g, '""')}"`,
      `"${r.relevance.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Literature_Matrix_${project.degreeLevel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <TableProperties className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Modul 04: Literature Matrix (Matriks Literatur)
              </h2>
              <p className="text-xs text-stone-500">
                Memetakan persamaan, perbedaan, metodologi, dan gap dari penelitian-penelitian sebelumnya.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Action: Bantu Cari 5 Literatur Sesuai Judul */}
            <button
              onClick={handleOpenSearch5}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bantu Cari 5 Literatur Sesuai Judul</span>
            </button>
            <button
              onClick={() => setIsExtractModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ekstrak dari Abstrak</span>
            </button>
            <button
              onClick={() => handleOpenEdit()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Title Reference Card */}
      <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                Judul Penelitian Rujukan
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300 font-mono font-medium">
                Jenjang {project.degreeLevel} • {project.field || 'Bidang Terkait'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-serif font-medium text-stone-800 dark:text-stone-100 italic leading-relaxed">
              "{activeTitle || 'Belum ada judul dipilih - Klik tombol cari untuk menetapkan judul rujukan'}"
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenSearch5}
          className="self-end md:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors shadow-2xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Cari Literatur dari Judul Ini</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {searchSuccessMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{searchSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSearchSuccessMessage(null)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Matrix Table Container */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Daftar Matriks ({matrix.length} Literatur Terpetakan)
            </span>
            {matrix.length > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                Lengkap dengan Metodologi & Gap
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {matrix.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 px-2.5 py-1 text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors"
                title="Ekspor ke CSV / Excel"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Ekspor Matriks</span>
              </button>
            )}
            <span className="text-[11px] text-stone-500">
              Geser ke kanan untuk melihat rincian metodologi & gap
            </span>
          </div>
        </div>

        {matrix.length === 0 ? (
          /* High-Craft AI Assistant Empty State */
          <div className="p-6 md:p-8 border border-dashed border-emerald-300/80 dark:border-emerald-800/60 bg-gradient-to-b from-emerald-50/30 to-stone-50/50 dark:from-emerald-950/10 dark:to-stone-900/40 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="max-w-xl mx-auto space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Bantu Cari 5 Literatur Sesuai Judul Penelitian
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Sistem akan secara otomatis menelusuri 5 artikel jurnal empiris bereputasi yang relevan dengan judul:{' '}
                <strong className="text-emerald-900 dark:text-emerald-300 italic">
                  "{activeTitle || 'Judul Penelitian Anda'}"
                </strong>
                , lalu memetakan populasi sampel, variabel, metode analisis, temuan kuantitatif/kualitatif, serta research gap langsung ke dalam tabel matriks.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={handleOpenSearch5}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs hover:shadow transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Cari 5 Literatur Sesuai Judul Sekarang</span>
              </button>

              <button
                onClick={() => setIsExtractModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 rounded-xl transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ekstrak dari Abstrak Jurnal</span>
              </button>

              <button
                onClick={() => handleOpenEdit()}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris Manual</span>
              </button>

              {project.evidence && project.evidence.length > 0 && (
                <button
                  onClick={handleImportFromEvidence}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 hover:bg-emerald-200/70 dark:bg-emerald-900/40 rounded-xl transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Impor dari Evidence Explorer ({project.evidence.length})</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700">
            <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
              <thead className="bg-stone-100 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 font-semibold">
                <tr>
                  <th className="p-2.5 w-10 text-center">No</th>
                  <th className="p-2.5 w-40">Penulis & Tahun</th>
                  <th className="p-2.5 w-56">Judul Artikel</th>
                  <th className="p-2.5 w-44">Populasi / Sampel</th>
                  <th className="p-2.5 w-44">Variabel / Intervensi</th>
                  <th className="p-2.5 w-36">Metode & Desain</th>
                  <th className="p-2.5 w-56">Temuan Kunci</th>
                  <th className="p-2.5 w-56">Gap & Limitasi</th>
                  <th className="p-2.5 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700 text-stone-800 dark:text-stone-200">
                {matrix.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className="hover:bg-stone-50/70 dark:hover:bg-stone-750 transition-colors"
                  >
                    <td className="p-2.5 text-center font-mono text-stone-500">{idx + 1}</td>
                    <td className="p-2.5 font-semibold text-stone-900 dark:text-stone-100">
                      {row.authorYear}
                    </td>
                    <td className="p-2.5 font-medium leading-relaxed">{row.title}</td>
                    <td className="p-2.5 text-stone-600 dark:text-stone-300">{row.population}</td>
                    <td className="p-2.5 text-stone-600 dark:text-stone-300">
                      <div>{row.variables}</div>
                      {row.intervention && row.intervention !== 'Tidak ada' && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                          Intervensi: {row.intervention}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                      {row.method}
                    </td>
                    <td className="p-2.5 text-stone-700 dark:text-stone-300 leading-relaxed">
                      {row.findings}
                    </td>
                    <td className="p-2.5 text-stone-600 dark:text-stone-300 leading-relaxed bg-amber-50/30 dark:bg-amber-950/10">
                      <div className="text-amber-900 dark:text-amber-300 font-medium">
                        {row.gap}
                      </div>
                      {row.limitations && (
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Limitasi: {row.limitations}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(row)}
                          className="p-1 text-stone-500 hover:text-emerald-600 rounded transition-colors"
                          title="Edit Baris"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Bantu Cari 5 Literatur Sesuai Judul */}
      {isSearch5ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-serif font-bold text-base">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pencarian 5 Literatur Berdasarkan Judul Riset</span>
              </div>
              <button
                onClick={() => setIsSearch5ModalOpen(false)}
                disabled={isSearching5}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1.5">
                  Judul Penelitian Rujukan (Bisa Disesuaikan) *
                </label>
                <textarea
                  rows={3}
                  value={targetTitleInput}
                  onChange={(e) => setTargetTitleInput(e.target.value)}
                  placeholder="Masukkan judul penelitian lengkap atau fokus topik riset Anda..."
                  disabled={isSearching5}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-serif text-xs leading-relaxed"
                />
              </div>

              {/* Quick suggestions if candidate titles exist */}
              {project.titleCandidates && project.titleCandidates.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Atau pilih dari kandidat judul yang telah dibuat:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    {project.titleCandidates.map((cand) => (
                      <button
                        key={cand.id}
                        type="button"
                        onClick={() => setTargetTitleInput(cand.title)}
                        className={`text-left text-[11px] px-2 py-1 rounded-md border transition-colors line-clamp-1 ${
                          targetTitleInput === cand.title
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        {cand.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-400">
                <div>
                  <span className="font-semibold block text-stone-700 dark:text-stone-300">Jenjang & Bidang:</span>
                  <span>{project.degreeLevel} ({project.degreeLevel === 'S1' ? 'Skripsi' : 'Tesis'}) • {project.field || 'Umum'}</span>
                </div>
                <div>
                  <span className="font-semibold block text-stone-700 dark:text-stone-300">Populasi Target:</span>
                  <span className="line-clamp-1">{project.problemCanvas?.area || project.populationInterest || 'Belum dispesifikasi'}</span>
                </div>
              </div>

              {matrix.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 block">
                    Mode Pengisian Matriks:
                  </span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="replaceMode"
                        checked={replaceOrAppend === 'append'}
                        onChange={() => setReplaceOrAppend('append')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Tambahkan ke matriks yang ada (+5 baris)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="replaceMode"
                        checked={replaceOrAppend === 'replace'}
                        onChange={() => setReplaceOrAppend('replace')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Ganti seluruh matriks saat ini</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Animated Progress Indicator */}
              {isSearching5 && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Sedang mencari dan menganalisis 5 literatur empiris...</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-stone-600 dark:text-stone-400 pl-6">
                    <div className={searchProgressStep >= 1 ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-stone-400'}>
                      {searchProgressStep > 1 ? '✓' : '•'} 1. Menelaah konstruk variabel, populasi, dan fokus dari judul
                    </div>
                    <div className={searchProgressStep >= 2 ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-stone-400'}>
                      {searchProgressStep > 2 ? '✓' : '•'} 2. Menelusuri artikel jurnal empiris bereputasi terkait
                    </div>
                    <div className={searchProgressStep >= 3 ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-stone-400'}>
                      • 3. Mengekstrak metodologi, temuan kunci, limitasi, dan gap ke dalam matriks
                    </div>
                  </div>
                </div>
              )}

              {search5Error && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{search5Error}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                disabled={isSearching5}
                onClick={() => setIsSearch5ModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSearching5 || !targetTitleInput.trim()}
                onClick={() => handleSearch5Literature()}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl transition-all shadow-xs"
              >
                {isSearching5 ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengekstrak 5 Literatur...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cari 5 Literatur Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditModalOpen && editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {editingRow.id.startsWith('row-') ? 'Tambah Literatur' : 'Edit Baris Matriks Literatur'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRow} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Penulis & Tahun *</label>
                  <input
                    type="text"
                    required
                    value={editingRow.authorYear}
                    onChange={(e) => setEditingRow({ ...editingRow, authorYear: e.target.value })}
                    placeholder="Contoh: Smith et al. (2023)"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Populasi / Sampel</label>
                  <input
                    type="text"
                    value={editingRow.population}
                    onChange={(e) => setEditingRow({ ...editingRow, population: e.target.value })}
                    placeholder="Contoh: 120 Pasien dewasa di RS X"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={editingRow.title}
                  onChange={(e) => setEditingRow({ ...editingRow, title: e.target.value })}
                  placeholder="Judul lengkap publikasi ilmiah"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Variabel Penelitian</label>
                  <input
                    type="text"
                    value={editingRow.variables}
                    onChange={(e) => setEditingRow({ ...editingRow, variables: e.target.value })}
                    placeholder="Contoh: Self-efficacy, Kepatuhan minum obat"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Metode / Desain Studi</label>
                  <input
                    type="text"
                    value={editingRow.method}
                    onChange={(e) => setEditingRow({ ...editingRow, method: e.target.value })}
                    placeholder="Contoh: Cross-sectional, Regresi Logistik"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Temuan Kunci</label>
                <textarea
                  rows={2}
                  value={editingRow.findings}
                  onChange={(e) => setEditingRow({ ...editingRow, findings: e.target.value })}
                  placeholder="Hasil signifikan atau statistik (p-value, odds ratio)..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Gap & Limitasi Penelitian</label>
                <textarea
                  rows={2}
                  value={editingRow.gap}
                  onChange={(e) => setEditingRow({ ...editingRow, gap: e.target.value })}
                  placeholder="Hal apa yang belum terjawab oleh penelitian ini?"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Relevansi Terhadap Penelitian Anda</label>
                <input
                  type="text"
                  value={editingRow.relevance}
                  onChange={(e) => setEditingRow({ ...editingRow, relevance: e.target.value })}
                  placeholder="Bagaimana artikel ini mendukung argumen proposal Anda?"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Simpan ke Matriks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extract from Abstract Modal */}
      {isExtractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                <FileText className="w-4 h-4" />
                <span>Ekstrak Otomatis dari Abstrak Jurnal</span>
              </div>
              <button
                onClick={() => setIsExtractModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400">
              Tempelkan teks abstrak artikel jurnal. AI akan mengekstrak populasi, variabel, metode, temuan, dan gap secara otomatis.
            </p>

            <form onSubmit={handleExtractFromAbstract} className="space-y-3">
              <textarea
                rows={6}
                required
                value={abstractText}
                onChange={(e) => setAbstractText(e.target.value)}
                placeholder="Paste abstrak artikel jurnal di sini..."
                className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {extractError && (
                <div className="text-xs text-red-600">{extractError}</div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExtractModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isExtracting}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-lg"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengekstrak Komponen...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ekstrak ke Matriks</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <span className="text-xs text-stone-500">
          Matriks ini akan menjadi input utama bagi AI Gap Analyzer dan Novelty Builder.
        </span>

        <button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>Lanjut ke Analisis Gap & Novelty</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

