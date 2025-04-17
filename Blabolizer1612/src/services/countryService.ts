import { Country } from '../models/countryModel';
import { db } from '../database/index';

export class CountryService {
    async saveCountry(countryName: string): Promise<Country> {
        const newCountry = new Country({ name: countryName });
        await db.collection('countries').insertOne(newCountry);
        return newCountry;
    }

    async fetchRandomCountry(): Promise<Country | null> {
        const countries = await db.collection('countries').find().toArray();
        if (countries.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * countries.length);
        return countries[randomIndex];
    }

    async getAllCountries(): Promise<Country[]> {
        return await db.collection('countries').find().toArray();
    }
}