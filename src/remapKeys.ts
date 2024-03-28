type MappedKeys<
  T extends { [key: string]: any },
  M extends { [K in keyof Partial<T>]: string },
> = Omit<T, keyof M> & {
  [P in keyof T & keyof M as M[P]]: T[P];
} extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

type Narrow<T> =
  | (T extends infer U ? U : never)
  | Extract<
    T,
    number | string | boolean | bigint | symbol | null | undefined | []
  >
  | ([T] extends [[]] ? [] : { [K in keyof T]: Narrow<T[K]> });


// @ts-ignore
function remapKeys<T extends { [key: string]: any }, M extends T extends any[] ? { [K in keyof Partial<T[number]>]: string } : { [K in keyof Partial<T>]: string }>(source: Narrow<T>, map: Narrow<M>, childrenKey?: string): T extends any[] ? MappedKeys<T[number], M>[] : MappedKeys<T, M> {
  // FIXME: Type
  if (Array.isArray(source)) {
    return source.map((item: any) => remapKeys(item, map, childrenKey)) as any

  } else {
    const result = {} as any;
    for (const key in source) {
      const newKey = (map as any)[key] ?? key;
      if (childrenKey !== undefined && key === childrenKey) {
        result[newKey] = remapKeys(source[key], map, childrenKey);
      } else {
        result[newKey] = source[key];
      }
    }
    return result;
  }
}

const obj = {
  a: 1,
  b: true,
  c: 'hello',
  d: undefined,
  children: [{
    a: 1,
    b: true,
    c: 'hello',
    d: undefined,
    children: []
  }]
}

const map = {
  a: 'aa',
  b: 'bb',
  c: 'cc',
  d: 'dd',
  children: 'child'
}

const result = remapKeys([obj], map, 'children');
console.log(result[0]);
