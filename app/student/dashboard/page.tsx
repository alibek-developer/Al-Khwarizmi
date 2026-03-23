"use client";

import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Medal,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const mockLeaderboard = [
  { rank: 1, name: "Abdullayev Jasur", xp: 2450, avatar: "AJ", badge: "gold" },
  { rank: 2, name: "Toshmatova Dilnoza", xp: 2280, avatar: "TD", badge: "silver" },
  { rank: 3, name: "Karimov Sherzod", xp: 2100, avatar: "KS", badge: "bronze" },
  { rank: 4, name: "Yusupova Malika", xp: 1950, avatar: "YM" },
  { rank: 5, name: "Normatov Bobur", xp: 1820, avatar: "NB" },
  { rank: 6, name: "Rahimov Anvar", xp: 1650, avatar: "RA" },
  { rank: 7, name: "Qodirova Nilufar", xp: 1580, avatar: "QN" },
];

const mockStats = {
  totalXP: 1850,
  rank: 4,
  coursesCompleted: 2,
  coursesInProgress: 1,
  homeworkDone: 12,
  homeworkPending: 2,
  streak: 7,
  avgScore: 87,
};

const mockCourseProgress = [
  { name: "Web Development", progress: 72, total: 24, completed: 17, color: "bg-violet-500" },
  { name: "English Course", progress: 45, total: 20, completed: 9, color: "bg-blue-500" },
  { name: "Data Science", progress: 20, total: 30, completed: 6, color: "bg-emerald-500" },
];

export default function StudentDashboardPage() {
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);
  const [studentName, setStudentName] = useState("Talaba");

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem("studentName");
    if (name) setStudentName(name);

    const h = new Date().getHours();
    if (h < 12) setGreeting("Xayrli tong");
    else if (h < 17) setGreeting("Xayrli kun");
    else setGreeting("Xayrli kech");
  }, []);

  const today = new Date().toLocaleDateString("uz-UZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!mounted) return null;

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {greeting}, {studentName} 👋
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
            {today}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-3.5 py-2">
          <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {mockStats.streak} kun ketma-ket
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" /> +150
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">
            {mockStats.totalXP}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            XP Ballari
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              #{mockStats.rank}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">
            {mockStats.rank}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Reyting
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">
            {mockStats.coursesCompleted}/{mockStats.coursesInProgress + mockStats.coursesCompleted}
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Kurslar
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">
            {mockStats.avgScore}%
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            O&apos;rtacha baho
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                Kurslar Progressi
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Joriy kurslaringiz
              </p>
            </div>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-4">
            {mockCourseProgress.map((course) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${course.color}`} />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {course.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {course.completed}/{course.total}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      dars
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${course.color} rounded-full transition-all duration-700`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Topshirilgan
                </span>
              </div>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {mockStats.homeworkDone}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Kutilmoqda
                </span>
              </div>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">
                {mockStats.homeworkPending}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Medal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                Leaderboard
              </h3>
              <p className="text-[10px] text-slate-400">
                Eng yaxshi talabalar
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {mockLeaderboard.slice(0, 5).map((user) => (
              <div
                key={user.rank}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  user.rank <= 3
                    ? "bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-500/10 border border-amber-100 dark:border-amber-500/20"
                    : "bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  user.badge === "gold" ? "bg-amber-400 text-amber-900" :
                  user.badge === "silver" ? "bg-slate-300 text-slate-600" :
                  user.badge === "bronze" ? "bg-orange-400 text-orange-900" :
                  "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}>
                  {user.rank}
                </div>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-[9px] font-black">
                    {user.avatar}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {user.xp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-violet-500/20">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-white/80" />
            <span className="text-xs font-semibold text-white/80">Kurs</span>
          </div>
          <h4 className="text-lg font-black mb-1">Web Development</h4>
          <p className="text-white/70 text-xs mb-4">72% tugallangan</p>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: "72%" }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {mockStats.avgScore}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O&apos;rtacha o&apos;quv natijangiz
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              2
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Olgan sertifikatingiz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
