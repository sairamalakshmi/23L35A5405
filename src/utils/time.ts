export function addMinutesIso(dateIso: string, minutes: number): string {
	const d = new Date(dateIso)
	d.setMinutes(d.getMinutes() + minutes)
	return d.toISOString()
}

export function isExpired(expiresAtIso: string): boolean {
	return new Date(expiresAtIso).getTime() <= Date.now()
} 