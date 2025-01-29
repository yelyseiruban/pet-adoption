import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {createPet, deletePet, getPet, getPets, updatePet} from "./resolvers/petsResolvers";

const PROTO_PATH = path.join(__dirname, '/proto/pet_adoption.proto');
console.log(PROTO_PATH);
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
    });
const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as { petadoption: { PetAdoptionService: grpc.ServiceDefinition } };
const petAdoptionProto = proto.petadoption;

const server = new grpc.Server();
server.addService(petAdoptionProto.PetAdoptionService, {
    GetPets: getPets,
    GetPet: getPet,
    CreatePet: createPet,
    UpdatePet: updatePet,
    DeletePet: deletePet,
});

const PORT =  5000;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`Failed to bind server: ${error.message}`);
    } else {
        console.log(`Server running at http://0.0.0.0:${port}`);
    }
});