import axios from "axios";

const fotoapi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_FOTOCASA_API_URL}`,
    headers: {
        'Accept': 'application/json',
    }
});

export default fotoapi;