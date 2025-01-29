import express from 'express';
import Pet, {PetDBModel} from '../models/db/petDb';
import {PetConverter} from "../utils/database/converters/petConverter";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Pets
 *     description: API for managing pets
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     tags: [Pets]
 *     summary: Get all pets
 *     responses:
 *       200:
 *         description: Returns a list of pets
 *       204:
 *         description: No pets found
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (req, res) => {
    try {
        const pets: PetDBModel[] = await Pet.find();
        if (pets.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(
            PetConverter.convertPets(pets)
        );
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error }); // Handle any other errors
    }
});

/**
 * @swagger
 * /pets/pet/{id}:
 *   get:
 *     tags: [Pets]
 *     summary: Get a pet by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the pet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the pet information
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/pet/:id', async (req, res) => {
    try {
        const pet: PetDBModel | null = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.status(200).json(PetConverter.convertPet(pet));
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     description: Add a new pet to the database.
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the pet.
 *               age:
 *                 type: number
 *                 description: Age of the pet.
 *               race:
 *                 type: string
 *                 description: Race of the pet (optional).
 *     responses:
 *       201:
 *         description: Pet created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 age:
 *                   type: number
 *                 race:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing required fields or age is not a number.
 *       409:
 *         description: Conflict - Pet already exists.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/', async (req, res) => {
    try {
        const {name, age, race } = req.body;

        if (!name || !age) {
            return res.status(400).json({ message: 'Bad Request: Missing required fields (name, age)' });
        }

        if (typeof age !== 'number') {
            return res.status(400).json({ message: 'Bad Request: Age must be a number' });
        }

        const existingPet: PetDBModel | null = await Pet.findOne({ name });
        if (existingPet) {
            return res.status(409).json({ message: 'Pet already exists' });
        }

        const newPetData = {
            name,
            age,
            race: race || 'none'
        };

        const newPet: PetDBModel = new Pet(newPetData);
        await newPet.save();

        let petResponse = PetConverter.convertPet(newPet.toObject());

        return res.status(201).json(petResponse);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

/**
 * @swagger
 * /pets/pet/{id}:
 *   put:
 *     summary: Update an existing pet
 *     description: Update the details of a pet in the database.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pet to update.
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
 *               age:
 *                 type: number
 *               race:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pet updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 age:
 *                   type: number
 *                 race:
 *                   type: string
 *       404:
 *         description: Pet not found.
 *       400:
 *         description: Bad Request.
 */
router.put('/pet/:id', async (req, res) => {
    try {
        const pet: PetDBModel | null = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.status(200).json(PetConverter.convertPet(pet));
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error });
    }
});

/**
 * @swagger
 * /pets/pet/{id}:
 *   delete:
 *     summary: Delete a pet
 *     description: Remove a pet from the database.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pet to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet deleted successfully.
 *       404:
 *         description: Pet not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/pet/:id', async (req, res) => {
    try {
        const pet: PetDBModel | null = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        return res.status(200).json({message: `Pet with id: ${req.params.id} deleted successfully`});
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

export default router;