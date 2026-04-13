import axios from "axios";

const idapi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_IDEALISTA_API_URL}`,
    headers: {
        'Accept': 'application/json',
    }
});

export default idapi;