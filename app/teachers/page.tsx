'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useIsUzbek } from '@/components/language-context'
import { Button } from '@/components/ui/button'
import {
  Award,
  BarChart2,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  GraduationCap,
  Mail,
  Monitor,
  Star,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const teachers = [
  {
    id: 1,
    name: 'Tulkin Rajabbaev',
    specialization: 'English Teacher',
    specializationUz: 'Ingliz Tili O\'qituvchisi',
    experience: '12+ years',
    company: 'AL-Khorazmiy Academy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=face',
    badge: 'STAFF PICK',
    rating: 4.9,
    students: '2,340',
    certificate: 'IELTS 8.5',
    bio: 'Tulkin Rajabbaev is a highly experienced English language instructor with over 12 years of teaching. He holds an IELTS score of 8.5 and has helped hundreds of students achieve their target scores in IELTS and CEFR examinations.',
    bioUz: 'Tulkin Rajabbaev 12 yildan ortiq ingliz tili o\'qitish tajribasiga ega. IELTS 8.5 natijasiga ega bo\'lib, yuzlab talabalar IELTS va CEFR imtihonlarida maqsadli ball olishlariga yordam bergan.',
    socials: ['mail', 'monitor', 'globe'],
    skills: ['IELTS Preparation', 'CEFR B2–C2', 'Business English', 'Academic Writing', 'Speaking & Pronunciation'],
    courses: [
      { title: 'IELTS Intensive Preparation', duration: '3 Months', level: 'Intermediate', students: 980 },
      { title: 'General English (A1–C1)', duration: '6 Months', level: 'Beginner', students: 1200 },
      { title: 'Business English Masterclass', duration: '6 Weeks', level: 'Advanced', students: 460 },
    ],
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    specialization: 'Full-Stack Developer',
    specializationUz: 'To\'liq Veb Dasturchi',
    experience: '8+ years',
    company: 'Former Meta',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=700&fit=crop&crop=face',
    badge: '',
    rating: 5.0,
    students: '1,820',
    bio: 'Sarah Jenkins is a full-stack engineer who spent 6 years at Meta building scalable web platforms. She is passionate about teaching modern JavaScript frameworks and helping students land their first tech jobs.',
    bioUz: 'Sarah Jenkins Meta\'da 6 yil davomida kengaytiriladigan veb platformalar yaratgan full-stack muhandis.',
    socials: ['mail', 'monitor', 'globe'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    courses: [
      { title: 'Full-Stack Web Development', duration: '6 Months', level: 'Intermediate', students: 1200 },
      { title: 'React & Next.js Mastery', duration: '2 Months', level: 'Intermediate', students: 890 },
    ],
  },
  {
    id: 3,
    name: 'Michael Volkov',
    specialization: 'Cybersecurity Lead',
    specializationUz: 'Kiberxavfsizlik Rahbari',
    experience: '10+ years',
    company: 'Former Kaspersky Lab',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=700&fit=crop&crop=face',
    badge: '',
    rating: 4.8,
    students: '1,540',
    bio: 'Michael Volkov is a certified ethical hacker and cybersecurity expert with a decade of experience in penetration testing, network security, and threat intelligence for Fortune 500 companies.',
    bioUz: 'Michael Volkov Fortune 500 kompaniyalar uchun penetration testing va tarmoq xavfsizligi sohasida o\'n yillik tajribaga ega sertifikatlangan etik xaker.',
    socials: ['mail', 'globe'],
    skills: ['Ethical Hacking', 'Pen Testing', 'OSINT', 'Network Security', 'SOC'],
    courses: [
      { title: 'Cybersecurity Essentials', duration: '4 Months', level: 'Intermediate', students: 870 },
      { title: 'Ethical Hacking Bootcamp', duration: '8 Weeks', level: 'Advanced', students: 670 },
    ],
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    specialization: 'Data Science Specialist',
    specializationUz: 'Ma\'lumotlar Fani Mutaxassisi',
    experience: '7+ years',
    company: 'Former Netflix',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=700&fit=crop&crop=face',
    badge: 'TOP RATED',
    rating: 4.9,
    students: '2,100',
    bio: 'Elena Rodriguez worked as a senior data scientist at Netflix, building recommendation algorithms that serve 260M+ users. She specializes in Python, statistical modeling, and data visualization.',
    bioUz: 'Elena Rodriguez Netflix\'da 260M+ foydalanuvchiga xizmat qiluvchi tavsiya algoritmlari yaratgan katta ma\'lumotlar olimi.',
    socials: ['monitor', 'bar'],
    skills: ['Python', 'Pandas', 'SQL', 'Tableau', 'Scikit-learn'],
    courses: [
      { title: 'Python for Data Science', duration: '4 Months', level: 'Beginner', students: 980 },
      { title: 'Data Visualization Masterclass', duration: '6 Weeks', level: 'Intermediate', students: 750 },
      { title: 'Machine Learning with Python', duration: '3 Months', level: 'Intermediate', students: 620 },
    ],
  },
  {
    id: 5,
    name: 'David Smith',
    specialization: 'Cloud Architect',
    specializationUz: 'Bulut Arxitektori',
    experience: '15+ years',
    company: 'Former Amazon AWS',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=700&fit=crop&crop=face',
    badge: '',
    rating: 4.7,
    students: '1,280',
    bio: 'David Smith is a veteran cloud architect with 15 years of experience, having led infrastructure projects for Amazon AWS. He holds multiple AWS and GCP certifications and mentors engineers worldwide.',
    bioUz: 'David Smith Amazon AWS uchun infratuzilma loyihalarini boshqargan 15 yillik tajribaga ega veteran bulut arxitektori.',
    socials: ['mail', 'monitor'],
    skills: ['AWS', 'GCP', 'Terraform', 'Kubernetes', 'CI/CD'],
    courses: [
      { title: 'Cloud Computing Fundamentals', duration: '5 Months', level: 'Intermediate', students: 760 },
      { title: 'AWS Solutions Architect', duration: '3 Months', level: 'Advanced', students: 520 },
    ],
  },
  {
    id: 6,
    name: 'Aisha Rahman',
    specialization: 'UX/UI Design Lead',
    specializationUz: 'UX/UI Dizayn Rahbari',
    experience: '8+ years',
    company: 'Former Apple',
    image: 'https://images.unsplash.com/photo-1517841905240-74f88316b8be?w=600&h=700&fit=crop&crop=face',
    badge: '',
    rating: 5.0,
    students: '1,650',
    bio: 'Aisha Rahman is an award-winning UX designer who shaped the design language of multiple Apple products. She is passionate about human-centered design and accessible user interfaces.',
    bioUz: 'Aisha Rahman bir nechta Apple mahsulotlarining dizayn tilini shakllantirgan mukofot olgan UX dizayner.',
    socials: ['globe', 'monitor'],
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Accessibility'],
    courses: [
      { title: 'Advanced UI/UX Design', duration: '3 Months', level: 'Advanced', students: 750 },
      { title: 'Figma for Beginners', duration: '4 Weeks', level: 'Beginner', students: 900 },
    ],
  },
  {
    id: 7,
    name: 'Marcus Stone',
    specialization: 'iOS/Android Engineer',
    specializationUz: 'Mobil Ilova Muhandisi',
    experience: '9+ years',
    company: 'Former Spotify',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=700&fit=crop&crop=face',
    badge: '',
    rating: 4.8,
    students: '1,100',
    bio: 'Marcus Stone built core features of the Spotify mobile app for over 6 years, specializing in Swift, Kotlin, and cross-platform development with Flutter and React Native.',
    bioUz: 'Marcus Stone 6 yildan ortiq Spotify mobil ilovasining asosiy xususiyatlarini yaratgan Swift va Kotlin mutaxassisi.',
    socials: ['mail', 'monitor'],
    skills: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'Firebase'],
    courses: [
      { title: 'Mobile App Development', duration: '5 Months', level: 'Beginner', students: 680 },
      { title: 'Flutter & Dart Bootcamp', duration: '2 Months', level: 'Intermediate', students: 420 },
    ],
  },
  {
    id: 8,
    name: 'Sophia Lee',
    specialization: 'QA & Testing Lead',
    specializationUz: 'Sifat Nazorati Rahbari',
    experience: '11+ years',
    company: 'Former Microsoft',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=700&fit=crop&crop=face',
    badge: '',
    rating: 4.7,
    students: '980',
    bio: 'Sophia Lee spent 11 years at Microsoft leading QA teams across multiple product lines. She is an expert in test automation, Selenium, and Agile QA methodologies.',
    bioUz: 'Sophia Lee Microsoft\'da 11 yil davomida bir nechta mahsulot liniyalarida QA jamoalarini boshqargan test avtomatizatsiyasi mutaxassisi.',
    socials: ['globe', 'bar'],
    skills: ['Selenium', 'Jest', 'Cypress', 'Postman', 'Agile QA'],
    courses: [
      { title: 'QA Engineering Essentials', duration: '3 Months', level: 'Beginner', students: 580 },
      { title: 'Test Automation with Cypress', duration: '6 Weeks', level: 'Intermediate', students: 400 },
    ],
  },
]

/* ─────────────────────────────────────────
   SOCIAL ICON
───────────────────────────────────────── */
function SocialIcon({ type, size = 'sm' }: { type: string; size?: 'sm' | 'md' }) {
  const base = size === 'md'
    ? 'w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-slate-500 dark:text-slate-400 transition-all cursor-pointer'
    : 'w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-blue-600 cursor-pointer'
  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  if (type === 'mail') return <button className={base}><Mail className={iconSize} /></button>
  if (type === 'monitor') return <button className={base}><Monitor className={iconSize} /></button>
  if (type === 'globe') return <button className={base}><Globe className={iconSize} /></button>
  if (type === 'bar') return <button className={base}><BarChart2 className={iconSize} /></button>
  return null
}

/* ─────────────────────────────────────────
   LEVEL BADGE COLOR
───────────────────────────────────────── */
function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Beginner: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    Intermediate: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    Advanced: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors[level] ?? 'bg-slate-100 text-slate-500'}`}>
      {level}
    </span>
  )
}

/* ─────────────────────────────────────────
   MODAL
───────────────────────────────────────── */
function TeacherModal({ teacher, onClose }: { teacher: typeof teachers[0]; onClose: () => void }) {
  const isUzbek = useIsUzbek()
  const isEnglishTeacher = teacher.specialization.toLowerCase().includes('english')

  // Build stats based on teacher type
  const stats = isEnglishTeacher
    ? [
        { icon: Award, value: teacher.certificate ?? 'IELTS 8.0', label: 'Sertifikat', color: 'text-amber-500' },
        { icon: Users, value: teacher.students, label: 'Talabalar', color: 'text-blue-600' },
        { icon: Clock, value: teacher.experience, label: 'Tajriba', color: 'text-emerald-600' },
      ]
    : [
        { icon: Users, value: teacher.students, label: 'Talabalar', color: 'text-blue-600' },
        { icon: Clock, value: teacher.experience, label: 'Tajriba', color: 'text-emerald-600' },
        { icon: Star, value: teacher.rating, label: 'Reyting', color: 'text-yellow-500' },
      ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden
                   flex flex-col sm:flex-row
                   max-h-[92vh] sm:h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── PHOTO ──
            Mobile: fixed height top banner
            Desktop: 45% width left panel               */}
        <div className="relative shrink-0 h-52 sm:h-auto sm:w-[45%]">
          <img
            src={teacher.image}
            alt={teacher.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

          {/* Name overlay — always at bottom of photo */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            {teacher.badge && (
              <span className="inline-block bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg mb-2 tracking-wider">
                {teacher.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{teacher.name}</h2>
            <p className="text-blue-300 text-sm font-semibold mt-0.5">
              {isUzbek ? teacher.specializationUz : teacher.specialization}
            </p>
            <p className="text-slate-400 text-xs mt-0.5 italic">
              {isUzbek ? teacher.specialization : teacher.specializationUz}
            </p>
          </div>
        </div>

        {/* ── SCROLLABLE RIGHT PANEL ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 min-h-0">

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {stats.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1.5 ${color}`} />
                <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-tight">{value}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Company */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <BriefcaseBusiness className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{teacher.company}</span>
          </div>

          {/* Bio */}
          <div className="mb-5">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2.5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" /> About
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
              {isUzbek ? teacher.bioUz : teacher.bio}
            </p>
            <p className="text-xs text-slate-400 italic leading-relaxed">
              {isUzbek ? teacher.bio : teacher.bioUz}
            </p>
          </div>

          {/* Skills */}
          <div className="mb-5">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" /> Skills / Ko'nikmalar
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <CheckCircle2 className="w-3 h-3" /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div className="mb-5">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" /> Courses / Kurslar
            </h4>
            <div className="space-y-2.5">
              {teacher.courses.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight truncate">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-slate-400">{course.duration}</span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <LevelBadge level={course.level} />
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {course.students.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA only — socials removed */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-blue-500/25">
              <GraduationCap className="w-4 h-4" />
              Kursga yozilish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function TeachersPage() {
  const [selected, setSelected] = useState<typeof teachers[0] | null>(null)
  const isUzbek = useIsUzbek()

  return (
    <>
      <Header />

      {/* Modal */}
      {selected && <TeacherModal teacher={selected} onClose={() => setSelected(null)} />}

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              {isUzbek ? "O'qituvchilar" : 'The Faculty'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              {isUzbek ? "Eng yaxshi mutaxassislardan o'rganing" : (
                <>
                  Learn from the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Best Minds</span>
                  <br />in Modern Tech
                </>
              )}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-3 leading-relaxed">
              {isUzbek
                ? "Bizning o'qituvchilarimiz talabalarni jahon darajasidagi muhandislarga aylantirishga bag'ishlangan tajribali mutaxassislar."
                : 'Our educators are industry veterans from global tech giants, dedicated to transforming students into world-class engineers.'}
            </p>
            <p className="text-slate-400 dark:text-slate-600 max-w-xl mx-auto mb-10 text-sm italic leading-relaxed">
              {isUzbek
                ? "Our educators are industry veterans from global tech giants."
                : "Bizning o'qituvchilarimiz dunyo yetakchi texnologiya kompaniyalaridan kelgan tajribali mutaxassislar."}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
              { icon: Users, label: '50+ Expert Mentors', labelUz: 'Mutaxassis Mentorlar' },
              { icon: Award, label: 'Industry Certified', labelUz: 'Sanoat Sertifikatlangan' },
              { icon: Clock, label: '10+ Years Avg. Exp', labelUz: "O'rtacha Tajriba" },
            ].map(({ icon: Icon, label, labelUz }) => (
                <div key={label} className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-sm">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                      {isUzbek ? labelUz : label}
                    </span>
                    <span className="text-xs text-slate-400 italic">
                      {isUzbek ? label : labelUz}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEACHERS GRID ── */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
              <div>
                <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-1">
                  {isUzbek ? 'Jamoamiz' : 'Our Team'}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  {isUzbek ? "Tavsiya etilgan o'qituvchilar" : 'Featured Instructors'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">
                  {isUzbek
                    ? "Maqsadlaringizga mos mentorlarni toping — Discover mentors who match your goals"
                    : "Mentorlaringizni tanlang — Discover mentors who match your goals"}
                </p>
              </div>
              <p className="text-xs text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl">
                {isUzbek ? "Batafsil ko'rish uchun kartani bosing" : 'Click on a card to view details'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  onClick={() => setSelected(teacher)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
                  style={{ aspectRatio: '3/4' }}
                >
                  {/* Full background image */}
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  />

                  {/* Permanent bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                  {/* Badge top-left */}
                  {teacher.badge && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider z-10">
                      {teacher.badge}
                    </span>
                  )}

                  {/* Bottom info — always visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-black text-white text-sm leading-tight mb-0.5">{teacher.name}</h3>
                    <p className="text-blue-300 text-xs font-semibold mb-2">
                      {isUzbek ? teacher.specializationUz : teacher.specialization}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users className="w-3 h-3" />
                        <span>{teacher.students}</span>
                      </div>
                      <span className="text-xs text-slate-400 italic">{teacher.experience}</span>
                    </div>

                    {/* Hover reveal: company + button */}
                    <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-500 ease-in-out">
                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 italic">{teacher.company}</span>
                        <span className="text-[11px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-lg">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 h-11 px-8 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-600 transition-all">
                {isUzbek ? "Barcha o'qituvchilarni ko'rish" : 'View All Faculty'} ↓
              </Button>
            </div>
          </div>
        </section>

        {/* ── TEACHING PHILOSOPHY ── */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">Our Approach / Yondashuvimiz</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Our Teaching Philosophy</h2>
              <p className="text-slate-400 italic text-sm">O'qitish falsafamiz</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { metric: '1:1', title: 'Personalized Mentorship', titleUz: 'Shaxsiy Mentorlik', desc: 'One-on-one guidance from industry experts tailored to your learning goals and pace.', descUz: 'O\'rganish maqsadlaringiz va sur\'atingizga moslashtirilgan sanoat ekspertlaridan individual ko\'rsatma.' },
                { metric: '100%', title: 'Project-Based Learning', titleUz: 'Loyihaga Asoslangan Ta\'lim', desc: 'Build real-world applications and portfolios that demonstrate your expertise to employers.', descUz: 'Ish beruvchilarga o\'z tajribangizni namoyish etadigan real ilova va portfoliolar yarating.' },
                { metric: '24/7', title: 'Community Support', titleUz: 'Hamjamiyat Qo\'llab-quvvatlash', desc: 'Access to our global alumni network and peer support community round the clock.', descUz: 'Bizning global bitiruvchilar tarmog\'i va tengdoshlar qo\'llab-quvvatlash hamjamiyatiga kechayu kunduz kirish.' },
              ].map((item, idx) => (
                <div key={idx} className="group bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <span className="text-xl font-black text-white">{item.metric}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-0.5">{item.title}</h3>
                  <p className="text-blue-600 text-xs italic font-medium mb-3">{item.titleUz}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-1.5">{item.desc}</p>
                  <p className="text-slate-400 dark:text-slate-600 text-xs italic leading-relaxed">{item.descUz}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Are you a Technical Expert?
            </h2>
            <p className="text-blue-100 text-base italic mb-2">Texnik mutaxassismisiz?</p>
            <p className="text-blue-200/80 mb-10 max-w-xl mx-auto text-sm leading-relaxed">
              We're always looking for passionate industry veterans to join our elite faculty and help shape the next generation of global tech talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white hover:bg-blue-50 text-blue-700 font-black h-13 px-10 rounded-xl shadow-xl transition-all hover:scale-105">
                Apply to Teach / O'qituvchi bo'l
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-10 font-bold rounded-xl backdrop-blur-sm transition-all hover:border-white">
                Refer a Colleague / Hamkasb tavsiya et
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}