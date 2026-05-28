"use client";

import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@alkhorazmiy.uz";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "itpark2026";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const redirecting = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (redirecting.current) return;
    const role = localStorage.getItem("userRole");
    if (role === "admin") {
      redirecting.current = true;
      router.replace("/admin/dashboard");
    } else if (role === "teacher") {
      redirecting.current = true;
      router.replace("/teacher-panel/dashboard");
    } else if (role === "student") {
      redirecting.current = true;
      router.replace("/student/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      redirecting.current = true;
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.removeItem("teacherLoggedIn");
      localStorage.removeItem("studentLoggedIn");
      router.replace("/admin/dashboard");
      return;
    }

    const { data: mentor, error: mentorErr } = await supabase
      .from("mentors")
      .select("id, full_name, email, password, specialty_en, image_url")
      .eq("email", email.trim())
      .single();

    if (!mentorErr && mentor && mentor.password === password) {
      redirecting.current = true;
      localStorage.setItem("teacherLoggedIn", "true");
      localStorage.setItem("userRole", "teacher");
      localStorage.setItem("teacherMentorId", String(mentor.id));
      localStorage.setItem("teacherName", mentor.full_name || "");
      localStorage.setItem("teacherEmail", mentor.email || "");
      localStorage.setItem("teacherSpecialty", mentor.specialty_en || "");
      localStorage.setItem("teacherAvatar", mentor.image_url || "");
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("studentLoggedIn");
      router.replace("/teacher-panel/dashboard");
      return;
    }

    const { data: student, error: studentErr } = await supabase
      .from("students")
      .select("id, first_name, last_name, email, password")
      .eq("email", email.trim())
      .eq("status", "active")
      .single();

    if (!studentErr && student && student.password === password) {
      redirecting.current = true;
      localStorage.setItem("studentLoggedIn", "true");
      localStorage.setItem("userRole", "student");
      localStorage.setItem("studentId", String(student.id));
      localStorage.setItem("studentName", `${student.first_name} ${student.last_name}`.trim());
      localStorage.setItem("studentEmail", student.email || "");
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("teacherLoggedIn");
      router.replace("/student/dashboard");
      return;
    }

    setError("Email yoki parol noto'g'ri.");
    setLoading(false);
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes up {
          from { opacity:0; transform:translateY(24px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes shake {
          0%,100%{ transform:translateX(0); }
          20%{ transform:translateX(-6px); }
          40%{ transform:translateX(6px); }
          60%{ transform:translateX(-4px); }
          80%{ transform:translateX(4px); }
        }
        .card-in   { animation: up .45s cubic-bezier(.16,1,.3,1) forwards; }
        .err-shake { animation: shake .4s ease; }
      `}</style>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-[#070b16] transition-colors duration-300 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/40 dark:bg-blue-600/15 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-200/30 dark:bg-cyan-500/10 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="card-in relative w-full max-w-[420px]">
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-blue-400/30 via-transparent to-cyan-400/20 dark:from-blue-500/20 dark:to-cyan-500/15 blur-[2px]" />
          <div className="relative bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-[26px] shadow-2xl border border-white/80 dark:border-slate-700/50 overflow-hidden">
            <div className="h-[3px] bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />

            <div className="px-8 pt-8 pb-7">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-blue-500/25 rounded-2xl blur-xl scale-110" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/35">
                    <GraduationCap className="w-7 h-7 text-white" strokeWidth={1.75} />
                  </div>
                </div>
                <h1 className="text-[22px] font-black text-slate-900 dark:text-white tracking-tight mb-0.5">
                  Al-Khwarizmi
                </h1>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                  IT Ta&apos;lim Markazi
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Admin</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Mentor</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Talaba</span>
                </div>
              </div>

              {error && (
                <div
                  key={error}
                  className="err-shake flex items-center gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400 rounded-2xl px-4 py-3 mb-5 text-xs font-semibold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] mb-2">
                    Email manzil
                  </label>
                  <div
                    className={`relative rounded-xl border transition-all duration-200 ${
                      focused === "email"
                        ? "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)] bg-white dark:bg-slate-800"
                        : error
                          ? "border-red-300/70 dark:border-red-500/30 bg-slate-50 dark:bg-slate-800/50"
                          : "border-slate-200 dark:border-slate-700/70 bg-slate-50/80 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <svg
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${focused === "email" ? "text-blue-500" : "text-slate-400 dark:text-slate-500"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="email@example.com"
                      disabled={loading}
                      className="w-full h-11 pl-10 pr-4 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none disabled:opacity-50 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] mb-2">
                    Parol
                  </label>
                  <div
                    className={`relative rounded-xl border transition-all duration-200 ${
                      focused === "password"
                        ? "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)] bg-white dark:bg-slate-800"
                        : error
                          ? "border-red-300/70 dark:border-red-500/30 bg-slate-50 dark:bg-slate-800/50"
                          : "border-slate-200 dark:border-slate-700/70 bg-slate-50/80 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <svg
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${focused === "password" ? "text-blue-500" : "text-slate-400 dark:text-slate-500"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full h-11 pl-10 pr-11 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none disabled:opacity-50 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="group relative w-full h-11 rounded-xl font-black text-sm transition-all duration-200 overflow-hidden disabled:cursor-not-allowed enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 enabled:bg-gradient-to-r enabled:from-blue-600 enabled:to-blue-500 enabled:hover:from-blue-500 enabled:hover:to-cyan-500 enabled:text-white enabled:shadow-lg enabled:shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>Tekshirilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirish</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Barcha ma&apos;lumotlar{" "}
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    shifrlangan
                  </span>{" "}
                  holda saqlanadi
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-5">
            © {new Date().getFullYear()} Al-Khwarizmi · Shovot, Xorazm
          </p>
        </div>
      </div>
    </>
  );
}
