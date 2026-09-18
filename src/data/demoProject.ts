import { ResearchProject } from '../types';

export const DEMO_PROJECT: ResearchProject = {
  id: 'demo-tb-adherence',
  title: 'Faktor-Faktor yang Berhubungan dengan Kepatuhan Minum Obat Pasien Tuberkulosis Paru di Puskesmas',
  degreeLevel: 'S1',
  field: 'Ilmu Keperawatan',
  program: 'S1 Keperawatan & Ners',
  topicInterest: 'Kepatuhan pengobatan (medication adherence) pasien tuberkulosis paru',
  populationInterest: 'Pasien dewasa terdiagnosis TB paru pada fase intensif dan lanjutan',
  phenomenonOrProblem:
    'Tingginya angka putus obat (default rate) pada bulan ke-2 dan ke-4 pengobatan OAT jangka panjang, seringkali dipengaruhi oleh efek samping obat, stigma, dan kurangnya dukungan PMO (Pengawas Menelan Obat).',
  settingLocation: 'Wilayah Kerja Puskesmas Rawat Inap / Komunitas',
  researchDesignPreference: 'Kuantitatif',
  dataAvailability: 'perlu mengambil data primer',
  targetTimeline: '4 - 6 bulan',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  activeStep: 0,

  topicExplorer: {
    inputs: {
      field: 'Ilmu Keperawatan',
      interest: 'Kepatuhan pengobatan jangka panjang dan intervensi keperawatan komunitas',
      population: 'Pasien TB Paru dewasa di fasilitas pelayanan kesehatan primer',
      interestingProblem: 'Kejenuhan minum obat 6 bulan dan efektivitas pendampingan keluarga',
      setting: 'Puskesmas',
      technologyOrIntervention: 'Edukasi audiovisual terstruktur dan reminder keluarga',
    },
    generatedDirections: [
      {
        id: 'dir-1',
        topicName: 'Medication Adherence Pasien Tuberkulosis Paru Berbasis Teori Health Belief Model',
        phenomenon: 'Tingginya angka drop-out OAT setelah pasien merasa gejala klinis berkurang pada bulan kedua.',
        coreProblem: 'Persepsi kerentanan dan keparahan yang rendah menyebabkan kepatuhan terapi menurun sebelum tuntas 6 bulan.',
        potentialPopulation: 'Pasien TB paru dewasa fase lanjutan di puskesmas',
        variables: ['Persepsi Hambatan', 'Persepsi Manfaat', 'Self-Efficacy', 'Kepatuhan Minum OAT'],
        rationale: 'Kepatuhan TB merupakan masalah krusial kesehatan masyarakat untuk mencegah Multidrug-Resistant TB (MDR-TB).',
        possibleDesign: 'Kuantitatif observasional analitik (cross-sectional)',
        literatureKeywords: ['tuberculosis', 'medication adherence', 'Health Belief Model', 'primary healthcare'],
      },
      {
        id: 'dir-2',
        topicName: 'Dukungan Keluarga dan Peran PMO terhadap Keberhasilan Terapi TB',
        phenomenon: 'Banyak PMO berasal dari keluarga tetapi tidak memahami cara mendampingi dan mengatasi keluhan efek samping.',
        coreProblem: 'Keluarga hanya pasif mengawasi tanpa memberikan dukungan emosional dan instrumental yang memadai.',
        potentialPopulation: 'Pasien TB paru dan pengawas menelan obat (PMO)',
        variables: ['Dukungan Emosional Keluarga', 'Efikasi PMO', 'Keberhasilan Konversi Sputum', 'Kepatuhan'],
        rationale: 'Pendekatan family-centered nursing sangat feasible dan terbukti meningkatkan retensi pengobatan di Indonesia.',
        possibleDesign: 'Kuantitatif analitik atau Mixed Methods',
        literatureKeywords: ['treatment supporter', 'family support', 'DOTS strategy', 'TB adherence'],
      },
      {
        id: 'dir-3',
        topicName: 'Stigma Sosial dan Dampaknya terhadap Keteraturan Kontrol Pasien TB',
        phenomenon: 'Kekhawatiran dikucilkan tetangga membuat pasien enggan mengambil obat ke puskesmas tepat waktu.',
        coreProblem: 'Stigma yang diinternalisasi (internalized stigma) memperlemah kepatuhan dan pencarian layanan kesehatan.',
        potentialPopulation: 'Pasien TB paru baru dan relaps',
        variables: ['Perceived Stigma', 'Depresi Ringan', 'Keteraturan Kunjungan Ulang', 'Kepatuhan OAT'],
        rationale: 'Menjawab aspek psikososial pasien yang jarang ditangani dalam program biomedis murni.',
        possibleDesign: 'Kuantitatif korelasional',
        literatureKeywords: ['TB stigma', 'internalized stigma', 'adherence', 'psychosocial nursing'],
      },
    ],
    selectedTopicId: 'dir-1',
  },

  problemCanvas: {
    masalah:
      'Ketidakpatuhan pasien tuberkulosis paru dalam menyelesaikan regimen Obat Anti Tuberkulosis (OAT) selama 6 bulan, di mana pasien sering menghentikan obat secara sepihak ketika batuk mereda pada bulan ke-2 atau ke-3.',
    dampak:
      'Ketidakpatuhan berisiko memicu resistensi obat (Multidrug-Resistant TB / MDR-TB), memperpanjang masa penularan kuman Mycobacterium tuberculosis ke anggota keluarga dan masyarakat, meningkatkan morbiditas, serta melipatgandakan beban biaya pengobatan nasional.',
    area:
      'Pasien TB paru usia produktif (18–59 tahun) yang menjalani rawat jalan di wilayah kerja Puskesmas dengan cakupan konversi BTA yang belum mencapai target nasional (90%).',
    existingEffort:
      'Penerapan strategi DOTS (Directly Observed Treatment Short-course) dengan penunjukan Pengawas Menelan Obat (PMO) keluarga dan penyuluhan singkat saat pengambilan obat bulanan di poli TB.',
    gap:
      'Meskipun PMO telah ditunjuk, pemantauan psikososial dan penguatan self-efficacy pasien untuk mengatasi kejenuhan minum obat harian serta manajemen efek samping belum terintegrasi secara terstruktur dalam asuhan keperawatan puskesmas.',
    gapStatus: 'verified',
    notes: 'Kajian berbasis literatur Puskesmas di Jawa & Kementerian Kesehatan RI.',
  },

  evidence: [
    {
      id: 'ev-1',
      title: 'Global Tuberculosis Report 2023: Epidemiological and Health System Challenges',
      authors: 'World Health Organization (WHO)',
      year: '2023',
      journalOrSource: 'World Health Organization Technical Report Series',
      doi: '10.1016/S2213-2600(23)00456-X',
      url: 'https://www.who.int/teams/global-tuberculosis-programme/tb-reports',
      keyFindings:
        'Indonesia menempati peringkat kedua beban TB tertinggi di dunia. Tingkat keberhasilan pengobatan masih terhambat oleh loss to follow-up sebesar 8-12% terutama pada fase transisi intensif ke lanjutan.',
      relationToStudy: 'Menjadi landasan urgensi epidemiologis makro pada paragraf pembuka Latar Belakang.',
      isVerified: true,
      isInMatrix: true,
    },
    {
      id: 'ev-2',
      title: 'Factors Associated with Non-Adherence to Tuberculosis Treatment in Primary Healthcare: A Cross-Sectional Study',
      authors: 'Subramanian, R., & Handayani, S.',
      year: '2022',
      journalOrSource: 'Journal of Infection and Public Health',
      doi: '10.1016/j.jiph.2022.04.011',
      url: 'https://doi.org/10.1016/j.jiph.2022.04.011',
      keyFindings:
        'Faktor dominan ketidakpatuhan meliputi persepsi hambatan terhadap efek samping (aOR 2.84), self-efficacy yang rendah (aOR 3.12), dan penurunan motivasi setelah perbaikan gejala klinis.',
      relationToStudy: 'Dasar pemilihan variabel Health Belief Model (hambatan, efikasi diri) dalam penelitian.',
      isVerified: true,
      isInMatrix: true,
    },
    {
      id: 'ev-3',
      title: 'Peran Dukungan Keluarga dan Efikasi Diri terhadap Kepatuhan Minum Obat pada Penderita TB Paru',
      authors: 'Pratiwi, N. L., & Rahmawati, A.',
      year: '2021',
      journalOrSource: 'Jurnal Keperawatan Indonesia',
      doi: '10.7454/jki.v24i2.1120',
      url: 'https://jki.ui.ac.id/index.php/jki/article/view/1120',
      keyFindings:
        'Dukungan keluarga berkorelasi signifikan dengan kepatuhan (p = 0.003), namun dukungan instrumental PMO tanpa edukasi berkelanjutan tidak cukup mencegah drop out pada bulan ke-4.',
      relationToStudy: 'Mendukung gap bahwa pengawasan mekanis PMO perlu dibarengi penguatan internal pasien.',
      isVerified: true,
      isInMatrix: true,
    },
  ],

  literatureMatrix: [
    {
      id: 'lm-1',
      no: 1,
      authorYear: 'Subramanian & Handayani (2022)',
      title: 'Factors Associated with Non-Adherence to Tuberculosis Treatment in Primary Healthcare',
      population: '210 pasien TB paru dewasa di fasilitas kesehatan primer',
      variables: 'Pengetahuan, efek samping obat, self-efficacy, stigma, kepatuhan OAT',
      intervention: 'Tidak ada (observasional)',
      method: 'Kuantitatif cross-sectional dengan kuesioner Morisky Medication Adherence Scale (MMAS-8)',
      instrument: 'MMAS-8 dan kuesioner HBM tervalidasi',
      findings: 'Self-efficacy rendah (p < 0.001) dan persepsi hambatan efek samping berkontribusi 64% terhadap risiko ketidakpatuhan.',
      limitations: 'Pengambilan sampel hanya pada puskesmas perkotaan; tidak menganalisis peran spesifik PMO.',
      gap: 'Belum mengeksplorasi interaksi antara dukungan PMO keluarga dengan efikasi diri pasien di setting semi-urban.',
      relevance: 'Variabel MMAS-8 dan konstruk HBM sangat relevan diadopsi pada penelitian ini.',
    },
    {
      id: 'lm-2',
      no: 2,
      authorYear: 'Pratiwi & Rahmawati (2021)',
      title: 'Peran Dukungan Keluarga dan Efikasi Diri terhadap Kepatuhan Minum Obat pada Penderita TB Paru',
      population: '96 pasien TB paru di poliklinik paru RSUD',
      variables: 'Dukungan keluarga (emosional, instrumental), efikasi diri, kepatuhan OAT',
      intervention: 'Tidak ada (observasional)',
      method: 'Korelasional dengan uji Spearman Rank',
      instrument: 'Kuesioner dukungan keluarga Hensarling dan TB-Self Efficacy Scale',
      findings: 'Terdapat hubungan bermakna antara dukungan keluarga (r = 0.482) dan efikasi diri (r = 0.531) dengan kepatuhan.',
      limitations: 'Populasi berbasis rumah sakit rujukan, bukan puskesmas lini pertama.',
      gap: 'Diperlukan penelitian pada tingkat puskesmas komunitas di mana karakteristik pasien lebih heterogen.',
      relevance: 'Memberikan acuan kuesioner dan justifikasi peran keluarga dalam asuhan keperawatan.',
    },
  ],

  gapAnalysis: {
    summary:
      'Mayoritas studi sebelumnya mengukur kepatuhan di rumah sakit rujukan atau berfokus semata pada faktor demografi. Masih terbatas bukti empiris mengenai interaksi antara efikasi diri pasien dan peran fungsional PMO keluarga di tingkat puskesmas lini pertama.',
    gaps: [
      {
        id: 'gap-1',
        category: 'Contextual Gap',
        description: 'Sebagian besar penelitian TB adherence dilakukan pada setting rumah sakit rujukan tipe B/C, bukan di puskesmas lini pertama dengan keterbatasan konseling.',
        supportingEvidence: 'Pratiwi & Rahmawati (2021); Subramanian & Handayani (2022).',
        whyItsAGap: 'Karakteristik pasien puskesmas lebih rentan mengalami drop out karena akses geografis dan minimnya edukasi personal.',
        relevanceToStudy: 'Penelitian ini secara spesifik mengambil lokasi di puskesmas rawat jalan komunitas.',
        howToAddress: 'Melakukan penelitian cross-sectional langsung pada populasi pasien terdaftar DOTS di puskesmas.',
      },
      {
        id: 'gap-2',
        category: 'Intervention Gap',
        description: 'Strategi DOTS yang berjalan saat ini bersifat pengawasan fisik menelan obat, belum mengintegrasikan penguatan self-efficacy pasien dalam menghadapi efek samping.',
        supportingEvidence: 'WHO Global TB Report (2023); Jurnal Keperawatan Indonesia (2021).',
        whyItsAGap: 'Pasien berhenti bukan karena lupa menelan, melainkan tidak berdaya menghadapi mual dan perubahan warna urin.',
        relevanceToStudy: 'Menjadi dasar identifikasi variabel persepsi hambatan dan efikasi diri.',
        howToAddress: 'Menganalisis hubungan faktor psikososial ini sebagai dasar rekomendasi intervensi keperawatan komprehensif.',
      },
    ],
    novelty: [
      {
        dimension: 'Setting & Konteks',
        previousStudies: 'Mayoritas dilakukan di poli paru rumah sakit kota besar.',
        plannedStudy: 'Dilakukan di puskesmas daerah penyangga dengan karakteristik sosioekonomi menengah ke bawah.',
        whatIsDifferent: 'Fokus pada layanan primer di mana angka loss to follow-up paling sering terjadi.',
        whatIsNew: 'Analisis hambatan spesifik tingkat puskesmas dengan sistem PMO lokal.',
        whatStudyAdds: 'Data empiris lokal bagi pengelola program P2TB Puskesmas dalam merancang edukasi PMO terarah.',
      },
      {
        dimension: 'Variabel & Framework',
        previousStudies: 'Hanya melihat kepatuhan dari sudut pandang demografi (usia, pendidikan, pekerjaan).',
        plannedStudy: 'Mengintegrasikan teori Health Belief Model: persepsi hambatan, dukungan keluarga, dan self-efficacy.',
        whatIsDifferent: 'Menekankan faktor internal psikologis pasien yang dapat diintervensi oleh perawat.',
        whatIsNew: 'Pengukuran terpadu persepsi hambatan efek samping dan efikasi diri.',
        whatStudyAdds: 'Bukti bahwa intervensi keperawatan tidak cukup hanya mengingatkan, namun harus membangun keyakinan diri pasien.',
      },
    ],
  },

  titleCandidates: [
    {
      id: 'tc-1',
      title: 'Hubungan Dukungan Keluarga dan Efikasi Diri dengan Kepatuhan Minum Obat Pasien Tuberkulosis Paru di Puskesmas',
      mainProblem: 'Ketidakpatuhan minum OAT pada fase lanjutan pengobatan TB paru.',
      variables: ['Dukungan Keluarga', 'Efikasi Diri (Self-Efficacy)', 'Kepatuhan Minum Obat (OAT)'],
      population: 'Pasien TB paru dewasa yang sedang menjalani terapi OAT minimal 2 bulan',
      setting: 'Wilayah Kerja Puskesmas',
      suggestedMethod: 'Kuantitatif observasional analitik dengan pendekatan cross-sectional',
      researchGapAnswered: 'Menjawab contextual gap pada fasilitas primer dan integrasi faktor psikososial keluarga.',
      novelty: 'Fokus pada sinergi dukungan keluarga dan efikasi diri dalam mencegah drop-out fase lanjutan di puskesmas.',
      rationale: 'Sangat terukur, variabel jelas, instrumen baku tersedia, feasible untuk skripsi S1 keperawatan.',
      clarity: 'Sangat Baik',
      measurability: 'Sangat Baik',
      feasibility: 'Sangat Baik',
      degreeFit: 'Sangat Baik',
      gapFit: 'Baik',
    },
    {
      id: 'tc-2',
      title: 'Analisis Faktor yang Mempengaruhi Kepatuhan Pengobatan Pasien TB Paru Berdasarkan Health Belief Model di Puskesmas',
      mainProblem: 'Rendahnya kepatuhan terapi TB dipicu persepsi keparahan dan hambatan yang keliru.',
      variables: ['Persepsi Kerentanan', 'Persepsi Hambatan', 'Cues to Action', 'Kepatuhan OAT'],
      population: 'Pasien TB paru aktif di Puskesmas',
      setting: 'Puskesmas',
      suggestedMethod: 'Kuantitatif analitik (regresi logistik)',
      researchGapAnswered: 'Eksplorasi konstruk teori perilaku kesehatan pada kepatuhan TB.',
      novelty: 'Pemetaan komprehensif 4 pilar HBM terhadap kepatuhan di puskesmas.',
      rationale: 'Kuat secara teoritis namun memerlukan jumlah sampel yang lebih besar untuk analisis multivariat.',
      clarity: 'Baik',
      measurability: 'Baik',
      feasibility: 'Baik',
      degreeFit: 'Baik',
      gapFit: 'Sangat Baik',
    },
  ],
  selectedTitle: 'Hubungan Dukungan Keluarga dan Efikasi Diri dengan Kepatuhan Minum Obat Pasien Tuberkulosis Paru di Puskesmas',
  titleDoctorHistory: [],

  researchCanvas: {
    frameworkType: 'PEO',
    title: 'Hubungan Dukungan Keluarga dan Efikasi Diri dengan Kepatuhan Minum Obat Pasien Tuberkulosis Paru di Puskesmas',
    phenomenon:
      'Pasien TB paru sering merasa sembuh saat batuk dan demam mereda pada bulan ke-2, lalu menghentikan obat secara mandiri.',
    problem:
      'Tingginya angka ketidakpatuhan terapi 6 bulan yang berisiko resistensi obat (MDR-TB) dan kegagalan konversi BTA.',
    urgency:
      'Indonesia berstatus beban TB tertinggi ke-2 di dunia; kepatuhan adalah kunci utama eliminasi TB tahun 2030.',
    population: 'Pasien TB paru usia 18–60 tahun yang tercatat di register TB 01 Puskesmas',
    exposureOrIntervention: 'Dukungan Keluarga (emosional & instrumental) dan Efikasi Diri pasien',
    comparison: 'Pasien dengan dukungan keluarga rendah vs tinggi; efikasi diri rendah vs tinggi',
    outcome: 'Tingkat kepatuhan minum obat (kategori patuh vs tidak patuh)',
    independentVariables: ['Dukungan Keluarga', 'Efikasi Diri (Self-Efficacy)'],
    dependentVariables: ['Kepatuhan Minum Obat Anti Tuberkulosis (OAT)'],
    confoundingOrOtherVariables: ['Usia', 'Tingkat Pendidikan', 'Riwayat Efek Samping Obat', 'Lama Sakit'],
    researchGap:
      'Terbatasnya studi di fasilitas pelayanan kesehatan primer yang mengkaji interaksi simultan antara penguatan keluarga dan keyakinan diri pasien.',
    novelty:
      'Penekanan pada peran keperawatan promotif-preventif di puskesmas melalui pemberdayaan PMO keluarga untuk meningkatkan self-efficacy pasien.',
    researchQuestion:
      'Apakah terdapat hubungan antara dukungan keluarga dan efikasi diri dengan kepatuhan minum obat pada pasien TB paru di Puskesmas?',
    objectivesGeneral:
      'Menganalisis hubungan antara dukungan keluarga dan efikasi diri dengan kepatuhan minum obat pasien TB paru di wilayah kerja Puskesmas.',
    objectivesSpecific: [
      'Mengidentifikasi karakteristik sosiodemografi pasien TB paru di wilayah kerja Puskesmas.',
      'Mengidentifikasi tingkat dukungan keluarga pada pasien TB paru.',
      'Mengidentifikasi tingkat efikasi diri (self-efficacy) pada pasien TB paru.',
      'Mengidentifikasi tingkat kepatuhan minum obat pada pasien TB paru.',
      'Menganalisis hubungan dukungan keluarga dengan kepatuhan minum obat pasien TB paru.',
      'Menganalisis hubungan efikasi diri dengan kepatuhan minum obat pasien TB paru.',
    ],
    researchDesign: 'Kuantitatif observasional analitik dengan rancangan cross-sectional',
    settingLocation: 'Poli Pengobatan Tuberkulosis (TB-DOTS) Puskesmas Rawat Inap',
    potentialInstruments: [
      'Kuesioner Dukungan Keluarga (Hensarling Family Support Scale adaptasi keperawatan)',
      'Kuesioner TB Self-Efficacy Scale (TBSES)',
      'Morisky Medication Adherence Scale (MMAS-8) versi Bahasa Indonesia tervalidasi',
    ],
  },

  consistencyCheck: {
    lastChecked: new Date().toISOString(),
    overallSummary: 'Struktur penelitian sudah memiliki konsistensi tinggi antara masalah, judul, variabel, rumusan, dan metode.',
    items: [
      {
        componentPair: 'Masalah ↔ Judul',
        status: 'consistent',
        issueFound: 'Tidak ada pertentangan. Masalah ketidakpatuhan diangkat langsung dalam variabel dependen judul.',
        recommendation: 'Pertahankan keselarasan definisi operasional kepatuhan minum obat.',
      },
      {
        componentPair: 'Gap ↔ Rumusan Masalah',
        status: 'consistent',
        issueFound: 'Rumusan masalah diturunkan langsung dari contextual dan intervention gap di puskesmas.',
        recommendation: 'Pastikan kuesioner mengukur aspek yang belum terjawab di puskesmas tersebut.',
      },
      {
        componentPair: 'Judul ↔ Rumusan Masalah & Tujuan',
        status: 'consistent',
        issueFound: 'Variabel dukungan keluarga, efikasi diri, dan kepatuhan konsisten muncul di judul, rumusan masalah, dan tujuan khusus.',
        recommendation: 'Pertahankan kata kerja operasional pada tujuan khusus (mengidentifikasi, menganalisis hubungan).',
      },
      {
        componentPair: 'Tujuan Khusus ↔ Variabel & Rencana Analisis',
        status: 'consistent',
        issueFound: 'Setiap tujuan khusus berpasangan dengan variabel penelitian dan uji statistik bivariat (Chi-Square / Rank Spearman).',
        recommendation: 'Siapkan uji korelasi yang sesuai dengan skala ukur data ordinal.',
      },
      {
        componentPair: 'Variabel ↔ Instrumen Penelitian',
        status: 'consistent',
        issueFound: 'Ketiga variabel utama telah memiliki rujukan kuesioner baku (Hensarling, TBSES, MMAS-8).',
        recommendation: 'Lakukan uji validitas dan reliabilitas ulang pada sampel serupa di luar lokasi penelitian.',
      },
    ],
  },

  chapter1: {
    outline: [
      {
        id: 'p-1',
        order: 1,
        pillar: 'masalah',
        pillarLabel: 'Pilar 1: Masalah',
        funnelStage: 'Paragraf 1: Definisi & Fenomena Inti Masalah',
        coreIdea: 'Tuberkulosis sebagai penyakit infeksi menular kronis global dan tantangan kepatuhan terapi jangka panjang.',
        requiredEvidenceTypes: 'Laporan Global TB WHO (2023) dan Kementerian Kesehatan RI (2023).',
        citationSources: ['WHO (2023)', 'Kemenkes RI (2023)'],
        draftContent:
          'Tuberkulosis (TB) paru hingga saat ini masih menjadi salah satu ancaman kesehatan masyarakat paling persisten di dunia. Penyakit infeksi menular kronis yang disebabkan oleh Mycobacterium tuberculosis ini menuntut penanganan ketat, di mana eliminasi kuman mensyaratkan kepatuhan minum obat anti tuberkulosis (OAT) secara rutin tanpa jeda selama minimal enam bulan (Kemenkes RI, 2023). Kegagalan pada ketuntasan konsumsi obat menjadi akar utama bertahannya rantai penularan di masyarakat dan pemicu kekambuhan penyakit.',
        hasCitationNeeded: false,
      },
      {
        id: 'p-2',
        order: 2,
        pillar: 'skala_urgensi',
        pillarLabel: 'Pilar 2: Skala & Urgensi',
        funnelStage: 'Paragraf 2: Besarnya Masalah di Tingkat Dunia hingga Nasional/Regional',
        coreIdea: 'Besarnya beban kasus tuberkulosis dan tingkat ketidakpatuhan obat mulai dari skala dunia/global hingga nasional dan regional di Indonesia.',
        requiredEvidenceTypes: 'Laporan Global TB Report WHO (2023) dan data surveilans Kemenkes RI (2023).',
        citationSources: ['WHO (2023)', 'Kemenkes RI (2023)'],
        draftContent:
          'Besarnya masalah tuberkulosis tercermin nyata dari skala global di tingkat dunia. Berdasarkan laporan World Health Organization (WHO, 2023), diperkirakan terdapat 10,6 juta orang terinfeksi TB di dunia dengan angka mortalitas mencapai 1,3 juta jiwa per tahun, serta tercatat lebih dari 410.000 kasus mengalami resistensi terhadap rifampisin (RR/MDR-TB) akibat kepatuhan terapi lini pertama yang buruk. Di tingkat nasional, Indonesia menempati peringkat kedua di dunia setelah India dengan estimasi 1.060.000 kasus baru dan angka mortalitas melebihi 134.000 jiwa per tahun (Kemenkes RI, 2023). Dalam skala regional, target angka keberhasilan pengobatan (treatment success rate) minimal 90% yang dicanangkan pemerintah belum tercapai merata, di mana capaian di sejumlah provinsi dan kabupaten masih tertahan pada rentang 78% hingga 84% akibat fenomena pasien mangkir dan putus obat (loss to follow-up).',
        hasCitationNeeded: false,
      },
      {
        id: 'p-3',
        order: 3,
        pillar: 'skala_urgensi',
        pillarLabel: 'Pilar 2: Skala & Urgensi',
        funnelStage: 'Paragraf 3: Urgensi Masalah (Dampak Fatal & Setting Spesifik Lokasi)',
        coreIdea: 'Dampak fatal bila ketidakpatuhan tidak ditangani (MDR-TB, kematian, klaster penularan) dan urgensi mendesak pada setting spesifik puskesmas setempat.',
        requiredEvidenceTypes: 'Profil Kesehatan Daerah (2023/2024), data klinis resistensi obat Kemenkes RI (2023), dan register TB Puskesmas.',
        citationSources: ['Kemenkes RI (2023)', 'Dinas Kesehatan (2023)'],
        draftContent:
          'Dampak masalah ketidakpatuhan minum obat jika tidak segera ditangani berakibat sangat fatal, meliputi mutasi bakteri menjadi Multidrug-Resistant Tuberculosis (MDR-TB) yang membutuhkan durasi terapi hingga dua tahun, tingginya angka kegagalan terapi, serta lonjakan beban pembiayaan kesehatan negara (Kemenkes RI, 2023). Dampak destruktif ini menjadi ancaman nyata pada kondisi populasi dan setting spesifik di tingkat Puskesmas wilayah kerja setempat. Data Dinas Kesehatan (2023) menunjukkan sekitar 14,2% penderita TB paru terdaftar berisiko putus obat pada fase lanjutan [DATA LOKAL: Butuh konfirmasi angka register TB01 puskesmas 2023-2024]. Urgensi penelitian ini menjadi sangat mendesak karena karakteristik wilayah kerja puskesmas berpenduduk padat dengan mobilitas tinggi, sehingga kelalaian minum obat pada satu pasien berisiko menyebarkan droplet kuman resisten dan melahirkan klaster penularan baru di lingkungan keluarga maupun masyarakat luas.',
        hasCitationNeeded: true,
      },
      {
        id: 'p-4',
        order: 4,
        pillar: 'kronologi',
        pillarLabel: 'Pilar 3: Kronologi Masalah',
        funnelStage: 'Paragraf 4: Kronologi Masalah, Upaya Saat Ini & Research Gap',
        coreIdea: 'Kronologi terjadinya putus obat (efek samping, rasa sembuh semu), evaluasi keterbatasan program DOTS/PMO saat ini, serta kesenjangan riset terdahulu.',
        requiredEvidenceTypes: 'Studi Subramanian et al. (2022), Rahmawati & Setiawan (2023), dan Wulandari et al. (2022).',
        citationSources: ['Subramanian et al. (2022)', 'Rahmawati & Setiawan (2023)', 'Wulandari et al. (2022)'],
        draftContent:
          'Kronologi ketidakpatuhan pasien umumnya memuncak pada transisi fase intensif menuju fase lanjutan, di mana meredanya keluhan klinis (batuk dan demam) memicu timbulnya persepsi sembuh semu (false sense of recovery) yang disusul kebosanan menelan puluhan butir obat serta efek samping mual dan nyeri sendi (Subramanian et al., 2022). Berbagai upaya penanggulangan telah dijalankan melalui strategi Directly Observed Treatment Short-course (DOTS) dengan menunjuk Pengawas Menelan Obat (PMO) keluarga, namun evaluasi mutakhir menunjukkan peran PMO acap kali hanya berlangsung mekanistis administratif tanpa dibekali keterampilan psikoedukasi dan pemahaman manajemen efek samping (Rahmawati & Setiawan, 2023). Di sisi lain, penelitian-penelitian terdahulu umumnya hanya menelaah faktor sosiodemografi pasif (usia, pendidikan) atau terbatas pada rumah sakit rujukan (Wulandari et al., 2022). Terdapat kesenjangan riset (research gap) empiris mengenai bagaimana dukungan keluarga fungsional dan efikasi diri internal pasien berinteraksi secara simultan dalam menentukan kepatuhan minum obat di fasilitas pelayanan kesehatan primer.',
        hasCitationNeeded: false,
      },
      {
        id: 'p-5',
        order: 5,
        pillar: 'solusi_novelty',
        pillarLabel: 'Pilar 4: Solusi & Novelty',
        funnelStage: 'Paragraf 5: Solusi, Novelty Penelitian & Penegasan Judul',
        coreIdea: 'Solusi integratif dukungan keluarga dan efikasi diri, kebaruan (novelty) riset pada setting puskesmas, dan pernyataan formal judul penelitian.',
        requiredEvidenceTypes: 'Landasan teoretis Nugroho et al. (2023), Bandura (Self-Efficacy), dan dokumen rancangan penelitian.',
        citationSources: ['Nugroho et al. (2023)', 'Subramanian et al. (2022)'],
        draftContent:
          'Menjawab kesenjangan tersebut, solusi penelitian yang diusulkan adalah pendekatan asuhan keperawatan komunitas yang mengintegrasikan penguatan dukungan keluarga multidimensi (emosional, instrumental, informasional) dengan pembinaan efikasi diri pasien, di mana keyakinan internal pasien terbukti menjadi determinan paling mandiri dalam mempertahankan kepatuhan jangka panjang (Nugroho et al., 2023; Subramanian et al., 2022). Kebaruan (novelty) dari penelitian ini terletak pada pengujian model keterkaitan simultan antara modalitas keluarga dan efikasi diri spesifik TB pada tatanan puskesmas primer, yang menyediakan dasar evidensi aplikatif bagi tenaga keperawatan dalam menyusun protokol pendampingan pasien berbasis keluarga. Berdasarkan latar belakang fenomena, urgensi, dan kebaruan tersebut, peneliti memandang penting untuk melaksanakan penelitian dengan judul "Hubungan Dukungan Keluarga dan Efikasi Diri dengan Kepatuhan Minum Obat Pasien Tuberkulosis Paru di Puskesmas".',
        hasCitationNeeded: false,
      },
    ],
    backgroundText: '', // Will be assembled or edited
    problemIdentification:
      '1. Tingginya angka putus obat pada fase lanjutan pengobatan TB paru di wilayah kerja puskesmas.\n2. Munculnya persepsi sembuh semu setelah dua bulan terapi yang menyebabkan penghentian obat secara dini.\n3. Peran PMO keluarga yang masih terbatas pada pengawasan mekanis tanpa dukungan emosional yang memadai.\n4. Kurangnya efikasi diri pasien dalam mengelola efek samping dan kejenuhan meminum obat jangka panjang.',
    problemLimitation:
      'Penelitian ini dibatasi pada pasien tuberkulosis paru dewasa (usia 18–60 tahun) dengan BTA positif yang sedang menjalani pengobatan fase intensif minimal satu bulan atau fase lanjutan di wilayah kerja Puskesmas, dengan variabel yang diteliti meliputi dukungan keluarga, efikasi diri, dan kepatuhan minum obat.',
    researchQuestions: [
      {
        id: 'rq-1',
        question: 'Bagaimanakah karakteristik sosiodemografi pasien TB paru di Puskesmas?',
        derivedFromGap: 'Kebutuhan data profil populasi sasaran.',
      },
      {
        id: 'rq-2',
        question: 'Bagaimanakah tingkat dukungan keluarga pada pasien TB paru di Puskesmas?',
        derivedFromGap: 'Identifikasi peran PMO keluarga secara objektif.',
      },
      {
        id: 'rq-3',
        question: 'Bagaimanakah tingkat efikasi diri (self-efficacy) pada pasien TB paru di Puskesmas?',
        derivedFromGap: 'Pengukuran keyakinan internal pasien dalam menyelesaikan terapi.',
      },
      {
        id: 'rq-4',
        question: 'Bagaimanakah tingkat kepatuhan minum obat pada pasien TB paru di Puskesmas?',
        derivedFromGap: 'Tingkat kepatuhan aktual dengan instrumen baku.',
      },
      {
        id: 'rq-5',
        question: 'Apakah ada hubungan antara dukungan keluarga dengan kepatuhan minum obat pasien TB paru di Puskesmas?',
        derivedFromGap: 'Menjawab contextual & intervention gap peran pendampingan keluarga.',
      },
      {
        id: 'rq-6',
        question: 'Apakah ada hubungan antara efikasi diri dengan kepatuhan minum obat pasien TB paru di Puskesmas?',
        derivedFromGap: 'Menjawab peran variabel psikologis internal pasien terhadap kepatuhan.',
      },
    ],
    objectives: {
      general:
        'Mengetahui hubungan antara dukungan keluarga dan efikasi diri dengan kepatuhan minum obat pasien TB paru di wilayah kerja Puskesmas.',
      specific: [
        {
          id: 'obj-1',
          text: 'Mengidentifikasi karakteristik sosiodemografi pasien TB paru di wilayah kerja Puskesmas.',
          mappedQuestion: 'Bagaimanakah karakteristik sosiodemografi pasien TB paru di Puskesmas?',
          variableOrConcept: 'Usia, jenis kelamin, pendidikan, pekerjaan',
          potentialAnalysis: 'Analisis univariat (frekuensi dan persentase)',
        },
        {
          id: 'obj-2',
          text: 'Mengidentifikasi tingkat dukungan keluarga pada pasien TB paru di wilayah kerja Puskesmas.',
          mappedQuestion: 'Bagaimanakah tingkat dukungan keluarga pada pasien TB paru di Puskesmas?',
          variableOrConcept: 'Dukungan Keluarga (skor Hensarling)',
          potentialAnalysis: 'Analisis univariat (mean, median, kategori)',
        },
        {
          id: 'obj-3',
          text: 'Mengidentifikasi tingkat efikasi diri pada pasien TB paru di wilayah kerja Puskesmas.',
          mappedQuestion: 'Bagaimanakah tingkat efikasi diri pada pasien TB paru di Puskesmas?',
          variableOrConcept: 'Efikasi Diri (skor TBSES)',
          potentialAnalysis: 'Analisis univariat (kategori rendah/sedang/tinggi)',
        },
        {
          id: 'obj-4',
          text: 'Mengidentifikasi tingkat kepatuhan minum obat pada pasien TB paru di wilayah kerja Puskesmas.',
          mappedQuestion: 'Bagaimanakah tingkat kepatuhan minum obat pada pasien TB paru di Puskesmas?',
          variableOrConcept: 'Kepatuhan Minum OAT (skor MMAS-8)',
          potentialAnalysis: 'Analisis univariat (patuh vs tidak patuh)',
        },
        {
          id: 'obj-5',
          text: 'Menganalisis hubungan dukungan keluarga dengan kepatuhan minum obat pasien TB paru di wilayah kerja Puskesmas.',
          mappedQuestion: 'Apakah ada hubungan antara dukungan keluarga dengan kepatuhan minum obat?',
          variableOrConcept: 'Dukungan Keluarga ↔ Kepatuhan OAT',
          potentialAnalysis: 'Analisis bivariat (Uji Chi-Square / Spearman Rank)',
        },
        {
          id: 'obj-6',
          text: 'Menganalisis hubungan efikasi diri dengan kepatuhan minum obat pasien TB paru di wilayah kerja Puskesmas.',
          mappedQuestion: 'Apakah ada hubungan antara efikasi diri dengan kepatuhan minum obat?',
          variableOrConcept: 'Efikasi Diri ↔ Kepatuhan OAT',
          potentialAnalysis: 'Analisis bivariat (Uji Chi-Square / Spearman Rank)',
        },
      ],
    },
    significance: {
      theoretical:
        'Menambah khazanah keilmuan keperawatan medikal bedah dan keperawatan komunitas mengenai aplikasi teori perilaku kesehatan (Health Belief Model) dalam kepatuhan pengobatan penyakit menular kronis.',
      practical:
        'Memberikan masukan konkret bagi program P2TB di Puskesmas mengenai perlunya lembar edukasi manajemen efek samping dan modul pelatihan PMO keluarga.',
      population:
        'Membantu pasien TB paru dan keluarganya mengenali pentingnya kepatuhan terapi secara utuh dan membangun rasa percaya diri dalam menuntaskan pengobatan.',
      institution:
        'Sebagai bahan evaluasi mutu pelayanan poli TB DOTS Puskesmas dalam meningkatkan capaian treatment success rate sesuai target nasional.',
      profession:
        'Sebagai dasar pengembangan protokol asuhan keperawatan mandiri dalam bentuk konseling suportif perawat bagi penderita TB paru rawat jalan.',
      futureResearch:
        'Dapat dijadikan rujukan bagi peneliti selanjutnya untuk mengembangkan penelitian quasi-eksperimen berbasis intervensi edukasi audiovisual terhadap peningkatan efikasi diri pasien.',
    },
  },

  versionHistory: [
    {
      id: 'ver-init',
      timestamp: new Date().toISOString(),
      label: 'Draf Awal Otomatis',
      section: 'Latar Belakang',
      originalText: 'Tuberkulosis masih menjadi masalah besar di puskesmas...',
      finalText: 'Tuberkulosis (TB) paru hingga saat ini masih menjadi salah satu ancaman kesehatan masyarakat...',
    },
  ],

  aiReview: {
    scoreSummary: 'Proposal memiliki dasar metodologis yang kuat untuk jenjang S1 dengan kejelasan variabel dan instrumen.',
    wellDone: [
      'Alur Latar Belakang menggunakan struktur funnel yang logis dari epidemiologi global hingga setting puskesmas.',
      'Instrumen penelitian baku (MMAS-8, TBSES, Hensarling) telah diidentifikasi secara tepat.',
      'Rumusan masalah dan tujuan khusus selaras 1:1 dengan analisis univariat dan bivariat yang direncanakan.',
    ],
    needsImprovement: [
      'Data prevalensi lokal di puskesmas sasaran masih berstatus [CITATION NEEDED] dan wajib diisi sebelum seminar proposal.',
      'Definisi operasional kepatuhan perlu dipastikan apakah diukur murni lewat kuesioner MMAS-8 atau divalidasi dengan sisa blister obat.',
    ],
    coreIssues: [
      'Pengukuran self-report kepatuhan rentan terhadap bias sosial (social desirability bias). Peneliti perlu menyertakan strategi konfirmasi objektif.',
    ],
    concreteSuggestions: [
      'Tambahkan 1 paragraf singkat di tinjauan pustaka mengenai cara mengatasi bias laporan mandiri pada pengisian MMAS-8.',
      'Lakukan koordinasi dengan pemegang program TB puskesmas untuk mendapatkan angka drop-out riil 2 tahun terakhir.',
    ],
    prioritizedRevisions: [
      {
        priority: 1,
        title: 'Lengkapi Data Prevalensi Lokal Puskesmas',
        description: 'Ganti placeholder [CITATION NEEDED] pada Paragraf 2 Latar Belakang dengan angka riil dari register TB Puskesmas.',
        actionableStep: 'Mintalah data rekapitulasi pasien TB tahun lalu ke perawat pemegang program P2TB.',
      },
      {
        priority: 2,
        title: 'Pertegas Kriteria Inklusi dan Eksklusi',
        description: 'Pastikan pasien yang memiliki komorbiditas diabetes mellitus atau HIV dimasukkan atau dieksklusikan secara eksplisit.',
        actionableStep: 'Tuliskan kriteria eksklusi: pasien TB-MDR, pasien dengan penurunan kesadaran, atau TB ekstra paru.',
      },
      {
        priority: 3,
        title: 'Validasi Bahasa Instrumen TBSES',
        description: 'Pastikan kuesioner efikasi diri telah melalui uji validitas isi (content validity) oleh pakar keperawatan medikal bedah.',
        actionableStep: 'Lakukan uji validitas konstruk pada 30 responden di puskesmas tetangga yang setara.',
      },
    ],
  },

  supervisorChat: [
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      content:
        'Halo! Saya Pembimbing Penelitian Digital Anda di RisetFlow AI. Saya telah menelaah konteks penelitian Anda mengenai kepatuhan minum obat pasien TB paru di Puskesmas. Semua variabel Anda (Dukungan Keluarga, Efikasi Diri, Kepatuhan OAT) sudah sangat konsisten dan feasible untuk skripsi S1. Ada bagian tertentu yang ingin kita diskusikan atau pertajam?',
      structuredFeedback: {
        findings: 'Topik, fenomena, dan variabel penelitian telah terdefinisi dengan sangat baik dan terukur.',
        reason: 'Penggunaan instrumen baku (MMAS-8 dan TBSES) memudahkan uji hipotesis bivariat.',
        suggestion: 'Fokuskan persiapan pada pengambilan data primer dan pelengkap data lokal di Paragraf 2 Latar Belakang.',
        improvementExample: 'Contoh data lokal: "Berdasarkan data register TB 01 Puskesmas X tahun 2023, dari 64 pasien tercatat 7 orang (10,9%) mangkir dari pengobatan."',
      },
    },
  ],
};
