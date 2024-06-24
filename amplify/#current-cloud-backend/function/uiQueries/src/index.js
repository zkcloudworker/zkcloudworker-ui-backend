const AWS = require('aws-sdk');
const { getWorkers } = require('./resources/workers.js');
const { getAccounts } = require('./resources/accounts.js');

/**
 * Call the corresponding query method using its name and provided params.
 * @param name string 
 * @param params {*}
 * @param JWT string 
 * @returns { success: true | false, data: any | null, error: any | null }
 */
async function callMethod(name, params, JWT) {
  const user = { uid: '1234' }; // must ne extracted from JWT
  switch (name) {
    case 'get_workers': return await getWorkers(params, user); break;
    case 'get_accounts': return await getAccounts(params, user); break;
  }
}


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`\nevent: ${JSON.stringify(event, null, 2)}`);

    let rpcMethod = event.pathParameters?.proxy || null;
    let rpcParams = JSON.parse(event.queryStringParameters?.params || "{}");
    let rpcJWT = ''; // event.headers['x-JWT'] || null;

    let response = await callMethod(rpcMethod, rpcParams, rpcJWT);
    /*
    let response = { 
      data: { status: "Query Done", "rpcParams": rpcParams },
      error: null,
      success: true
    };
    */ 
    
    console.log("\nresponse: ", JSON.stringify(response, null, 2));

    return {
        statusCode: response.success ? 200 : 500,
         // enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET, OPTION"
        },
        body: JSON.stringify({
          "success": response.success,
          "data": response.data,
          "error": response.error
        }, null, 2),
    };
};
