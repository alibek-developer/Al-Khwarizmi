"use client";

import {
  ArrowRight,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const programs = [
  { key: "web_development", href: "/courses/web" },
  { key: "data_science", href: "/courses/data" },
  { key: "ai_ml", href: "/courses/ai" },
  { key: "cybersecurity", href: "/courses/cyber" },
  { key: "mobile_apps", href: "/courses/mobile" },
];

const company = [
  { key: "about_us", href: "/about" },
  { key: "our_teachers", href: "/teachers" },
  { key: "student_stories", href: "/stories" },
  { key: "careers", href: "/careers" },
  { key: "contact_link", href: "/contact" },
];

const socials = [
  {
    icon: Youtube,
    href: "#",
    label: "YouTube",
    color: "hover:bg-red-500 hover:border-red-500",
  },
  {
    icon: Instagram,
    href: "#",
    label: "Instagram",
    color: "hover:bg-pink-500 hover:border-pink-500",
  },
  {
    icon: Twitter,
    href: "#",
    label: "Twitter / X",
    color: "hover:bg-sky-500 hover:border-sky-500",
  },
  {
    icon: Send,
    href: "#",
    label: "Telegram",
    color: "hover:bg-blue-500 hover:border-blue-500",
  },
];

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* ── TOP CTA BANNER ── */}
      <div className="border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-8 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
            <div>
              <h3 className="text-white font-black text-xl md:text-2xl mb-1">
                {t("cta_heading")}
              </h3>
              <p className="text-blue-200 text-sm">
                {t("cta_sub")}
              </p>
            </div>
            <Link
              href="/courses"
              className="shrink-0 flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-black text-sm px-6 py-3.5 rounded-xl transition-all hover:scale-105 shadow-md"
            >
              {t("cta_btn")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand col */}
          <div className="md:col-span-4">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  IT-Park
                </span>
                <span className="text-base font-black text-blue-600 tracking-tight">
                  {" "}
                  &{" "}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Khorazmi
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-2 max-w-xs">
              {t("brand_desc")}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600 italic leading-relaxed mb-6 max-w-xs">
              {t("brand_desc")}
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white transition-all duration-200 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
              {t("programs_title")}
            </h3>
            <ul className="space-y-3">
              {programs.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    <div>
                      <span className="font-medium">{t("program_" + item.key)}</span>
                      <span className="block text-xs text-slate-400 dark:text-slate-600 italic">
                        {t("program_" + item.key)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
              {t("company_title")}
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    <div>
                      <span className="font-medium">{t(item.key)}</span>
                      <span className="block text-xs text-slate-400 dark:text-slate-600 italic">
                        {t(item.key)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
              {t("contact_title")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@it-park.edu"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mb-0.5">
                      {t("email_label")}
                    </p>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium group-hover:text-blue-600 transition-colors">
                      {t("email")}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+998901234567"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mb-0.5">
                      {t("phone_label")}
                    </p>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium group-hover:text-blue-600 transition-colors">
                      {t("phone")}
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mb-0.5">
                      {t("address_label")}
                    </p>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {t("address")}
                    </span>
                  </div>
                </div>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t("newsletter_title")}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("newsletter_placeholder")}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center sm:text-left">
            {t("copyright", { year })}
          </p>
          <div className="flex items-center gap-6">
            {["privacy_policy", "terms_of_service", "safety_policy"].map(
              (key) => (
                <a
                  key={key}
                  href="#"
                  className="text-xs text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-slate-300 transition-colors whitespace-nowrap"
                >
                  {t(key)}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
