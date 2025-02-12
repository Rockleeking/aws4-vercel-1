const aws4 = require('aws4');
const { URL } = require('url');

module.exports = async (req, res) => {
    // Ensure only POST requests are allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Parse the request body
        const { accessKey, secretKey, region, httpMethod, url, body } = req.body;

        // Validate input
        if (!accessKey || !secretKey || !region || !httpMethod || !url) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Parse the URL
        const parsedUrl = new URL(url);

        // Create the request options
        const opts = {
            host: parsedUrl.hostname,
            path: parsedUrl.pathname,
            method: httpMethod,
            service: 'execute-api', // or the appropriate AWS service
            region: region,
            body: body
        };

        // Sign the request
        const signedRequest = aws4.sign(opts, { accessKeyId: accessKey, secretAccessKey: secretKey });

        // Return the signed headers
        res.status(200).json(signedRequest.headers);
    } catch (error) {
        console.error('Error generating AWS4 signature:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
