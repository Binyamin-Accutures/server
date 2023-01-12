require('dotenv').config();
require('./DL/db').connect();
const mainRouter = require('./router');
const express = require('express');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "bottcamp accutures",
      description: "bootcamp API Information",
      contact: {
        name: "matanel vatkin",
        email: "matanelvatkin@gmail.com"
      },
      servers: ["http://localhost:5000"]
    }
  },
  apis: ["index.js",'./router/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.use('/api', mainRouter);
app.use('/',express.static('upload'))

app.listen(PORT, () => {
  console.log('server listen to ' +PORT);
});
