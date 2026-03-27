/**
 * APP.JS
 * Main application controller and initialization
 */

// Application state
let appState = {
    currentAgent: 0,
    totalAgents: 7,
    answers: {},
    emissions: null,
    calculatorResult: null,
    recommendations: null,
    goals: null
};

/**
 * Initialize the application
 */
function initApp() {
    console.log('Carbon Footprint Calculator - Multi-Agent System');
    
    // Update progress display
    UI.updateProgress(0, appState.totalAgents);
    
    // Set initial agent status
    UI.updateAgentStatus(0);
    
    // Add event listeners
    document.getElementById('prevBtn')?.addEventListener('click', prevStep);
    document.getElementById('nextBtn')?.addEventListener('click', nextStep);
}

/**
 * Start the journey
 */
function startJourney() {
    appState.currentAgent = 1;
    UI.updateProgress(appState.currentAgent, appState.totalAgents);
    UI.updateAgentStatus(appState.currentAgent);
    
    // Show navigation
    document.getElementById('navigation').style.display = 'flex';
    
    // Render intake form
    const agentContent = document.getElementById('agentContent');
    if (agentContent) {
        agentContent.innerHTML = UI.renderIntakeForm(ROUTES_DATA.questions, appState.answers);
    }
}

/**
 * Collect answers from form
 */
function collectAnswers() {
    for (const question of ROUTES_DATA.questions) {
        let value;
        
        if (question.type === 'radio') {
            const selected = document.querySelector(`input[name="${question.id}"]:checked`);
            value = selected ? selected.value : appState.answers[question.id];
        } else {
            const element = document.getElementById(question.id);
            if (element) value = element.value;
        }
        
        if (value && value !== '') {
            appState.answers[question.id] = value;
        }
    }
}

/**
 * Validate answers
 */
function validateAnswers() {
    for (const question of ROUTES_DATA.questions) {
        if (question.required && !appState.answers[question.id]) {
            alert(`Por favor, responda: ${question.text}`);
            return false;
        }
    }
    return true;
}

/**
 * Process all agents
 */
function processAgents() {
    UI.showLoading(CONFIG.AGENTS[appState.currentAgent].name);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
        try {
            // Agent 2: Factors - Process data
            const emissions = Calculator.calculateTotalEmissions(appState.answers);
            appState.emissions = emissions;
            
            // Agent 3: Calculator - Already done in calculateTotalEmissions
            appState.calculatorResult = {
                total_ton: emissions.total_ton,
                main_sources: emissions.main_sources,
                comparison: emissions.comparison_vs_brazil
            };
            
            // Agent 4: Explainability - Generate analogies
            const analogies = Calculator.generateAnalogies(parseFloat(emissions.total_ton));
            const explanationData = {
                total_ton: emissions.total_ton,
                breakdown: emissions.percentages,
                comparison: emissions.comparison_vs_brazil,
                analogies: analogies
            };
            
            // Agent 5: Advisor - Generate recommendations
            const recommendations = Calculator.generateRecommendations(appState.answers, emissions);
            appState.recommendations = recommendations;
            
            // Agent 6: Goal - Calculate goals
            const goals = Calculator.calculateGoals(parseFloat(emissions.total_ton), recommendations);
            appState.goals = goals;
            
            // Render results
            const resultsHtml = UI.renderResults(emissions, explanationData, recommendations, goals);
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                resultsSection.innerHTML = resultsHtml;
                resultsSection.style.display = 'block';
            }
            
            // Update progress to completed
            appState.currentAgent = appState.totalAgents;
            UI.updateProgress(appState.currentAgent, appState.totalAgents);
            
            // Hide navigation, show results
            document.getElementById('navigation').style.display = 'none';
            document.getElementById('agentCard').style.display = 'none';
            
            UI.scrollToTop();
            
        } catch (error) {
            console.error('Error processing agents:', error);
            UI.showError('Ocorreu um erro ao processar seus dados. Por favor, tente novamente.');
        }
    }, 800);
}

/**
 * Next step handler
 */
function nextStep() {
    if (appState.currentAgent === 1) {
        // Collect answers from intake form
        collectAnswers();
        
        // Validate answers
        if (!validateAnswers()) {
            return;
        }
        
        // Process all agents
        processAgents();
    }
}

/**
 * Previous step handler
 */
function prevStep() {
    if (appState.currentAgent > 1) {
        appState.currentAgent--;
        UI.updateProgress(appState.currentAgent, appState.totalAgents);
        UI.updateAgentStatus(appState.currentAgent);
        
        // Show intake form again
        const agentContent = document.getElementById('agentContent');
        if (agentContent) {
            agentContent.innerHTML = UI.renderIntakeForm(ROUTES_DATA.questions, appState.answers);
        }
        
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('agentCard').style.display = 'block';
        UI.scrollToTop();
    }
}

/**
 * Reset application
 */
function resetApp() {
    appState = {
        currentAgent: 0,
        totalAgents: 7,
        answers: {},
        emissions: null,
        calculatorResult: null,
        recommendations: null,
        goals: null
    };
    
    document.getElementById('navigation').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('agentCard').style.display = 'block';
    document.getElementById('agentContent').innerHTML = `
        <div class="welcome-message">
            <h3>Welcome to Carbon Footprint Calculator</h3>
            <p>I'll guide you through 7 specialized agents to calculate, understand, and reduce your carbon footprint.</p>
            <button class="btn-primary" onclick="window.startJourney()">Start Journey →</button>
        </div>
    `;
    
    UI.updateProgress(0, appState.totalAgents);
    UI.updateAgentStatus(0);
}

// Make functions globally available
window.initApp = initApp;
window.startJourney = startJourney;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.resetApp = resetApp;

// Initialize on load
document.addEventListener('DOMContentLoaded', initApp);