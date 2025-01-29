export interface AdoptionResponse {
    id: string;
    userId: string;
    petId: string;
    dateTime: Date;
    links: {
        self: string;
        user: string;
        pet: string;
    };
}