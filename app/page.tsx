'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useIsUzbek } from '@/components/language-context'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  GraduationCap,
  Minus,
  Play,
  Plus,
  Shield,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */


const featuredCourses = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    titleUz: 'To\'liq Veb Dasturlash',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    duration: '6 Months',
    durationUz: '6 Oy',
    level: 'Intermediate',
    levelUz: 'O\'rta daraja',
    instructor: 'David Smith',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    price: '$499',
    rating: 4.9,
    students: '1.2k',
    tag: 'BESTSELLER',
    tagColor: 'bg-emerald-500',
  },
  {
    id: 2,
    title: 'Python for Data Science',
    titleUz: 'Python va Ma\'lumotlar Fani',
    image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=400&h=250&fit=crop',
    duration: '4 Months',
    durationUz: '4 Oy',
    level: 'Beginner',
    levelUz: 'Boshlang\'ich',
    instructor: 'Sarah Jenkins',
    instructorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    price: '$399',
    rating: 4.8,
    students: '980',
    tag: 'NEW',
    tagColor: 'bg-blue-500',
  },
  {
    id: 3,
    title: 'Advanced UI/UX Design',
    titleUz: 'Ilg\'or UI/UX Dizayn',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    duration: '3 Months',
    durationUz: '3 Oy',
    level: 'Advanced',
    levelUz: 'Yuqori daraja',
    instructor: 'Elena Rodriguez',
    instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop',
    price: '$299',
    rating: 5.0,
    students: '750',
    tag: 'TRENDING',
    tagColor: 'bg-orange-500',
  },
  {
    id: 4,
    title: 'Cloud Computing Fundamentals',
    titleUz: 'Bulutli Hisoblash Asoslari',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    duration: '5 Months',
    durationUz: '5 Oy',
    level: 'Intermediate',
    levelUz: 'O\'rta daraja',
    instructor: 'Michael Volkov',
    instructorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
    price: '$450',
    rating: 4.7,
    students: '630',
    tag: 'NEW',
    tagColor: 'bg-blue-500',
  },
  {
    id: 5,
    title: 'Cybersecurity Essentials',
    titleUz: 'Kiberxavfsizlik Asoslari',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=250&fit=crop',
    duration: '4 Months',
    durationUz: '4 Oy',
    level: 'Intermediate',
    levelUz: 'O\'rta daraja',
    instructor: 'James Okonkwo',
    instructorImage: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=60&h=60&fit=crop',
    price: '$379',
    rating: 4.8,
    students: '540',
    tag: 'HOT',
    tagColor: 'bg-red-500',
  },
  {
    id: 6,
    title: 'Mobile App Development',
    titleUz: 'Mobil Ilova Yaratish',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
    duration: '5 Months',
    durationUz: '5 Oy',
    level: 'Beginner',
    levelUz: 'Boshlang\'ich',
    instructor: 'Yuki Tanaka',
    instructorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop',
    price: '$420',
    rating: 4.9,
    students: '890',
    tag: 'POPULAR',
    tagColor: 'bg-purple-500',
  },
]

const stats = [
  { number: '5,000+', label: 'Active Students', labelUz: 'Faol Talabalar', icon: Users },
  { number: '120+', label: 'Expert Teachers', labelUz: 'Mutaxassis O\'qituvchilar', icon: GraduationCap },
  { number: '45+', label: 'Premium Courses', labelUz: 'Premium Kurslar', icon: BookOpen },
  { number: '98%', label: 'Job Placement', labelUz: 'Ish Joylashish', icon: TrendingUp },
]

const whyChoose = [
  { icon: Code, title: 'Algorithm Focus', titleUz: 'Algoritm Asosi', description: "Master the logic behind the code, inspired by Al-Kharazmi's mathematical foundations.", descriptionUz: "Al-Xorazmiy matematik asoslaridan ilhomlanib, kod ortidagi mantiqni o'zlashtirasiz." },
  { icon: Users, title: 'Project Teams', titleUz: 'Jamoa Loyihalari', description: 'Work in agile squads to build real-world products from conception to deployment.', descriptionUz: 'Haqiqiy mahsulotlarni konsepsiyadan joylashtirishgacha yaratish uchun agile jamoalarda ishlaysiz.' },
  { icon: Award, title: 'Career Launchpad', titleUz: 'Martaba Platformasi', description: 'Direct networking with IT-Park companies and exclusive job placement opportunities.', descriptionUz: 'IT-Park kompaniyalari bilan to\'g\'ridan-to\'g\'ri aloqa va eksklyuziv ish joylashish imkoniyatlari.' },
  { icon: Brain, title: 'Modern Tech Stack', titleUz: 'Zamonaviy Texnologiyalar', description: 'Always updated curriculum featuring the most relevant technologies in the industry.', descriptionUz: 'Sohaning eng dolzarb texnologiyalarini o\'z ichiga olgan doimiy yangilangan dastur.' },
  { icon: Shield, title: 'Global Certification', titleUz: 'Xalqaro Sertifikat', description: 'Receive industry-recognized certificates backed by IT-Park Uzbekistan.', descriptionUz: 'IT-Park O\'zbekiston tomonidan qo\'llab-quvvatlangan xalqaro tan olingan sertifikatlar oling.' },
  { icon: Database, title: 'Mentorship Program', titleUz: 'Mentorlik Dasturi', description: 'One-on-one sessions with senior engineers from top global technology firms.', descriptionUz: 'Dunyo\'ning yetakchi texnologiya firmalaridan yuqori malakali muhandislar bilan individual sessiyalar.' },
]

