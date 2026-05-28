"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations, useLocale } from 'next-intl'
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  Globe,
  Instagram,
  Laptop,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Shield,
  Smartphone,
  Youtube,
} from "lucide-react";
import { useState, useEffect } from "react";

import { supabase } from '@/lib/supabase'

/* ─────────────────────────────────────────
   ICON MAPPING — title_en bo'yicha avtomatik icon
───────────────────────────────────────── */
type CourseUI = {
  id: number;
  label: string;
  price: number;
  icon: React.ElementType;
  color: string;
  bg: string;
};

function getCourseIcon(title: string): {
  icon: React.ElementType;
  color: string;
  bg: string;
} {
  const t = title.toLowerCase();
  if (t.includes("english") || t.includes("language"))
    return {
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    };
  if (t.includes("web"))
    return {
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    };
  if (t.includes("data") || t.includes("science"))
    return {
      icon: BarChart2,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    };
  if (t.includes("ai") || t.includes("ml") || t.includes("machine"))
    return {
      icon: BarChart2,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    };
  if (t.includes("mobile") || t.includes("flutter") || t.includes("android"))
    return {
      icon: Smartphone,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    };
  if (t.includes("cyber") || t.includes("security"))
    return {
      icon: Shield,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
    };
  if (t.includes("computer") || t.includes("savodxon"))
    return {
      icon: Laptop,
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
    };
  if (t.includes("it") || t.includes("program"))
    return {
      icon: Code,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    };
  // Default
  return {
    icon: BookOpen,
    color: "text-slate-600",
    bg: "bg-slate-50 dark:bg-slate-800",
  };
}

