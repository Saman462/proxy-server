import fetch from 'node-fetch'; // Ensure you have 'node-fetch' installed

export default async (req, res) => {
    try {
        // Fetch data from your backend server
        const response = await fetch('http://10.5.5.9:8080/gopro/camera/state');
        const data = await response.json();

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', 'https://gopro-app.vercel.app');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Send the response back to the client
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

