import { IB } from 'app/entities/b/b.model';

export interface IA {
  id?: number;
  bs?: IB[] | null;
}

export class A implements IA {
  constructor(public id?: number, public bs?: IB[] | null) {}
}

export function getAIdentifier(a: IA): number | undefined {
  return a.id;
}
