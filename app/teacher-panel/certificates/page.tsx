'use client'

import { createClient } from '@supabase/supabase-js'
import {
	Award,
	CheckCircle2,
	Download,
	GraduationCap,
	Loader2,
	Printer,
	Save,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
const MENTOR_ID = process.env.NEXT_PUBLIC_MENTOR_ID || ''

type Group = { id: string; name: string }
type Student = { id: string; first_name: string; last_name: string }
type Certificate = {
	id: string
	certificate_number: string
	student_id: string
	issue_date: string
	full_name_at_issue: string
	course_title_at_issue: string
}

const labelCls =
	'block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5'
const selectCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors'

export default function CertificatesPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [students, setStudents] = useState<Student[]>([])
	const [issuedCerts, setIssuedCerts] = useState<Certificate[]>([])
	const [selectedGroup, setSelectedGroup] = useState('')
	const [selectedStudent, setSelectedStudent] = useState('')
	const [issueDate, setIssueDate] = useState(
		new Date().toISOString().slice(0, 10),
	)
	const [loading, setLoading] = useState(true)
	const [studentsLoading, setStudentsLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)
	const certRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		fetchGroups()
	}, [])
	useEffect(() => {
		if (selectedGroup) fetchStudents(selectedGroup)
	}, [selectedGroup])

	const showToast = (msg: string, type: 'success' | 'error') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	const fetchGroups = async () => {
		setLoading(true)
		const { data } = await supabase
			.from('groups')
			.select('id, name')
			.eq('mentor_id', MENTOR_ID)
		setGroups(data || [])
		const { data: certs } = await supabase
			.from('certificates')
			.select('*')
			.eq('mentor_id', MENTOR_ID)
			.order('issue_date', { ascending: false })
		setIssuedCerts(certs || [])
		setLoading(false)
	}

	const fetchStudents = async (gId: string) => {
		setStudentsLoading(true)
		setSelectedStudent('')
		const { data: en } = await supabase
			.from('group_enrollments')
			.select('student_id')
			.eq('group_id', gId)
		const ids = (en || []).map(e => e.student_id)
		if (!ids.length) {
			setStudents([])
			setStudentsLoading(false)
			return
		}
		const { data } = await supabase
			.from('students')
			.select('id, first_name, last_name')
			.in('id', ids)
			.order('last_name')
		setStudents(data || [])
		setStudentsLoading(false)
	}

	const selectedStudentObj = students.find(s => s.id === selectedStudent)
	const selectedGroupObj = groups.find(g => g.id === selectedGroup)
	const fullName = selectedStudentObj
		? `${selectedStudentObj.last_name} ${selectedStudentObj.first_name}`.trim()
		: ''
	const certNumber = `CERT-${Date.now().toString().slice(-8)}`

	const handleSave = async () => {
		if (!selectedStudent || !selectedGroup) return
		setSaving(true)
		const { error } = await supabase.from('certificates').insert([
			{
				certificate_number: certNumber,
				student_id: selectedStudent,
				group_id: selectedGroup,
				mentor_id: MENTOR_ID,
				issue_date: issueDate,
				full_name_at_issue: fullName,
				course_title_at_issue: selectedGroupObj?.name || '',
			},
		])
		setSaving(false)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast('Sertifikat saqlandi!', 'success')
		fetchGroups()
	}

	const handleDownload = async () => {
		try {
			// @ts-ignore
			const { toPng } = await import('html-to-image')
			if (certRef.current) {
				const dataUrl = await toPng(certRef.current, {
					quality: 0.95,
					pixelRatio: 2,
				})
				const a = document.createElement('a')
				a.href = dataUrl
				a.download = `sertifikat_${fullName.replace(/ /g, '_')}.png`
				a.click()
			}
		} catch {
			window.print()
		}
	}

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 space-y-6 transition-colors duration-300'>
			<style>{`@media print { body > * { display:none!important } #cert-print-area { display:block!important; position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999 } }`}</style>

			{toast && (
				<div
					className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
				>
					{toast.type === 'success' ? (
						<CheckCircle2 className='w-4 h-4' />
					) : (
						<Award className='w-4 h-4' />
					)}
					{toast.msg}
				</div>
			)}

			<div>
				<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
					Sertifikatlar
				</h1>
				<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
					Bitiruvchilarga sertifikat yarating
				</p>
			</div>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Shakl */}
				<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm'>
					<h2 className='font-bold text-slate-900 dark:text-white flex items-center gap-2'>
						<GraduationCap className='w-5 h-5 text-blue-600 dark:text-blue-400' />
						Talabani tanlash
					</h2>
					<div>
						<label className={labelCls}>Guruh</label>
						<select
							className={selectCls}
							value={selectedGroup}
							onChange={e => setSelectedGroup(e.target.value)}
						>
							<option value=''>Guruhni tanlang...</option>
							{groups.map(g => (
								<option key={g.id} value={g.id}>
									{g.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className={labelCls}>Talaba</label>
						<select
							className={selectCls}
							value={selectedStudent}
							onChange={e => setSelectedStudent(e.target.value)}
							disabled={!selectedGroup || studentsLoading}
						>
							<option value=''>
								{studentsLoading ? 'Yuklanmoqda...' : 'Talabani tanlang...'}
							</option>
							{students.map(s => (
								<option key={s.id} value={s.id}>
									{s.last_name} {s.first_name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className={labelCls}>Berilgan sana</label>
						<input
							type='date'
							className={selectCls}
							value={issueDate}
							onChange={e => setIssueDate(e.target.value)}
						/>
					</div>
					{selectedStudent && (
						<div className='flex gap-3 pt-2'>
							<button
								onClick={handleSave}
								disabled={saving}
								className='flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 text-sm font-black transition-all'
							>
								{saving ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Saqlanmoqda...
									</>
								) : (
									<>
										<Save className='w-4 h-4' />
										DB ga saqlash
									</>
								)}
							</button>
							<button
								onClick={handleDownload}
								className='flex items-center gap-2 h-10 px-4 rounded-xl border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors'
							>
								<Download className='w-4 h-4' />
								PNG
							</button>
							<button
								onClick={() => window.print()}
								className='flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors'
							>
								<Printer className='w-4 h-4' />
								Print
							</button>
						</div>
					)}
				</div>

				{/* Preview */}
				<div>
					<h2 className='font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2'>
						<Award className='w-5 h-5 text-amber-500' />
						Sertifikat ko'rinishi
					</h2>
					<div id='cert-print-area' ref={certRef}>
						<CertificatePreview
							fullName={fullName || 'Talaba Ismi Familiyasi'}
							courseName={selectedGroupObj?.name || 'Kurs Nomi'}
							date={issueDate}
							certNumber={certNumber}
						/>
					</div>
				</div>
			</div>

			{/* Berilgan sertifikatlar */}
			{issuedCerts.length > 0 && (
				<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm'>
					<h2 className='font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
						<CheckCircle2 className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
						Berilgan sertifikatlar ({issuedCerts.length})
					</h2>
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-slate-100 dark:border-white/5'>
									{['Sertifikat №', 'Talaba', 'Kurs', 'Sana'].map(h => (
										<th
											key={h}
											className='text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 py-3'
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-100 dark:divide-white/5'>
								{issuedCerts.map(c => (
									<tr
										key={c.id}
										className='hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors'
									>
										<td className='px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400'>
											{c.certificate_number}
										</td>
										<td className='px-4 py-3 text-slate-900 dark:text-white font-semibold text-xs'>
											{c.full_name_at_issue}
										</td>
										<td className='px-4 py-3 text-slate-500 dark:text-slate-400 text-xs'>
											{c.course_title_at_issue}
										</td>
										<td className='px-4 py-3 text-slate-400 dark:text-slate-500 text-xs'>
											{new Date(c.issue_date).toLocaleDateString('uz-UZ')}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	)
}

function CertificatePreview({
	fullName,
	courseName,
	date,
	certNumber,
}: {
	fullName: string
	courseName: string
	date: string
	certNumber: string
}) {
	const formattedDate = new Date(date).toLocaleDateString('uz-UZ', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
	return (
		<div
			style={{
				width: '100%',
				aspectRatio: '1.414',
				background:
					'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
				border: '2px solid rgba(59,130,246,0.3)',
				borderRadius: '16px',
				padding: '40px',
				position: 'relative',
				overflow: 'hidden',
				fontFamily: 'Georgia, serif',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
			}}
		>
			{[
				{ top: 12, left: 12 },
				{ top: 12, right: 12 },
				{ bottom: 12, left: 12 },
				{ bottom: 12, right: 12 },
			].map((pos, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						width: 40,
						height: 40,
						borderTop: i < 2 ? '2px solid rgba(59,130,246,0.5)' : 'none',
						borderBottom: i >= 2 ? '2px solid rgba(59,130,246,0.5)' : 'none',
						borderLeft: [0, 2].includes(i)
							? '2px solid rgba(59,130,246,0.5)'
							: 'none',
						borderRight: [1, 3].includes(i)
							? '2px solid rgba(59,130,246,0.5)'
							: 'none',
						...pos,
					}}
				/>
			))}
			<div
				style={{
					position: 'absolute',
					width: 200,
					height: 200,
					background:
						'radial-gradient(circle, rgba(59,130,246,0.15), transparent)',
					borderRadius: '50%',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					pointerEvents: 'none',
				}}
			/>
			<p
				style={{
					color: '#60a5fa',
					fontSize: '11px',
					letterSpacing: '4px',
					textTransform: 'uppercase',
					marginBottom: '12px',
					fontFamily: 'sans-serif',
				}}
			>
				AL-KHARAZMI ACADEMY
			</p>
			<h1
				style={{
					color: '#f1f5f9',
					fontSize: '28px',
					fontWeight: 'bold',
					letterSpacing: '2px',
					marginBottom: '8px',
					textTransform: 'uppercase',
				}}
			>
				SERTIFIKAT
			</h1>
			<div
				style={{
					width: '60px',
					height: '2px',
					background:
						'linear-gradient(90deg, transparent, #3b82f6, transparent)',
					margin: '0 auto 16px',
				}}
			/>
			<p
				style={{
					color: '#94a3b8',
					fontSize: '12px',
					fontFamily: 'sans-serif',
					marginBottom: '20px',
				}}
			>
				Ushbu sertifikat quyidagi shaxsga beriladi
			</p>
			<h2
				style={{
					color: '#f8fafc',
					fontSize: '26px',
					fontWeight: 'bold',
					borderBottom: '1px solid rgba(59,130,246,0.4)',
					paddingBottom: '8px',
					marginBottom: '16px',
					minWidth: '280px',
				}}
			>
				{fullName}
			</h2>
			<p
				style={{
					color: '#94a3b8',
					fontSize: '12px',
					fontFamily: 'sans-serif',
					marginBottom: '6px',
				}}
			>
				quyidagi kursni muvaffaqiyatli tamomladi:
			</p>
			<p
				style={{
					color: '#60a5fa',
					fontSize: '18px',
					fontWeight: 'bold',
					marginBottom: '24px',
				}}
			>
				«{courseName}»
			</p>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
					marginTop: 'auto',
					paddingTop: '16px',
					borderTop: '1px solid rgba(255,255,255,0.05)',
				}}
			>
				<div style={{ textAlign: 'left' }}>
					<p
						style={{
							color: '#475569',
							fontSize: '10px',
							fontFamily: 'sans-serif',
							textTransform: 'uppercase',
							letterSpacing: '1px',
						}}
					>
						Berilgan sana
					</p>
					<p
						style={{
							color: '#94a3b8',
							fontSize: '12px',
							fontFamily: 'sans-serif',
							marginTop: '2px',
						}}
					>
						{formattedDate}
					</p>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div
						style={{
							width: '48px',
							height: '48px',
							borderRadius: '50%',
							background: 'rgba(59,130,246,0.1)',
							border: '2px solid rgba(59,130,246,0.3)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							margin: '0 auto',
						}}
					>
						<span style={{ color: '#60a5fa', fontSize: '18px' }}>✦</span>
					</div>
				</div>
				<div style={{ textAlign: 'right' }}>
					<p
						style={{
							color: '#475569',
							fontSize: '10px',
							fontFamily: 'sans-serif',
							textTransform: 'uppercase',
							letterSpacing: '1px',
						}}
					>
						Sertifikat №
					</p>
					<p
						style={{
							color: '#94a3b8',
							fontSize: '11px',
							fontFamily: 'monospace',
							marginTop: '2px',
						}}
					>
						{certNumber}
					</p>
				</div>
			</div>
		</div>
	)
}
