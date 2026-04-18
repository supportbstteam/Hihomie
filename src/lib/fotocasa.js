import fotoapi from '@/lib/api/fotoapi';

export async function createPropertyOnFotocasa(propertyData) {
    const response = await fotoapi.post('/api/property', propertyData, {
        headers: {
            'Api-Key': process.env.FOTOCASA_API_KEY,
            'Content-Type': 'application/json'
        }
    });

    console.log("response",response.data);

    return response.data;
}