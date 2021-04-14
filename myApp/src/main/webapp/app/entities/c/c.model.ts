export interface IC {
  id?: number;
}

export class C implements IC {
  constructor(public id?: number) {}
}

export function getCIdentifier(c: IC): number | undefined {
  return c.id;
}
