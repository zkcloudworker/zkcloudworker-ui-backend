const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.getWorkers = getWorkers;

async function getWorkers(params, user) {
  const { developer, repos } = params;

  console.log("repos: ", repos);

  let query = "";
  let queryParams = {};

  if (developer) {
    // SQL-like query to select workers of a given developer
    query = `SELECT * FROM "workers" WHERE "developer" = ?`;
    queryParams = {
      Statement: query,
      Parameters: [{
        S: developer
      }]
    };
  }

  if (repos) {
    // SQL-like query to select any worker that belong in a set of repos
    query = `SELECT * FROM "workers" WHERE "repo" IN [${repos.map((t) => `'${t}'`).join(',')}]`;
    queryParams = {
      Statement: query
    };
  }
  
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