import express from "express";
import Adoption, {AdoptionDBModel} from '../models/db/adoptionDb';
import User from '../models/db/userDb';
import Pet from '../models/db/petDb';
import AdoptionConverter from '../utils/database/converters/adoptionConverter';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const adoptions: AdoptionDBModel[] = await Adoption.find();
        if (adoptions.length === 0) {
            return res.status(204).send();
        }
        return res.status(200).json(AdoptionConverter.convertAdoptions(adoptions));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.get('/adoption/:id', async (req, res) => {
    try {
        const adoption: AdoptionDBModel | null = await Adoption.findById(req.params.id);
        if (!adoption) return res.status(404).json({ message: 'Adoption not found' });
        return res.status(200).json(AdoptionConverter.convertAdoption(adoption));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId, petId } = req.body;

        if (!userId || !petId) {
            return res.status(400).json({ message: 'Bad Request: Missing required fields (userId, petId)' });
        }

        const userExists = await User.findById(userId);
        const petExists = await Pet.findById(petId);
        if (!userExists) return res.status(404).json({ message: 'User not found' });
        if (!petExists) return res.status(404).json({ message: 'Pet not found' });

        if (!userExists.canAdopt) {
            return res.status(400).json({ message: 'User cannot adopt pets' });
        }

        if (userExists.pets.includes(petId)) {
            return res.status(409).json({ message: 'Conflict: User already owns this pet' });
        }

        if (petExists.adopted) {
            return res.status(409).json({ message: 'Conflict: This pet has already been adopted' });
        }

        const newAdoption = new Adoption({ userId, petId });
        await newAdoption.save();

        petExists.adopted = true;
        await petExists.save();

        userExists.pets.push(petId);
        await userExists.save();

        return res.status(201).json(AdoptionConverter.convertAdoption(newAdoption));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.delete('/adoption/:id', async (req, res) => {
    try {
        const adoption = await Adoption.findByIdAndDelete(req.params.id);
        if (!adoption) return res.status(404).json({ message: 'Adoption not found' });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

export default router;