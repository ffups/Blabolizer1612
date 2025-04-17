import { Router } from 'express';
import { CountryController } from '../controllers/countryController';

const router = Router();
const countryController = new CountryController();

export function setCountryRoutes(app) {
    app.post('/countries', countryController.addCountry.bind(countryController));
    app.get('/countries/random', countryController.getRandomCountry.bind(countryController));
    app.get('/countries', countryController.getAllCountries.bind(countryController));
    
    return router;
}