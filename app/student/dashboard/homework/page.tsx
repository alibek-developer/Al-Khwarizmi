"use client";

import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Paperclip,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";

type Homework = {
  id: number;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  status: "pending" | "submitted" | "checked" | "rejected";
  grade?: number;
  mentorFeedback?: string;
  fileUrl?: string;
  submittedFile?: string;
  submittedAt?: string;
};

const mockHomeworks: Homework[] = [
  {
    id: 1,
    title: "HTML Layout Yaratish",
    course: "Web Development",
    description: "Berilgan dizayn asosida HTML layout yaratish. Grid va Flexbox ishlatish talab qilinadi.",
    dueDate: "2026-03-25",
    status: "pending",
  },
  {
    id: 2,
    title: "CSS Animatsiyalar",
    course: "Web Development",
    description: "3 ta animatsiya yaratish: fade-in, slide, va bounce effektlar.",
    dueDate: "2026-03-20",
    status: "submitted",
    submittedFile: "animations.zip",
    submittedAt: "2026-03-19",
  },
  {
    id: 3,
    title: "JavaScript Calculator",
    course: "Web Development",
    description: "To'liq ishlaydigan calculator yaratish. Barcha arifmetik amallar qo'llab quvvatlanishi kerak.",
    dueDate: "2026-03-15",
    status: "checked",
    grade: 92,
    mentorFeedback: "Ajoyib ishlangan! Barcha talablarga javob beradi.",
    submittedFile: "calculator.zip",
    submittedAt: "2026-03-14",
  },
  {
    id: 4,
    title: "Present Perfect Tenses",
    course: "English Course",
    description: "5 ta gapni Present Perfect zamonida yozing va tarjima qiling.",
    dueDate: "2026-03-18",
    status: "rejected",
    grade: 45,
    mentorFeedback: "Grammatik xatolar bor. Iltimos, qayta topshiring.",
    submittedFile: "homework.docx",
    submittedAt: "2026-03-17",
  },
  {
    id: 5,
    title: "Python List Comprehensions",
    course: "Data Science",
    description: "List comprehensions yordamida 3 ta misol yechish.",
    dueDate: "2026-03-22",
    status: "pending",
  },
  {
    id: 6,
    title: "React Props va State",
    course: "Web Development",
    description: "Props va State tushunchalarini ko'rsatadigan kichik loyiha yaratish.",
    dueDate: "2026-03-10",
    status: "checked",
    grade: 88,
    mentorFeedback: "Yaxshi tushuntirilgan. Lekin performance optimallashtirish kerak.",
    submittedFile: "react-project.zip",
    submittedAt: "2026-03-09",
  },
];

const statusConfig: Record<string, { label: string; cls: string; icon: any }> = {
  pending: {
    label: "Kutilmoqda",
    cls: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
    icon: Clock,
  },
  submitted: {
    label: "Topshirilgan",
    cls: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
    icon: Send,
  },
  checked: {
    label: "Baholangan",
    cls: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rad etildi",
    cls: "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400",
    icon: X,
  },
};

