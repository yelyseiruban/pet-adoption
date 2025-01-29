import { Request, Response, NextFunction } from 'express';

const setHeaders = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Powered-By', 'PetAdoptionApp');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json');
    next();
};

export default setHeaders;