import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BaseModel } from './models/base.model';
import { User } from './models/user.model';

export abstract class BaseService<T extends BaseModel> {

  protected user: User;

  constructor(
    protected db: AngularFireDatabase,
    private dbPath: string,
    protected auth: AuthService) { 
      const classThis = this;
      this.auth.user$.subscribe({
        next(user){
          classThis.user = user;
        }
      })
  }

  public async put(item: T, userid?: string): Promise<boolean> {
    const path = userid ? `${this.dbPath}/${userid}` : this.dbPath;
    const itemsRef = await this.db.list(path);
    await itemsRef.push(item);
    return true;
  }

  public list() {
    const listRef = this.db.list<T>(`${this.dbPath}/${this.user.uid}`);
    return listRef.valueChanges();
  }

  public listValueChanges(): Observable<T[]> {
    const listRef = this.db.list<T>(`${this.dbPath}/${this.user.uid}`);
    return listRef.valueChanges();
  }
}
