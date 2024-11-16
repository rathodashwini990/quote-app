import axios from 'axios';

const BASE_URL = 'https://assignment.stage.crafto.app';

// Login API
export const login = async (username, otp) => {
    const response = await axios.post(`${BASE_URL}/login`, {
        username,
        otp,
    });
    return response.data.token; // Return token from response
};

// Fetch Quotes API
export const getQuotes = async (token, limit = 20, offset = 0) => {
    const response = await axios.get(`${BASE_URL}/getQuotes?limit=${limit}&offset=${offset}`, {
        headers: {
            Authorization: token,
        },
    });
    return response.data;  // Assuming response structure { data: [...] }
};

// Upload Media API
export const uploadMedia = async (file) => {
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
        'https://crafto.app/crafto/v1.0/media/assignment/upload',
        formData
    );
    console.log(response.data); // Add this in uploadMedia function

    return response.data.mediaUrl;
};

// Post Quote API
export const createQuote = async (token, text, mediaUrl) => {
    const response = await axios.post(
        `${BASE_URL}/postQuote`,
        { text, mediaUrl },
        {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
};