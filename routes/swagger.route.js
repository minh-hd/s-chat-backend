import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'S-Chat Express API with Swagger',
      version: '2.0',
      description:
        'This is a chat application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'MinhHD',
        url: 'https://minhhd.dev',
        email: 'work@minhhd.dev'
      }
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>'
        }
      }
    }
  },
  apis: ['./routes/*.route.js'],
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json']
};

const specs = swaggerJSDoc(options);

router.use('/', swaggerUiExpress.serve);
router.get('/', swaggerUiExpress.setup(specs));

export default router;
