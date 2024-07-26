import { ApiResponseOptions } from '@nestjs/swagger';

const SwaggerSuccessfulResponse200 = (responseExample: any) => {
  const example: ApiResponseOptions = {
    status: 200,
    description: 'Successful Response',
    example: responseExample,
  };
  return example;
};

const SwaggerSuccessfulResponse201 = (responseExample: any) => {
  const example: ApiResponseOptions = {
    status: 200,
    description: 'Successful Response',
    example: responseExample,
  };
  return example;
};

export { SwaggerSuccessfulResponse200, SwaggerSuccessfulResponse201 };
