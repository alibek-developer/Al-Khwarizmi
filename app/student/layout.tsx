"use client";

import {
  Award,
  BookOpen,
  ChevronLeft,
  CreditCard,
  Gamepad2,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Moon,
  User,
  Sun,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { studentApi } from "@/lib/api";

const navItems = [
  {
    href: "/student/dashboard",
    label: "Dashboard",
    labelUz: "Bosh sahifa",
    icon: Home,
  },
  {
    href: "/student/dashboard/courses",
    label: "Kurslar",
    labelUz: "Kurslar",
    icon: BookOpen,
  },
  {
    href: "/student/dashboard/games",
    label: "O'yinlar",
    labelUz: "O'yin va testlar",
    icon: Gamepad2,
  },
  {
    href: "/student/dashboard/homework",
    label: "Vazifalar",
    labelUz: "Uy vazifalari",
    icon: GraduationCap,
  },
  {
    href: "/student/dashboard/certificate",
    label: "Sertifikat",
    labelUz: "Sertifikatlar",
    icon: Award,
  },
  {
    href: "/student/dashboard/payments",
    label: "To'lovlar",
    labelUz: "To'lovlar",
    icon: CreditCard,
  },
  {
    href: "/student/dashboard/profile",
    label: "Profil",
    labelUz: "Shaxsiy profil",
    icon: User,
  },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<{ id: number; full_name: string; email: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    setMounted(true);

    const isLoggedIn = localStorage.getItem("studentLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole");

    if (!isLoggedIn || userRole !== "student") {
      router.replace("/login");
      return;
    }

    const saved = localStorage.getItem("student-theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const fetchStudent = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (studentId) {
          const data = await studentApi.getById(Number(studentId));
          const fullName = `${data.first_name} ${data.last_name}`;
          setStudent({
            id: data.id,
            full_name: fullName,
            email: data.email,
            avatar_url: data.avatar || undefined,
          });
          localStorage.setItem("studentName", fullName);
          localStorage.setItem("studentEmail", data.email);
          if (data.avatar) localStorage.setItem("studentAvatar", data.avatar);
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        const name = localStorage.getItem("studentName");
        const email = localStorage.getItem("studentEmail");
        setStudent({
          id: 0,
          full_name: name || "Talaba",
          email: email || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [router]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("student-theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("studentLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentId");
    router.push("/login");
  };

  const currentPage = navItems.find((n) => n.href === pathname);

  function getInitials(name: string) {
    return (
      name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "T"
    );
  }

  return (
    <div className="h-screen flex bg-slate-100 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

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
        <div
          className={`flex items-center h-14 px-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
                <GraduationCap
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2}
                />
              </div>
              <div className="leading-none min-w-0">
                <p className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight truncate">
                  Al-Khwarizmi
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                  Talaba paneli
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30">
              <GraduationCap
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

        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-hidden">
          {navItems.map(({ href, label, labelUz, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? label : undefined}
                className={`
                  group flex items-center gap-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-150 relative
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

        <div className="px-2 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-0.5 shrink-0">
          {!collapsed && student && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              {student.avatar_url ? (
                <img
                  src={student.avatar_url}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-200 dark:ring-blue-500/20"
                  alt={student.full_name}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-black">
                    {getInitials(student.full_name)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-slate-900 dark:text-white truncate leading-none">
                  {student.full_name}
                </p>
                {student.email && (
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 truncate mt-0.5">
                    {student.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {collapsed && student && (
            <div className="flex justify-center py-1 mb-1 group relative">
              {student.avatar_url ? (
                <img
                  src={student.avatar_url}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-200 dark:ring-blue-500/20"
                  alt={student.full_name}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-black">
                    {getInitials(student.full_name)}
                  </span>
                </div>
              )}
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {student.full_name}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
              </div>
            </div>
          )}

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

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden lg:flex absolute -right-3 top-[72px] w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110"
          >
            <ChevronLeft className="w-3 h-3 text-slate-500 rotate-180" />
          </button>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
                Talaba
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentPage?.label ?? "Dashboard"}
              </span>
            </div>
          </div>

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
              {student?.avatar_url ? (
                <img
                  src={student.avatar_url}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-200 dark:ring-blue-500/20"
                  alt={student.full_name}
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-black">
                    {student ? getInitials(student.full_name) : "T"}
                  </span>
                </div>
              )}
              <div className="hidden sm:block leading-none">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {student?.full_name || "Talaba"}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {student?.email || "Talaba paneli"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 bg-slate-100 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