export default function StudentHomeworkPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedHw, setSelectedHw] = useState<Homework | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [submitComment, setSubmitComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = filterStatus === "all" 
    ? mockHomeworks 
    : mockHomeworks.filter(h => h.status === filterStatus);

  const stats = {
    pending: mockHomeworks.filter(h => h.status === "pending").length,
    submitted: mockHomeworks.filter(h => h.status === "submitted").length,
    checked: mockHomeworks.filter(h => h.status === "checked").length,
    rejected: mockHomeworks.filter(h => h.status === "rejected").length,
  };

  const handleSubmit = () => {
    if (!submitFile) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowSubmit(false);
      setSubmitFile(null);
      setSubmitComment("");
    }, 1500);
  };

  const isOverdue = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          Uy Vazifalari
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Mentor tomonidan berilgan vazifalar
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: "pending", label: "Kutilmoqda", color: "amber" },
          { key: "submitted", label: "Topshirilgan", color: "blue" },
          { key: "checked", label: "Baholangan", color: "emerald" },
          { key: "rejected", label: "Rad etildi", color: "red" },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilterStatus(filterStatus === item.key ? "all" : item.key)}
            className={`bg-white dark:bg-slate-900 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
              filterStatus === item.key
                ? `border-${item.color}-500 dark:border-${item.color}-500/50`
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-lg font-black text-${item.color}-600 dark:text-${item.color}-400`}>
                {stats[item.key as keyof typeof stats]}
              </span>
              <div className={`w-8 h-8 rounded-lg bg-${item.color}-50 dark:bg-${item.color}-500/10 flex items-center justify-center`}>
                {item.key === "pending" && <Clock className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} />}
                {item.key === "submitted" && <Send className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} />}
                {item.key === "checked" && <CheckCircle2 className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} />}
                {item.key === "rejected" && <X className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} />}
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(hw => {
          const status = statusConfig[hw.status];
          const StatusIcon = status.icon;
          const overdue = hw.status === "pending" && isOverdue(hw.dueDate);
          return (
            <div
              key={hw.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {hw.title}
                      </h3>
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold mt-0.5">
                        {hw.course}
                      </p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${status.cls}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {hw.description}
                  </p>

                  {hw.grade !== undefined && (
                    <div className="mt-3 flex items-center gap-4">
                      <div className={`px-3 py-1.5 rounded-lg font-black text-sm ${
                        hw.grade >= 80 ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" :
                        hw.grade >= 60 ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" :
                        "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                      }`}>
                        {hw.grade}
                      </div>
                      {hw.mentorFeedback && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
                          "{hw.mentorFeedback}"
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                      <span className={`flex items-center gap-1 ${overdue ? "text-red-500" : ""}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(hw.dueDate).toLocaleDateString("uz-UZ")}
                        {overdue && " • Muddati o'tgan"}
                      </span>
                      {hw.submittedFile && (
                        <span className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {hw.submittedFile}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedHw(hw)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Ko'rish
                      </button>
                      {hw.status === "pending" && (
                        <button
                          onClick={() => {
                            setSelectedHw(hw);
                            setShowSubmit(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          Topshirish
                        </button>
                      )}
                      {hw.status === "rejected" && (
                        <button
                          onClick={() => {
                            setSelectedHw(hw);
                            setShowSubmit(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          Qayta topshirish
                        </button>
                      )}
                      {hw.submittedFile && (
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors">
                          <Download className="w-3 h-3" />
                          Fayl
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedHw && !showSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedHw(null)}>
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white">{selectedHw.title}</h3>
                <p className="text-xs text-violet-600 dark:text-violet-400">{selectedHw.course}</p>
              </div>
              <button onClick={() => setSelectedHw(null)} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tavsif</label>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedHw.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Muddat</label>
                  <p className={`text-sm font-semibold ${isOverdue(selectedHw.dueDate) && selectedHw.status === "pending" ? "text-red-600" : "text-slate-700 dark:text-slate-300"}`}>
                    {new Date(selectedHw.dueDate).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                {selectedHw.grade !== undefined && (
                  <div className="text-right">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Baho</label>
                    <p className={`text-2xl font-black ${
                      selectedHw.grade >= 80 ? "text-emerald-600" :
                      selectedHw.grade >= 60 ? "text-amber-600" : "text-red-600"
                    }`}>{selectedHw.grade}</p>
                  </div>
                )}
              </div>
              {selectedHw.mentorFeedback && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mentor izohi</label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedHw.mentorFeedback}</p>
                </div>
              )}
              {selectedHw.submittedFile && (
                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedHw.submittedFile}</p>
                    <p className="text-[11px] text-slate-400">{selectedHw.submittedAt && new Date(selectedHw.submittedAt).toLocaleDateString("uz-UZ")} da topshirilgan</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSubmit && selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSubmit(false)}>
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white">Vazifani topshirish</h3>
                <p className="text-xs text-slate-400">{selectedHw.title}</p>
              </div>
              <button onClick={() => setShowSubmit(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fayl yuklash *</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    submitFile
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500"
                  }`}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  {submitFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{submitFile.name}</p>
                        <p className="text-[11px] text-slate-400">{(submitFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        Faylni bu yerga bosing yoki sudrab olib keling
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PDF, ZIP, DOCX formatlari</p>
                    </>
                  )}
                </div>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.zip,.docx"
                  onChange={e => setSubmitFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Izoh (ixtiyoriy)</label>
                <textarea
                  rows={3}
                  placeholder="Vazifa haqida qo'shimcha izoh..."
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  value={submitComment}
                  onChange={e => setSubmitComment(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSubmit(false)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Bekor
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!submitFile || submitting}
                  className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Topshirish
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
