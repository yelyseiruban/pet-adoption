import express, { Request, Response } from 'express';
import User from '../models/db/userDb';
import Pet from '../models/db/petDb';
import UserConverter from '../utils/database/converters/userConverter';
import {UserDBModel} from "../models/db/userDb";
import {PetConverter} from "../utils/database/converters/petConverter";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful retrieval of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   pets:
 *                     type: array
 *                     items:
 *                       type: string
 *       204:
 *         description: No users found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /users/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a specific user by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/user/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: UserDBModel | null = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(UserConverter.convertUser(user));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

/**
 * @swagger
 * /users/user/{id}/pets:
 *   get:
 *     summary: Get pets of a user
 *     description: Retrieves a list of pets owned by a specific user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve pets for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pets retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       age:
 *                         type: number
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing required field (name).
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /users/user/data/{id}:
 *   put:
 *     summary: Update user data
 *     description: Updates the user's name.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the user.
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing required field (name).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /users/user/verify/{id}:
 *   put:
 *     summary: Verify user adoption eligibility
 *     description: Updates the user's eligibility to adopt pets.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               canAdopt:
 *                 type: boolean
 *                 description: Whether the user can adopt pets.
 *     responses:
 *       200:
 *         description: User eligibility updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 canAdopt:
 *                   type: boolean
 *       400:
 *         description: Bad Request - Missing required field (canAdopt) or wrong type (must be boolean).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /users/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Removes a user from the database by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
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