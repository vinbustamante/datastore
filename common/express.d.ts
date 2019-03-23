import ObjectIdDto from './services/dto/ObjectIdDto';

declare module 'express' {
    export interface Request {
        objectId?: ObjectIdDto
    }
}