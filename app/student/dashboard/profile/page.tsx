"use client";

import {
  AlertCircle,
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  Zap,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { studentApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const iCls = "w-full h-11 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors";
const lCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

export default function StudentProfilePage() {
  const [student, setStudent] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    group: "",
    avatarUrl: "",
    total_points: 0,
    created_at: "",
  });

  const [stats, setStats] = useState({
    xp: 0,
    courses: 0,
    certificates: 0,
    gamePoints: 0,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) { setLoading(false); return }
        const id = Number(studentId)

        const [studentData, enrollments, certs, games] = await Promise.all([
          studentApi.getById(id),
          supabase.from('group_enrollments').select('group:groups(name)').eq('student_id', id),
          supabase.from('certificates').select('id').eq('student_id', id),
          supabase.from('game_results').select('points_earned').eq('student_id', id),
        ])

        const gamePoints = (games.data || []).reduce((sum, g) => sum + g.points_earned, 0)
        const groupNames = (enrollments.data || []).map((r: unknown) => (r as { group: { name: string } }).group?.name).filter(Boolean)

        setStudent({
          id: studentData.id,
          firstName: studentData.first_name || "",
          lastName: studentData.last_name || "",
          email: studentData.email || "",
          phone: studentData.phone || "",
          group: groupNames.join(', ') || '—',
          avatarUrl: studentData.avatar || "",
          total_points: studentData.total_points || 0,
          created_at: studentData.created_at || "",
        })

        setStats({
          xp: studentData.total_points || 0,
          courses: (enrollments.data || []).length,
          certificates: (certs.data || []).length,
          gamePoints,
        })
      } catch (error) {
        console.error("Failed to fetch student:", error);
        const name = localStorage.getItem("studentName");
        const email = localStorage.getItem("studentEmail");
        if (name) {
          const parts = name.split(" ");
          setStudent(p => ({
            ...p,
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
            email: email || "",
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const msg = (m: string, ok = true) => {
    setToast({ msg: m, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async () => {
    if (!student.id) return;
    setSaving(true);
    try {
      await studentApi.update(student.id, {
        first_name: student.firstName,
        last_name: student.lastName,
        phone: student.phone,
        avatar: student.avatarUrl,
      });
      localStorage.setItem("studentName", `${student.firstName} ${student.lastName}`);
      msg("Profil muvaffaqiyatli saqlandi!");
    } catch (error) {
      msg("Xatolik yuz berdi", false);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current) {
      msg("Joriy parolni kiriting", false);
      return;
    }
    if (passwords.new.length < 6) {
      msg("Yangi parol kamida 6 ta belgi bo'lishi kerak", false);
      return;
    }
    if (passwords.new !== passwords.confirm) {
      msg("Yangi parollar mos kelmadi", false);
      return;
    }
    if (!student.id) return;
    setSaving(true);
    try {
      await studentApi.updatePassword(student.id, passwords.new);
      msg("Parol muvaffaqiyatli o'zgartirildi!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      msg("Xatolik yuz berdi", false);
    } finally {
      setSaving(false);
    }
  };

  const statItems = [
    { label: "XP Ballar", value: stats.xp.toString(), icon: Zap, color: "amber" },
    { label: "Kurslar", value: stats.courses.toString(), icon: BookOpen, color: "violet" },
    { label: "Sertifikatlar", value: stats.certificates.toString(), icon: Award, color: "emerald" },
    { label: "O'yin ballari", value: stats.gamePoints.toString(), icon: Zap, color: "amber" },
  ];

  const getInitials = () => {
    return (student.firstName[0] || "") + (student.lastName[0] || "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${toast.ok ? "bg-blue-600" : "bg-red-600"}`}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          Profil
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Shaxsiy ma&apos;lumotlaringizni boshqaring
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="font-black text-slate-900 dark:text-white text-sm mb-5">Shaxsiy ma&apos;lumotlar</h2>
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                {student.avatarUrl ? (
                  <img src={student.avatarUrl} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-100 dark:ring-blue-500/20" alt="Avatar" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-500/20">
                    <span className="text-white text-2xl font-black">{getInitials()}</span>
                  </div>
                )}
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{student.firstName} {student.lastName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
                <button className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Rasmni o&apos;zgartirish
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lCls}>Ism *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className={`${iCls} pl-10`}
                    placeholder="Ismingiz"
                    value={student.firstName}
                    onChange={e => setStudent(p => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className={lCls}>Familiya *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className={`${iCls} pl-10`}
                    placeholder="Familiyangiz"
                    value={student.lastName}
                    onChange={e => setStudent(p => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className={lCls}>Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    className={`${iCls} pl-10`}
                    placeholder="email@example.com"
                    value={student.email}
                    onChange={e => setStudent(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className={lCls}>Telefon raqam</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    className={`${iCls} pl-10`}
                    placeholder="+998901234567"
                    value={student.phone}
                    onChange={e => setStudent(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 font-bold text-sm transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Saqlash
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="font-black text-slate-900 dark:text-white text-sm">Parolni o&apos;zgartirish</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={lCls}>Joriy parol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    className={`${iCls} pl-10 pr-10`}
                    placeholder="Joriy parolingiz"
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={lCls}>Yangi parol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    className={`${iCls} pl-10 pr-10`}
                    placeholder="Kamida 6 ta belgi"
                    value={passwords.new}
                    onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={lCls}>Yangi parolni tasdiqlang</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    className={`${iCls} pl-10 pr-10`}
                    placeholder="Yangi parolni qayta kiriting"
                    value={passwords.confirm}
                    onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="h-11 px-6 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 font-bold text-sm transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    O&apos;zgartirilmoqda...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" /> Parolni o&apos;zgartirish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-black text-slate-900 dark:text-white text-sm mb-4">Statistika</h3>
            <div className="space-y-3">
              {statItems.map(stat => {
                const Icon = stat.icon;
                const colorClasses: Record<string, { bg: string; text: string }> = {
                  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
                  violet: { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
                  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
                  blue: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
                };
                const colors = colorClasses[stat.color];
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-[11px] text-slate-400">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-black text-slate-900 dark:text-white text-sm mb-4">A&apos;zolar bo&apos;yicha</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Guruh</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{student.group}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Ro&apos;yxatdan o&apos;tgan</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {student.created_at ? new Date(student.created_at).toLocaleDateString('uz-UZ') : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Xavfsizlik</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Parolingizni muntazam o&apos;zgartirib turish hisobingiz xavfsizligini ta&apos;minlaydi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
