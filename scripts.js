// Basic Calculator
function calculateBasic() {
  const num1 = parseFloat(document.getElementById('basic-num1').value);
  const num2 = parseFloat(document.getElementById('basic-num2').value);
  const operation = document.getElementById('basic-operation').value;
  const resultEl = document.getElementById('basic-result');

  if (isNaN(num1) || (isNaN(num2) && operation !== 'percentage')) {
    resultEl.innerText = 'Please enter valid numbers.';
    return;
  }

  let result;

  switch(operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract':
      result = num1 - num2;
      break;
    case 'multiply':
      result = num1 * num2;
      break;
    case 'divide':
      if (num2 === 0) {
        resultEl.innerText = 'Cannot divide by zero.';
        return;
      }
      result = num1 / num2;
      break;
    case 'percentage':
      // percentage of num1 by num2 => (num1 * num2) / 100
      if (isNaN(num2)) {
        resultEl.innerText = 'Please enter second number for percentage.';
        return;
      }
      result = (num1 * num2) / 100;
      break;
    default:
      resultEl.innerText = 'Invalid operation selected.';
      return;
  }

  resultEl.innerHTML = `<span class="answer">Result: ${result.toFixed(4)}</span>`;
}

// Investment Calculator
function calculateInvestment() {
  const P = parseFloat(document.getElementById('inv-amount').value);
  const r = parseFloat(document.getElementById('inv-rate').value) / 100;
  const t = parseFloat(document.getElementById('inv-years').value);
  const type = document.getElementById('inv-type').value;
  const n = parseInt(document.getElementById('inv-compound').value);
  const resultEl = document.getElementById('investment-result');

  if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || r <= 0 || t <= 0) {
    resultEl.innerText = 'Please enter valid positive numbers for investment.';
    return;
  }

  let balance;
  if (type === 'compound') {
    balance = P * Math.pow(1 + r / n, n * t);
  } else {
    balance = P + P * r * t;
  }

  const interestEarned = balance - P;
  resultEl.innerHTML =
    `<span class="answer">Total Value: $${balance.toFixed(2)}</span><br/><span class="answer">Interest Earned: $${interestEarned.toFixed(2)}</span>`;
}

// Debt Payoff Estimator
function calculateDebt() {
  const debt = parseFloat(document.getElementById('debt-amount').value);
  const annualRate = parseFloat(document.getElementById('debt-rate').value) / 100;
  const payment = parseFloat(document.getElementById('debt-payment').value);
  const payFreq = parseInt(document.getElementById('debt-payfreq').value);
  const interestType = document.getElementById('debt-type').value;
  const compoundFreq = parseInt(document.getElementById('debt-compound').value);
  const resultEl = document.getElementById('debt-result');

  if (isNaN(debt) || isNaN(annualRate) || isNaN(payment) || debt <= 0 || annualRate < 0 || payment <= 0) {
    resultEl.innerText = 'Please enter valid positive numbers.';
    return;
  }

  let balance = debt;
  let periods = 0;
  const maxIterations = 10000;
  let periodRate;
  if (interestType === 'compound') {
    const rPerCompoundingPeriod = annualRate / compoundFreq;
    const compoundPeriodsPerPayment = compoundFreq / payFreq;
    if (!Number.isFinite(compoundPeriodsPerPayment) || compoundPeriodsPerPayment <= 0) {
      resultEl.innerText = 'Invalid combination of payment and compounding frequencies.';
      return;
    }
    periodRate = Math.pow(1 + rPerCompoundingPeriod, compoundPeriodsPerPayment) - 1;
  } else {
    periodRate = annualRate / payFreq;
  }

  while (balance > 0 && periods < maxIterations) {
    if (interestType === 'compound') {
      balance *= (1 + periodRate);
    } else {
      balance += balance * periodRate;
    }

    balance -= payment;
    periods++;

    if (balance < 0) balance = 0;
  }

  if (periods === maxIterations) {
    resultEl.innerText = 'Payment too low to ever pay off debt.';
    return;
  }

  const totalPaid = periods * payment;
  const freqNames = {365: 'day(s)', 52: 'week(s)', 26: 'bi-week(s)', 12: 'month(s)', 1: 'year(s)'};
  const years = Math.floor(periods / payFreq);
  const remPeriods = periods % payFreq;

  resultEl.innerHTML =
    `<span class="answer">Debt paid off in: ${years} ${freqNames[payFreq]} and ${remPeriods} ${freqNames[payFreq]}</span><br/><span class="answer">Total paid: $${totalPaid.toFixed(2)}</span>`;
}

