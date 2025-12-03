export interface Person {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // Array of Person IDs
}

export interface BillState {
  step: 'people' | 'items' | 'totals' | 'result';
  people: Person[];
  items: Item[];
  subtotal: number;
  tax: number;
  tip: number;
  tipType: 'percent' | 'amount';
  tipValue: number; // Stores the raw % or $ value
}

export interface SplitResult {
  personId: string;
  name: string;
  subtotal: number;
  taxShare: number;
  tipShare: number;
  total: number;
  items: Item[];
}

export type Breakdown = Record<string, SplitResult>;