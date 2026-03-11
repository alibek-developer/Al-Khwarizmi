'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  MessageSquare,
  Phone,
  Send,
  Shield,
  Smartphone,
  Youtube,
} from 'lucide-react'
import { useState } from 'react'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const courses = [
  { id: 'english', label: 'English Language', labelUz: 'Ingliz Tili', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'it-programming', label: 'IT & Programming', labelUz: 'IT va Dasturlash', icon: Code, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 'computer-literacy', label: 'Computer Literacy', labelUz: 'Kompyuter Savodxonligi', icon: Laptop, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { id: 'web-development', label: 'Web Development', labelUz: 'Veb Dasturlash', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'cybersecurity', label: 'Cybersecurity', labelUz: 'Kiberxavfsizlik', icon: Shield, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  { id: 'mobile-apps', label: 'Mobile Apps', labelUz: 'Mobil Ilovalar', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'data-science', label: 'Data Science', labelUz: "Ma'lumotlar Fani", icon: BarChart2, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 'not-sure', label: "I'm not sure yet", labelUz: 'Hali bilmayman', icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800' },
]

const faqs = [
  {
    q: "What are the admission requirements?",
    qUz: "Qabul talablari qanday?",
    a: "We welcome students from all backgrounds. No prior experience needed for beginner tracks — just motivation and a willingness to learn.",
    aUz: "Biz barcha darajadagi talabalarni qabul qilamiz. Boshlang'ich yo'nalishlar uchun oldindan tajriba shart emas.",
  },
  {
    q: "How long are the programs?",
    qUz: "Dasturlar qancha davom etadi?",
    a: "Programs range from 4 weeks (intensive bootcamps) to 6 months (full courses). Flexible scheduling available.",
    aUz: "Dasturlar 4 haftadan (intensiv bootcamp) 6 oygacha (to'liq kurslar) davom etadi.",
  },
  {
    q: "Do you offer certificates?",
    qUz: "Sertifikat berasizlarmi?",
    a: "Yes! All graduates receive an IT-Park recognized certificate upon successful completion of their program.",
    aUz: "Ha! Barcha bitiruvchilar IT-Park tomonidan tan olingan sertifikat oladilar.",
  },
  {
    q: "Where are you located?",
    qUz: "Qaerdasiz?",
    a: "We are located in Shovot district, Xorazm region, Uzbekistan. Come visit us anytime during working hours!",
    aUz: "Biz O'zbekiston, Xorazm viloyati, Shovot tumanida joylashganmiz.",
  },
]

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedCourse: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCourse = (id: string) => {
    setFormData((prev) => ({ ...prev, selectedCourse: prev.selectedCourse === id ? '' : id }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.selectedCourse) return
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)
    setFormData({ name: '', email: '', phone: '', message: '', selectedCourse: '' })
    setTimeout(() => setIsSuccess(false), 6000)
  }

  const selectedCourseData = courses.find((c) => c.id === formData.selectedCourse)

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-400/8 dark:bg-blue-500/8 blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              Biz bilan bog'laning / Contact Us
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-5 leading-[1.02] tracking-tight">
              Let's Start Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Journey Together
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto mb-2 leading-relaxed">
              Choose your course, fill in your details, and our team will reach out within 24 hours.
            </p>
            <p className="text-slate-400 dark:text-slate-600 text-base italic max-w-xl mx-auto">
              Kursni tanlang, ma'lumotlaringizni kiriting — jamoamiz 24 soat ichida bog'lanadi.
            </p>

            {/* Quick contact pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <a href="tel:+998901234567" className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 transition-all">
                <Phone className="w-4 h-4 text-blue-600" /> +998 90 123 45 67
              </a>
              <a href="mailto:info@alkhorazmiy.uz" className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 transition-all">
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
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Ro'yxatdan o'tish</h2>
                    <p className="text-slate-400 text-sm">Enroll Now — Kurs tanlang va ma'lumotlaringizni kiriting</p>
                  </div>

                  <div className="p-8">
                    {/* Success state */}
                    {isSuccess && (
                      <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Muvaffaqiyatli yuborildi!</p>
                          <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">Jamoamiz 24 soat ichida siz bilan bog'lanadi. / Our team will contact you within 24 hours.</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">

                      {/* STEP 1 — Course Selection */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">1</div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">Kursni tanlang</p>
                            <p className="text-xs text-slate-400 italic">Choose your course</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {courses.map((course) => {
                            const Icon = course.icon
                            const isSelected = formData.selectedCourse === course.id
                            return (
                              <button
                                key={course.id}
                                type="button"
                                onClick={() => handleCourse(course.id)}
                                className={`group relative flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 text-center transition-all duration-200 ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10'
                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-blue-600 shadow-md shadow-blue-500/30' : course.bg
                                }`}>
                                  <Icon className={`w-4.5 h-4.5 ${isSelected ? 'text-white' : course.color}`} style={{ width: '18px', height: '18px' }} />
                                </div>
                                <div>
                                  <p className={`text-[11px] font-bold leading-tight ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {course.label}
                                  </p>
                                  <p className={`text-[10px] italic mt-0.5 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}>
                                    {course.labelUz}
                                  </p>
                                </div>
                                {isSelected && (
                                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {/* Selected course pill */}
                        {selectedCourseData && (
                          <div className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {selectedCourseData.label} tanlandi
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">2</div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">Ma'lumotlaringiz</p>
                            <p className="text-xs text-slate-400 italic">Your information</p>
                          </div>
                        </div>
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                      </div>

                      {/* STEP 2 — Personal Info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            To'liq ism / Full Name *
                          </label>
                          <Input
                            name="name"
                            placeholder="Ism Familiya"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            Telefon / Phone *
                          </label>
                          <Input
                            name="phone"
                            type="tel"
                            placeholder="+998 90 000 00 00"
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
                          Email (ixtiyoriy / optional)
                        </label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="email@gmail.com"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                          Xabar / Message (ixtiyoriy)
                        </label>
                        <Textarea
                          name="message"
                          placeholder="Qo'shimcha savollar yoki izohlar..."
                          value={formData.message}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="min-h-28 resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                          * Majburiy maydonlar. Ma'lumotlaringiz faqat bog'lanish uchun ishlatiladi.
                        </p>
                        <button
                          type="submit"
                          disabled={isSubmitting || !formData.selectedCourse || !formData.name || !formData.phone}
                          className="shrink-0 flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black text-sm h-13 px-7 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 disabled:shadow-none"
                        >
                          {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Yuborilmoqda...</>
                          ) : isSuccess ? (
                            <><CheckCircle2 className="w-4 h-4" /> Yuborildi!</>
                          ) : (
                            <><Send className="w-4 h-4" /> Yuborish <ArrowRight className="w-3.5 h-3.5" /></>
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
                    <span className="w-3 h-0.5 bg-blue-600 rounded-full" /> Aloqa / Contact
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Phone, label: 'Telefon', value: '+998 90 123 45 67', href: 'tel:+998901234567' },
                      { icon: Mail, label: 'Email', value: 'info@alkhorazmiy.uz', href: 'mailto:info@alkhorazmiy.uz' },
                      { icon: MapPin, label: 'Manzil', value: 'Shovot tumani, Xorazm viloyati', href: null },
                      { icon: Clock, label: 'Ish vaqti', value: 'Du–Shan: 9:00 – 18:00', href: null },
                    ].map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-3 group">
                        <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                          {href ? (
                            <a href={href} className="text-sm text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 transition-colors">
                              {value}
                            </a>
                          ) : (
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social */}
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Ijtimoiy tarmoqlar</p>
                    <div className="flex gap-2">
                      {[
                        { icon: Instagram, color: 'hover:bg-pink-500 hover:border-pink-500', label: 'Instagram' },
                        { icon: Youtube, color: 'hover:bg-red-500 hover:border-red-500', label: 'YouTube' },
                        { icon: Send, color: 'hover:bg-blue-500 hover:border-blue-500', label: 'Telegram' },
                      ].map(({ icon: Icon, color, label }) => (
                        <a key={label} href="#" aria-label={label}
                          className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-white transition-all ${color}`}>
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
                          <p className="font-black text-slate-900 dark:text-white text-xs">Shovot tumani</p>
                          <p className="text-blue-600 text-[10px] font-medium">Xorazm, O'zbekiston</p>
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
                    Google Maps'da ko'rish <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Quick note */}
                <div className="bg-blue-600 rounded-3xl p-6 text-white">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-black text-base mb-1">Tez javob kafolati</h4>
                  <p className="text-blue-100 text-xs leading-relaxed mb-0.5">Fast response guaranteed</p>
                  <p className="text-blue-200 text-xs leading-relaxed">
                    Arizangiz qabul qilingandan so'ng jamoamiz <strong className="text-white">24 soat</strong> ichida siz bilan bog'lanadi.
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
              <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">FAQ / Savol-Javob</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                Ko'p so'raladigan savollar
              </h2>
              <p className="text-slate-400 italic text-sm">Frequently Asked Questions</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    openFaq === idx
                      ? 'border-blue-200 dark:border-blue-800 shadow-md shadow-blue-500/5'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="pr-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{faq.q}</p>
                      <p className="text-slate-400 text-xs italic mt-0.5">{faq.qUz}</p>
                    </div>
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      openFaq === idx ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 bg-white dark:bg-slate-900">
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-1.5">{faq.a}</p>
                      <p className="text-slate-400 text-xs italic leading-relaxed">{faq.aUz}</p>
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
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Hali savollaringiz bormi?</h2>
            <p className="text-blue-100 italic mb-8 text-sm">Still have questions? We're just a call away.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+998901234567"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-black text-sm px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-xl">
                <Phone className="w-4 h-4" /> Qo'ng'iroq qiling
              </a>
              <a href="https://t.me/alkhorazmiy" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm px-8 py-3.5 rounded-xl transition-all backdrop-blur-sm">
                <Send className="w-4 h-4" /> Telegram orqali yozing
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}