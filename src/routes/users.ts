import express, { Request, Response } from 'express';
import User from '../models/db/userDb';
import Pet from '../models/db/petDb';
import UserConverter from '../utils/database/converters/userConverter';
import {UserDBModel} from "../models/db/userDb";
import {PetConverter} from "../utils/database/converters/petConverter";

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<Response> => {
    try {
        const users: UserDBModel[] = await User.find();

        if (users.length === 0) {
            return res.status(204).send();
        }

        return res.status(200).json(UserConverter.convertUsers(users));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.get('/user/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: UserDBModel | null = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(UserConverter.convertUser(user));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.get('/user/:id/pets', async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const petIds = user.pets;

        const pets = await Pet.find({ _id: { $in: petIds } });

        return res.status(200).json({
            pets: PetConverter.convertPets(pets)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.post('/', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Bad Request: Missing required field (name)' });
        }

        const newUser = new User({ name });
        await newUser.save();

        return res.status(201).json(UserConverter.convertUser(newUser));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.put('/user/data/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Bad Request: Missing required field (name)' });
        }

        const updatedUser: UserDBModel | null = await User.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(UserConverter.convertUser(updatedUser));
    } catch (error) {
        return res.status(400).json({ message: 'Bad Request', error });
    }
});

router.put('/user/verify/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { canAdopt } = req.body;

        if (typeof canAdopt !== 'boolean') {
            return res.status(400).json({ message: 'Bad Request: Missing required field (canAdopt) or wrong type (must be boolean)' });
        }

        const updatedUser: UserDBModel | null = await User.findByIdAndUpdate(
            req.params.id,
            { canAdopt },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(UserConverter.convertUser(updatedUser));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

router.delete('/user/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: UserDBModel | null = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({message: `User with id: ${req.params.id} deleted successfully`});
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

export default router;