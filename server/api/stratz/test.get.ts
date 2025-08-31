export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiToken = config.stratzApiToken

    console.log('STRATZ Test: Checking configuration...')
    console.log('STRATZ Test: API token available:', !!apiToken)

    if (!apiToken) {
        return {
            status: 'error',
            message: 'STRATZ API token not configured',
            tokenAvailable: false
        }
    }

    try {
        // Test with the exact query format that works in Postman
        const testQuery = `{ match(id: 8437201902) { id didRadiantWin durationSeconds players { hero { id displayName } kills deaths assists } } }`

        console.log('STRATZ Test: Making test API call...')
        const response = await fetch('https://api.stratz.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'STRATZ_API',
                'Authorization': `Bearer ${apiToken}`,
                'GraphQL-Require-Preflight': 'true'
            },
            body: JSON.stringify({ query: testQuery })
        })

        console.log('STRATZ Test: Response status:', response.status)

        if (!response.ok) {
            return {
                status: 'error',
                message: `STRATZ API error: ${response.status} ${response.statusText}`,
                tokenAvailable: true,
                responseStatus: response.status
            }
        }

        const data = await response.json()
        console.log('STRATZ Test: Response received successfully')

        return {
            status: 'success',
            message: 'STRATZ API is working correctly',
            tokenAvailable: true,
            heroCount: data.data?.constants?.heroConstants?.length || 0
        }

    } catch (error) {
        console.error('STRATZ Test: Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return {
            status: 'error',
            message: `Test failed: ${errorMessage}`,
            tokenAvailable: true,
            error: errorMessage
        }
    }
}) 