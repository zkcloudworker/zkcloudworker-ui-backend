const AWS = require('aws-sdk');
const { signUp, updateAccount } = require('./resources/accounts.js');

/**
 * Call the corresponding query method using its name and provided params.
 * @param name string 
 * @param data {*}
 * @param JWT string 
 * @returns { success: true | false, data: any | null, error: any | null }
 */
async function callMethod(name, data, JWT) {
  const user = { uid: '1234' }; // must ne extracted from JWT
  switch (name) {
    case 'signup': return await signUp(data, user); break;
    case 'update_account': return await updateAccount(data, user); break;
  }
  return { success: false, data: null, error: `Unknown method ${name}` }
}


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`\nevent: ${JSON.stringify(event, null, 2)}`);

    let rpcMethod = event.pathParameters?.proxy || null;
    let rpcParams = JSON.parse(event.queryStringParameters?.params || "{}");
    let rpcBody = typeof(event.body) === 'string' 
      ? JSON.parse(event.body) 
      : event.body || {};
    let rpcJWT = '';//event.headers['x-JWT'] || null;

    let response = await callMethod(rpcMethod, rpcBody, rpcJWT);
    console.log("\nresponse: ", JSON.stringify(response, null, 2));

    return {
        statusCode: response.success ? 200 : 500,
         // enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        body: JSON.stringify({
          "success": response.success,
          "data": response.data,
          "error": response.error
        }, null, 2),
    };
};
