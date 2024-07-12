// Load the AWS SDK
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1'
});

exports.signUp = signUp;
exports.updateAccount = updateAccount;

async function signUp(params, user) {
  const putParams = {
      TableName: 'accounts',
      Item: {
          id: params.id,
          alias: 'Update profile',
          email: '',
          fullName: 'No Name',
          preferences: '{}',
          discord: params.discord || '',
          JWT: params.JWT || ''
      }
  };
  console.log("signUp putParams: ", putParams);

  // Ensure id is provided and not empty
  if (!params.id) {
    return {
        success: false,
        data: null,
        error: JSON.stringify({
            message: 'Invalid input',
            error: 'The id parameter is required.'
        }),
    };
  }  

  // insert it now
  try {
    // check if it exists first
    const getParams = {
      TableName: 'accounts',
      Key: { id: params.id }
    };
    let before = await dynamoDb.get(getParams).promise();
    if (before?.Item?.id === params.id) return {
      success: false, data: null,
      error: JSON.stringify({
        message: 'Could not create account',
        error: `Account id ${params.id} already exists !`
      })
    }  

    // does not exist, can insert it
    await dynamoDb.put(putParams).promise();
    return {
      success: true, error: null,
      data: { status: 'Account created !' }
    };
  } catch (error) {
      return {
        success: false, data: null,
        error: JSON.stringify({
          message: 'Could not create account',
          error: error.message || error
        }),
      };
  }
};


async function updateAccount(params, user) {
  const putParams = {
      TableName: 'accounts',
      Item: {
          id: params.id,
          alias: params.alias,
          email: params.email,
          fullName: params.fullName,
          preferences: params.preferences,
          discord: params.discord || '',
          JWT: params.JWT || ''
      }
  };
  console.log("signUp putParams: ", putParams);

  // Ensure id is provided and not empty
  if (!params.id) {
    return {
        success: false,
        data: null,
        error: JSON.stringify({
            message: 'Invalid input',
            error: 'The id parameter is required.'
        }),
    };
  }  

  // insert it now
  try {
    // check if it exists first
    const getParams = {
      TableName: 'accounts',
      Key: { id: params.id }
    };
    let before = await dynamoDb.get(getParams).promise();
    if (before?.Item?.id !== params.id) return {
      success: false, data: null,
      error: JSON.stringify({
        message: 'Could not update account',
        error: `Account id ${params.id} does not exist !`
      })
    }  

    // does exist, can update it
    await dynamoDb.put(putParams).promise();
    return {
      success: true, error: null,
      data: { status: 'Account updated !' }
    };
  } catch (error) {
      return {
        success: false, data: null,
        error: JSON.stringify({
          message: 'Could not update account',
          error: error.message || error
        }),
      };
  }
};