import App from './middlewares/app';
import * as OrganizationController from '../controllers/organization.controller';


const app = App();

app.get('/', async (req, res) => {
  try {
    const data = await OrganizationController.getOrganizations();

    res.status(200).json({
      success: true,
      data
    });
    
  } catch (err) {

  }
});

app.post('/', async (req, res) => {
  res.status(200).json({
    success: true
  });
});

app.put('/', async (req, res) => {
  res.status(200).json({
    success: true
  });
});

app.delete('/', async (req, res) => {
  res.status(200).json({
    success: true
  });
});


export default app;