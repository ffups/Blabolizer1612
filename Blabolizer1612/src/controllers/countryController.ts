class CountryController {
    constructor(private countryService: CountryService) {}

    async addCountry(req: Request, res: Response) {
        const { name } = req.body;
        try {
            const country = await this.countryService.saveCountry(name);
            res.status(201).json(country);
        } catch (error) {
            res.status(500).json({ message: 'Error adding country', error });
        }
    }

    async getRandomCountry(req: Request, res: Response) {
        try {
            const country = await this.countryService.fetchRandomCountry();
            if (country) {
                res.status(200).json(country);
            } else {
                res.status(404).json({ message: 'No countries found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching random country', error });
        }
    }

    async getAllCountries(req: Request, res: Response) {
        try {
            const countries = await this.countryService.fetchAllCountries();
            res.status(200).json(countries);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching countries', error });
        }
    }
}

export default CountryController;