const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const tableName = 'workers'; // Replace with your existing table name

    const params = {
        TableName: tableName,
        KeyConditionExpression: '#developer = :developer',
        ExpressionAttributeNames: {
            '#developer': 'developer'
        },
        ExpressionAttributeValues: {
            ':developer': 'MAZ'
        }        
        // ExpressionAttributeNames: {
        //     '#key': 'PrimaryKey' // Replace with your table's primary key attribute name
        // },
        // ExpressionAttributeValues: {
        //     ':value': event.queryStringParameters.key // Replace with appropriate value
        // }
    };

    let response;
    try {
        const data = await docClient.query(params).promise();
        response = {
            statusCode: 200,
            //  Uncommented below to enable CORS requests
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
