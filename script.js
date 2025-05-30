// Enhanced Mortgage Calculator with UX Improvements
// Get all DOM elements
const homePriceInput = document.getElementById('home-price');
const downPaymentPercentInput = document.getElementById('down-payment-percent');
const downPaymentAmountInput = document.getElementById('down-payment-amount');
const loanAmountInput = document.getElementById('loan-amount');
const interestRateInput = document.getElementById('interest-rate');
const loanTermInput = document.getElementById('loan-term');
const propertyTaxRateInput = document.getElementById('property-tax-rate');
const homeInsuranceInput = document.getElementById('home-insurance');

// Results elements
const monthlyPaymentEl = document.getElementById('monthly-payment');
const totalInterestEl = document.getElementById('total-interest');
const paymentBreakdownDiv = document.getElementById('payment-breakdown');
const piAmountEl = document.getElementById('pi-amount');
const taxAmountEl = document.getElementById('tax-amount');
const insuranceAmountEl = document.getElementById('insurance-amount');
const totalMonthlyPaymentEl = document.getElementById('total-monthly-payment');

// API Configuration
const ZILLOW_API_BASE = 'https://mortgageapi.zillow.com/getCurrentRates';
const PARTNER_ID = 'RD-MPWGSPZ';

// Function to format currency with commas and no cents
function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('en-US');
}

// Show loading state
function showCalculationLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsDiv = document.getElementById('results');
    
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
    
    if (resultsDiv) {
        resultsDiv.classList.add('calculating');
    }
}

// Hide loading state
function hideCalculationLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsDiv = document.getElementById('results');
    
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    
    if (resultsDiv) {
        resultsDiv.classList.remove('calculating');
    }
}

// Auto-calculate loan amount and down payment
function updateLoanCalculations() {
    const homePrice = parseFloat(homePriceInput.value) || 0;
    const downPaymentPercent = parseFloat(downPaymentPercentInput.value) || 0;
    
    const downPaymentAmount = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPaymentAmount;
    
    downPaymentAmountInput.value = Math.round(downPaymentAmount);
    loanAmountInput.value = Math.round(loanAmount);
    
    // Auto-recalculate mortgage with loading state
    const currentRate = parseFloat(interestRateInput.value);
    if (currentRate > 0) {
        calculateMortgageWithLoading();
    }
}

// New function with loading state
function calculateMortgageWithLoading() {
    showCalculationLoading();
    
    // Small delay to show the loading state
    setTimeout(() => {
        calculateMortgage();
        hideCalculationLoading();
    }, 300);
}

// Enhanced calculation with safe breakdown
function calculateMortgage() {
    const principal = parseFloat(loanAmountInput.value);
    const interestRate = parseFloat(interestRateInput.value) / 100 / 12;
    const numberOfPayments = parseFloat(loanTermInput.value) * 12;
    const homePrice = parseFloat(homePriceInput.value);
    const propertyTaxRate = parseFloat(propertyTaxRateInput.value) || 1.2;
    const annualInsurance = parseFloat(homeInsuranceInput.value) || 1200;
    
    // Calculate P&I
    const x = Math.pow(1 + interestRate, numberOfPayments);
    const monthlyPI = (principal * x * interestRate) / (x - 1);
    const totalInterest = (monthlyPI * numberOfPayments) - principal;
    
    // Calculate monthly property costs
    const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;
    const monthlyInsurance = annualInsurance / 12;
    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance;
    
    if (isFinite(monthlyPI)) {
        // Update main payment (this should always exist)
        monthlyPaymentEl.textContent = formatCurrency(totalMonthlyPayment);
        totalInterestEl.textContent = formatCurrency(totalInterest);
        
        // SAFE: Only update breakdown if elements exist
        const piAmountBar = document.getElementById('pi-amount-bar');
        const taxAmountBar = document.getElementById('tax-amount-bar');
        const insuranceAmountBar = document.getElementById('insurance-amount-bar');
        const paymentBreakdown = document.getElementById('payment-breakdown');
        
        if (piAmountBar && taxAmountBar && insuranceAmountBar) {
            piAmountBar.textContent = formatCurrency(monthlyPI);
            taxAmountBar.textContent = formatCurrency(monthlyTax);
            insuranceAmountBar.textContent = formatCurrency(monthlyInsurance);
            
            // Update bar widths if bar elements exist
            const piBar = document.getElementById('pi-bar');
            const taxBar = document.getElementById('tax-bar');
            const insuranceBar = document.getElementById('insurance-bar');
            
            if (piBar && taxBar && insuranceBar) {
                const piPercent = (monthlyPI / totalMonthlyPayment) * 100;
                const taxPercent = (monthlyTax / totalMonthlyPayment) * 100;
                const insurancePercent = (monthlyInsurance / totalMonthlyPayment) * 100;
                
                piBar.style.flexBasis = piPercent + '%';
                taxBar.style.flexBasis = taxPercent + '%';
                insuranceBar.style.flexBasis = insurancePercent + '%';
                
                console.log('Bar chart updated:', {piPercent, taxPercent, insurancePercent});
            }
            
            // Show breakdown
            if (paymentBreakdown) {
                paymentBreakdown.style.display = 'block';
            }
        } else {
            console.log('Payment breakdown elements not found - skipping visual breakdown');
        }
        
        console.log('Calculation completed successfully');
        
    } else {
        monthlyPaymentEl.textContent = 'Error';
        totalInterestEl.textContent = 'Error';
    }
}

