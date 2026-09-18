import { ResearchProject } from '../types';

export function calculateProjectProgress(project?: ResearchProject | null): {
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  checklist: Array<{ stepNumber: number; title: string; isDone: boolean; advice: string }>;
} {
  if (!project) {
    return {
      percentage: 0,
      completedSteps: 0,
      totalSteps: 10,
      checklist: [],
    };
  }

  const steps = [
    {
      stepNumber: 1,
      title: '01 Temukan Topik',
      isDone: !!project.topicExplorer?.selectedTopicId || !!project.topicInterest,
      advice: 'Tentukan topik dan minat fenomena penelitian.',
    },
    {
      stepNumber: 2,
      title: '02 Temukan Masalah',
      isDone: !!project.problemCanvas?.masalah && project.problemCanvas?.masalah.length > 20,
      advice: 'Lengkapi Problem Canvas dengan kerangka MDAEG.',
    },
    {
      stepNumber: 3,
      title: '03 Evidence Explorer',
      isDone: (project.evidence?.length || 0) >= 2,
      advice: 'Kumpulkan minimal 2 bukti empiris atau artikel jurnal terpercaya.',
    },
    {
      stepNumber: 4,
      title: '04 Literature Matrix',
      isDone: (project.literatureMatrix?.length || 0) >= 1,
      advice: 'Petakan minimal 1 literatur ke dalam matriks perbandingan.',
    },
    {
      stepNumber: 5,
      title: '05 Research Gap & Novelty',
      isDone: (project.gapAnalysis?.gaps?.length || 0) >= 1,
      advice: 'Identifikasi kategori gap dan kebaruan penelitian.',
    },
    {
      stepNumber: 6,
      title: '06 Judul Penelitian',
      isDone: !!project.selectedTitle && project.selectedTitle.length > 10,
      advice: 'Pilih judul penelitian yang jelas dan terukur.',
    },
    {
      stepNumber: 7,
      title: '07 Research Canvas',
      isDone: !!project.researchCanvas?.researchQuestion && (project.researchCanvas?.independentVariables?.length || 0) > 0,
      advice: 'Lengkapi kerangka konseptual 1 halaman.',
    },
    {
      stepNumber: 8,
      title: '08 Konsistensi Penelitian',
      isDone: (project.consistencyCheck?.items?.length || 0) > 0,
      advice: 'Lakukan audit konsistensi antar komponen riset.',
    },
    {
      stepNumber: 9,
      title: '09 Draf Bab 1',
      isDone: (project.chapter1?.outline?.length || 0) >= 3 && project.chapter1?.outline?.some((p) => p.draftContent?.length > 50),
      advice: 'Susun draf latar belakang dan rumusan Bab 1.',
    },
    {
      stepNumber: 10,
      title: '10 AI Review & Export',
      isDone: !!project.aiReview?.scoreSummary,
      advice: 'Lakukan telaah ala dosen pembimbing sebelum ekspor.',
    },
  ];

  const completedSteps = steps.filter((s) => s.isDone).length;
  const percentage = Math.round((completedSteps / steps.length) * 100);

  return {
    percentage,
    completedSteps,
    totalSteps: steps.length,
    checklist: steps,
  };
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
