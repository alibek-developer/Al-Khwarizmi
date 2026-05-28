'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code,
  Globe,
  GraduationCap,
  Laptop,
  MapPin,
  Rocket,
  Shield,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const stats = [
  { number: '2+', key: 'stat_1_label' },
  { number: '500+', key: 'stat_2_label' },
  { number: '3', key: 'stat_3_label' },
  { number: '98%', key: 'stat_4_label' },
]

const programs = [
  { icon: Globe, color: 'bg-blue-600', key: '1' },
  { icon: Code, color: 'bg-indigo-600', key: '2' },
  { icon: Laptop, color: 'bg-cyan-600', key: '3' },
]

const roadmap = [
  { year: '2023', done: true, key: '1' },
  { year: '2024', done: true, key: '2' },
  { year: '2025', done: false, key: '3' },
  { year: '2026', done: false, key: '4' },
]

const values = [
  { icon: Star, key: '1' },
  { icon: Users, key: '2' },
  { icon: Shield, key: '3' },
  { icon: Rocket, key: '4' },
]

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function AboutPage() {
  const t = useTranslations('about')
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-slate-950">
          {/* Grid bg */}
          <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
            style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

          {/* Orbs */}
          <div className="absolute top-1/3 right-0 w-[700px] h-[700px] rounded-full bg-blue-400/8 dark:bg-blue-500/8 blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-32 left-0 w-[500px] h-[500px] rounded-full bg-cyan-400/8 dark:bg-cyan-500/8 blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left */}
              <div>
                {/* Location pill */}
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  {t('hero_location')}
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.02] tracking-tight">
                  {t('hero_heading')}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                    AL-Khorazmiy
                  </span>
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-lg mb-10 leading-relaxed max-w-lg">
                  {t('hero_sub')}
                </p>

                {/* Quick facts */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {[
                    { icon: Calendar, key: 'hero_fact_1' },
                    { icon: MapPin, key: 'hero_fact_2' },
                    { icon: GraduationCap, key: 'hero_fact_3' },
                  ].map(({ icon: Icon, key }) => (
                    <div key={key} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Icon className="w-3.5 h-3.5 text-blue-600" />
                      {t(key)}
                    </div>
                  ))}
                </div>

                <a href="/courses" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
                  {t('hero_cta')} <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right — stacked image cards */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" alt="Students" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-36 shadow-lg">
                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop" alt="Coding" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden h-36 shadow-lg">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop" alt="Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                    <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop" alt="Classroom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>

                {/* Floating stat card */}
                <div className="col-span-2 flex justify-center -mt-4">
                  <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 shadow-xl">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900 dark:text-white">{t('stat_1_label')}</div>
                      <div className="text-xs text-slate-400">{t('stat_2_label')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STATS
        ══════════════════════════════════════ */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black text-blue-600 mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t(stat.key)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            ABOUT THE PROJECT
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left text */}
              <div>
                <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-4">
                  {t('our_story_label')}
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                  {t('our_story_heading_1')}
                  <br />
                  <span className="text-slate-400 dark:text-slate-600 font-light">
                    {t('our_story_heading_2')}
                  </span>
                </h2>

                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  <p>{t('our_story_p1')}</p>
                  <p>{t('our_story_p2')}</p>
                </div>

                {/* Checklist */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    '2+ yillik tajriba',
                    'Shovotda joylashgan',
                    '500+ talaba',
                    '3 ta asosiy dastur',
                    'Ingliz tili kurslari',
                    'IT & Dasturlash',
                    'Kompyuter savodxonligi',
                    'IT-Park hamkorlik',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — location card */}
              <div className="space-y-5">
                {/* Map placeholder */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-64">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&h=400&fit=crop"
                    alt="Xorazm region"
                    className="w-full h-full object-cover opacity-60 dark:opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-5 flex items-center gap-4 border border-slate-100 dark:border-slate-700">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-base">{t('hero_location')}</p>
                        <p className="text-sm text-blue-600 font-medium">{t('hero_location')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partnership badge */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <GraduationCap className="w-6 h-6 text-blue-200" />
                    <span className="text-xs font-black tracking-widest uppercase text-blue-200">Official Partnership</span>
                  </div>
                  <h3 className="text-xl font-black mb-1">IT-Park Uzbekistan</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Proud partner of IT-Park Uzbekistan — bringing nationally recognized certification and resources to the Khorezm region.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROGRAMS
        ══════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">
                {t('programs_label')}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {t('programs_heading')}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {programs.map((prog, idx) => {
                const Icon = prog.icon
                return (
                  <div key={idx} className="group bg-white dark:bg-slate-800 rounded-2xl p-7 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                    <div className={`w-13 h-13 ${prog.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2 block">{t('program_' + prog.key + '_tag')}</span>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg mb-3">
                      {t('program_' + prog.key + '_title')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {t('program_' + prog.key + '_desc')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            ROADMAP / TIMELINE
        ══════════════════════════════════════ */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">
                {t('roadmap_label')}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {t('roadmap_heading')}
              </h2>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600 via-blue-400 to-slate-200 dark:to-slate-800" />

              <div className="space-y-8">
                {roadmap.map((item, idx) => (
                  <div key={idx} className={`relative flex items-start gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                    {/* Dot */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-lg border-4 ${
                        item.done
                          ? 'bg-blue-600 text-white border-blue-100 dark:border-blue-900'
                          : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {item.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                    </div>

                    {/* Spacer left on mobile */}
                    <div className="w-16 shrink-0 md:hidden" />

                    {/* Content */}
                    <div className={`flex-1 ${idx % 2 === 1 ? 'md:text-right md:pr-16' : 'md:pl-16'} pb-2`}>
                      <div className={`inline-block bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                        item.done
                          ? 'border-blue-100 dark:border-blue-900/50 hover:border-blue-200 dark:hover:border-blue-800'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">{item.year}</span>
                          <span className={`text-[10px] font-black tracking-widest uppercase ${item.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {t(item.done ? 'completed' : 'upcoming')}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white mb-3">
                          {t('roadmap_' + item.key + '_title')}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs">
                          {t('roadmap_' + item.key + '_desc')}
                        </p>
                      </div>
                    </div>

                    {/* Spacer right */}
                    {idx % 2 === 0 && <div className="hidden md:block flex-1" />}
                    {idx % 2 === 1 && <div className="hidden md:block flex-1" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            VALUES
        ══════════════════════════════════════ */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">
                {t('values_label')}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {t('values_heading')}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((val, idx) => {
                const Icon = val.icon
                return (
                  <div key={idx} className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    {/* Number watermark */}
                    <div className="absolute top-3 right-4 text-6xl font-black text-slate-50 dark:text-slate-700/50 select-none leading-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white mb-3">
                      {t('value_' + val.key + '_title')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {t('value_' + val.key + '_desc')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            METHODOLOGY
        ══════════════════════════════════════ */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <p className="text-blue-200 text-xs font-black tracking-widest uppercase mb-4">
                  {t('methodology_label')}
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-10 leading-tight">
                  {t('methodology_heading')}
                  <br />
                  <span className="text-blue-200 font-light">
                    {t('methodology_sub')}
                  </span>
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: BookOpen, key: '1' },
                    { icon: Users, key: '2' },
                    { icon: TrendingUp, key: '3' },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-11 h-11 bg-white/10 group-hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-black text-white mb-3">
                            {t('methodology_' + item.key + '_title')}
                          </h4>
                          <p className="text-blue-100/70 text-sm leading-relaxed">
                            {t('methodology_' + item.key + '_desc')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right — image + badge */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&h=500&fit=crop"
                    alt="Learning environment"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
                {/* Floating success badge */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 rounded-2xl px-6 py-4 shadow-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">{t('stat_4_label')}</p>
                  <p className="text-4xl font-black text-blue-600">98%</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t('stat_2_label')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA
        ══════════════════════════════════════ */}
        <section className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-black text-lg tracking-tight">{t('cta_academy_name')}</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 leading-tight">
                  {t('cta_heading')}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed mb-3">
                  {t('cta_sub')}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8">
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Foydali havolalar</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Bizning tariximiz', href: '#' },
                    { label: 'Karyera markazi', href: '/courses' },
                    { label: 'Hamkorlik dasturi', href: '/contact' },
                    { label: "O'qituvchilar", href: '/teachers' },
                    { label: 'Kurslar', href: '/courses' },
                    { label: 'Aloqa', href: '/contact' },
                  ].map((item) => (
                    <a key={item.label} href={item.href} className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-transform shrink-0" />
                      {item.label}
                    </a>
                  ))}
                </div>

                {/* Contact quick */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {t('hero_location')}
                  </div>
                  <a href="/contact" className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3 rounded-xl transition-all hover:scale-[1.02]">
                    Biz bilan bog'laning <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
