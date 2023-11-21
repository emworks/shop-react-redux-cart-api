import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  try {
    const result = await server(event, context, callback);
    // Ensure the response from the server is in the proper format
    if (typeof result === 'object' && 'statusCode' in result) {
      // Set CORS headers
      result.headers = {
        ...result.headers,
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id', // Allow specific headers
      };
    }

    return result;
  } catch (error) {
    // Handle any errors that occur during execution
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};
