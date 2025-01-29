import {Pet} from "../proto/pet_adoption";

export class PetConverter {
    public static convertPet(pet: any): Pet {
        const { _id, __v, ...petData } = pet.toObject ? pet.toObject() : pet;
        return {
            ...petData,
            id: _id,
            links: {
                self: `/pets/pet/${_id}`,
            }
        };
    }

    public static convertPets(pets: any[]): Pet[] {
        return pets.map(this.convertPet);
    }
}
