export const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

export const MOCK_RECEIPT_PROMPT = `
  Analyze this receipt image. 
  Extract the following as JSON:
  - items: array of objects with 'name' (string) and 'price' (number).
  - subtotal: number
  - tax: number
  - tip: number (if present, otherwise 0)
  
  Ignore payment lines (Visa, Auth Code, Total). 
  Focus on the line items ordered.
  Return ONLY raw JSON, no markdown formatting.
`;

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});