const faqs = [
  { key: '1' },
  { key: '2' },
  { key: '3' },
  { key: '4' },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ContactPage() {
  const t = useTranslations('contact')
  const tc = useTranslations('common')
  const locale = useLocale()
  const [courses, setCourses] = useState<CourseUI[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    selectedCourse: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Supabase dan kurslarni yuklash
  useEffect(() => {
    supabase
      .from("courses")
      .select("id, title_en, title_uz, price")
      .order("id")
      .then(({ data }) => {
        const list: CourseUI[] = (data || []).map((c) => ({
          id: c.id,
          label: locale === 'uz' ? (c.title_uz || c.title_en) : c.title_en,
          price: c.price || 0,
          ...getCourseIcon(c.title_en),
        }));
        setCourses(list);
        setCoursesLoading(false);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const handleCourse = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourse: prev.selectedCourse === String(id) ? "" : String(id),
    }));
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedCourse) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // selectedCourse endi kurs id si (number string)
      const courseId = formData.selectedCourse
        ? parseInt(formData.selectedCourse)
        : null;
      const selectedCourse = courses.find((c) => c.id === courseId);
      if (!selectedCourse) {
        setSubmitError(t('error_course_not_found'));
        setIsSubmitting(false);
        return;
      }

      // 2. Ism → first_name / last_name ga ajratish (1-so'z ism, qolgani familiya)
      const parts = formData.name.trim().split(" ");
      const first_name = parts[0];
      const last_name = parts.length > 1 ? parts.slice(1).join(" ") : "";

      // 3. students jadvaliga yozish
      const { error: dbError } = await supabase.from("students").insert([
        {
          first_name,
          last_name,
          father_name: null,
          email: formData.email.trim() || null,
          birth_date: null,
          phone: formData.phone.trim(),
          parent_phone: null,
          certificate_id: null,
          pinfl: null,
          course_id: courseId,
          payment_amount: selectedCourse.price,
          status: "pending",
        },
      ]);

      if (dbError) {
        console.error("Supabase error:", dbError);
        if (dbError.code === "23505") {
          setSubmitError(t('error_duplicate_email'));
        } else {
          setSubmitError(t('error_generic'));
        }
        setIsSubmitting(false);
        return;
      }

      // 4. Muvaffaqiyat
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        selectedCourse: "",
      });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err) {
      console.error(err);
      setSubmitError(tc('network_error'));
      setIsSubmitting(false);
    }
  };

  const selectedCourseData = courses.find(
    (c) => c.id === parseInt(formData.selectedCourse || "0"),
  );

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 bg-white dark:bg-slate-950 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-400/8 dark:bg-blue-500/8 blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              {t('hero_badge')}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-5 leading-[1.02] tracking-tight">
              {t('hero_heading_1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {t('hero_heading_2')}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto mb-2 leading-relaxed">
              {t('hero_sub')}
            </p>

            {/* Quick contact pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <a
                href="tel:+998901234567"
                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 transition-all"
              >
                <Phone className="w-4 h-4 text-blue-600" /> +998 90 123 45 67
              </a>
              <a
                href="mailto:info@alkhorazmiy.uz"
                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 transition-all"
              >
                <Mail className="w-4 h-4 text-blue-600" /> info@alkhorazmiy.uz
              </a>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2.5 rounded-xl">
                <MapPin className="w-4 h-4 text-blue-600" /> Shovot, Xorazm
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            MAIN FORM + INFO
        ══════════════════════════════════════ */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* ── FORM (2/3) ── */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                  {/* Form header */}
                  <div className="px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                      {t('form_heading')}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {t('form_sub')}
                    </p>
                  </div>

                  <div className="p-8">
                    {/* Success state */}
                    {isSuccess && (
                      <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                            {t('form_success_title')}
                          </p>
                          <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">
                            {t('form_success_msg')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error state */}
                    {submitError && (
                      <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-black">
                            !
                          </span>
                        </div>
                        <p className="text-red-700 dark:text-red-300 text-sm font-semibold">
                          {submitError}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">
                      {/* STEP 1 — Course Selection */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                            1
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">
                              {t('form_step_1')}
                            </p>
                          </div>
                        </div>

                        {/* Kurslar yuklanmoqda */}
                        {coursesLoading && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                              />
                            ))}
                          </div>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {!coursesLoading &&
                            courses.map((course) => {
                              const Icon = course.icon;
                              const isSelected =
                                formData.selectedCourse === String(course.id);
                              return (
                                <button
                                  key={course.id}
                                  type="button"
                                  onClick={() => handleCourse(course.id)}
                                  className={`group relative flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 text-center transition-all duration-200 ${
                                    isSelected
                                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10"
                                      : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800"
                                  }`}
                                >
                                  <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "bg-blue-600 shadow-md shadow-blue-500/30"
                                        : course.bg
                                    }`}
                                  >
                                    <Icon
                                      className={`w-4.5 h-4.5 ${isSelected ? "text-white" : course.color}`}
                                      style={{ width: "18px", height: "18px" }}
                                    />
                                  </div>
                                  <div>
                                    <p
                                      className={`text-[11px] font-bold leading-tight ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}
                                    >
                                      {course.label}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                      <CheckCircle2 className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                        </div>

                        {/* Selected course pill */}
                        {selectedCourseData && (
                          <div className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t('course_selected', { course: selectedCourseData.label })}
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                            2
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">
                              {t('form_step_2')}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                      </div>

                      {/* STEP 2 — Personal Info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            {t('form_fullname')}
                          </label>
                          <Input
                            name="name"
                            placeholder={t('placeholder_name')}
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            {t('form_phone')}
                          </label>
                          <Input
                            name="phone"
                            type="tel"
                            placeholder={t('placeholder_phone')}
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                          {t('form_email')}
                        </label>
                        <Input
                          name="email"
                          type="email"
                          placeholder={t('placeholder_email')}
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                          {t('form_message')}
                        </label>
                        <Textarea
                          name="message"
                          placeholder={t('placeholder_message')}
                          value={formData.message}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="min-h-28 resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                          {t('form_required')}
                        </p>
                        <button
                          type="submit"
                          disabled={
                            isSubmitting ||
                            !formData.selectedCourse ||
                            !formData.name ||
                            !formData.phone
                          }
                          className="shrink-0 flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black text-sm h-13 px-7 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 disabled:shadow-none"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />{" "}
                              {t('form_submitting')}
                            </>
                          ) : isSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> {t('form_submitted')}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" /> {t('form_submit')}{" "}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* ── SIDE INFO (1/3) ── */}
              <div className="space-y-5">
                {/* Contact details */}
                <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="font-black text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-blue-600 rounded-full" />{" "}
                    {t('sidebar_heading')}
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Phone,
                        label: t('sidebar_phone_label'),
                        value: t('phone'),
                        href: "tel:+998901234567",
                      },
                      {
                        icon: Mail,
                        label: t('sidebar_email_label'),
                        value: t('email'),
                        href: "mailto:info@alkhorazmiy.uz",
                      },
                      {
                        icon: MapPin,
                        label: t('sidebar_address_label'),
                        value: t('sidebar_address'),
                        href: null,
                      },
                      {
                        icon: Clock,
                        label: t('sidebar_hours_label'),
                        value: t('sidebar_hours'),
                        href: null,
                      },
                    ].map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-3 group">
                        <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="text-sm text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 transition-colors"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                              {value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social */}
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      {t('sidebar_social')}
                    </p>
                    <div className="flex gap-2">
                      {[
                        {
                          icon: Instagram,
                          color: "hover:bg-pink-500 hover:border-pink-500",
                          label: "Instagram",
                        },
                        {
                          icon: Youtube,
                          color: "hover:bg-red-500 hover:border-red-500",
                          label: "YouTube",
                        },
                        {
                          icon: Send,
                          color: "hover:bg-blue-500 hover:border-blue-500",
                          label: "Telegram",
                        },
                      ].map(({ icon: Icon, color, label }) => (
                        <a
                          key={label}
                          href="#"
                          aria-label={label}
                          className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white transition-all ${color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="relative h-52 bg-slate-100 dark:bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=300&fit=crop"
                      alt="Xorazm"
                      className="w-full h-full object-cover opacity-50 dark:opacity-30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">
                            Shovot tumani
                          </p>
                          <p className="text-blue-600 text-[10px] font-medium">
                            Xorazm, O'zbekiston
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors border-t border-slate-100 dark:border-slate-800"
                  >
                    {t('sidebar_map')}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Quick note */}
                <div className="bg-blue-600 rounded-3xl p-6 text-white">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-black text-base mb-1">
                    {t('sidebar_quick_note_sub')}
                  </h4>
                  <p className="text-blue-100 text-xs leading-relaxed">
                    {t('sidebar_quick_note_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FAQ
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">
                {t('faq_label')}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {t('faq_heading')}
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    openFaq === idx
                      ? "border-blue-200 dark:border-blue-800 shadow-md shadow-blue-500/5"
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="pr-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {t('faq_' + faq.key + '_q')}
                      </p>
                    </div>
                    <div
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        openFaq === idx
                          ? "bg-blue-600 text-white rotate-180"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 bg-white dark:bg-slate-900">
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {t('faq_' + faq.key + '_a')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            BOTTOM CTA
        ══════════════════════════════════════ */}
        <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              {t('cta_heading')}
            </h2>
            <p className="text-blue-100 italic mb-8 text-sm">
              {t('cta_sub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+998901234567"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-black text-sm px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-xl"
              >
                <Phone className="w-4 h-4" /> {t('cta_btn_1')}
              </a>
              <a
                href="https://t.me/alkhorazmiy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm px-8 py-3.5 rounded-xl transition-all backdrop-blur-sm"
              >
                <Send className="w-4 h-4" /> {t('cta_btn_2')}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
