import React, { useState } from 'react';
import { BillState } from './types';
import StepPeople from './components/StepPeople';
import StepItems from './components/StepItems';
import StepTotals from './components/StepTotals';
import StepResult from './components/StepResult';

const App: React.FC = () => {
  const initialState: BillState = {
    step: 'people',
    people: [],
    items: [],
    subtotal: 0,
    tax: 0,
    tip: 0,
    tipType: 'percent',
    tipValue: 20,
  };

  const [billState, setBillState] = useState<BillState>(initialState);

  const resetApp = () => {
    if (confirm("Are you sure you want to start a new bill? All current data will be lost.")) {
      setBillState(initialState);
    }
  };

  const renderStep = () => {
    switch (billState.step) {
      case 'people':
        return (
          <StepPeople
            people={billState.people}
            setPeople={(people) => setBillState({ ...billState, people })}
            onNext={() => setBillState({ ...billState, step: 'items' })}
          />
        );
      case 'items':
        return (
          <StepItems
            items={billState.items}
            people={billState.people}
            setItems={(items) => setBillState({ ...billState, items })}
            onNext={() => setBillState({ ...billState, step: 'totals' })}
            onBack={() => setBillState({ ...billState, step: 'people' })}
          />
        );
      case 'totals':
        return (
          <StepTotals
            billState={billState}
            setBillState={setBillState}
            onNext={() => setBillState({ ...billState, step: 'result' })}
            onBack={() => setBillState({ ...billState, step: 'items' })}
          />
        );
      case 'result':
        return (
          <StepResult
            billState={billState}
            onBack={() => setBillState({ ...billState, step: 'totals' })}
            onReset={resetApp}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-indigo-200 shadow-md">
              F
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">FairShare</h1>
          </div>
          <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
            {billState.step}
          </div>
        </div>
      </header>
      
      <main className="h-[calc(100vh-64px)] overflow-hidden">
        {renderStep()}
      </main>
    </div>
  );
};

export default App;