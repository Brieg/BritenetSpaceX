import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

export const dbName = 'Favorites';

const dbConfig: DBConfig = {
  name: dbName,
  version: 1,
  objectStoresMeta: [
    {
      store: 'Launches',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'id', keypath: 'id', options: { unique: false } },
        { name: 'img', keypath: 'img', options: { unique: false } },
      ],
    },
    {
      store: 'Ships',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'id', keypath: 'id', options: { unique: true } },
      ],
    },
  ],
};

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxIndexedDBModule.forRoot(dbConfig)],
})
export class IndexedDBModule {}
