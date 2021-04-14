export interface ID {
  id?: number;
}

export class D implements ID {
  constructor(public id?: number) {}
}

export function getDIdentifier(d: ID): number | undefined {
  return d.id;
}
