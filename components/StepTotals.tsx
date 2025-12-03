import React from 'react';
import { BillState } from '../types';
import { DollarSign, Percent } from 'lucide-react';

interface StepTotalsProps {
  billState: BillState;
  setBillState: React.Dispatch<React.SetStateAction<BillState>>;
  onNext: () => void;
  onBack: () => void;
}

const StepTotals: React.FC<StepTotalsProps> = ({ billState, setBillState, onNext, onBack }) => {
  const itemsTotal = billState.items.reduce((sum, item) => sum + item.price, 0);

  const handleTipChange = (val: string) => {
    setBillState((prev) => ({ ...prev, tipValue: parseFloat(val) || 0 }));
  };

  const handleTaxChange = (val: string) => {
    setBillState((prev) => ({ ...prev, tax: parseFloat(val) || 0 }));
  };

  const toggleTipType = () => {
    setBillState((prev) => ({
      ...prev,
      tipType: prev.tipType === 'percent' ? 'amount' : 'percent',
      // Reset value when switching to avoid confusion (e.g. 20% -> $20 might be huge jump)
      tipValue: 0
    }));
  };

  const calculatedTip =
    billState.tipType === 'percent'
      ? itemsTotal * (billState.tipValue / 100)
      : billState.tipValue;

  const grandTotal = itemsTotal + billState.tax + calculatedTip;

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Tax & Tip</h2>
        <p className="text-slate-500">Enter details from the receipt.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        
        {/* Subtotal Display */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Subtotal</span>
          <span className="text-xl font-bold text-slate-800">${itemsTotal.toFixed(2)}</span>
        </div>

        {/* Tax Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Tax Amount</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              step="0.01"
              value={billState.tax || ''}
              onChange={(e) => handleTaxChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all font-mono text-lg"
            />
          </div>
        </div>

        {/* Tip Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Tip</label>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setBillState(prev => ({ ...prev, tipType: 'percent' }))}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${billState.tipType === 'percent' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                %
              </button>
              <button
                onClick={() => setBillState(prev => ({ ...prev, tipType: 'amount' }))}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${billState.tipType === 'amount' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                $
              </button>
            </div>
          </div>
          
          <div className="relative">
            {billState.tipType === 'amount' ? (
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            ) : (
              <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            )}
            <input
              type="number"
              step={billState.tipType === 'percent' ? '1' : '0.01'}
              value={billState.tipValue || ''}
              onChange={(e) => handleTipChange(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 transition-all font-mono text-lg"
            />
          </div>

          {/* Quick Tip Buttons */}
          {billState.tipType === 'percent' && (
            <div className="flex gap-2 mt-2">
              {[15, 18, 20, 25].map(pct => (
                <button
                  key={pct}
                  onClick={() => setBillState(prev => ({...prev, tipValue: pct}))}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${billState.tipValue === pct ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          )}
          
          {billState.tipType === 'percent' && (
             <div className="text-right text-sm text-slate-400 mt-1">
               Amount: ${calculatedTip.toFixed(2)}
             </div>
          )}
        </div>

        {/* Grand Total Preview */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-lg font-bold text-slate-800">Grand Total</span>
          <span className="text-2xl font-bold text-indigo-600">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg"
        >
          View Split
        </button>
      </div>
    </div>
  );
};

export default StepTotals;