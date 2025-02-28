import { useState } from 'react'
import './App.css'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalSavings = Number(income) - totalExpenses;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (expenseName && expenseAmount) {
      setExpenses([...expenses, {
        name: expenseName,
        amount: parseFloat(expenseAmount)
      }]);
      setExpenseName('');
      setExpenseAmount('');
    }
  };

  const handleDeleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const generatePdfReport = () => {
    try {
      if (!income && expenses.length === 0) {
        alert('Please add income and/or expenses before generating report');
        return;
      }

      const doc = new jsPDF();
      
      // Report title
      doc.setFontSize(18);
      doc.text('Monthly Expense Report', 14, 20);
      
      // Basic info
      doc.setFontSize(12);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Monthly Income: ₹${Number(income || 0).toFixed(2)}`, 14, 40);
      doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`, 14, 50);
      doc.text(`${totalSavings >= 0 ? 'Savings' : 'Loss'}: ₹${Math.abs(totalSavings).toFixed(2)}`, 14, 60);
      
      // Expenses table
      if (expenses.length > 0) {
        autoTable(doc, {
          startY: 70,
          head: [['Expense Name', 'Amount (₹)']],
          body: expenses.map(expense => [expense.name, expense.amount.toFixed(2)]),
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 }
        });
      }

      doc.save('expense-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check the console for details.');
    }
  };

  return (
    <div className="calculator">
      <h1>Monthly Expense Calculator</h1>
      
      <div className="input-section">
        <label>
          Monthly Income:
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter income"
          />
        </label>
      </div>

      <form onSubmit={handleAddExpense} className="expense-form">
        <input
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          placeholder="Expense name"
        />
        <input
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          placeholder="Amount"
        />
        <button type="submit">Add Expense</button>
      </form>

      <div className="results">
        <div className="total-card">
          <h3>Total Income: ₹{income || 0}</h3>
          <h3>Total Expenses: ₹{totalExpenses.toFixed(2)}</h3>
          <h3 className={totalSavings < 0 ? 'negative' : 'positive'}>
            {totalSavings >= 0 ? 'Savings' : 'Loss'}: ₹{Math.abs(totalSavings).toFixed(2)}
          </h3>
          <button 
            onClick={generatePdfReport}
            className="generate-pdf-btn"
          >
            Download PDF Report
          </button>
        </div>

        <div className="expense-list">
          <h4>Expenses Breakdown:</h4>
          {expenses.map((expense, index) => (
            <div key={index} className="expense-item">
              <span>{expense.name}</span>
              <div>
                <span>₹{expense.amount.toFixed(2)}</span>
                <button className="delete-btn" onClick={() => handleDeleteExpense(index)}>×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
