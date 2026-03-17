/**
 * Google Sheets API integration
 * Sends student data to Google Sheets via webhook or API
 */

interface StudentRecord {
	full_name: string
	father_name: string
	phone: string
	email: string
	certificate_id?: string
	created_at?: string
}

/**
 * Send student registration data to Google Sheets
 * Can be configured to use webhook URL or direct API integration
 */
export async function sendToGoogleSheets(
	data: StudentRecord,
): Promise<{ success: boolean; message: string }> {
	try {
		// Option 1: Using Google Apps Script Web App (recommended)
		const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK

		if (!webhookUrl) {
			console.warn('Google Sheets webhook URL not configured')
			return {
				success: false,
				message: 'Google Sheets integration not configured',
			}
		}

		// Prepare data for Google Sheets
		const payload = {
			full_name: data.full_name,
			father_name: data.father_name,
			phone: data.phone,
			email: data.email,
			certificate_id: data.certificate_id || '',
			created_at: new Date().toISOString(),
		}

		// Send to Google Sheets via webhook
		const response = await fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})

		if (!response.ok) {
			throw new Error(`Google Sheets API error: ${response.statusText}`)
		}

		return {
			success: true,
			message: 'Data successfully sent to Google Sheets',
		}
	} catch (error) {
		console.error('Error sending to Google Sheets:', error)
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to send data to Google Sheets',
		}
	}
}

/**
 * Batch send multiple student records to Google Sheets
 */
export async function sendBatchToGoogleSheets(
	records: StudentRecord[],
): Promise<{ success: boolean; message: string }> {
	try {
		const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK

		if (!webhookUrl) {
			return {
				success: false,
				message: 'Google Sheets integration not configured',
			}
		}

		const payload = {
			records: records.map(record => ({
				full_name: record.full_name,
				father_name: record.father_name,
				phone: record.phone,
				email: record.email,
				certificate_id: record.certificate_id || '',
				created_at: new Date().toISOString(),
			})),
		}

		const response = await fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})

		if (!response.ok) {
			throw new Error(`Google Sheets API error: ${response.statusText}`)
		}

		return {
			success: true,
			message: `${records.length} records sent to Google Sheets`,
		}
	} catch (error) {
		console.error('Error sending batch to Google Sheets:', error)
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to send batch data to Google Sheets',
		}
	}
}
