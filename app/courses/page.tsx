'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useIsUzbek } from '@/components/language-context'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  Search,
  Send,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Users,
  X,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const categories = [
  { id: 'all', label: 'All Courses', labelUz: 'Barcha' },
  { id: 'Web Development', label: 'Web Dev', labelUz: 'Veb' },
  { id: 'Data Science', label: 'Data Science', labelUz: 'Data' },
  { id: 'AI & ML', label: 'AI & ML', labelUz: 'AI' },
  { id: 'Cybersecurity', label: 'Cybersecurity', labelUz: 'Xavfsizlik' },
  { id: 'Mobile Apps', label: 'Mobile Apps', labelUz: 'Mobil' },
]

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

const courses = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    titleUz: "To'liq Veb Dasturlash",
    description: 'Master modern web development with React, Node.js, and databases from scratch to deployment.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    category: 'Web Development',
    duration: '6 Months',
    durationUz: '6 Oy',
    level: 'Intermediate',
    levelUz: "O'rta daraja",
    instructor: 'David Smith',
    instructorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    price: '$499',
    rating: 4.9,
    students: 1250,
    tag: 'BESTSELLER',
    tagColor: 'bg-emerald-500',
    lessons: 48,
  },
  {
    id: 2,
    title: 'Python for Data Science',
    titleUz: "Python va Ma'lumotlar Fani",
    description: 'Learn data analysis, visualization, and machine learning with Python and Pandas.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    category: 'Data Science',
    duration: '4 Months',
    durationUz: '4 Oy',
    level: 'Beginner',
    levelUz: "Boshlang'ich",
    instructor: 'Sarah Jenkins',
    instructorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    price: '$649',
    rating: 4.8,
    students: 980,
    tag: 'NEW',
    tagColor: 'bg-blue-500',
    lessons: 36,
  },
  {
    id: 3,
    title: 'UI/UX Product Design',
    titleUz: 'UI/UX Mahsulot Dizayni',
    description: 'Create stunning user experiences with Figma, design systems, and user research.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    category: 'Web Development',
    duration: '3 Months',
    durationUz: '3 Oy',
    level: 'Intermediate',
    levelUz: "O'rta daraja",
    instructor: 'Elena Rodriguez',
    instructorImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop',
    price: '$750',
    rating: 5.0,
    students: 756,
    tag: 'TRENDING',
    tagColor: 'bg-orange-500',
    lessons: 28,
  },
  {
    id: 4,
    title: 'AI & Machine Learning Foundations',
    titleUz: "Sun'iy Intellekt Asoslari",
    description: 'Deep dive into machine learning algorithms, neural networks and real-world AI applications.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=300&fit=crop',
    category: 'AI & ML',
    duration: '5 Months',
    durationUz: '5 Oy',
    level: 'Advanced',
    levelUz: 'Yuqori daraja',
    instructor: 'Michael Volkov',
    instructorImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
    price: '$599',
    rating: 4.9,
    students: 654,
    tag: '',
    tagColor: '',
    lessons: 52,
  },
  {
    id: 5,
    title: 'Ethical Hacking & Cybersecurity',
    titleUz: 'Etik Hacking va Kiberxavfsizlik',
    description: 'Learn penetration testing, network security, and cybersecurity best practices.',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500&h=300&fit=crop',
    category: 'Cybersecurity',
    duration: '4 Months',
    durationUz: '4 Oy',
    level: 'Intermediate',
    levelUz: "O'rta daraja",
    instructor: 'James Chen',
    instructorImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop',
    price: '$449',
    rating: 4.7,
    students: 523,
    tag: 'HOT',
    tagColor: 'bg-red-500',
    lessons: 40,
  },
  {
    id: 6,
    title: 'iOS & Android Development',
    titleUz: 'iOS va Android Dasturlash',
    description: 'Build native mobile applications for iOS and Android with Swift, Kotlin and Flutter.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop',
    category: 'Mobile Apps',
    duration: '6 Months',
    durationUz: '6 Oy',
    level: 'Intermediate',
    levelUz: "O'rta daraja",
    instructor: 'Lisa Wong',
    instructorImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop',
    price: '$499',
    rating: 4.8,
    students: 892,
    tag: 'POPULAR',
    tagColor: 'bg-purple-500',
    lessons: 56,
  },
  {
    id: 7,
    title: 'Advanced React & Next.js',
    titleUz: "Ilg'or React va Next.js",
    description: 'Master advanced React patterns, performance optimization and server-side rendering.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6cb?w=500&h=300&fit=crop',
    category: 'Web Development',
    duration: '2 Months',
    durationUz: '2 Oy',
    level: 'Advanced',
    levelUz: 'Yuqori daraja',
    instructor: 'Thomas Brown',
    instructorImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop',
    price: '$199',
    rating: 4.9,
    students: 1100,
    tag: '',
    tagColor: '',
    lessons: 22,
  },
  {
    id: 8,
    title: 'Cloud Computing with AWS',
    titleUz: 'AWS bilan Bulutli Hisoblash',
    description: 'Learn to deploy and scale applications on Amazon Web Services with hands-on labs.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
    category: 'Web Development',
    duration: '3 Months',
    durationUz: '3 Oy',
    level: 'Intermediate',
    levelUz: "O'rta daraja",
    instructor: 'Rachel Green',
    instructorImg: 'https://images.unsplash.com/photo-1517841905240-74f88316b8be?w=60&h=60&fit=crop',
    price: '$349',
    rating: 4.8,
    students: 734,
    tag: '',
    tagColor: '',
    lessons: 34,
  },
  {
    id: 9,
    title: 'Data Visualization Masterclass',
    titleUz: "Ma'lumotlar Vizualizatsiyasi",
    description: "Transform raw data into compelling visual stories with Tableau, D3.js and Python.",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    category: 'Data Science',
    duration: '6 Weeks',
    durationUz: '6 Hafta',
    level: 'Beginner',
    levelUz: "Boshlang'ich",
    instructor: 'Elena Rodriguez',
    instructorImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop',
    price: '$249',
    rating: 4.7,
    students: 610,
    tag: 'NEW',
    tagColor: 'bg-blue-500',
    lessons: 18,
  },
]

