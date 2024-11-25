import React from 'react';
import { Trash2, Edit2, CheckCircle } from 'lucide-react';
import type { Expense } from '../App';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onConfirm: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete, onEdit, onConfirm }: ExpenseListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      transportation: 'bg-blue-100 text-blue-800',
      food: 'bg-green-100 text-green-800',
      accommodation: 'bg-purple-100 text-purple-800',
      supplies: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className={`bg-white rounded-lg shadow-sm p-4 ${
            expense.status === 'confirmed' ? 'border-l-4 border-green-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg">
              {formatAmount(expense.amount)}
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  expense.category
                )}`}
              >
                {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
              </span>
              {expense.status === 'confirmed' && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmed
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600">{expense.description}</p>
          <p className="text-sm text-gray-500 mb-3">{formatDate(expense.date)}</p>
          
          <div className="flex justify-end space-x-2">
            {expense.status === 'draft' && (
              <>
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Edit"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onConfirm(expense.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  title="Confirm"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
      {expenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No expenses recorded yet
        </div>
      )}
    </div>
  );
}