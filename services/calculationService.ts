import { BillState, Breakdown, SplitResult } from '../types';

export const calculateBreakdown = (state: BillState): Breakdown => {
  const breakdown: Breakdown = {};

  // Initialize breakdown for everyone
  state.people.forEach((person) => {
    breakdown[person.id] = {
      personId: person.id,
      name: person.name,
      subtotal: 0,
      taxShare: 0,
      tipShare: 0,
      total: 0,
      items: [],
    };
  });

  // 1. Distribute Item Prices
  let calculatedSubtotal = 0;

  state.items.forEach((item) => {
    if (item.assignedTo.length > 0) {
      const splitPrice = item.price / item.assignedTo.length;
      item.assignedTo.forEach((personId) => {
        if (breakdown[personId]) {
          breakdown[personId].subtotal += splitPrice;
          breakdown[personId].items.push(item);
        }
      });
      calculatedSubtotal += item.price;
    }
  });

  // Use the calculated subtotal from items to ensure precision match with assignments
  // If no items, avoid division by zero
  const safeSubtotal = calculatedSubtotal > 0 ? calculatedSubtotal : 1;

  // 2. Calculate Proportions
  // We use the actual Tax entered by user, distributed by the ratio of consumption
  const taxRatio = state.tax / safeSubtotal;
  
  // Calculate Tip Amount
  let totalTipAmount = 0;
  if (state.tipType === 'amount') {
    totalTipAmount = state.tipValue;
  } else {
    totalTipAmount = calculatedSubtotal * (state.tipValue / 100);
  }
  
  const tipRatio = totalTipAmount / safeSubtotal;

  // 3. Apply Tax and Tip
  Object.values(breakdown).forEach((person) => {
    person.taxShare = person.subtotal * taxRatio;
    person.tipShare = person.subtotal * tipRatio;
    person.total = person.subtotal + person.taxShare + person.tipShare;
  });

  return breakdown;
};

export const formatMoney = (amount: number): string => {
  return amount.toFixed(2);
};