import * as grpc from '@grpc/grpc-js';
import Pet from '../../models/db/petDb';
import {Empty} from "../proto/google/protobuf/empty";
import {CreatePetRequest, CreatePetResponse, PetIdRequest, PetsResponse, UpdatePetRequest} from "../proto/pet_adoption";
import {PetConverter} from "../convertors/petConvertor";
import * as pet_adoption from "../proto/pet_adoption";


export const getPets = async (_: Empty, callback: grpc.sendUnaryData< PetsResponse | string>) => {
    try {
        const pets = await Pet.find();
        callback(null, { pet: PetConverter.convertPets(pets) });
    } catch (error) {
        callback(null, error!.toString());
    }
};

export const getPet = async (call: grpc.ServerUnaryCall<PetIdRequest, any>, callback: grpc.sendUnaryData<pet_adoption.Pet | string>) => {
    try {
        const pet = await Pet.findById(call.request.id);
        if (!pet) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: 'Pet not found',
            });
        }
        callback(null, PetConverter.convertPet(pet));
    } catch (error) {
        callback(null, error!.toString());
    }
};

export const createPet = async (call: grpc.ServerUnaryCall<CreatePetRequest, CreatePetResponse>, callback: grpc.sendUnaryData<CreatePetResponse | string>) => {
    try {
        const newPet = new Pet({
            name: call.request.name,
            race: call.request.race,
            age: call.request.age,
            adopted: false,
        });
        await newPet.save();
        callback(null, { pet: PetConverter.convertPet(newPet) });
    } catch (error) {
        callback(null, error!.toString());
    }
};

export const updatePet = async (call: grpc.ServerUnaryCall<UpdatePetRequest, CreatePetResponse>, callback: grpc.sendUnaryData<CreatePetResponse | string>) => {
    try {
        const { id } = call.request;
        const { name, race, age } = call.request;

        const updatedPet = await Pet.findByIdAndUpdate(id, { name, race, age }, { new: true });
        if (!updatedPet) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: 'Pet not found',
            });
        }
        callback(null, { pet: PetConverter.convertPet(updatedPet) });
    } catch (error) {
        callback(null, error!.toString());
    }
};

export const deletePet = async (call: grpc.ServerUnaryCall<PetIdRequest, Empty>, callback: grpc.sendUnaryData<Empty>) => {
    try {
        const pet = await Pet.findByIdAndDelete(call.request.id);
        if (!pet) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: 'Pet not found',
            });
        }
        callback(null, Empty);
    } catch (error) {
        callback(null, error!.toString());
    }
};
