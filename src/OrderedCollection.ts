import { GET_CHANGES, ChangeReporter } from './ChangeReporter';

export interface CollectionAdd<TElement> {
  type: "add";
  index: number;
  value: TElement;
}
export type OrderedCollectionChange<TElement> = CollectionAdd<TElement>;

export interface OrderedCollectionOf<TElement> extends ChangeReporter<OrderedCollectionChange<TElement>>, Iterable<TElement> {
  readonly size: number;
  at(index: number): TElement | undefined;
  push(element: TElement): void;
}

class OrderedCollection<TElement> implements OrderedCollectionOf<TElement> {
  // TODO: Find a way to minimize changes?
  private changes: OrderedCollectionChange<TElement>[] = [];
  private elements: Array<TElement>;
  constructor(input: Iterable<TElement>) {
    this.elements = Array.from(input);
  }
  [Symbol.iterator]() {
    return this.elements[Symbol.iterator]();
  }
  [GET_CHANGES]() {
    return this.changes;
  }
  at(index: number) {
    return this.elements.at(index);
  }
  push(element: TElement) {
    const newLength = this.elements.push(element);
    this.changes.push(<CollectionAdd<TElement>>{
      type: 'add',
      index: newLength - 1,
      value: element
    });
  }
  get size() {
    return this.elements.length;
  }
}

function makeOrderedCollection<TElement>(elements: Iterable<TElement>): OrderedCollectionOf<TElement> {
  return new OrderedCollection(elements);
}

export {
  makeOrderedCollection as OrderedCollection
};
