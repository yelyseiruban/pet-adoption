import {PetResponse} from "../../../models/responses/petResponse";

export class PetConverter {
    public static convertPet(pet: any): PetResponse {
        const { _id, __v, ...petData } = pet.toObject ? pet.toObject() : pet;
        return {
            ...petData,
            id: _id,
            links: {
                self: `/pets/pet/${_id}`,
            }
        };
    }

    public static convertPets(pets: any[]): PetResponse[] {
        return pets.map(this.convertPet);
    }
}
