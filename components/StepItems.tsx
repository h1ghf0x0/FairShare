import React, { useState, useRef } from 'react';
import { Item, Person } from '../types';
import { Camera, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import Avatar from './Avatar';
import { parseReceiptImage } from '../services/geminiService';

interface StepItemsProps {
  items: Item[];
  people: Person[];
  setItems: (items: Item[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepItems: React.FC<StepItemsProps> = ({ items, people, setItems, onNext, onBack }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!itemName.trim() || !itemPrice) return;

    const newItem: Item = {
      id: Date.now().toString() + Math.random(),
      name: itemName.trim(),
      price: parseFloat(itemPrice),
      assignedTo: [],
    };

    setItems([...items, newItem]);
    setItemName('');
    setItemPrice('');
    // Auto-select the new item to immediately assign people
    setActiveItemId(newItem.id);
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items.filter((i) => i.id !== id));
    if (activeItemId === id) setActiveItemId(null);
  };

  const toggleAssignment = (itemId: string, personId: string) => {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const isAssigned = item.assignedTo.includes(personId);
        return {
          ...item,
          assignedTo: isAssigned
            ? item.assignedTo.filter((id) => id !== personId)
            : [...item.assignedTo, personId],
        };
      })
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          const parsed = await parseReceiptImage(base64String, file.type);
          const newItems = parsed.items.map((pi) => ({
            id: Date.now().toString() + Math.random(),
            name: pi.name,
            price: pi.price,
            assignedTo: [],
          }));
          setItems([...items, ...newItems]);
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      alert('Failed to scan receipt. Please add items manually.');
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 md:p-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Add Items</h2>
          <p className="text-slate-500 text-sm">Assign items to people.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
          >
            {isScanning ? (
              <span className="animate-pulse">Scanning...</span>
            ) : (
              <>
                <Camera size={18} />
                <span className="hidden sm:inline">Scan Receipt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      <form onSubmit={addItem} className="flex gap-2 mb-6 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item name"
          className="flex-[2] px-3 py-2 rounded-lg bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 outline-none"
        />
        <input
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          placeholder="0.00"
          step="0.01"
          className="flex-1 min-w-[80px] px-3 py-2 rounded-lg bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 outline-none text-right"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={24} />
        </button>
      </form>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto mb-20 space-y-3 pb-4">
        {items.length === 0 && (
          <div className="text-center py-10 text-slate-400 italic">
            No items yet. Add manually or scan a receipt.
          </div>
        )}
        {items.map((item) => {
          const isActive = activeItemId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveItemId(isActive ? null : item.id)}
              className={`
                relative bg-white rounded-xl transition-all duration-300 overflow-hidden cursor-pointer border
                ${isActive ? 'ring-2 ring-indigo-500 shadow-lg border-transparent' : 'shadow-sm border-slate-100 hover:border-indigo-200'}
              `}
            >
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-800">{item.name}</h3>
                  <div className="text-xs text-slate-500 mt-1 flex gap-1 items-center">
                    {item.assignedTo.length === 0 ? (
                      <span className="text-red-400 font-medium">Unassigned</span>
                    ) : (
                      <>
                        <span className="text-indigo-600 font-medium">
                          {item.assignedTo.length} {item.assignedTo.length === 1 ? 'person' : 'people'}
                        </span>
                         &middot; ${((item.price) / Math.max(1, item.assignedTo.length)).toFixed(2)}/ea
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-800">${item.price.toFixed(2)}</span>
                  {isActive ? (
                     <CheckCircle2 size={20} className="text-indigo-600" />
                  ) : (
                    <Circle size={20} className="text-slate-300" />
                  )}
                </div>
              </div>

              {/* Collapsible Assignment Area */}
              <div
                className={`bg-slate-50 border-t border-slate-100 transition-all duration-300 ease-in-out ${
                  isActive ? 'max-h-40 opacity-100 p-3' : 'max-h-0 opacity-0 p-0 overflow-hidden'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assign to:</span>
                  <button onClick={(e) => deleteItem(item.id, e)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                    <Trash2 size={12} /> Delete Item
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {people.map((person) => (
                    <Avatar
                      key={person.id}
                      person={person}
                      selected={item.assignedTo.includes(person.id)}
                      onClick={() => toggleAssignment(item.id, person.id)}
                    />
                  ))}
                  {/* "All" Shortcut could go here */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-4 max-w-2xl mx-auto z-10">
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
          Totals
        </button>
      </div>
    </div>
  );
};

export default StepItems;