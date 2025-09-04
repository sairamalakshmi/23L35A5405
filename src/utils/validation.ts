import { z } from 'zod'

export const urlSchema = z.string().url({ message: 'Enter a valid URL' })

export const minutesSchema = z
	.string()
	.transform(v => (v.trim() === '' ? '30' : v))
	.refine(v => /^\d+$/.test(v), { message: 'Minutes must be an integer' })
	.transform(v => Number(v))
	.refine(v => v > 0 && v <= 60 * 24 * 365, { message: 'Minutes out of range' })

export const codeSchema = z
	.string()
	.optional()
	.transform(v => (v?.trim() ? v.trim() : undefined))
	.refine(v => (v ? /^[a-zA-Z0-9_-]{3,20}$/.test(v) : true), {
		message: 'Code must be 3-20 chars, alnum/underscore/hyphen'
	}) 