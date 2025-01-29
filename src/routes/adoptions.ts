import express from "express";
import Adoption, {AdoptionDBModel} from '../models/db/adoptionDb';
import User from '../models/db/userDb';
import Pet from '../models/db/petDb';
import AdoptionConverter from '../utils/database/converters/adoptionConverter';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Adoptions
 *     description: API for managing adoptions
 */

/**
 * @swagger
 * /adoptions:
 *   get:
 *     summary: Get all adoptions
 *     description: Retrieves a list of all adoptions.
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Successful retrieval of adoptions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   petId:
 *                     type: string
 *       204:
 *         description: No adoptions found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /adoptions/adoption/{id}:
 *   get:
 *     summary: Get adoption by ID
 *     description: Retrieves specific adoption details by ID.
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the adoption to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adoption details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   userId:
 *                     type: string
 *                   petId:
 *                     type: string
 *       404:
 *         description: Adoption not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/adoption/:id', async (req, res) => {
    try {
        const adoption: AdoptionDBModel | null = await Adoption.findById(req.params.id);
        if (!adoption) return res.status(404).json({ message: 'Adoption not found' });
        return res.status(200).json(AdoptionConverter.convertAdoption(adoption));
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

/**
 * @swagger
 * /adoptions:
 *   post:
 *     summary: Create a new adoption
 *     description: Creates a new adoption for a user and a pet.
 *     tags: [Adoptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user adopting the pet.
 *               petId:
 *                 type: string
 *                 description: The ID of the pet being adopted.
 *     responses:
 *       201:
 *         description: Adoption created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 petId:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing required fields or user cannot adopt pets.
 *       404:
 *         description: User or pet not found.
 *       409:
 *         description: Conflict - User already owns this pet or pet already adopted.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /adoptions/adoption/{id}:
 *   delete:
 *     summary: Delete an adoption
 *     description: Removes an adoption record by ID.
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the adoption to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Adoption deleted successfully.
 *       404:
 *         description: Adoption not found.
 *       500:
 *         description: Internal Server Error.
 */
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