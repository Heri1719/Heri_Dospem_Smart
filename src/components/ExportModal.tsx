import React, { useState } from 'react';
import {
  Download,
  FileText,
  Copy,
  Check,
  X,
  FileCode,
  Upload,
  Loader2,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { ResearchProject } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ResearchProject;
  onImportProject: (imported: ResearchProject) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onImportProject,
}) => {
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copied, setCopied] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    setDocxError(null);

    try {
      const res = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghasilkan file DOCX dari server.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanTitle = (project.selectedTitle || project.title || 'Proposal_Riset')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 50);
      a.download = `Proposal_${cleanTitle}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setDocxError(err.message || 'Terjadi kesalahan saat mengunduh DOCX.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleCopyText = () => {
    const ch1 = project.chapter1;
    const title = project.selectedTitle || project.title || 'PROPOSAL PENELITIAN';
    const lines: string[] = [
      `PROPOSAL PENELITIAN: ${title.toUpperCase()}`,
      `Jenjang: ${project.degreeLevel} | Program Studi: ${project.program} | Bidang: ${project.field}`,
      `Penyusun: ${project.studentName || 'Mahasiswa'} (NIM: ${project.studentId || '-'})`,
      `\n======================================================\n`,
      `BAB I: PENDAHULUAN\n`,
      `1.1 Latar Belakang Masalah`,
    ];

    if (ch1?.outline && ch1.outline.length > 0) {
      ch1.outline.forEach((o, i) => {
        lines.push(`\n[Paragraf ${i + 1}: ${o.funnelStage}]`);
        lines.push(o.draftContent || o.coreIdea);
      });
    }

    if (ch1?.problemIdentification) {
      lines.push(`\n1.2 Identifikasi Masalah:\n${ch1.problemIdentification}`);
    }

    if (ch1?.problemLimitation) {
      lines.push(`\n1.3 Pembatasan Masalah:\n${ch1.problemLimitation}`);
    }

    if (ch1?.researchQuestions && ch1.researchQuestions.length > 0) {
      lines.push(`\n1.4 Rumusan Masalah:`);
      ch1.researchQuestions.forEach((q, i) => {
        lines.push(`${i + 1}. ${q.question}`);
      });
    }

    if (ch1?.objectives) {
      lines.push(`\n1.5 Tujuan Penelitian:`);
      if (ch1.objectives.general) {
        lines.push(`Tujuan Umum: ${ch1.objectives.general}`);
      }
      if (ch1.objectives.specific && ch1.objectives.specific.length > 0) {
        lines.push(`Tujuan Khusus:`);
        ch1.objectives.specific.forEach((s, i) => {
          lines.push(`${i + 1}. ${s.text}`);
        });
      }
    }

    if (ch1?.significance) {
      lines.push(`\n1.6 Manfaat Penelitian:`);
      if (ch1.significance.theoretical) lines.push(`- Manfaat Teoretis: ${ch1.significance.theoretical}`);
      if (ch1.significance.population) lines.push(`- Bagi Subjek: ${ch1.significance.population}`);
      if (ch1.significance.institution) lines.push(`- Bagi Institusi: ${ch1.significance.institution}`);
      if (ch1.significance.futureResearch) lines.push(`- Bagi Peneliti Selanjutnya: ${ch1.significance.futureResearch}`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `RisetFlow_Backup_${project.id}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.id) {
          onImportProject(parsed);
          alert('Proyek berhasil diimpor!');
          onClose();
        } else {
          alert('Format JSON proyek tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file cadangan.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            <Download className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <span>Ekspor & Cadangan Proposal Riset</span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          Pilih format dokumen yang Anda butuhkan untuk bimbingan atau seminar proposal. File DOCX otomatis diformat dengan struktur standar karya tulis ilmiah.
        </p>

        {docxError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {docxError}
          </div>
        )}

        <div className="space-y-3">
          {/* Option 1: Microsoft Word DOCX */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="w-full p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/60 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-2xs">
                {isExportingDocx ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Unduh Dokumen Microsoft Word (.DOCX)
                </h4>
                <p className="text-[11px] text-stone-500">
                  Lengkap dengan halaman judul, Bab 1, tabel matriks, dan format font 12pt 1.5 spasi.
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 opacity-80 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Option 2: Copy Full Text to Clipboard */}
          <button
            onClick={handleCopyText}
            className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                  {copied ? 'Teks Berhasil Disalin ke Clipboard!' : 'Salin Seluruh Teks Proposal'}
                </h4>
                <p className="text-[11px] text-stone-500">
                  Salin teks format terstruktur untuk ditempel ke Google Docs atau aplikasi lain.
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Download JSON Project File */}
          <button
            onClick={handleDownloadJson}
            className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                  Cadangkan File Proyek (.JSON)
                </h4>
                <p className="text-[11px] text-stone-500">
                  Simpan cadangan lengkap dari topik, masalah, kanvas, matriks, dan draf Anda.
                </p>
              </div>
            </div>
          </button>

          {/* Option 4: Import Project Backup */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="flex items-center justify-between p-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Pulihkan dari File Cadangan (.JSON)</span>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJsonFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Data disimpan di perangkat lokal Anda dan tidak akan hilang saat browser ditutup.
          </span>
        </div>
      </div>
    </div>
  );
};
