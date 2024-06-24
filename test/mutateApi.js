require('dotenv').config();
const axios = require('axios');

const apiEndpoint = process.env.API_ENDPOINT;
const apiKey = process.env.API_KEY; 

const rpcMethod = "signup";
const rpcParams = "{\"id\":\"A035\",\"signed\":\"---\"}"
// {
//   "id": "A01zt",
//   "signed": ""
//   // "id": "B62qnZe9mnp5uJxiWMwV4x8dP77i3CN9CjsQ5JYXfFYdPtaaEbVbyzt",
//   // "signed": "{\"signature\":{\"field\":\"19266631227557172042491562137955761611505978077423377669721106953247419520383\",\"scalar\":\"15422344447067158860266382695408341511076088926400773636333071156786819219365\"},\"publicKey\":\"B62qnZe9mnp5uJxiWMwV4x8dP77i3CN9CjsQ5JYXfFYdPtaaEbVbyzt\",\"data\":\"{\\\"id\\\":\\\"B62qnZe9mnp5uJxiWMwV4x8dP77i3CN9CjsQ5JYXfFYdPtaaEbVbyzt\\\"}\"}"
// }

const sessionJWT = "ANYSESSIONJWT";
const mutateUrl = `${apiEndpoint}/mutations/${rpcMethod}`;

const mutateApi = async () => {
    try {
        console.log('Mutate url:', mutateUrl);
        const response = await axios.post(mutateUrl, rpcParams, {
            headers: {
              'Content-Type': 'application/json', // ensure request sent as JSON
              'x-api-key': apiKey, // AWS API key
            }
        });
        console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error mutate API:', error.response ? error.response.data : error.message);
    }
};

mutateApi();
