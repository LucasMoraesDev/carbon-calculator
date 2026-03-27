/**
 * UI.JS
 * DOM manipulation and UI rendering functions
 */

const UI = {
    /**
     * Update progress bar and timeline
     */
    updateProgress: function(currentStep, totalSteps) {
        const percent = (currentStep / totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressPercent) progressPercent.textContent = `${Math.round(percent)}%`;
        
        // Update timeline
        const timeline = document.getElementById('agentsTimeline');
        if (timeline && CONFIG.AGENTS) {
            timeline.innerHTML = '';
            CONFIG.AGENTS.forEach((agent, index) => {
                const step = document.createElement('div');
                step.className = 'timeline-step';
                if (index < currentStep) step.classList.add('completed');
                if (index === currentStep) step.classList.add('active');
                step.innerHTML = `${agent.icon}<br>${agent.name}`;
                step.title = agent.description;
                timeline.appendChild(step);
            });
        }
    },
    
    /**
     * Update agent status display
     */
    updateAgentStatus: function(agentIndex) {
        const agent = CONFIG.AGENTS[agentIndex];
        if (!agent) return;
        
        const agentBadge = document.getElementById('agentBadge');
        const agentName = document.getElementById('agentName');
        const agentDescription = document.getElementById('agentDescription');
        const agentIcon = document.getElementById('agentIcon');
        const statusText = document.querySelector('.status-text');
        
        if (agentBadge) agentBadge.textContent = agent.name + ' Agent';
        if (agentName) agentName.textContent = agent.name + ' Agent';
        if (agentDescription) agentDescription.textContent = agent.description;
        if (agentIcon) agentIcon.textContent = agent.icon;
        if (statusText) statusText.textContent = `${agent.name} Active`;
    },
    
    /**
     * Render intake form
     */
    renderIntakeForm: function(questions, answers = {}) {
        let html = '';
        
        questions.forEach((q, index) => {
            html += `<div class="form-group" data-question-id="${q.id}">
                        <label>${q.text}</label>
                        <div class="helper-text">💡 ${q.explanation}</div>`;
            
            if (q.type === 'number') {
                html += `<input type="number" id="${q.id}" name="${q.id}" 
                            placeholder="${q.placeholder}" 
                            value="${answers[q.id] || ''}"
                            min="${q.min || 0}" 
                            max="${q.max || 1000}">`;
            } 
            else if (q.type === 'select') {
                html += `<select id="${q.id}" name="${q.id}">
                            <option value="">Selecione...</option>`;
                q.options.forEach(opt => {
                    html += `<option value="${opt}" ${answers[q.id] === opt ? 'selected' : ''}>${opt}</option>`;
                });
                html += `</select>`;
            }
            else if (q.type === 'radio') {
                html += `<div class="radio-group">`;
                q.options.forEach(opt => {
                    html += `<label>
                                <input type="radio" name="${q.id}" value="${opt}" 
                                    ${answers[q.id] === opt ? 'checked' : ''}>
                                ${opt}
                            </label>`;
                });
                html += `</div>`;
            }
            
            html += `</div>`;
        });
        
        return html;
    },
    
    /**
     * Render calculator results
     */
    renderResults: function(emissions, explanations, recommendations, goals) {
        let html = '';
        
        // Explanation section
        html += `
            <div class="result-card">
                <div class="result-title">📊 Sua Pegada de Carbono</div>
                <div class="metric-large">${explanations.total_ton} tCO₂e/ano</div>
                <p style="text-align: center; color: #7f8c8d;">vs média Brasil: ${explanations.comparison}</p>
                
                <div style="margin: 20px 0;">
                    <strong>🔍 O que mais contribui:</strong>
                    <ul style="margin-top: 10px;">
                        <li>🚗 Transporte: ${explanations.breakdown.transporte}% (${emissions.transport_kg.toLocaleString()} kg)</li>
                        <li>⚡ Energia: ${explanations.breakdown.energia}% (${emissions.energy_kg.toLocaleString()} kg)</li>
                        <li>🍖 Alimentação: ${explanations.breakdown.alimentacao}% (${emissions.food_kg.toLocaleString()} kg)</li>
                    </ul>
                </div>
                
                <div style="background: #ecf0f1; padding: 15px; border-radius: 12px; margin-top: 15px;">
                    <strong>🌳 Para você entender melhor:</strong>
                    <p style="margin-top: 8px;">Sua pegada equivale a:</p>
                    <ul style="margin-top: 5px;">
                        <li>🚗 Dirigir um carro médio por <strong>${explanations.analogies.car_km} km</strong> em um ano</li>
                        <li>🌲 Plantar <strong>${explanations.analogies.trees}</strong> árvores para compensar</li>
                        <li>✈️ Voar por <strong>${explanations.analogies.flight_hours} horas</strong> em um avião</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Recommendations section
        html += `
            <div class="result-card">
                <div class="result-title">💡 Recomendações Personalizadas</div>
        `;
        
        for (const rec of recommendations) {
            const impactClass = rec.impact === 'high' ? 'high-impact' : (rec.impact === 'medium' ? 'medium-impact' : 'low-impact');
            html += `
                <div class="recommendation-item ${impactClass}">
                    <strong>${rec.title}</strong><br>
                    <span style="font-size: 14px; color: #666;">${rec.description}</span><br>
                    <span style="font-size: 12px; display: inline-block; margin-top: 8px;">
                        📊 Impacto: ${rec.impact.toUpperCase()} | 
                        💪 Esforço: ${rec.effort.toUpperCase()} | 
                        🌱 Redução: ${rec.reduction} t CO₂/ano | 
                        💰 Economia: ${rec.savings}
                    </span>
                </div>
            `;
        }
        
        html += `</div>`;
        
        // Goals section
        html += `
            <div class="result-card">
                <div class="result-title">🎯 Sua Meta de Redução</div>
                <p><strong>Meta:</strong> Reduzir ${goals.reduction_target} da sua pegada</p>
                <p><strong>De:</strong> ${goals.current} tCO₂e/ano → <strong>Para:</strong> ${goals.target} tCO₂e/ano</p>
                <p><strong>Redução necessária:</strong> ${goals.reduction_needed} tCO₂e/ano</p>
                
                <div class="goal-progress">
                    <div class="goal-fill" style="width: ${goals.progress_percent}%;">
                        ${goals.progress_percent}%
                    </div>
                </div>
        `;
        
        for (const achievement of goals.achievements) {
            html += `<div class="badge">${achievement.icon} ${achievement.title}</div>`;
        }
        
        html += `</div>`;
        
        return html;
    },
    
    /**
     * Show loading state
     */
    showLoading: function(agentName) {
        const agentContent = document.getElementById('agentContent');
        if (agentContent) {
            agentContent.innerHTML = `
                <div class="loading" style="padding: 40px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                    <p>${agentName} Agent is processing your data...</p>
                </div>
            `;
        }
    },
    
    /**
     * Show error message
     */
    showError: function(message) {
        const agentContent = document.getElementById('agentContent');
        if (agentContent) {
            agentContent.innerHTML = `
                <div style="background: #fee; border: 1px solid #fcc; border-radius: 12px; padding: 20px; text-align: center; color: #c33;">
                    <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
                    <p>${message}</p>
                    <button class="btn-secondary" onclick="location.reload()" style="margin-top: 16px;">Try Again</button>
                </div>
            `;
        }
    },
    
    /**
     * Scroll to top smoothly
     */
    scrollToTop: function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}