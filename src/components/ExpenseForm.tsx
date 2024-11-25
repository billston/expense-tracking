import React from 'react';
import { PlusCircle, Receipt, Calendar, DollarSign, Tag } from 'lucide-react';
import type { Expense } from '../App';

interface ExpenseFormProps {
  onSubmit: (expense: {
    amount: number;
    description: string;
    date: string;
    category: string;
  }) => void;
  initialData?: Expense | null;
}

export default function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      category: formData.get('category') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DollarSign className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="number"
          name="amount"
          step="0.01"
          required
          defaultValue={initialData?.amount}
          placeholder="Amount"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Receipt className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="description"
          required
          defaultValue={initialData?.description}
          placeholder="Description"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="date"
          name="date"
          required
          defaultValue={initialData?.date || today}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Tag className="h-5 w-5 text-gray-400" />
        </div>
        <select
          name="category"
          required
          defaultValue={initialData?.category}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Category</option>
          <option value="transportation">Transportation</option>
          <option value="food">Food & Drinks</option>
          <option value="accommodation">Accommodation</option>
          <option value="supplies">Supplies</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <PlusCircle className="h-5 w-5" />
        <span>{initialData ? 'Update Expense' : 'Add Expense'}</span>
      </button>
    </form>
  );
}