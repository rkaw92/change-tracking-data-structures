export const GET_CHANGES = Symbol('GET_CHANGES');

export interface ChangeReporter<ChangeType> {
  [GET_CHANGES](): ChangeType[];
}