// Safe loading functions
function showCalculationLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsDiv = document.getElementById('results');
    
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
    
    if (resultsDiv) {
        resultsDiv.classList.add('calculating');
    }
    
    console.log('Loading spinner shown');
}

function hideCalculationLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsDiv = document.getElementById('results');
    
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    
    if (resultsDiv) {
        resultsDiv.classList.remove('calculating');
    }
    
    console.log('Loading spinner hidden');
}

// Safe calculation with loading
function calculateMortgageWithLoading() {
    showCalculationLoading();
    
    setTimeout(() => {
        try {
            calculateMortgage();
        } catch (error) {
            console.error('Error in calculation:', error);
        } finally {
            hideCalculationLoading(); // Always hide loading, even if error
        }
    }, 300);
}

// Safe function to show lead capture form after calculation
function showLeadCapture() {
    try {
        const leadSection = document.getElementById('lead-capture');
        
        if (!leadSection) {
            console.log('Lead capture section not found - skipping');
            return;
        }
        
        const hasValidResults = monthlyPaymentEl.textContent !== '$0' && 
                               monthlyPaymentEl.textContent !== 'Error' && 
                               monthlyPaymentEl.textContent !== '';
        
        if (leadSection.style.display === 'none' && hasValidResults) {
            leadSection.style.display = 'block';
            leadSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (error) {
        console.log('Error showing lead capture:', error);
    }
}

// Enhanced save function that shows toggle button
function saveCalculation() {
    const calculationData = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        homePrice: parseFloat(homePriceInput.value),
        downPaymentPercent: parseFloat(downPaymentPercentInput.value),
        downPaymentAmount: parseFloat(downPaymentAmountInput.value),
        loanAmount: parseFloat(loanAmountInput.value),
        interestRate: parseFloat(interestRateInput.value),
        loanTerm: parseFloat(loanTermInput.value),
        propertyTaxRate: parseFloat(propertyTaxRateInput.value),
        homeInsurance: parseFloat(homeInsuranceInput.value),
        monthlyPayment: monthlyPaymentEl.textContent,
        totalInterest: totalInterestEl.textContent
    };
    
    let savedCalculations = JSON.parse(localStorage.getItem('mortgageCalculations')) || [];
    savedCalculations.push(calculationData);
    localStorage.setItem('mortgageCalculations', JSON.stringify(savedCalculations));
    
    console.log('Calculation saved:', calculationData);
    displaySavedCalculations();
    
    // Show toggle button after first save
    const toggleBtn = document.getElementById('toggle-saved-btn');
    if (toggleBtn) {
        toggleBtn.style.display = 'flex';
    }
    
    // Visual feedback
    const saveBtn = document.getElementById('save-calculation-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.backgroundColor = '';
    }, 2000);
}

// Toggle saved calculations visibility
function toggleSavedCalculations() {
    const savedSection = document.getElementById('saved-calculations');
    const toggleBtn = document.getElementById('toggle-saved-btn');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    
    if (savedSection.style.display === 'none') {
        savedSection.style.display = 'block';
        toggleBtn.classList.add('expanded');
        toggleText.textContent = 'Hide Saved';
    } else {
        savedSection.style.display = 'none';
        toggleBtn.classList.remove('expanded');
        toggleText.textContent = 'Show Saved';
    }
}

