import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Send,
  MessageSquare,
  Award,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Download,
  Flame,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ResearchProject, ProposalReviewResult, SupervisorMessage, ReviewPersona } from '../types';

interface AIReviewViewProps {
  project: ResearchProject;
  onUpdateProject: (updated: ResearchProject) => void;
  onOpenExportModal: () => void;
}

export const AIReviewView: React.FC<AIReviewViewProps> = ({
  project,
  onUpdateProject,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'chat'>('review');

  // Review persona & state
  const [persona, setPersona] = useState<ReviewPersona>('ramah');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const reviewResult: ProposalReviewResult | null = project.latestReview || null;

  // Chat state
  const [chatMessages, setChatMessages] = useState<SupervisorMessage[]>(
    project.supervisorChatHistory?.length
      ? project.supervisorChatHistory
      : [
          {
            id: 'msg-init',
            sender: 'supervisor',
            text: `Halo ${project.studentName || 'rekan mahasiswa'}, saya adalah Dosen Pembimbing AI Anda untuk penelitian "${project.selectedTitle || project.title || 'Proposal Anda'}". Apa yang ingin Anda diskusikan atau tanyakan hari ini terkait persiapan seminar proposal?`,
            timestamp: new Date().toISOString(),
          },
        ]
  );
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Run full evaluation
  const handleRunEvaluation = async () => {
    setIsReviewing(true);
    setReviewError(null);

    try {
      const res = await fetch('/api/ai/review-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectContext: project,
          persona,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal melakukan review proposal.');
      }

      const result: ProposalReviewResult = await res.json();
      onUpdateProject({
        ...project,
        latestReview: result,
      });
    } catch (err: any) {
      setReviewError(err.message || 'Terjadi kesalahan saat review proposal.');
    } finally {
      setIsReviewing(false);
    }
  };

  // Send message to AI Supervisor
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSendingChat) return;

    const userMsg: SupervisorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'student',
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const newChat = [...chatMessages, userMsg];
    setChatMessages(newChat);
    setInputMessage('');
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/ai/supervisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          projectContext: project,
          history: newChat.slice(-8),
        }),
      });

      if (!res.ok) throw new Error('Gagal menghubungi Pembimbing AI.');

      const data = await res.json();
      const aiMsg: SupervisorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'supervisor',
        text: data.reply || 'Maaf, silakan ulangi pertanyaan Anda.',
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [...newChat, aiMsg];
      setChatMessages(updatedHistory);
      onUpdateProject({
        ...project,
        supervisorChatHistory: updatedHistory,
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
                Modul 10: Evaluasi Dosen & Konsultasi Pembimbing AI
              </h2>
              <p className="text-xs text-stone-500">
                Uji kelayakan proposal, simulasi pertanyaan seminar proposal, dan konsultasi interaktif bersama Dosen AI.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'review'
                  ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Evaluasi & Skor Kelayakan</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Konsultasi Pembimbing AI</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'review' ? (
        /* TAB 1: FORM EVALUASI & REVIEW DOSEN */
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Pilih Karakter Dosen Penguji / Reviewer:
                </h3>
                <p className="text-xs text-stone-500">
                  Ubah mode persona untuk menguji ketahanan proposal Anda sebelum menghadapi dosen penguji sesungguhnya.
                </p>
              </div>

              <button
                onClick={handleRunEvaluation}
                disabled={isReviewing}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengevaluasi 8 Aspek Kritis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mulai Evaluasi Komprehensif</span>
                  </>
                )}
              </button>
            </div>

            {/* Persona Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPersona('ramah')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  persona === 'ramah'
                    ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 mb-1">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mode Ramah & Membimbing</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Fokus pada saran konstruktif yang membangun motivasi dan memperjelas jalan keluar.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPersona('kritis')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  persona === 'kritis'
                    ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-950/40 ring-1 ring-amber-500'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Mode Kritis (Standar Reviewer)</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Ketat membedah metodologi, kelayakan variabel, serta bukti empiris pendukung.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPersona('sidang')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  persona === 'sidang'
                    ? 'border-red-600 bg-red-50/40 dark:bg-red-950/40 ring-1 ring-red-500'
                    : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 mb-1">
                  <Flame className="w-4 h-4 text-red-600" />
                  <span>Simulasi Ujian Sidang Proposal</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Menguji argumen utama mahasiswa dan melontarkan pertanyaan tajam khas dosen penguji.
                </p>
              </button>
            </div>

            {reviewError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {reviewError}
              </div>
            )}
          </div>

          {/* Review Results */}
          {reviewResult && (
            <div className="space-y-6">
              {/* Scorecard Hero */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-1 max-w-lg">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                    Kesiapan Proposal ({reviewResult.verdict})
                  </span>
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                    Evaluasi Komprehensif Jenjang {project.degreeLevel}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {reviewResult.overallFeedback}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-3xl font-black font-mono text-emerald-800 dark:text-emerald-300">
                      {reviewResult.score}
                      <span className="text-sm font-normal text-stone-400">/100</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      Skor Kesiapan
                    </span>
                  </div>
                </div>
              </div>

              {/* 8 Aspects Detailed Grid */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Penilaian 8 Aspek Kunci Proposal
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {reviewResult.aspects?.map((asp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 dark:text-stone-100 font-serif">
                          {asp.aspectName}
                        </span>
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                          {asp.score}/100
                        </span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                        {asp.analysis}
                      </p>
                      {asp.recommendation && (
                        <div className="p-2 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                          Saran: {asp.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Potential Questions in Proposal Defense */}
              {reviewResult.potentialDefenseQuestions && (
                <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Prediksi Pertanyaan Kritis Ujian Seminar Proposal</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Siapkan jawaban Anda untuk pertanyaan-pertanyaan ini sebelum memasuki ruang sidang:
                  </p>

                  <div className="space-y-3 pt-1">
                    {reviewResult.potentialDefenseQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-1.5"
                      >
                        <strong className="text-stone-900 dark:text-stone-100 block">
                          {i + 1}. "{q.question}"
                        </strong>
                        <p className="text-stone-600 dark:text-stone-400">
                          <strong className="text-emerald-700 dark:text-emerald-400">Tips Cara Menjawab:</strong> {q.howToAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: CHAT INTERAKTIF DENGAN DOSEN PEMBIMBING AI */
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h4 className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                  Dosen Pembimbing Digital RisetFlow
                </h4>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Siap mendampingi proses berpikir penelitian Anda
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('Bersihkan riwayat percakapan?')) {
                  setChatMessages([]);
                  onUpdateProject({ ...project, supervisorChatHistory: [] });
                }
              }}
              className="text-[11px] text-stone-400 hover:text-stone-600"
            >
              Reset Chat
            </button>
          </div>

          {/* Messages Container */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto p-2">
            {chatMessages.map((msg) => {
              const isMe = msg.sender === 'student';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-700 text-white rounded-br-xs'
                        : 'bg-stone-100 dark:bg-stone-700/60 text-stone-800 dark:text-stone-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        isMe ? 'text-emerald-200 text-right' : 'text-stone-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isSendingChat && (
              <div className="flex justify-start">
                <div className="p-3 bg-stone-100 dark:bg-stone-700/60 rounded-2xl text-xs text-stone-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Dosen Pembimbing sedang mengetik...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t">
            <input
              type="text"
              required
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan hal apa pun mengenai proposal Anda (misal: 'Bagaimana cara menjelaskan kebaruan penelitian ini?')..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isSendingChat}
              className="p-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
        <span className="text-xs text-stone-500">
          Proposal Anda telah selesai melalui 10 tahapan metodologis.
        </span>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-xl shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Proposal Lengkap (.DOCX)</span>
        </button>
      </div>
    </div>
  );
};
