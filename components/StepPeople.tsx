import React, { useState } from 'react';
import { Person } from '../types';
import { AVATAR_COLORS } from '../constants';
import { Plus, X, Users } from 'lucide-react';
import Avatar from './Avatar';

interface StepPeopleProps {
  people: Person[];
  setPeople: (people: Person[]) => void;
  onNext: () => void;
}

const StepPeople: React.FC<StepPeopleProps> = ({ people, setPeople, onNext }) => {
  const [newName, setNewName] = useState('');

  const addPerson = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newName.trim()) return;

    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    const color = AVATAR_COLORS[people.length % AVATAR_COLORS.length];
    const initials = newName.trim().slice(0, 2).toUpperCase();

    const newPerson: Person = {
      id,
      name: newName.trim(),
      initials,
      color,
    };

    setPeople([...people, newPerson]);
    setNewName('');
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto p-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <Users size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Who's Dining?</h2>
        <p className="text-slate-500">Add everyone at the table to get started.</p>
      </div>

      <form onSubmit={addPerson} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter name (e.g. Alice)"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          autoFocus
        />
        <button
          type="submit"
          disabled={!newName.trim()}
          className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1">
        {people.length === 0 && (
          <div className="text-center py-10 text-slate-400 italic">
            No one added yet.
          </div>
        )}
        {people.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <Avatar person={person} />
              <span className="font-semibold text-slate-700">{person.name}</span>
            </div>
            <button
              onClick={() => removePerson(person.id)}
              className="text-slate-400 hover:text-red-500 p-2"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={people.length === 0}
        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
      >
        Next: Add Items
      </button>
    </div>
  );
};

export default StepPeople;