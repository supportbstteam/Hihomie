import idapi from '@/lib/api/idapi';
import qs from 'qs';

export async function getIdealistaToken() {
    const credentials = Buffer.from(
        `${process.env.IDEALISTA_CLIENT_ID}:${process.env.IDEALISTA_CLIENT_SECRET}`
    ).toString('base64');

    const response = await idapi.post('/oauth/token', 
        qs.stringify({
            'grant_type': 'client_credentials',
            'scope': 'read' // or 'write' depending on your API permissions
        }), 
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    return response.data.access_token;
}

/**
 * Main function to sync property
 */
export async function createPropertyOnIdealista(propertyData) {
    const token = await getIdealistaToken();

    // Apply token to this specific request
    const response = await idapi.post('/v1/properties', propertyData, {
        headers: {
            // 'feedKey': process.env.IDEALISTA_FEED_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}