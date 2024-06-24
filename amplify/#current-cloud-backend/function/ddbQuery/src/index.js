const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

/*
Example query params:
- queryString: table=workers&key=developer&value=MAZ
- queryString: table=deployers&scan=chain&value=zeko
*/

/** @type {import('@types/aws-lambda').APIGatewayProxyHandler} */
exports.handler = async (event) => {
    console.log(`\nEvent: ${JSON.stringify(event)}`);
    const { table, key, scan, value } = event.queryStringParameters;

    let filterParams = {};

    if (key) filterParams = {
      KeyConditionExpression: `#${key} = :${key}`,
      ExpressionAttributeNames: JSON.parse(`{ "#${key}": "${key}" }`),
      ExpressionAttributeValues: JSON.parse(`{ ":${key}": "${value}" }`)        
    };

    if (scan && value !== '*') filterParams = {
      FilterExpression: `#${scan} = :${scan}`,
      ExpressionAttributeNames: JSON.parse(`{ "#${scan}": "${scan}" }`),
      ExpressionAttributeValues: JSON.parse(`{ ":${scan}": "${value}" }`)        
    } 

    const params = {
        TableName: `${table}`, 
        ...filterParams
    };
    console.log("\nQuery params: ", JSON.stringify(params, null, 2));

    
    let response;
    try {
        // use 'scan' for all cases to filter by 'column = value'
        let data = await docClient.scan(params).promise();  

        response = {
            statusCode: 200,
            // enable CORS requests
             headers: {
                 "Access-Control-Allow-Origin": "*",
                 "Access-Control-Allow-Headers": "*"
             },
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        response = {
            statusCode: 500,
            body: JSON.stringify(error)
        };
    }

    return response;
};
