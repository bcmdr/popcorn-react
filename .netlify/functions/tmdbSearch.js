// source: https://medium.com/@pailee.wai/hiding-serverless-apps-api-keys-and-secret-key-by-using-netlify-and-netlify-lambda-68c7e4a16a44
import fetch from 'node-fetch';

const movieDbApiRootUrl = 'https://api.themoviedb.org/3'
const movieDbApiKey = process.env.movieDbApiKey; // Here we hide value in environment

exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;
  
  if (httpMethod === 'GET') {
    const response = await fetch(
      `${movieDbApiRootUrl}/search/movie/?api_key=${movieDbApiKey}&query=${queryStringParameters.query}&include_adult=false&page=1`, 
      { 'content-type': 'application/json' }
    )  
    const movieData = await response.text();

    return { statusCode: 200, body: movieData };
  }
  
  return { statusCode: 404 };
}