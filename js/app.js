/**
 * APP.js - CORRIGIDO
 * Main application controller and initialization
 */

let appState = {
    currentAgent: 0,
    totalAgents: 7,
    answers: {},
    emissions: null,
    calculatorResult: null,
    recommendations: null,
    goals: null
};

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    console.log('🌍 Carbon Footprint Calculator - Multi-Agent System');
    
    UI.updateProgress(0, appState.totalAgents);
    UI.updateAgentStatus(0);
    
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startJourney);
    }
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', prevStep);
    if (nextBtn) nextBtn.addEventListener('click', nextStep);
}

function startJourney() {
    appState.currentAgent = 1;
    UI.updateProgress(appState.currentAgent, appState.totalAgents);
    UI.updateAgentStatus(appState.currentAgent);
    
    document.getElementById('navigation').classList.remove('hidden');
    
    const agentContent = document.getElementById('agentContent');
    if (agentContent) {
        agentContent.innerHTML = UI.renderIntakeForm(ROUTES_DATA.questions, appState.answers);
    }
    
    UI.scrollToElement('agentCard');
}

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

function validateAnswers() {
    for (const question of ROUTES_DATA.questions) {
        if (question.required && !appState.answers[question.id]) {
            alert(`❌ Por favor, responda: ${question.text}`);
            return false;
        }
    }
    return true;
}

function processAgents() {
    const submitButton = document.querySelector('.form-submit');
    UI.showLoading(submitButton);
    
    setTimeout(() => {
        try {
            // Calculate emissions
            const emissions = Calculator.calculateTotalEmissions(appState.answers);
            appState.emissions = emissions;
            
            // Generate analogies
            const analogies = Calculator.generateAnalogies(parseFloat(emissions.total_ton));
            
            // Create explanation data with correct percentages
            const explanationData = {
                total_ton: emissions.total_ton,
                breakdown: {
                    transporte: parseInt(emissions.percentages.transport),
                    energia: parseInt(emissions.percentages.energy),
                    alimentacao: parseInt(emissions.percentages.food)
                },
                comparison: emissions.comparison_vs_brazil,
                analogies: analogies
            };
            
            // Generate recommendations
            const recommendations = Calculator.generateRecommendations(appState.answers, emissions);
            appState.recommendations = recommendations;
            
            // Calculate goals
            const goals = Calculator.calculateGoals(parseFloat(emissions.total_ton), recommendations);
            appState.goals = goals;
            
            // Render all sections
            const resultsHtml = UI.renderResults(emissions, explanationData);
            const recommendationsHtml = UI.renderRecommendations(recommendations);
            const goalsHtml = UI.renderGoals(goals);
            
            document.getElementById('results-content').innerHTML = resultsHtml;
            document.getElementById('recommendations-content').innerHTML = recommendationsHtml;
            document.getElementById('goals-content').innerHTML = goalsHtml;
            
            // Show result sections
            UI.showElement('results');
            UI.showElement('recommendations');
            UI.showElement('goals');
            
            // Update progress to completed
            appState.currentAgent = appState.totalAgents;
            UI.updateProgress(appState.currentAgent, appState.totalAgents);
            
            // Hide agent card and navigation
            document.getElementById('navigation').classList.add('hidden');
            document.getElementById('agentCard').classList.add('hidden');
            
            // Scroll to results
            UI.scrollToElement('results');
            
            console.log('✅ Cálculo concluído:', emissions);
            
        } catch (error) {
            console.error('❌ Erro:', error);
            alert('❌ Ocorreu um erro ao calcular. Por favor, tente novamente.');
        } finally {
            UI.hideLoading(submitButton);
        }
    }, 800);
}

function nextStep() {
    if (appState.currentAgent === 1) {
        collectAnswers();
        
        if (!validateAnswers()) {
            return;
        }
        
        processAgents();
    }
}

function prevStep() {
    if (appState.currentAgent > 1) {
        appState.currentAgent--;
        UI.updateProgress(appState.currentAgent, appState.totalAgents);
        UI.updateAgentStatus(appState.currentAgent);
        
        const agentContent = document.getElementById('agentContent');
        if (agentContent) {
            agentContent.innerHTML = UI.renderIntakeForm(ROUTES_DATA.questions, appState.answers);
        }
        
        UI.hideElement('results');
        UI.hideElement('recommendations');
        UI.hideElement('goals');
        document.getElementById('agentCard').classList.remove('hidden');
        document.getElementById('navigation').classList.remove('hidden');
        
        UI.scrollToElement('agentCard');
    }
}