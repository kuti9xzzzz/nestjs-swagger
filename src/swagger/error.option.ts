import { ApiResponseOptions } from '@nestjs/swagger';

const SwaggerBadRequestResponse = (responseExample: any) => {
  const example: ApiResponseOptions = {
    status: 400,
    description: 'Error: Bad Request',
    example: responseExample,
  };
  return example;
};

const SwaggerNotFoundResponse = () => {
  const example: ApiResponseOptions = {
    status: 404,
    description: 'Error: Not Found',
    example: {
      statusCode: 404,
      message: 'Not found message',
    },
  };
  return example;
};

export { SwaggerNotFoundResponse, SwaggerBadRequestResponse };
