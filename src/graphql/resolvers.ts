import Pet from '../models/db/petDb'; // Pet model
import User from '../models/db/userDb'; // User model
import Adoption from '../models/db/adoptionDb'; // Adoption model

const resolvers = {
    Query: {
        pets: async () => await Pet.find(),
        pet: async (_: any, { id }: { id: string }) => await Pet.findById(id),
        users: async () => await User.find(),
        user: async (_: any, { id }: { id: string }) => await User.findById(id).populate('pets'),
        adoptions: async () => await Adoption.find(),
        adoption: async (_: any, { id }: { id: string }) => await Adoption.findById(id),
    },
    Mutation: {
        createPet: async (_: any, { input }: { input: { name: string; race: string; age: number } }) => {
            const newPet = new Pet(input);
            await newPet.save();
            return newPet;
        },
        createUser: async (_: any, { input }: { input: { name: string } }) => {
            const newUser = new User(input);
            await newUser.save();
            return newUser;
        },
        createAdoption: async (_: any, { input }: { input: { userId: string; petId: string } }) => {
            const userExists = await User.findById(input.userId);
            const petExists = await Pet.findById(input.petId);

            if (!userExists) {
                throw new Error('User not found');
            }
            if (!petExists) {
                throw new Error('Pet not found');
            }
            if (!userExists.canAdopt) {
                throw new Error('User cannot adopt pets');
            }
            if (petExists.adopted) {
                throw new Error('Conflict: This pet has already been adopted');
            }

            const newAdoption = new Adoption(input);
            await newAdoption.save();

            petExists.adopted = true;
            await petExists.save();

            userExists.pets.push(petExists.id);
            await userExists.save();

            return newAdoption;
        },
    },
};

export default resolvers;
