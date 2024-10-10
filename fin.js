document.getElementById("investmentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get user inputs
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value);
    const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 100;
    const years = parseInt(document.getElementById("years").value);

    // Calculate future value
    const futureValue = calculateFutureValue(initialInvestment, monthlyContribution, interestRate, years);

    // Display the result
    document.getElementById("futureValue").textContent = `Future Value: $${futureValue.toFixed(2)}`;
});

function calculateFutureValue(initialInvestment, monthlyContribution, annualInterestRate, years) {
    const months = years * 12;
    const monthlyInterestRate = annualInterestRate / 12;
    let futureValue = initialInvestment;

    for (let i = 1; i <= months; i++) {
        futureValue += monthlyContribution;
        futureValue *= (1 + monthlyInterestRate);
    }

    return futureValue;
}
