export class Queue<T> {
  public constructor() {}

  private _store: T[] = [];
  public push(val: T): void {
    if (val) {
      this._store.push(val);
    }
  }

  public pop(): T | undefined {
    return this._store.shift();
  }

  public top(): T | undefined {
    return this._store[0];
  }

  public get storage(): T[] {
    return this._store;
  }
}
