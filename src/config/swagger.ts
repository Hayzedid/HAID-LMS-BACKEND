import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechLearn LMS API',
      version: '1.0.0',
      description: 'Enterprise-grade LMS API with AI Integrity and Accountability.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Auto-detected Server (Local or Production)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Use a broad search to find routes in both src (dev) and dist (prod)
  apis: [
    '**/modules/**/*.routes.[tj]s',
    '**/modules/**/*.controller.[tj]s'
  ],
};

export const specs = swaggerJsdoc(options);
