import App from './middlewares/app';
import * as swaggerUi from 'swagger-ui-express';
import swaggerDocument  from '../docs/organization';

const app = App();

app.use('/api', swaggerUi.serve);
app.get('/api', swaggerUi.setup(swaggerDocument));

export default app;