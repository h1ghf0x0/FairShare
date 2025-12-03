import React from 'react';
import { BillState } from '../types';
import { calculateBreakdown } from '../services/calculationService';
import Avatar from './Avatar';
import { Share2, RefreshCw } from 'lucide-react';

interface StepResultProps {
  billState: BillState;
  onReset: () => void;
  onBack: () => void;
}

const StepResult: React.FC<StepResultProps> = ({ billState, onReset, onBack }) => {
  const breakdown = calculateBreakdown(billState);
  const results = Object.values(breakdown);

  const handleShare = async () => {
    let text = "🧾 Bill Split:\n\n";
    results.forEach(p => {
      text += `${p.name}: $${p.total.toFixed(2)}\n`;
    });
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FairShare Bill Split',
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Breakdown copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 md:p-6 animate-fade-in">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Final Split</h2>
          <p className="text-slate-500 text-sm">Here is what everyone owes.</p>
        </div>
        <button
          onClick={handleShare}
          className="p-3 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
          title="Share"
        >
          <Share2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-20">
        {results.map((person) => (
          <div key={person.personId} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar person={billState.people.find(p => p.id === person.personId)!} />
                <div>
                   <h3 className="text-lg font-bold text-slate-800">{person.name}</h3>
                   <span className="text-xs text-slate-400">{person.items.length} items</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-slate-900">${person.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 text-sm">
               {person.items.map(item => (
                 <div key={item.id} className="flex justify-between text-slate-600">
                   <span>{item.name} {item.assignedTo.length > 1 && <span className="text-xs bg-slate-100 px-1 rounded text-slate-400">(split)</span>}</span>
                   <span>${(item.price / item.assignedTo.length).toFixed(2)}</span>
                 </div>
               ))}
               
               <div className="h-px bg-slate-100 my-2" />
               
               <div className="flex justify-between text-slate-400 text-xs uppercase tracking-wide">
                 <span>Subtotal</span>
                 <span>${person.subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-slate-400 text-xs uppercase tracking-wide">
                 <span>Tax</span>
                 <span>${person.taxShare.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-slate-400 text-xs uppercase tracking-wide">
                 <span>Tip</span>
                 <span>${person.tipShare.toFixed(2)}</span>
               </div>
            </div>
            
            {/* Visual accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${billState.people.find(p => p.id === person.personId)?.color}`} />
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 max-w-2xl mx-auto z-10 flex gap-3">
         <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          <RefreshCw size={18} /> New Bill
        </button>
      </div>
    </div>
  );
};

export default StepResult;