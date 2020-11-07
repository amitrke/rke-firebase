import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BaseModel } from './models/base.model';
import { User } from './models/user.model';

export abstract class BaseService<T extends BaseModel> {

  protected user: User;
  public items: Observable<SnapshotAction<T>[]>;

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

  public async push(item: T): Promise<firebase.default.database.Reference> {
    const path = `${this.dbPath}/${this.user.uid}`;
    const itemsRef = this.db.list(path);
    return itemsRef.push(item);
  }

  public async listItemUpdate(key: string, item: T): Promise<void> {
    const listRef = this.db.list<T>(`${this.dbPath}/${this.user.uid}`);
    return listRef.update(key, item);
  }

  public list(): Observable<SnapshotAction<T>[]>  {
    const listRef = this.db.list<T>(`${this.dbPath}/${this.user.uid}`);
    return listRef.snapshotChanges();
  }

  public listValueChanges(): Observable<T[]> {
    const listRef = this.db.list<T>(`${this.dbPath}/${this.user.uid}`);
    return listRef.valueChanges();
  }

  public async listItemDelete(key: string): Promise<void> {
    const listRef = this.db.list<T>(`${this.dbPath}/${this.user.uid}`);
    return listRef.remove(key);
  }
}
