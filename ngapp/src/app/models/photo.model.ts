import { BaseModel } from '../models/base.model';

export class Photo extends BaseModel {

  public url: string;
  public publish: boolean;
  public description: string;
  public title: string;
  public album: string;

  constructor(
    public path: string, 
    public filename: string, 
    public updated: Date){
    super(updated);
  }

  public static getThumbPath(path: string): string{
    const pathItems = path.split('/');
    const filenameItems = pathItems[2].split('.');
    return `${pathItems[0]}/${pathItems[1]}/thumbnails/${filenameItems[0]}_200x200.${filenameItems[1]}`;
  }

  public static getMedPath(path: string): string{
    const pathItems = path.split('/');
    const filenameItems = pathItems[2].split('.');
    return `${pathItems[0]}/${pathItems[1]}/thumbnails/${filenameItems[0]}_680x680.${filenameItems[1]}`;
  }
}