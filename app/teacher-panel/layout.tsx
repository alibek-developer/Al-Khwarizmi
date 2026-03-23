"use client";

import { createClient } from "@supabase/supabase-js";
import {
  Award,
  BookOpen,
  ChevronLeft,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const navItems = [
  {
    href: "/teacher-panel/dashboard",
    label: "Dashboard",
    labelUz: "Bosh sahifa",
    icon: LayoutDashboard,
  },
  {
    href: "/teacher-panel/attendance",
    label: "Davomat",
    labelUz: "Yo'qlama",
    icon: ClipboardList,
  },
  {
    href: "/teacher-panel/groups",
    label: "Guruhlar",
    labelUz: "O'quvchilar",
    icon: Users,
  },
  {
    href: "/teacher-panel/homework",
    label: "Uy vazifalari",
    labelUz: "Topshiriqlar",
    icon: BookOpen,
  },
  {
    href: "/teacher-panel/materials",
    label: "Materiallar",
    labelUz: "Resurslar",
    icon: FolderOpen,
  },
  {
    href: "/teacher-panel/certificates",
    label: "Sertifikatlar",
    labelUz: "Diplomlar",
    icon: Award,
  },
];

// ── Mentor ma'lumotlari ─────────────────────────────────────────────────
type MentorInfo = {
  id: number;
  full_name: string;
  email: string;
  specialty_en?: string;
  image_url?: string;
};

async function loadMentorInfo(): Promise<MentorInfo | null> {
  // 1. localStorage da saqlangan ID bor bo'lsa — to'g'ridan Supabase dan olamiz
  const storedId = localStorage.getItem("teacherMentorId");
  const storedName = localStorage.getItem("teacherName");

  if (storedId && parseInt(storedId) > 0) {
    const { data } = await supabase
      .from("mentors")
      .select("id, full_name, email, specialty_en, image_url")
      .eq("id", parseInt(storedId))
      .single();

    if (data) {
      localStorage.setItem("teacherName", data.full_name || "");
      return data;
    }
  }

  // 2. localStorage da faqat ism bor (ID yo'q) — email bilan qidirish
  const teacherEmail = localStorage.getItem("teacherEmail");
  if (teacherEmail) {
    const { data } = await supabase
      .from("mentors")
      .select("id, full_name, email, specialty_en, image_url")
      .eq("email", teacherEmail)
      .single();
    if (data) {
      localStorage.setItem("teacherMentorId", String(data.id));
      localStorage.setItem("teacherName", data.full_name || "");
      return data;
    }
  }

  // 3. Barcha mentorlardan birinchisini olish (demo / test uchun)
  const envId = process.env.NEXT_PUBLIC_MENTOR_ID;
  if (envId && parseInt(envId) > 0) {
    const { data } = await supabase
      .from("mentors")
      .select("id, full_name, email, specialty_en, image_url")
      .eq("id", parseInt(envId))
      .single();
    if (data) return data;
  }

  // 4. Hech narsa topilmasa — localStorage dagi nomni ishlatamiz
  if (storedName) {
    return { id: 0, full_name: storedName, email: "" };
  }

  return null;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MT"
  );
}

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mentor, setMentor] = useState<MentorInfo | null>(null);

  // Theme + mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("teacher-theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // mentors jadvalidan full_name ni yuklash
  useEffect(() => {
    const fetchMentor = async () => {
      // 1. localStorage da ID bor bo'lsa — mentors.id bo'yicha
      const storedId = localStorage.getItem("teacherMentorId");
      if (storedId && parseInt(storedId) > 0) {
        const { data } = await supabase
          .from("mentors")
          .select("id, full_name, email, specialty_en, image_url")
          .eq("id", parseInt(storedId))
          .single();
        if (data) {
          setMentor(data);
          localStorage.setItem("teacherName", data.full_name || "");
          return;
        }
      }

      // 2. Email bo'yicha mentors jadvalidan qidirish
      const storedEmail = localStorage.getItem("teacherEmail");
      if (storedEmail) {
        const { data } = await supabase
          .from("mentors")
          .select("id, full_name, email, specialty_en, image_url")
          .eq("email", storedEmail)
          .single();
        if (data) {
          setMentor(data);
          localStorage.setItem("teacherMentorId", String(data.id));
          localStorage.setItem("teacherName", data.full_name || "");
          return;
        }
      }

      // 3. Hech narsa topilmasa — mentors jadvalidan birinchi yozuv
      const { data: first } = await supabase
        .from("mentors")
        .select("id, full_name, email, specialty_en, image_url")
        .order("id", { ascending: true })
        .limit(1)
        .single();
      if (first) setMentor(first);
    };

    fetchMentor();
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("teacher-theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherLoggedIn");
    localStorage.removeItem("teacherMentorId");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const currentPage = navItems.find((n) => n.href === pathname);

  return (
    <div className="h-screen flex bg-slate-100 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
				fixed lg:relative inset-y-0 left-0 z-40 flex flex-col
				bg-white dark:bg-slate-900
				border-r border-slate-200 dark:border-slate-800
				shadow-xl shadow-slate-200/50 dark:shadow-black/30
				transition-all duration-300 ease-in-out
				${collapsed ? "w-[72px]" : "w-64"}
				${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
			`}
      >
        {/* Header */}
        <div
          className={`flex items-center h-14 px-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
                <LayoutDashboard
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2}
                />
              </div>
              <div className="leading-none min-w-0">
                <p className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight truncate">
                  Al-Kharazmi
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                  O'qituvchi paneli
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30">
              <LayoutDashboard
                className="w-3.5 h-3.5 text-white"
                strokeWidth={2}
              />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex w-6 h-6 rounded-lg items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-hidden">
          {navItems.map(({ href, label, labelUz, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? label : undefined}
                className={`group flex items-center gap-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-150 relative
									${collapsed ? "py-3 justify-center" : "py-2"}
									${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}`}
              >
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white/60 rounded-r-full" />
                )}
                <Icon
                  className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}
                  style={{ width: 17, height: 17 }}
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0 leading-none">
                    <span className="block truncate text-[13px]">{label}</span>
                    <span
                      className={`block text-[10px] font-medium truncate mt-0.5 ${isActive ? "text-blue-200" : "text-slate-400 dark:text-slate-600"}`}
                    >
                      {labelUz}
                    </span>
                  </div>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {label}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer — MENTOR MA'LUMOTLARI */}
        <div className="px-2 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-0.5 shrink-0">
          {/* Mentor profil kartasi */}
          {!collapsed && mentor && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              {mentor.image_url ? (
                <img
                  src={mentor.image_url}
                  className="w-8 h-8 rounded-xl object-cover object-top shrink-0 ring-2 ring-blue-100 dark:ring-blue-500/20"
                  alt={mentor.full_name}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white text-[10px] font-black">
                    {getInitials(mentor.full_name)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-slate-900 dark:text-white truncate leading-none">
                  {mentor.full_name}
                </p>
                {mentor.specialty_en ? (
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 truncate mt-0.5">
                    {mentor.specialty_en}
                  </p>
                ) : mentor.email ? (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {mentor.email}
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {/* Collapsed holatda faqat avatar */}
          {collapsed && mentor && (
            <div className="flex justify-center py-1 mb-1 group relative">
              {mentor.image_url ? (
                <img
                  src={mentor.image_url}
                  className="w-8 h-8 rounded-xl object-cover object-top ring-2 ring-blue-100 dark:ring-blue-500/20"
                  alt={mentor.full_name}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-black">
                    {getInitials(mentor.full_name)}
                  </span>
                </div>
              )}
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {mentor.full_name}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
              </div>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={collapsed ? (dark ? "Light mode" : "Dark mode") : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
          >
            {mounted ? (
              dark ? (
                <Sun
                  style={{ width: 17, height: 17 }}
                  className="shrink-0 text-amber-400"
                />
              ) : (
                <Moon
                  style={{ width: 17, height: 17 }}
                  className="shrink-0 text-slate-500"
                />
              )
            ) : (
              <div className="shrink-0" style={{ width: 17, height: 17 }} />
            )}
            {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? "Chiqish" : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150 group ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut
              style={{ width: 17, height: 17 }}
              className="shrink-0 group-hover:text-red-500 transition-colors"
            />
            {!collapsed && <span>Chiqish</span>}
          </button>
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden lg:flex absolute -right-3 top-[72px] w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110"
          >
            <ChevronLeft className="w-3 h-3 text-slate-500 rotate-180" />
          </button>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {mobileOpen ? (
                <X style={{ width: 18, height: 18 }} />
              ) : (
                <Menu style={{ width: 18, height: 18 }} />
              )}
            </button>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 dark:text-slate-500 font-medium">
                O'qituvchi
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentPage?.label ?? "Dashboard"}
              </span>
            </div>
          </div>

          {/* Top bar right — mentor ismi */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              {mounted && dark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
              {mentor?.image_url ? (
                <img
                  src={mentor.image_url}
                  className="w-8 h-8 rounded-xl object-cover object-top ring-2 ring-blue-100 dark:ring-blue-500/20"
                  alt={mentor.full_name}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-black">
                    {mentor ? getInitials(mentor.full_name) : "MT"}
                  </span>
                </div>
              )}
              <div className="hidden sm:block leading-none">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {mentor?.full_name || "O'qituvchi"}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {mentor?.specialty_en || mentor?.email || "O'qituvchi paneli"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 bg-slate-100 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
