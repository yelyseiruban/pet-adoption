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
import {swaggerSpec} from "./documentation/swagger/swagger";

const app = express();
const port = 3000;


const whitelist = ['https://pet-adoption-front'];
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use('/pets', petsRouter);
app.use('/users', usersRouter);
app.use('/adoptions', adoptionRouter);

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


connectDB();


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});