/* ─────────────────────────────────────────
   LEVEL BADGE
───────────────────────────────────────── */
function LevelBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Beginner: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    Intermediate: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    Advanced: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${map[level] ?? 'bg-slate-100 text-slate-500'}`}>
      {level}
    </span>
  )
}

/* ─────────────────────────────────────────
   COURSE TYPE
───────────────────────────────────────── */
type Course = typeof courses[0]

/* ─────────────────────────────────────────
   ENROLL MODAL
───────────────────────────────────────── */
function EnrollModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1800))
    setSubmitting(false)
    setSuccess(true)
  }

  const levelColors: Record<string, string> = {
    Beginner: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    Intermediate: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    Advanced: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      style={{ animation: 'fadeIn .18s ease' }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>

      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp .22s ease' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top — course info */}
        <div className="relative h-36 overflow-hidden">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            {course.tag && (
              <span className={`inline-block ${course.tagColor} text-white text-[9px] font-black px-2 py-0.5 rounded-md mb-2 w-fit tracking-widest`}>
                {course.tag}
              </span>
            )}
            <h2 className="text-white font-black text-xl leading-snug line-clamp-1">{course.title}</h2>
            <p className="text-blue-300 text-xs italic">{course.titleUz}</p>
          </div>
        </div>

        {/* Course quick stats */}
        <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800">
          {[
            { icon: Clock, label: 'Davomiyligi', value: course.duration },
            { icon: GraduationCap, label: 'Daraja', value: course.level },
            { icon: BookOpen, label: 'Darslar', value: `${course.lessons} ta` },
            { icon: Users, label: 'Talabalar', value: course.students.toLocaleString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-3.5 border-r last:border-r-0 border-slate-100 dark:border-slate-800">
              <Icon className="w-4 h-4 text-blue-600 mb-1" />
              <p className="text-[10px] text-slate-400 mb-0.5">{label}</p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Form or Success */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Muvaffaqiyatli yuborildi!</h3>
              <p className="text-slate-400 text-sm mb-1">Arizangiz qabul qilindi.</p>
              <p className="text-slate-400 text-sm italic">Jamoamiz tez orada siz bilan bog'lanadi.</p>
              <button
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3 rounded-xl transition-all"
              >
                Yopish <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h3 className="font-black text-slate-900 dark:text-white text-lg mb-0.5">Kursga yozilish</h3>
                <p className="text-slate-400 text-xs italic">Enroll in this course — fill in your details below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      To'liq ism / Full Name *
                    </label>
                    <input
                      required
                      placeholder="Ism Familiya"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      disabled={submitting}
                      className="w-full h-11 px-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Telefon / Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+998 90 000 00 00"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      disabled={submitting}
                      className="w-full h-11 px-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Email (ixtiyoriy / optional)
                  </label>
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    disabled={submitting}
                    className="w-full h-11 px-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-60"
                  />
                </div>

                {/* Instructor row */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <img src={course.instructorImg} alt={course.instructor} className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-100 dark:ring-blue-900" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">O'qituvchi</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{course.instructor}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-black text-slate-800 dark:text-white">{course.rating}</span>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${levelColors[course.level] ?? ''}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs text-slate-400">Kurs narxi</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{course.price}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !form.name || !form.phone}
                    className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black text-sm h-12 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 disabled:shadow-none"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Yuborilmoqda...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Yozilish <ArrowRight className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function CoursesPage() {
  const isUzbek = useIsUzbek()
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLevel, setActiveLevel] = useState('All Levels')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchCat = activeCategory === 'all' || c.category === activeCategory
      const matchLevel = activeLevel === 'All Levels' || c.level === activeLevel
      const matchSearch =
        search === '' ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchLevel && matchSearch
    })
  }, [activeCategory, activeLevel, search])

  return (
    <>
      {selectedCourse && (
        <EnrollModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
      <Header />
      <main className="flex-1">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative py-20 md:py-28 bg-white dark:bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-400/8 dark:bg-blue-500/8 blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
                <Zap className="w-3.5 h-3.5" />
                {isUzbek ? '45+ kurs mavjud' : '45+ courses available'}
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-5 leading-[1.02] tracking-tight">
                {isUzbek ? 'Eng talabgir ko‘nikmalarni' : 'Master the Most'}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  {isUzbek ? 'o‘rganing' : 'In-Demand Skills'}
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-2 max-w-xl leading-relaxed">
                {isUzbek
                  ? "Sanoat ekspertlari tomonidan tuzilgan dasturlar raqamli iqtisodiyotda martabangizni tezlashtirish uchun mo'ljallangan."
                  : 'Carefully curated programs designed by industry experts to accelerate your career in the digital economy.'}
              </p>
              <p className="text-slate-400 dark:text-slate-600 text-base italic mb-10 max-w-xl">
                {isUzbek
                  ? 'Carefully curated programs designed by industry experts to accelerate your career in the digital economy.'
                  : "Sanoat ekspertlari tomonidan tuzilgan dasturlar — raqamli iqtisodiyotda martabangizni tezlashtirish uchun."}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: BookOpen, value: '45+', labelEn: 'Courses', labelUz: 'Kurslar' },
                  { icon: Users, value: '5,000+', labelEn: 'Students', labelUz: 'Talabalar' },
                  { icon: TrendingUp, value: '98%', labelEn: 'Job placement', labelUz: 'Ish joylashish' },
                  { icon: Clock, value: '6 weeks–6 mo', labelEn: 'Duration range', labelUz: 'Davomiylik oralig‘i' },
                ].map(({ icon: Icon, value, labelEn, labelUz }) => (
                  <div key={labelEn} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl">
                    <Icon className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{value}</span>
                    <span className="text-xs text-slate-400">{isUzbek ? labelUz : labelEn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STICKY FILTERS
        ══════════════════════════════════════ */}
        <section className="sticky top-[68px] z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center gap-3">

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Kurs qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 h-9 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category tabs */}
              <div className="hidden md:flex items-center gap-1 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isUzbek ? cat.labelUz : cat.label}
                  </button>
                ))}
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-bold transition-all ${
                  showFilters || activeLevel !== 'All Levels'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
                {activeLevel !== 'All Levels' && (
                  <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] flex items-center justify-center">1</span>
                )}
              </button>

              {/* Result count */}
              <span className="text-xs text-slate-400 shrink-0 hidden sm:block">
                {filtered.length} ta kurs
              </span>
            </div>

            {/* Level filter row */}
            {showFilters && (
              <div className="pt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">
                  {isUzbek ? 'Daraja:' : 'Level:'}
                </span>
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeLevel === lvl
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile category scroll */}
            <div className="md:hidden flex gap-2 overflow-x-auto pt-3 pb-0.5 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat.labelUz}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            COURSES GRID
        ══════════════════════════════════════ */}
        <section className="py-12 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Kurs topilmadi</h3>
                <p className="text-slate-400 text-sm">Boshqa kalit so'z bilan qidirib ko'ring</p>
                <button onClick={() => { setSearch(''); setActiveCategory('all'); setActiveLevel('All Levels') }}
                  className="mt-4 text-sm text-blue-600 font-semibold hover:underline">
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((course, idx) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-200">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />

                      {course.tag && (
                        <span className={`absolute top-3 left-3 ${course.tagColor} text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider`}>
                          {course.tag}
                        </span>
                      )}

                      {/* Lessons count */}
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                        <BookOpen className="w-3 h-3 text-blue-600" />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-white">{course.lessons} dars</span>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/15 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-blue-700 text-xs font-black px-5 py-2.5 rounded-xl shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5" /> Kursga yozilish
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      {/* Category + level */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                          {course.category}
                        </span>
                        <LevelBadge level={course.level} />
                      </div>

                      <h3 className="font-black text-slate-900 dark:text-white mb-0.5 text-sm leading-snug line-clamp-2">
                        {isUzbek ? course.titleUz : course.title}
                      </h3>
                      <p className="text-xs text-blue-600 italic mb-2">
                        {isUzbek ? course.title : course.titleUz}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
                        {isUzbek ? course.description.replace('Master ', '') : course.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3 h-3" /> {isUzbek ? course.durationUz : course.duration}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                          <Users className="w-3 h-3" /> {course.students.toLocaleString()}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <img src={course.instructorImg} alt={course.instructor} className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-700" />
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{course.rating}</span>
                          </div>
                          <span className="font-black text-slate-900 dark:text-white text-base">{course.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load more */}
            {filtered.length > 0 && (
              <div className="text-center mt-12">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-sm hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-sm">
                  Barcha kurslarni ko'rish
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURED PATHS
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">Learning Paths / O'quv yo'llari</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                Structured Career Paths
              </h2>
              <p className="text-slate-400 italic text-sm">Tuzilgan martaba yo'llari — qayerdan boshlashni bilmaysizmi?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  emoji: '🌐',
                  title: 'Frontend Developer',
                  titleUz: 'Frontend Dasturchi',
                  steps: ['HTML & CSS Fundamentals', 'JavaScript Mastery', 'React & Next.js', 'UI/UX Design'],
                  duration: '8 months',
                  color: 'from-blue-600 to-cyan-500',
                },
                {
                  emoji: '🤖',
                  title: 'AI/ML Engineer',
                  titleUz: "Sun'iy Intellekt Muhandisi",
                  steps: ['Python Foundations', 'Data Science', 'Machine Learning', 'Deep Learning'],
                  duration: '10 months',
                  color: 'from-indigo-600 to-purple-500',
                },
                {
                  emoji: '🔒',
                  title: 'Cybersecurity Expert',
                  titleUz: 'Kiberxavfsizlik Mutaxassisi',
                  steps: ['Network Basics', 'Linux & Security', 'Ethical Hacking', 'SOC Analyst'],
                  duration: '9 months',
                  color: 'from-red-500 to-orange-500',
                },
              ].map((path) => (
                <div key={path.title} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                  {/* Color top bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${path.color}`} />
                  <div className="p-6">
                    <div className="text-3xl mb-4">{path.emoji}</div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg mb-0.5">{path.title}</h3>
                    <p className="text-xs text-slate-400 italic mb-4">{path.titleUz} · {path.duration}</p>

                    <div className="space-y-2.5 mb-5">
                      {path.steps.map((step, idx) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${path.color} text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm`}>
                            {idx + 1}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{step}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/courses"
                      className="flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all group-hover:text-blue-500">
                      Yo'lni boshlash <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA
        ══════════════════════════════════════ */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
              Yo'lingizni topa olmadingizmi?
            </h2>
            <p className="text-blue-100 italic mb-2 text-sm">Can't find your path?</p>
            <p className="text-blue-200/80 mb-10 max-w-xl mx-auto text-sm leading-relaxed">
              Bizning maslahatchilarimiz siz uchun maqsadlaringizga mos shaxsiy o'quv rejasini tuzishga yordam beradi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-black text-sm h-14 px-10 rounded-xl shadow-xl transition-all hover:scale-105">
                Maslahat olish <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/teachers"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm h-14 px-10 rounded-xl transition-all backdrop-blur-sm">
                O'qituvchilarni ko'rish
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}