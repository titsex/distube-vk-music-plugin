import { afterEach } from 'vitest'

// In order not to catch the Rate Limit, we make a delay after each test!
afterEach(async () => {
	await new Promise((resolve) => setTimeout(resolve, 500))
})
