import React, { useState, useEffect } from 'react';
import { Receipt, PlusCircle, LayoutDashboard, List } from 'lucide-react';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseList from './components/ExpenseList';
import { utils, writeFile } from 'xlsx';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  status: 'draft' | 'confirmed';
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState<'dashboard' | 'add' | 'list'>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'status'>) => {
    const newExpense = {
      ...expenseData,
      id: crypto.randomUUID(),
      status: 'draft' as const,
    };
    setExpenses([newExpense, ...expenses]);
    setView('dashboard');
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setView('add');
  };

  const handleUpdateExpense = (expenseData: Omit<Expense, 'id' | 'status'>) => {
    if (editingExpense) {
      setExpenses(expenses.map(exp => 
        exp.id === editingExpense.id 
          ? { ...exp, ...expenseData }
          : exp
      ));
      setEditingExpense(null);
      setView('dashboard');
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleConfirmExpense = (id: string) => {
    setExpenses(expenses.map(expense =>
      expense.id === id
        ? { ...expense, status: 'confirmed' as const }
        : expense
    ));
  };

  const handleExportToExcel = () => {
    const data = expenses.map(expense => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Description: expense.description,
      Amount: expense.amount,
      Category: expense.category.charAt(0).toUpperCase() + expense.category.slice(1),
      Status: expense.status.charAt(0).toUpperCase() + expense.status.slice(1)
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Expenses");
    writeFile(wb, "expenses.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-sm text-gray-600">Keep track of your expenses on the go</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setView('dashboard');
                setEditingExpense(null);
              }}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
                view === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                setView('list');
                setEditingExpense(null);
              }}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="h-5 w-5" />
              <span>Expenses</span>
            </button>
            <button
              onClick={() => {
                setView('add');
                setEditingExpense(null);
              }}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
                view === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {view === 'dashboard' ? (
          <Dashboard expenses={expenses} />
        ) : view === 'list' ? (
          <div className="space-y-4">
            <ExpenseFilters onExport={handleExportToExcel} />
            <ExpenseList 
              expenses={expenses} 
              onDelete={handleDeleteExpense}
              onEdit={handleEditExpense}
              onConfirm={handleConfirmExpense}
            />
          </div>
        ) : (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-6">
            <ExpenseForm 
              onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
              initialData={editingExpense}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;