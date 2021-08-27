import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';

const app = () => {

  const app = express();

  app.use(cors({ 
    origin: true,  
    methods: 'GET,OPTIONS,POST,DELETE,HEAD,PATCH',
    preflightContinue: false
  }));

  app.use(express.json({ type: 'application/*+json' }));
  app.use(express.urlencoded({ extended: false }));

  app.use(morgan(':remote-addr :date[iso] [:method]:url :status :res[content-length] :response-time ms'));
  
  
  return app;
}

export default app;