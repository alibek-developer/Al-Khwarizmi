'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Eski /admin/login URL'ini /login ga yo'naltiradi
export default function AdminLoginRedirect() {
	const router = useRouter()

	useEffect(() => {
		router.replace('/login')
	}, [router])

	return null
}