// Updated display function that starts collapsed
function displaySavedCalculations() {
    const savedCalculations = JSON.parse(localStorage.getItem('mortgageCalculations')) || [];
    const savedSection = document.getElementById('saved-calculations');
    const savedList = document.getElementById('saved-list');
    const toggleBtn = document.getElementById('toggle-saved-btn');
    
    if (savedCalculations.length === 0) {
        savedSection.style.display = 'none';
        if (toggleBtn) toggleBtn.style.display = 'none';
        return;
    }
    
    // Show toggle button but keep section collapsed by default
    if (toggleBtn) {
        toggleBtn.style.display = 'flex';
    }
    
    // Keep section hidden by default (user must click to expand)
    savedSection.style.display = 'none';
    
    let savedHTML = '';
    savedCalculations.forEach(calc => {
        savedHTML += `
            <div class="saved-calculation-card">
                <div class="saved-info">
                    <strong>Saved: ${calc.date}</strong><br>
                    Home: ${formatCurrency(calc.homePrice)} | 
                    Loan: ${formatCurrency(calc.loanAmount)} | 
                    Rate: ${calc.interestRate}%<br>
                    <strong>Payment: ${calc.monthlyPayment}</strong>
                </div>
                <div class="saved-actions">
                    <button class="load-btn" data-calc-id="${calc.id}">Load</button>
                    <button class="delete-btn" data-calc-id="${calc.id}">Delete</button>
                </div>
            </div>
        `;
    });
    
    savedList.innerHTML = savedHTML;
    
    // Add event listeners to all buttons
    document.querySelectorAll('.load-btn').forEach(button => {
        button.addEventListener('click', function() {
            const calcId = parseInt(this.getAttribute('data-calc-id'));
            loadCalculation(calcId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const calcId = parseInt(this.getAttribute('data-calc-id'));
            deleteCalculation(calcId);
        });
    });
}

// Function to load a saved calculation with auto-collapse
function loadCalculation(calculationId) {
    const savedCalculations = JSON.parse(localStorage.getItem('mortgageCalculations')) || [];
    const calculation = savedCalculations.find(calc => calc.id === calculationId);
    
    if (calculation) {
        // Load values back into the form
        homePriceInput.value = calculation.homePrice;
        downPaymentPercentInput.value = calculation.downPaymentPercent;
        interestRateInput.value = calculation.interestRate;
        loanTermInput.value = calculation.loanTerm;
        propertyTaxRateInput.value = calculation.propertyTaxRate || 1.2;
        homeInsuranceInput.value = calculation.homeInsurance || 1200;
        
        // Auto-collapse saved calculations after loading
        document.getElementById('saved-calculations').style.display = 'none';
        
        // Recalculate everything
        updateLoanCalculations();
        calculateMortgage();
        
        console.log('Calculation loaded:', calculation);
        
        // Scroll to results
        document.getElementById('results-section').scrollIntoView({behavior: 'smooth'});
    }
}

// Function to delete a saved calculation
function deleteCalculation(calculationId) {
    let savedCalculations = JSON.parse(localStorage.getItem('mortgageCalculations')) || [];
    savedCalculations = savedCalculations.filter(calc => calc.id !== calculationId);
    
    localStorage.setItem('mortgageCalculations', JSON.stringify(savedCalculations));
    displaySavedCalculations();
    
    console.log('Calculation deleted');
}

// Function to build dynamic API URLs
function buildRateQueries() {
    const homePrice = parseFloat(homePriceInput.value);
    const loanAmount = parseFloat(loanAmountInput.value);
    const state = 'TX';
    
    const baseParams = `partnerId=${PARTNER_ID}&queries.1.propertyBucket.location.stateAbbreviation=${state}&queries.1.propertyBucket.propertyValue=${homePrice}&queries.1.propertyBucket.loanAmount=${loanAmount}`;
    
    return {
        conventional: `${ZILLOW_API_BASE}?${baseParams}&queries.1.loanType=Conventional`,
        fha: `${ZILLOW_API_BASE}?${baseParams}&queries.1.loanType=FHA`,
        va: `${ZILLOW_API_BASE}?${baseParams}&queries.1.loanType=VA`,
        jumbo: `${ZILLOW_API_BASE}?${baseParams}&queries.1.loanType=Jumbo`
    };
}

// Helper function to extract rate data with zero filtering
function extractRateData(apiResponse, loanType) {
    try {
        console.log(`${loanType} API Response:`, apiResponse);
        
        if (!apiResponse.rates || !apiResponse.rates['1']) {
            console.log(`No rates found for ${loanType}`);
            return null;
        }
        
        const rateData = apiResponse.rates['1'];
        
        // Filter out zero rates (API returning 0 means unavailable)
        if (rateData.rate === 0 || rateData.apr === 0) {
            console.log(`${loanType} returned zero rates - not available`);
            return null;
        }
        
        console.log(`Successfully extracted ${loanType} rate:`, rateData.rate, 'APR:', rateData.apr);
        
        return {
            loanType: loanType,
            rate: rateData.rate,
            apr: rateData.apr
        };
    } catch (error) {
        console.error(`Error parsing ${loanType} rate:`, error);
        return null;
    }
}

// Smart function to fetch appropriate rate types based on loan amount
async function fetchAllRateTypes() {
    const queries = buildRateQueries();
    const loanAmount = parseFloat(loanAmountInput.value);
    const results = {};
    
    // Define loan limits (2025 updated)
    const FHA_LIMIT = 524250;
    const JUMBO_THRESHOLD = 806500;
    
    try {
        console.log(`Fetching rates for loan amount: $${loanAmount.toLocaleString()}`);
        
        // Always fetch conventional and VA
        const fetchPromises = [
            fetch(queries.conventional).then(r => r.json()).then(data => ({type: 'conventional', data})),
            fetch(queries.va).then(r => r.json()).then(data => ({type: 'va', data}))
        ];
        
        // Only fetch FHA if loan amount is within limits
        if (loanAmount <= FHA_LIMIT) {
            console.log('Loan amount eligible for FHA - fetching FHA rates');
            fetchPromises.push(
                fetch(queries.fha).then(r => r.json()).then(data => ({type: 'fha', data}))
            );
        } else {
            console.log(`Loan amount exceeds FHA limit`);
        }
        
        // Only fetch Jumbo if loan amount requires it
        if (loanAmount > JUMBO_THRESHOLD) {
            console.log('Loan amount requires jumbo loan - fetching jumbo rates');
            fetchPromises.push(
                fetch(queries.jumbo).then(r => r.json()).then(data => ({type: 'jumbo', data}))
            );
        }
        
        // Wait for all API calls
        const responses = await Promise.all(fetchPromises);
        
        // Process each response
        responses.forEach(response => {
            const rateData = extractRateData(response.data, response.type);
            if (rateData) {
                results[response.type] = rateData;
            }
        });
        
        console.log('Final results:', results);
        return results;
        
    } catch (error) {
        console.error('Error fetching rates:', error);
        return null;
    }
}

// Enhanced display function with CORRECT 2025 loan limits
function displayAllRateOptions(allRates) {
    const rateOptionsDiv = document.getElementById('rate-options');
    const loanAmount = parseFloat(loanAmountInput.value);
    
    let rateCardsHTML = '<div class="rate-comparison"><h3>Current Market Rates</h3>';
    
    // Add loan amount info
    rateCardsHTML += `<p class="loan-info">For loan amount: <strong>$${loanAmount.toLocaleString()}</strong></p>`;
    
    rateCardsHTML += '<div class="rate-grid">';
    
    // Show available rates
    Object.values(allRates).forEach(rateInfo => {
        if (rateInfo) {
            rateCardsHTML += `
                <div class="rate-card-mini">
                    <h4>${rateInfo.loanType.toUpperCase()}</h4>
                    <div class="rate-numbers">
                        <span class="rate-big">${rateInfo.rate.toFixed(3)}%</span>
                        <span class="apr-small">APR: ${rateInfo.apr.toFixed(3)}%</span>
                    </div>
                    <button class="select-rate-btn" data-rate="${rateInfo.rate}" data-type="${rateInfo.loanType}">
                        Select This Rate
                    </button>
                </div>
            `;
        }
    });
    
    rateCardsHTML += '</div>';
    
    // Add explanations for missing loan types with CORRECT 2025 limits
    const explanations = [];
    if (loanAmount > 524250 && !allRates.fha) {
        explanations.push(`FHA loans not available - loan amount exceeds $524,250 limit (2025)`);
    }
    if (loanAmount <= 806500 && !allRates.jumbo) {
        explanations.push(`Jumbo loans not needed - loan amount below $806,500 threshold (2025)`);
    }
    if (loanAmount > 806500 && !allRates.jumbo) {
        explanations.push(`Jumbo loans not available through this rate provider for this scenario`);
    }
    
    if (explanations.length > 0) {
        rateCardsHTML += '<div class="loan-explanations"><h4>Loan Type Availability:</h4>';
        explanations.forEach(explanation => {
            rateCardsHTML += `<p class="explanation">• ${explanation}</p>`;
        });
        rateCardsHTML += '</div>';
    }
    
    rateCardsHTML += '</div>';
    
    rateOptionsDiv.innerHTML = rateCardsHTML;
    rateOptionsDiv.style.display = 'block';
    
    // Add click handlers
    document.querySelectorAll('.select-rate-btn').forEach(button => {
        button.addEventListener('click', function() {
            const rate = this.getAttribute('data-rate');
            const type = this.getAttribute('data-type');
            
            interestRateInput.value = rate;
            calculateMortgage();
            
            document.querySelectorAll('.select-rate-btn').forEach(btn => {
                btn.style.backgroundColor = '';
                btn.textContent = 'Select This Rate';
            });
            
            this.style.backgroundColor = '#28a745';
            this.textContent = `${type.toUpperCase()} Selected!`;
        });
    });
}

// Function to handle lead form submission
function handleLeadSubmission(event) {
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        timeline: document.getElementById('timeline').value,
        notes: document.getElementById('notes').value,
        calculationData: {
            homePrice: formatCurrency(parseFloat(homePriceInput.value)),
            loanAmount: formatCurrency(parseFloat(loanAmountInput.value)),
            downPayment: document.getElementById('down-payment-percent').value + '%',
            interestRate: interestRateInput.value + '%',
            monthlyPayment: monthlyPaymentEl.textContent,
            totalInterest: totalInterestEl.textContent
        },
        submissionDate: new Date().toISOString()
    };
    
    let leads = JSON.parse(localStorage.getItem('mortgageLeads')) || [];
    leads.push(formData);
    localStorage.setItem('mortgageLeads', JSON.stringify(leads));
    
    console.log('Lead captured:', formData);
    
    const leadSection = document.getElementById('lead-capture');
    leadSection.innerHTML = `
        <div class="success-message">
            <h3>✅ Thank You ${formData.firstName}!</h3>
            <p>We've received your information and will contact you within 24 hours with personalized rate quotes.</p>
            <p><strong>Your calculation:</strong> ${formData.calculationData.monthlyPayment}/month for a ${formData.calculationData.loanAmount} loan</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: white; color: #667eea; border: none; border-radius: 5px; cursor: pointer;">Calculate Another Scenario</button>
        </div>
    `;
}

