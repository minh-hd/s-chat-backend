import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const router = express.Router();

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'S-Chat Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a chat application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'MinhHD',
        url: 'https://minhhd.dev',
        email: 'info@email.com'
      }
    }
  },
  apis: ['./routes/*.route.js']
};

const specs = swaggerJSDoc(options);

router.get('/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

export default router;
