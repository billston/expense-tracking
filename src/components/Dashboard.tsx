import React from 'react';
import { PieChart } from 'lucide-react';
import type { Expense } from '../App';

interface DashboardProps {
  expenses: Expense[];
}

export default function Dashboard({ expenses }: DashboardProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const confirmedTotal = expenses
    .filter(exp => exp.status === 'confirmed')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingTotal = expenses
    .filter(exp => exp.status === 'draft')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    'transportation',
    'food',
    'accommodation',
    'supplies',
    'other',
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold">Summary</h2>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(total)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-xl font-bold text-green-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(confirmedTotal)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-orange-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(pendingTotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category}
                className="bg-gray-50 rounded-lg p-4"
              >
                <p className="text-sm text-gray-600 capitalize mb-1">{category}</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(categoryTotals[category] || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}