const instructors = [
  { name: 'Dr. Alex Rivera', title: 'Algorithm Expert', titleUz: 'Algoritm Mutaxassisi', company: 'Former Google', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&fit=faces', students: '2.3k', rating: 4.9, courses: 8 },
  { name: 'Elena Petrova', title: 'UX/Design Lead', titleUz: 'UX/Dizayn Rahbari', company: 'Former Apple', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', students: '1.8k', rating: 5.0, courses: 5 },
  { name: 'Samir Al-Mansur', title: 'Systems Architect', titleUz: 'Tizim Arxitektori', company: 'Former Amazon', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop', students: '3.1k', rating: 4.8, courses: 11 },
  { name: 'Priya Nair', title: 'ML Research Lead', titleUz: 'ML Tadqiqot Rahbari', company: 'Former DeepMind', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop', students: '2.7k', rating: 4.9, courses: 7 },
  { name: 'James Okonkwo', title: 'DevOps Specialist', titleUz: 'DevOps Mutaxassisi', company: 'Former Microsoft', image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&h=300&fit=crop', students: '1.5k', rating: 4.7, courses: 6 },
  { name: 'Yuki Tanaka', title: 'Mobile Dev Expert', titleUz: 'Mobil Dasturchi', company: 'Former Spotify', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop', students: '2.0k', rating: 4.8, courses: 9 },
]

const testimonials = [
  {
    name: 'Jordan Smith',
    role: 'Software Engineer at Netflix',
    roleUz: 'Netflix\'da Dasturiy ta\'minot muhandisi',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    text: 'The Al-Kharazmi program completely changed my career path. The focus on underlying algorithms gave me the edge I needed.',
    textUz: 'Al-Xorazmiy dasturi mening martaba yo\'limni butunlay o\'zgartirdi. Algoritmlarga e\'tibor menga kerakli ustunlikni berdi.',
    rating: 5,
  },
  {
    name: 'Dilnoza Yusupova',
    role: 'Frontend Developer at Epam',
    roleUz: 'Epam\'da Frontend Dasturchi',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop',
    text: 'From zero to hired in 6 months. The mentorship and project-based learning made all the difference in my journey.',
    textUz: '6 oyda noldan ishga qabul qilinganimga. Mentorlik va loyihaga asoslangan ta\'lim mening yo\'limda katta farq yaratdi.',
    rating: 5,
  },
  {
    name: 'Rustam Nazarov',
    role: 'Data Scientist at Uzum',
    roleUz: 'Uzum\'da Ma\'lumotlar Olimi',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    text: 'World-class education right here in Uzbekistan. The curriculum is on par with top international programs.',
    textUz: 'O\'zbekistonda jahon darajasidagi ta\'lim. Dastur eng yaxshi xalqaro dasturlar bilan bir xil darajada.',
    rating: 5,
  },
]

const faqs = [
  { q: 'Who can apply to Al-Kharazmi programs?', qUz: 'Al-Xorazmiy dasturlariga kim murojaat qila oladi?', a: 'Anyone with a passion for technology can apply — from complete beginners to working professionals looking to upskill. No prior coding experience required for beginner tracks.', aUz: 'Texnologiyaga qiziqish bilan istalgan kishi murojaat qila oladi — mutlaq boshlang\'ichlardan qayta malaka oshirishni xohlovchi ishlayotgan mutaxassislargacha.' },
  { q: 'How long are the programs?', qUz: 'Dasturlar qancha davom etadi?', a: 'Programs range from 3 to 6 months depending on the track. Bootcamp formats are 12 weeks intensive. All programs are flexible with part-time and full-time options.', aUz: 'Dasturlar yo\'nalishiga qarab 3 dan 6 oygacha davom etadi. Bootcamp formatlari 12 haftalik intensiv. Barcha dasturlarda yarim va to\'liq vaqtli variantlar mavjud.' },
  { q: 'What certificate will I receive?', qUz: 'Qanday sertifikat olaman?', a: 'Graduates receive an internationally recognized certificate backed by IT-Park Uzbekistan. Our certificates are accepted by top tech companies across the region and globally.', aUz: 'Bitiruvchilar IT-Park O\'zbekiston tomonidan qo\'llab-quvvatlangan xalqaro tan olingan sertifikat oladilar.' },
  { q: 'Is job placement guaranteed?', qUz: 'Ish joylashish kafolatlanadimi?', a: 'We have a 98% job placement rate. Our career team actively works with 100+ partner companies to connect graduates with relevant opportunities through our talent network.', aUz: '98% ish joylashish darajasiga egamiz. Bizning martaba jamoamiz 100+ hamkor kompaniyalar bilan faol hamkorlik qiladi.' },
  { q: 'What is the cost and are there scholarships?', qUz: 'Narxi qancha va stipendiyalar bormi?', a: 'Course prices range from $299 to $499. We offer merit-based scholarships covering up to 50% of tuition, as well as flexible installment payment plans.', aUz: 'Kurs narxlari $299 dan $499 gacha. Biz o\'qish pulining 50% gacha qoplaydigan stipendiyalar va moslashuvchan to\'lov rejalarini taklif etamiz.' },
]

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const isUzbek = useIsUzbek()
  const [activeCat, setActiveCat] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  // Instructor carousel
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const isPausedRef = useRef(false)
  const CARD_W = 300
  const GAP = 24
  const STEP = CARD_W + GAP
  const TOTAL = instructors.length
  const [activeInstructor, setActiveInstructor] = useState(0)

  useEffect(() => {
    const speed = 0.5
    const totalWidth = TOTAL * STEP
    let raf: number
    const animate = () => {
      if (!isPausedRef.current) {
        posRef.current += speed
        if (posRef.current >= totalWidth) posRef.current -= totalWidth
        if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`
        setActiveInstructor(Math.round(posRef.current / STEP) % TOTAL)
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [TOTAL, STEP])

  const scrollInstructor = (dir: number) => {
    posRef.current = Math.max(0, posRef.current + dir * STEP)
  }

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisibleSections((prev) => new Set([...prev, e.target.id]))
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Auto testimonial
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-hidden">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative min-h-[92vh] flex items-center bg-white dark:bg-slate-950 overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{ backgroundImage: 'linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          {/* Glowing orbs */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  IT-Park & Al-Kharazmi Academy
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.05] tracking-tight">
                  Master the<br />
                  <span className="relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Future</span>
                  </span>
                  <br />of Tech
                </h1>

                <p className="text-slate-600 dark:text-slate-400 text-lg mb-4 leading-relaxed max-w-lg">
                  {isUzbek
                    ? "Kelajakni shakllantiruvchi texnologiyalarni o'rganing va martabangizni yangi bosqichga olib chiqing."
                    : 'Join the elite program and transform your career with world-class mentors.'}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-base mb-10 leading-relaxed max-w-lg font-light italic">
                  {isUzbek
                    ? 'Join the elite program and transform your career with world-class mentors.'
                    : "Kelajakni shakllantiruvchi texnologiyalarni o'rganing va martabangizni yangi bosqichga olib chiqing."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/courses">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 font-bold text-base rounded-xl shadow-2xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40">
                      {isUzbek ? "Kurslarni ko'rish" : 'Explore Courses'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="ghost" className="text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 h-14 px-8 font-semibold text-base rounded-xl transition-all group">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-colors">
                      <Play className="w-3.5 h-3.5 fill-blue-600 dark:fill-white ml-0.5" />
                    </div>
                    Watch Demo
                  </Button>
                </div>

                {/* Mini stats */}
                <div className="flex gap-8">
                  {[
                    { n: '5,000+', en: 'Students', uz: 'Talabalar' },
                    { n: '98%', en: 'Job Placement', uz: 'Ish joylashish' },
                    { n: '45+', en: 'Courses', uz: 'Kurslar' },
                  ].map((item) => (
                    <div key={item.n}>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">{item.n}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {isUzbek ? item.uz : item.en}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — floating course cards */}
              <div className="hidden lg:block relative h-[520px]">
                {/* Main card */}
                <div className="absolute top-8 right-0 w-72 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop" alt="" className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10 px-2 py-0.5 rounded">BESTSELLER</span>
                    <h3 className="text-slate-900 dark:text-white font-bold mt-2 text-sm">Full-Stack Web Development</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-blue-600 font-bold">$499</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-slate-700 dark:text-white text-xs font-semibold">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge 1 */}
                <div className="absolute top-0 left-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm">120+ Teachers</div>
                      <div className="text-slate-500 text-xs">120+ O'qituvchi</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge 2 */}
                <div className="absolute bottom-24 left-0 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm">Certified</div>
                      <div className="text-slate-500 text-xs">Sertifikatlangan</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge 3 */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 shadow-2xl">
                  <div className="text-white text-center">
                    <div className="text-3xl font-black">98%</div>
                    <div className="text-blue-200 text-xs mt-0.5">Job Placement</div>
                  </div>
                </div>

                {/* Second card behind */}
                <div className="absolute top-44 left-12 w-64 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl opacity-50">
                  <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=160&fit=crop" alt="" className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <h3 className="text-slate-900 dark:text-white font-semibold text-xs">Advanced UI/UX Design</h3>
                    <div className="text-blue-600 font-bold text-sm mt-1">$299</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-600 animate-bounce">
            <ChevronDown className="w-6 h-6" />
          </div>
        </section>

        {/* ══════════════════════════════════════
            CATEGORY TABS
        ══════════════════════════════════════ */}
  

        {/* ══════════════════════════════════════
            STATS
        ══════════════════════════════════════ */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div
                    key={idx}
                    className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">{stat.number}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-600 italic mt-0.5">{stat.labelUz}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURED COURSES
        ══════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                    <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-2">
                      {isUzbek ? 'Tanlangan dasturlar' : 'Featured Programs'}
                    </p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  {isUzbek ? 'Eng so‘ralgan kurslar' : 'In-Demand Courses'}
                  <br />
                  <span className="text-slate-400 dark:text-slate-600 font-light text-2xl">
                    {isUzbek ? 'In-demand courses' : "Eng so'ralgan kurslar"}
                  </span>
                </h2>
              </div>
                <Link href="/courses" className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all group">
                {isUzbek ? "Barcha kurslarni ko'rish" : 'View all courses'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.slice(0, 3).map((course, idx) => (
                <div
                  key={course.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    {course.tag && (
                      <span className={`absolute top-3 left-3 ${course.tagColor} text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider`}>
                        {course.tag}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{course.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-0.5 leading-snug">
                      {isUzbek ? course.titleUz : course.title}
                    </h3>
                    <p className="text-slate-400 text-xs mb-4 italic">
                      {isUzbek ? course.title : course.titleUz}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                        <BookOpen className="w-3 h-3" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3" /> {course.level}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                        <Users className="w-3 h-3" /> {course.students}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <img src={course.instructorImage} alt={course.instructor} className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-700" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{course.instructor}</span>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-lg">{course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHY CHOOSE
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-3">
                {isUzbek ? 'Nima uchun biz' : 'Why Us'}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
                {isUzbek ? 'Nima uchun Al-Xorazmiy?' : 'Why Choose Al-Kharazmi?'}
              </h2>
              <p className="text-slate-400 text-base italic">
                {isUzbek ? 'Why choose Al-Kharazmi?' : 'Nima uchun Al-Xorazmiyni tanlash kerak?'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChoose.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Number watermark */}
                    <div className="absolute top-4 right-5 text-7xl font-black text-slate-100 dark:text-slate-800 select-none leading-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-base">
                      {isUzbek ? item.titleUz : item.title}
                    </h3>
                    <p className="text-blue-600 text-xs font-medium mb-3 italic">
                      {isUzbek ? item.title : item.titleUz}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {isUzbek ? item.descriptionUz : item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            INSTRUCTORS CAROUSEL
        ══════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="flex items-end justify-between">
              <div>
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-3">
                {isUzbek ? 'Jamoamiz' : 'Our Team'}
              </p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">
                {isUzbek ? "Eng yaxshilardan o'rganing" : 'Learn from the Best'}
                </h2>
              <p className="text-slate-400 text-base italic">
                {isUzbek ? 'Learn from the best' : "Eng yaxshilardan o'rganing"}
              </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scrollInstructor(-1)} className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollInstructor(1)} className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-28 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-28 z-10 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent pointer-events-none" />

            <div
              className="overflow-hidden"
              onMouseEnter={() => { isPausedRef.current = true }}
              onMouseLeave={() => { isPausedRef.current = false }}
            >
              <div
                ref={trackRef}
                className="flex will-change-transform"
                style={{ gap: `${GAP}px`, width: `${TOTAL * 2 * STEP + GAP}px` }}
              >
                {[...instructors, ...instructors].map((inst, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 group cursor-pointer"
                    style={{ width: `${CARD_W}px` }}
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 shadow-sm">
                      <div className="relative h-60 overflow-hidden bg-slate-200">
                        <img
                          src={inst.image}
                          alt={inst.name}
                          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-slate-800 dark:text-white">{inst.rating}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-0.5">{inst.name}</h3>
                        <p className="text-blue-600 text-xs font-semibold mb-0.5">{inst.title}</p>
                        <p className="text-slate-400 text-xs italic mb-4">{inst.company}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {inst.students}</span>
                            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {inst.courses} courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {instructors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { posRef.current = idx * STEP }}
                className={`rounded-full transition-all duration-300 ${activeInstructor === idx ? 'w-7 h-2.5 bg-blue-600' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-blue-400'}`}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, #93c5fd 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-3">
                {isUzbek ? 'Muvaffaqiyat hikoyalari' : 'Success Stories'}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {isUzbek ? 'Talabalarimiz nima deyishadi' : 'What Our Students Say'}
              </h2>
              <p className="text-slate-400 italic">
                {isUzbek ? 'What our students say' : 'Talabalarimiz nima deyishadi'}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Active testimonial */}
              <div className="relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-10 md:p-14 mb-8">
                <div className="text-8xl text-blue-400/20 font-serif leading-none absolute top-6 left-10 select-none">"</div>
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-900 dark:text-white text-xl md:text-2xl text-center leading-relaxed font-medium mb-3">
                  "{isUzbek ? testimonials[activeTestimonial].textUz : testimonials[activeTestimonial].text}"
                </p>
                <p className="text-slate-400 text-base text-center italic mb-10">
                  "{isUzbek ? testimonials[activeTestimonial].text : testimonials[activeTestimonial].textUz}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <img src={testimonials[activeTestimonial].image} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 dark:border-blue-500/30" />
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold">{testimonials[activeTestimonial].name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>

              {/* Testimonial nav */}
              <div className="flex justify-center gap-3">
                {testimonials.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      activeTestimonial === idx
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <img src={t.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-semibold hidden sm:block">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FAQ
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-3">
                {isUzbek ? 'Savol-javoblar' : 'FAQ'}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {isUzbek ? "Ko'p so'raladigan savollar" : 'Frequently Asked Questions'}
              </h2>
              <p className="text-slate-400 italic">
                {isUzbek ? 'Frequently asked questions' : "Ko'p so'raladigan savollar"}
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    openFaq === idx
                      ? 'border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/5'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="pr-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {isUzbek ? faq.qUz : faq.q}
                      </p>
                      <p className="text-slate-400 text-xs italic mt-0.5">
                        {isUzbek ? faq.q : faq.qUz}
                      </p>
                    </div>
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${openFaq === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {openFaq === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 bg-white dark:bg-slate-900">
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2">
                        {isUzbek ? faq.aUz : faq.a}
                      </p>
                      <p className="text-slate-400 text-xs italic leading-relaxed">
                        {isUzbek ? faq.a : faq.aUz}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA
        ══════════════════════════════════════ */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {isUzbek ? "2024-yil yozgi oqimiga qabul ochiq" : 'Summer 2024 Cohort Open'}
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              {isUzbek ? 'Kelajakni birga qurishga tayyormisiz?' : 'Ready to Build the Future?'}
            </h2>
            <p className="text-blue-100 text-lg mb-2 max-w-xl mx-auto">
              {isUzbek
                ? "Mintaqadagi eng nufuzli texnologiya akademiyasida o'rningizni hoziroq band qiling."
                : 'Secure your spot in the most prestigious tech academy in the region.'}
            </p>
            <p className="text-blue-200/70 text-base italic mb-12 max-w-xl mx-auto">
              {isUzbek
                ? 'Secure your spot in the most prestigious tech academy in the region.'
                : "Mintaqadagi eng nufuzli texnologiya akademiyasida o'rningizni band qiling."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 h-14 px-10 font-black text-base rounded-xl shadow-2xl shadow-blue-900/30 transition-all hover:scale-105">
                {isUzbek ? "Hozir murojaat qiling" : 'Apply Now'}
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-14 px-10 font-bold text-base rounded-xl backdrop-blur-sm transition-all">
                {isUzbek ? 'Sayohatni rejalashtirish' : 'Schedule a Tour'}
              </Button>
            </div>

            <p className="text-blue-200/60 text-sm">
              {isUzbek
                ? "Majburiyat yo'q. Birinchi 30 kun ichida istalgan vaqtda bekor qilishingiz mumkin."
                : 'No commitment required. Cancel anytime in the first 30 days.'}
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}