// Function to hide lead capture
function hideLeadCapture() {
    document.getElementById('lead-capture').style.display = 'none';
}

// Auto-calculation event listeners
homePriceInput.addEventListener('input', updateLoanCalculations);
downPaymentPercentInput.addEventListener('input', updateLoanCalculations);
interestRateInput.addEventListener('input', calculateMortgageWithLoading);
loanTermInput.addEventListener('input', calculateMortgageWithLoading);
propertyTaxRateInput.addEventListener('input', calculateMortgageWithLoading);
homeInsuranceInput.addEventListener('input', calculateMortgageWithLoading);

// Save calculation button
document.getElementById('save-calculation-btn').addEventListener('click', saveCalculation);

// Enhanced fetch rates button with lead capture trigger
document.getElementById('fetch-rates-btn').addEventListener('click', async function() {
    const button = this;
    const originalText = button.textContent;
    
    button.textContent = 'Loading All Rates...';
    button.disabled = true;
    
    const allRates = await fetchAllRateTypes();
    
    if (allRates) {
        displayAllRateOptions(allRates);
        
        // Show lead form after successful rate fetch (high-intent behavior)
        setTimeout(() => {
            showLeadCapture();
        }, 1000); // Small delay so they see the rates first
        
    } else {
        alert('Unable to fetch current rates. Please try again.');
    }
    
    button.textContent = originalText;
    button.disabled = false;
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLoanCalculations();
    calculateMortgage();
    displaySavedCalculations();
    
    // Add lead form listeners if elements exist
    const leadForm = document.getElementById('lead-form');
    const maybeLaterBtn = document.getElementById('maybe-later-btn');
    
    if (leadForm) {
        leadForm.addEventListener('submit', handleLeadSubmission);
    }
    
    if (maybeLaterBtn) {
        maybeLaterBtn.addEventListener('click', hideLeadCapture);
    }
    
    // Add toggle functionality for saved calculations
    const toggleBtn = document.getElementById('toggle-saved-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSavedCalculations);
    }
});

console.log("Enhanced mortgage calculator loaded successfully!");