import express from 'express';
import fileRoutConfig from './config/fileRoutes.js';
import routes from './routes.js';


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/product-file', fileRoutConfig)
app.use(routes)

export default app;
