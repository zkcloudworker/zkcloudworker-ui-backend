const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.getAccounts = getAccounts;

async function getAccounts(params, user) {
  const { id } = params;

  // SQL-like query to select accounts using its id
  const query = `SELECT * FROM "accounts" WHERE "id" = ?`;
  const queryParams = {
    Statement: query,
    Parameters: [{
        S: id
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