import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './utils/database/database';

import petsRouter from './routes/pets';
import usersRouter from './routes/users';
import adoptionRouter from './routes/adoptions';
import setHeaders from "./middlewares/headers/setHeaders";
import {typeDefs} from "./graphql/types";
import resolvers from "./graphql/resolvers";
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {serve, setup} from "swagger-ui-express";
import {swaggerSpec} from "../swagger";

const app = express();
const port = 3000;


const corsOptions = {
    methods: ["GET", "POST", "PUT", "DELETE"]
};


app.use('/api-docs', serve);
app.get('/api-docs', setup(swaggerSpec));
app.use(cors(corsOptions));
app.use(setHeaders);
app.use(bodyParser.json());

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

startStandaloneServer(apolloServer, {
    listen: { port: 4000 },
}).then((_) => {
    console.log(`Apollo server is running at http://localhost:4000}`);
})

app.use('/pets', petsRouter);
app.use('/users', usersRouter);
app.use('/adoptions', adoptionRouter);

connectDB();


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});