// EMI Calculator
function calculateEMI() {
  const P = parseFloat(document.getElementById('emi-loan').value);
  const annualRate = parseFloat(document.getElementById('emi-rate').value) / 100;
  const years = parseFloat(document.getElementById('emi-years').value);
  const payFreq = parseInt(document.getElementById('emi-payfreq').value);
  const interestType = document.getElementById('emi-type').value;
  const compoundFreq = parseInt(document.getElementById('emi-compound').value);
  const resultEl = document.getElementById('emi-result');

  if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate < 0 || years <= 0) {
    resultEl.innerText = 'Please enter valid positive numbers.';
    return;
  }

  const n = years * payFreq; // total payments
  let emi;

  if (interestType === 'compound') {
    // Convert annual rate to effective periodic rate based on compounding and payment frequencies
    const r = Math.pow(1 + annualRate / compoundFreq, compoundFreq / payFreq) - 1;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  } else {
    // Simple interest EMI calculation
    const totalInterest = P * annualRate * years;
    emi = (P + totalInterest) / n;
  }

  const totalPayment = emi * n;
  const totalInterestPaid = totalPayment - P;

  resultEl.innerHTML =
    `<span class="answer">EMI: $${emi.toFixed(2)}</span><br/>
    <span class="answer">Total Interest Paid: $${totalInterestPaid.toFixed(2)}</span><br/>
    <span class="answer">Total Payment: $${totalPayment.toFixed(2)}</span>`;
}

// Currency Converter (Fixed with proper error handling)
// Currency Converter (Using open.er-api.com)
async function convertCurrency() {
  const amount = parseFloat(document.getElementById('curr-amount').value);
  const from = document.getElementById('curr-from').value;
  const to = document.getElementById('curr-to').value;
  const resultEl = document.getElementById('currency-result');

  if (isNaN(amount) || amount <= 0) {
    resultEl.innerText = 'Please enter a valid amount.';
    return;
  }

  if (from === to) {
    resultEl.innerHTML = `<span class="answer">${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}</span>`;
    return;
  }

  resultEl.innerText = 'Converting…';

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();

    if (data && data.rates && data.rates[to]) {
      const converted = amount * data.rates[to];
      resultEl.innerHTML = `<span class="answer">${amount.toFixed(2)} ${from} = ${converted.toFixed(4)} ${to}</span>`;
    } else {
      resultEl.innerText = 'Failed to get exchange rate.';
    }
  } catch (error) {
    resultEl.innerText = 'Error fetching exchange rate.';
  }
}


// Export to PDF
function exportPDF(resultId, title) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const resultEl = document.getElementById(resultId);
  if (!resultEl || resultEl.innerText.trim() === '') {
    alert('No result to export.');
    return;
  }

  doc.setFontSize(18);
  doc.setTextColor('#1a237e');
  doc.text(title, 10, 20);

  doc.setFontSize(12);
  doc.setTextColor('#000');

  const lines = resultEl.innerText.split('\n');
  let y = 40;
  lines.forEach(line => {
    doc.text(line, 10, y);
    y += 10;
  });

  doc.save(`${title.replace(/\s/g, '_')}.pdf`);
}

// Event Listeners for all pages and calculators
document.addEventListener('DOMContentLoaded', () => {
  // Basic Calculator
  const basicCalcBtn = document.getElementById('calculate-basic');
  if (basicCalcBtn) {
    basicCalcBtn.addEventListener('click', calculateBasic);
  }
  const basicExportBtn = document.getElementById('export-basic-pdf');
  if (basicExportBtn) {
    basicExportBtn.addEventListener('click', () => exportPDF('basic-result', 'Basic Calculator Result'));
  }

  // Investment
  const invCalcBtn = document.getElementById('calculate-investment');
  if (invCalcBtn) {
    invCalcBtn.addEventListener('click', calculateInvestment);
  }
  const invExportBtn = document.getElementById('export-investment-pdf');
  if (invExportBtn) {
    invExportBtn.addEventListener('click', () => exportPDF('investment-result', 'Investment Calculator Result'));
  }

  // Debt
  const debtCalcBtn = document.getElementById('calculate-debt');
  if (debtCalcBtn) {
    debtCalcBtn.addEventListener('click', calculateDebt);
  }
  const debtExportBtn = document.getElementById('export-debt-pdf');
  if (debtExportBtn) {
    debtExportBtn.addEventListener('click', () => exportPDF('debt-result', 'Debt Payoff Estimator Result'));
  }

  // EMI
  const emiCalcBtn = document.getElementById('calculate-emi');
  if (emiCalcBtn) {
    emiCalcBtn.addEventListener('click', calculateEMI);
  }
  const emiExportBtn = document.getElementById('export-emi-pdf');
  if (emiExportBtn) {
    emiExportBtn.addEventListener('click', () => exportPDF('emi-result', 'EMI Calculator Result'));
  }

  // Currency Converter
  const currConvBtn = document.getElementById('convert-currency');
  if (currConvBtn) {
    currConvBtn.addEventListener('click', convertCurrency);
  }
  const currExportBtn = document.getElementById('export-currency-pdf');
  if (currExportBtn) {
    currExportBtn.addEventListener('click', () => exportPDF('currency-result', 'Currency Converter Result'));
  }
});
  document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.toggle-button');
    const navLinks = document.querySelector('.nav-links');

    toggleButton.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  });

