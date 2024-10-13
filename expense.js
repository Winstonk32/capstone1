// Store data locally
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editIndex = null;  // Track the index of the transaction being edited

// Render initial data
document.addEventListener('DOMContentLoaded', () => {
    renderTransactions();
    updateOverview();
    renderChart();
});

// Add new transaction or update existing one
const transactionForm = document.getElementById('transaction-form');
transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    const transaction = { amount, type, category };

    if (editIndex !== null) {
        // Edit existing transaction
        transactions[editIndex] = transaction;
        editIndex = null;  // Reset edit mode
    } else {
        // Add new transaction
        transactions.push(transaction);
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));

    renderTransactions();
    updateOverview();
    renderChart();
    transactionForm.reset();
});

// Render transactions to the list
function renderTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';  // Clear existing transactions

    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${transaction.amount}</td>
            <td>${transaction.type}</td>
            <td>${transaction.category}</td>
            <td><button onclick="deleteTransaction(${index})">Delete</button></td>
            <td><button onclick="loadTransactionForEdit(${index})">Edit</button></td>
        `;

        transactionList.appendChild(row);
    });
}

// Load transaction into form for editing
function loadTransactionForEdit(index) {
    const transaction = transactions[index];

    // Populate form fields with the selected transaction data
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;

    editIndex = index;  // Set the current edit index to the transaction being edited
}

// Update total income, expenses, and balance
function updateOverview() {
    const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').innerText = `$${totalIncome}`;
    document.getElementById('total-expenses').innerText = `$${totalExpenses}`;
    document.getElementById('balance').innerText = `$${balance}`;
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);  // Remove the transaction from the array
    localStorage.setItem('transactions', JSON.stringify(transactions));  // Update localStorage
    renderTransactions();  // Re-render the transactions list
    updateOverview();  // Update the financial overview
    renderChart();  // Re-render the chart
}

// Render chart for expenses breakdown
function renderChart() {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = [...new Set(expenses.map(expense => expense.category))];

    const data = categories.map(category => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0);
    });

    const ctx = document.getElementById('expense-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
            }]
        }
    });
}
