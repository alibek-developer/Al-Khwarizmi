export const CONTACT_PHONE = "+998 90 123 45 67"
export const CONTACT_EMAIL = "info@alkhorazmiy.uz"

export const INPUT_CLS =
  'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'

export const LABEL_CLS =
  'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'

export const COLORS = [
  'from-blue-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-amber-500 to-orange-600',
]

export const STATUS_MAP = {
  active: {
    label: 'Faol',
    cls: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    icon: 'CheckCircle2',
  },
  pending: {
    label: 'Kutilmoqda',
    cls: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
    icon: 'Clock',
  },
  inactive: {
    label: 'Nofaol',
    cls: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
    icon: 'AlertCircle',
  },
} as const

export const UZ_MONTHS = ['Y','F','M','A','M','I','I','A','S','O','N','D']

export const WEEK_DAYS = [
  { value: 'dushanba', label: 'Dushanba' },
  { value: 'seshanba', label: 'Seshanba' },
  { value: 'chorshanba', label: 'Chorshanba' },
  { value: 'payshanba', label: 'Payshanba' },
  { value: 'juma', label: 'Juma' },
  { value: 'shanba', label: 'Shanba' },
  { value: 'yakshanba', label: 'Yakshanba' },
]

export const DURATION_TYPES = [
  { value: 'oy', label: 'Oy' },
  { value: 'hafta', label: 'Hafta' },
  { value: 'kun', label: 'Kun' },
]
