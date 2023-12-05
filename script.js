const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionsList = document.getElementById('transactions');
const balanceDisplay = document.getElementById('balance');
const moneyPlusDisplay = document.getElementById('money-plus');
const moneyMinusDisplay = document.getElementById('money-minus');

let transactions = [];

function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value;

  if (text === '' || amount === 0) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    amount
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();

  textInput.value = '';
  amountInput.value = '';
}

function generateID() {
  return Math.floor(Math.random() * 1000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const li = document.createElement('li');

  li.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  li.innerHTML = `
    ${transaction.text} <span>${sign} R$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  transactionsList.appendChild(li);
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  init();
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, amount) => acc + amount, 0).toFixed(2);
  const income = amounts.filter(amount => amount > 0).reduce((acc, amount) => acc + amount, 0).toFixed(2);
  const expense = (amounts.filter(amount => amount < 0).reduce((acc, amount) => acc + amount, 0) * -1).toFixed(2);

  balanceDisplay.textContent = `R$${total}`;
  moneyPlusDisplay.textContent = `+ R$${income}`;
  moneyMinusDisplay.textContent = `- R$${expense}`;
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  transactionsList.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener('submit', addTransaction);

init();
