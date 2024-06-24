const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.getWorkers = getWorkers;

async function getWorkers(params, user) {
  const { developer } = params;

  // SQL-like query to select all developers
  const query = `SELECT * FROM "workers" WHERE "developer" = ?`;
  const queryParams = {
    Statement: query,
    Parameters: [{
        S: developer
      } // Replace with your developer value
    ]
  };

  try {
    const data = await dynamodb.executeStatement(queryParams).promise();
    return {
      success: true,
      data: data.Items.map(AWS.DynamoDB.Converter.unmarshall),
      error: null
    };
  } 
  catch (error) {
    console.error('Error executing PartiQL query:', error);
    return {
      success: false,
      error: JSON.stringify({
        message: 'Error executing PartiQL query',
        error
      }),
      data: null
    };
  }
};