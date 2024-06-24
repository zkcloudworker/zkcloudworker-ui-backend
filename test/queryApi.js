require('dotenv').config();
const axios = require('axios');

const apiEndpoint = process.env.API_ENDPOINT;
const apiKey = process.env.API_KEY; 

const rpcMethod = "get_accounts";
const rpcParams = {
  "params": "{\"id\": \"B62qpbqLB1pabZUu4oaDKFmv72DtHWnFxGK8aucNZHxS1cDmmsrrpVp\"}"
}
const sessionJWT = "ANYSESSIONJWT";
const queryUrl = `${apiEndpoint}/queries/${rpcMethod}`;

const queryApi = async () => {
    try {
        console.log('Query url:', queryUrl);
        const response = await axios.get(queryUrl, {
            params: rpcParams,
            headers: {
              'Content-Type': 'application/json', // ensure request sent as JSON
              'x-api-key': apiKey, // AWS API key
              'x-JWT': sessionJWT  // the App session JWToken            
            }
        });
        console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error querying API:', error.response ? error.response.data : error.message);
    }
};


function tryFetch() {
    const endpoint = "https://w0559i4260.execute-api.eu-west-1.amazonaws.com/dev/queries/get_accounts";
    const apikey = "TPhXowXC7A1g5yQLjpIOP1lBXNZnsPOYsulnwZ9a"
    const qparams = { params: '{"id":"B62qpbqLB1pabZUu4oaDKFmv72DtHWnFxGK8aucNZHxS1cDmmsrrpVp"}' };
    const baseUrl = endpoint; // Replace with your URL
    const params = new URLSearchParams(qparams).toString();
    const url = `${baseUrl}?${params}`;
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apikey 
    };

    fetch(url, {
        method: 'GET', // Change to 'POST' or other methods as needed
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
          // console.log(error);
          throw new Error('Network response was not ok', response);
        }
        return response.json();
    })
    .then(data => {
      console.log("tryFetch ", JSON.stringify(data, null, 2));
    })
    .catch(error => {
      console.log(error);
    });
}

queryApi();
//tryFetch();
