import { AdoptionDBModel } from '../../../models/db/adoptionDb';
import { AdoptionResponse } from '../../../models/responses/adoptionResponse';

class AdoptionConverter {
    public static convertAdoption(adoption: AdoptionDBModel): AdoptionResponse {
        const { _id, userId, petId, dateTime } = adoption.toObject ? adoption.toObject() : adoption;

        return {
            id: _id.toString(),
            userId: userId.toString(),
            petId: petId.toString(),
            dateTime: dateTime,
            links: {
                self: `/adoptions/adoption/${_id}`,
                user: `/users/user/${userId}`,
                pet: `/pets/pet/${petId}`,
            },
        };
    }

    public static convertAdoptions(adoptions: AdoptionDBModel[]): AdoptionResponse[] {
        return adoptions.map(this.convertAdoption);
    }
}

export default AdoptionConverter;