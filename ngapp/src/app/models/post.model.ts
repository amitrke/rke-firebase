import { BaseModel } from '../models/base.model';

export class Post extends BaseModel {

    constructor(
        public title: string, 
        public intro: string, 
        public body: string, 
        public photoPath: string, 
        public updated: Date
    ) {
        super(updated);
    }
}