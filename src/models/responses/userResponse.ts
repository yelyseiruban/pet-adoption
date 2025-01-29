export type UserResponse = {
    id: string;
    name: string;
    canAdopt: boolean;
    adoptedPets: number[];
    links: {
        self: string;
        verify: string;
    };
}