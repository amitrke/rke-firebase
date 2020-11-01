import { BaseModel } from '../models/base.model';

export class Photo extends BaseModel {

  public url: string;
  
  constructor(public path: string, public filename: string, public updated: Date){
    super(updated);
  }

}