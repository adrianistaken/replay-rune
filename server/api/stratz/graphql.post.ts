export default defineEventHandler(async (event) => {
    console.log('STRATZ Proxy: Request received')
    const body = await readBody(event)
    console.log('STRATZ Proxy: Request body:', body)

    // Get the STRATZ API token from runtime config
    const config = useRuntimeConfig()
    const apiToken = config.stratzApiToken
    console.log('STRATZ Proxy: API token available:', !!apiToken)

    if (!apiToken) {
        console.error('STRATZ Proxy: No API token found in environment variables')
        throw createError({
            statusCode: 500,
            statusMessage: 'STRATZ API token not configured. Please add STRATZ_API_TOKEN to your .env file.'
        })
    }

    try {
        console.log('STRATZ Proxy: Forwarding request to STRATZ API...')
        // Forward the GraphQL request to STRATZ API
        const response = await fetch('https://api.stratz.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'STRATZ_API',
                'Authorization': `Bearer ${apiToken}`,
                'GraphQL-Require-Preflight': 'true'
            },
            body: JSON.stringify(body)
        })

        console.log('STRATZ Proxy: STRATZ API response status:', response.status)

        if (!response.ok) {
            console.error('STRATZ Proxy: STRATZ API error:', response.status, response.statusText)
            throw createError({
                statusCode: response.status,
                statusMessage: `STRATZ API error: ${response.statusText}`
            })
        }

        const data = await response.json()
        console.log('STRATZ Proxy: STRATZ API response data received')
        return data
    } catch (error) {
        console.error('Error proxying STRATZ GraphQL request:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch data from STRATZ API'
        })
    }
}) 