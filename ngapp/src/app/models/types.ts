import { DatabaseSnapshot } from '@angular/fire/database';

export type UserDbItem = {
    userId: string;
    itemSnapshot: DatabaseSnapshot<any>;
}