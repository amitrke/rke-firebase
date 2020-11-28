import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BaseModel } from './models/base.model';
import { User } from './models/user.model';
import { UserDbItems } from './models/types';
export abstract class BaseService<T extends BaseModel> {

  protected user: User;
  public items: Observable<SnapshotAction<T>[]> = new Observable();
  public allUsersItems: Observable<UserDbItems[]> = new Observable();

  constructor(
    protected db: AngularFireDatabase,
    private dbPath: string,
    protected auth: AuthService) { 
      const classThis = this;
      const allUsersListRef = this.db.list<any>(`${this.dbPath}`);
      
      this.allUsersItems = allUsersListRef.snapshotChanges().pipe(
        switchMap(rawAllUsersItems => {
          const userDbItems: UserDbItems[][] = [];
          userDbItems[0] = [];
          rawAllUsersItems.forEach(rawUserItems => {
            const userDbItem: UserDbItems = {uid: rawUserItems.key, items: []};
            console.log(`userItems ${JSON.stringify(rawUserItems)}`);
            rawUserItems.payload.forEach(rawItem => {
              const item = {key: rawItem.key, item: rawItem.val()}
              userDbItem.items.push(item);
              return true;
            });
            userDbItems[0].push(userDbItem);
          });
          return userDbItems;
        })
      )
      
      this.items = this.auth.user$.pipe(
        switchMap(user => {
          const listRef = classThis.db.list<T>(`${classThis.dbPath}/${classThis.user.uid}`);
          return listRef.snapshotChanges();
        })
      );
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

  public async listItemDelete(key: string): Promise<void> {
    const listRef = this.db.list<T>(`${this.dbPath}/${this.user.uid}`);
    return listRef.remove(key);
  }
}
