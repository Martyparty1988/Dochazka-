// Data z localStorage
const data = JSON.parse(localStorage.getItem('workFinanceData')) || {
    reports: [],
    finances: [],
    debts: [],
    debtPayments: [],
    categories: ["Komunikace s hostem", "Úklid", "Wellness"],
    financeCategories: ["Výplata", "Záloha", "Nájem", "Nákup"],
    settings: {
        monthlyRentCZK: 20400,
        monthlyRentEUR: 800,
        monthlyRentUSD: 900,
        autoAddRentDay: 1,
        lastRentAddedMonth: null,
        maruDeductionRate: 0.33,
        martyDeductionRate: 0.5
    }
};

// Funkce pro uložení dat do localStorage
function saveData() {
    localStorage.setItem('workFinanceData', JSON.stringify(data));
}

// Funkce pro přepínání záložek
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Inicializace záložek
document.querySelectorAll('nav button').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
});

// Inicializace kategorií
const categorySelect = document.getElementById('category');
const financeCategorySelect = document.getElementById('finance-category');

function populateCategories() {
    categorySelect.innerHTML = data.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    financeCategorySelect.innerHTML = data.financeCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}
populateCategories();

// Inicializace časovače
let timerInterval;
let timerStart;
let timerPause = 0;
const timerDisplay = document.getElementById('timer-display');
const startTimer = document.getElementById('start-timer');
const pauseTimer = document.getElementById('pause-timer');
const stopTimer = document.getElementById('stop-timer');

// Funkce pro formátování času (HH:MM:SS)
function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds %= 60;
    minutes %= 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Funkce pro spuštění časovače
function startTimerFunc() {
    if (timerInterval) return;
    timerStart = Date.now() - timerPause;
    timerInterval = setInterval(() => {
        timerDisplay.textContent = formatTime(Date.now() - timerStart);
    }, 1000);
}

// Funkce pro pozastavení časovače
function pauseTimerFunc() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerPause = Date.now() - timerStart;
}

// Funkce pro zastavení časovače a uložení výkazu
function stopTimerFunc() {
    clearInterval(timerInterval);
    timerInterval = null;
    const endTime = Date.now();
    const duration = endTime - timerStart;
    const formattedDuration = formatTime(duration);

    const report = {
        date: new Date().toISOString().split('T')[0],
        person: document.getElementById('person').value,
        category: document.getElementById('category').value,
        startTime: new Date(timerStart).toLocaleTimeString(),
        endTime: new Date(endTime).toLocaleTimeString(),
        pause: formatTime(timerPause),
        duration: formattedDuration,
        earnings: calculateEarnings(duration, document.getElementById('person').value)
    };

    data.reports.push(report);
    saveData();
    displayReports();

    timerPause = 0;
    timerDisplay.textContent = '00:00:00';
}

// Funkce pro výpočet výdělku
function calculateEarnings(duration, person) {
    const hours = duration / (1000 * 60 * 60);
    const rate = person === 'Maru' ? 275 : 400;
    let earnings = hours * rate;

    // Odečtení části výdělku pro dluh
    const deductionRate = person === 'Maru' ? data.settings.maruDeductionRate : data.settings.martyDeductionRate;
    const deduction = earnings * deductionRate;

    // Přičtení k dluhům
    addDeductionToDebts(deduction);
    return earnings;
}

function addDeductionToDebts(amount) {
    const rentDebts = data.debts.filter(debt => debt.type === 'nájem' && debt.amount > 0);
    let remainingAmount = amount;

    rentDebts.forEach(debt => {
        if (remainingAmount <= 0) return;
        const deduction = Math.min(remainingAmount, debt.amount);
