import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Encode credentials correctly using Buffer
        // const credentials = Buffer.from('info@hihomie.es:Myhomie').toString('base64');
        // const credentials = Buffer.from('testDocu:dc4haw4JmASg2CZG').toString('base64');
        // const credentials = Buffer.from('betasofttechnology:RfOx54gNq67ONqXxHkJwb6tXAdFMMb15').toString('base64');
        const credentials = Buffer.from('betasofttechnology:qsmxeQGKLSkQQikDUb63v4gBNat8xOne').toString('base64');

        // 2. Idealista OAuth usually requires the grant_type in the BODY, not just the URL
        const details = {
            'grant_type': 'client_credentials',
            'scope': 'read'
        };

        const formBody = Object.keys(details)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
            .join('&');

        const response = await fetch('https://partners-sandbox.idealista.com/oauth/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            body: formBody,
        });

        console.log('Idealista Response Status:', response);

        if (!response.ok) {
            const errorText = await response.text();
            // console.error('Idealista Error Body:', errorText);
            return NextResponse.json(
                { error: 'Idealista denied access', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}