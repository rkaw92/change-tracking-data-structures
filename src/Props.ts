import { GET_CHANGES, ChangeReporter } from './ChangeReporter';

export type PropsOf<TData extends Record<string, any>> = TData & ChangeReporter<PropsChange>;
export interface PropsChange {
  type: "set";
  key: string;
  value: any;
}

/**
 * A Props object is a key-value map that keeps primitives or other change-tracking data structures as values.
 */
export function Props<TData extends Record<string, any>>(fields: TData): PropsOf<TData> {
  const data: any = Object.create(fields);
  const changes = new Map<keyof TData, PropsChange>();
  const overlay: ChangeReporter<PropsChange> = Object.create(Object.prototype);
  Object.defineProperty(overlay, GET_CHANGES, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: () => [...changes.values()]
  });
  // Right now, TypeScript prevents adding new properties, but this can be worked around using "as any" or JS.
  // TODO: Decide whether to replace by a Proxy which would reject new props in runtime, too.
  for (const [ key, value ] of Object.entries(fields)) {
    Object.defineProperty(overlay, key, {
      configurable: false,
      enumerable: true,
      get: () => data[key],
      set: (newValue: TData[typeof key]) => {
        data[key as keyof TData] = newValue;
        changes.set(key, { type: 'set', key: key, value: newValue });
      }
    });
  }
  return overlay as PropsOf<TData>;
};
