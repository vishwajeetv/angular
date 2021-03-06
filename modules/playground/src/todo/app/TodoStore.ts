/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable} from '@angular/core';
import {ListWrapper, Predicate} from '@angular/core/src/facade/collection';

// base model for RecordStore
export abstract class KeyModel {
  constructor(public key: number) {}
}

export class Todo extends KeyModel {
  constructor(key: number, public title: string, public completed: boolean) { super(key); }
}

@Injectable()
export class TodoFactory {
  _uid: number = 0;

  nextUid(): number { return ++this._uid; }

  create(title: string, isCompleted: boolean): Todo {
    return new Todo(this.nextUid(), title, isCompleted);
  }
}

// Store manages any generic item that inherits from KeyModel
@Injectable()
export class Store<T extends KeyModel> {
  list: T[] = [];

  add(record: T): void { this.list.push(record); }

  remove(record: T): void { this._spliceOut(record); }

  removeBy(callback: Predicate<T>): void {
    var records = this.list.filter(callback);
    ListWrapper.removeAll(this.list, records);
  }

  private _spliceOut(record: T) {
    var i = this._indexFor(record);
    if (i > -1) {
      return this.list.splice(i, 1)[0];
    }
    return null;
  }

  private _indexFor(record: T) { return this.list.indexOf(record); }
}
