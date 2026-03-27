/**
 * UI.js
 * DOM manipulation and UI rendering functions
 */

const UI = {
    formatNumber: function(number, decimals = 2) {
        if (isNaN(number)) return '0,00';
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    formatCurrency: function(value) {
        if (isNaN(value)) return 'R$ 0,00';
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    showElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) element.classList.remove('hidden');
    },

    hideElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) element.classList.add('hidden');
    },

    scrollToElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    updateProgress: function(currentStep, totalSteps) {
        const percent = (currentStep / totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressPercent) progressPercent.textContent = `${Math.round(percent)}%`;
        
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

    updateAgentStatus: function(agentIndex) {
        const agent = CONFIG.AGENTS[agentIndex];
        if (!agent) return;
        
        const agentIcon = document.getElementById('agentIcon');
        const agentName = document.getElementById('agentName');
        const agentDescription = document.getElementById('agentDescription');
        
        if (agentIcon) agentIcon.textContent = agent.icon;
        if (agentName) agentName.textContent = agent.name + ' Agent';
        if (agentDescription) agentDescription.textContent = agent.description;
    },

    renderIntakeForm: function(questions, answers = {}) {
        let html = '';
        
        questions.forEach((q) => {
            html += `<div class="form-group" data-question-id="${q.id}">
                        <label class="form-group__label">${q.text}</label>
                        <div class="form-group__helper-text">💡 ${q.explanation}</div>`;
            
            if (q.type === 'number') {
                html += `<input type="number" id="${q.id}" class="form-group__input" 
                            placeholder="${q.placeholder}" 
                            value="${answers[q.id] || ''}"
                            min="${q.min || 0}" 
                            max="${q.max || 1000}">`;
            } 
            else if (q.type === 'select') {
                html += `<select id="${q.id}" class="form-group__input">
                            <option value="">Selecione...</option>`;
                q.options.forEach(opt => {
                    html += `<option value="${opt}" ${answers[q.id] === opt ? 'selected' : ''}>${opt}</option>`;
                });
                html += `</select>`;
            }
            else if (q.type === 'radio') {
                html += `<div class="radio-group">`;
                q.options.forEach(opt => {
                    html += `<label class="radio-group__option">
                                <input type="radio" name="${q.id}" value="${opt}" class="radio-group__input"
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

    renderResults: function(emissions, explanationData) {
        const transportPercent = explanationData.breakdown.transporte || 0;
        const energyPercent = explanationData.breakdown.energia || 0;
        const foodPercent = explanationData.breakdown.alimentacao || 0;
        
        let html = `
            <div class="results__grid">
                <div class="results__card results__card--highlight">
                    <div class="results__card-icon">🌿</div>
                    <div class="results__card-content">
                        <h3 class="results__card-title">PEGADA TOTAL</h3>
                        <p class="results__card-value results__card-value--large">${explanationData.total_ton} tCO₂e</p>
                        <p class="results__card-subtitle">vs Brasil: ${explanationData.comparison}</p>
                    </div>
                </div>
                
                <div class="results__card">
                    <div class="results__card-icon">🚗</div>
                    <div class="results__card-content">
                        <h3 class="results__card-title">TRANSPORTE</h3>
                        <p class="results__card-value">${this.formatNumber(emissions.transport_kg)} kg</p>
                        <p class="results__card-subtitle">${transportPercent}% do total</p>
                    </div>
                </div>
                
                <div class="results__card">
                    <div class="results__card-icon">⚡</div>
                    <div class="results__card-content">
                        <h3 class="results__card-title">ENERGIA</h3>
                        <p class="results__card-value">${this.formatNumber(emissions.energy_kg)} kg</p>
                        <p class="results__card-subtitle">${energyPercent}% do total</p>
                    </div>
                </div>
                
                <div class="results__card">
                    <div class="results__card-icon">🍖</div>
                    <div class="results__card-content">
                        <h3 class="results__card-title">ALIMENTAÇÃO</h3>
                        <p class="results__card-value">${this.formatNumber(emissions.food_kg)} kg</p>
                        <p class="results__card-subtitle">${foodPercent}% do total</p>
                    </div>
                </div>
            </div>
            
            <div class="breakdown">
                <div class="breakdown__item">
                    <div class="breakdown__header">
                        <span>🚗 Transporte</span>
                        <span>${transportPercent}%</span>
                    </div>
                    <div class="breakdown__bar">
                        <div class="breakdown__fill" style="width: ${transportPercent}%; background-color: #3b82f6;"></div>
                    </div>
                </div>
                <div class="breakdown__item">
                    <div class="breakdown__header">
                        <span>⚡ Energia</span>
                        <span>${energyPercent}%</span>
                    </div>
                    <div class="breakdown__bar">
                        <div class="breakdown__fill" style="width: ${energyPercent}%; background-color: #f59e0b;"></div>
                    </div>
                </div>
                <div class="breakdown__item">
                    <div class="breakdown__header">
                        <span>🍖 Alimentação</span>
                        <span>${foodPercent}%</span>
                    </div>
                    <div class="breakdown__bar">
                        <div class="breakdown__fill" style="width: ${foodPercent}%; background-color: #10b981;"></div>
                    </div>
                </div>
            </div>
            
            <div class="analogies">
                <div class="analogies__title">🌳 Para você entender melhor:</div>
                <ul class="analogies__list">
                    <li class="analogies__item">🚗 Dirigir um carro médio por <strong>${explanationData.analogies.car_km} km</strong> em um ano</li>
                    <li class="analogies__item">🌲 Plantar <strong>${explanationData.analogies.trees}</strong> árvores para compensar</li>
                    <li class="analogies__item">✈️ Voar por <strong>${explanationData.analogies.flight_hours} horas</strong> em um avião</li>
                </ul>
            </div>
        `;
        
        return html;
    },

    renderRecommendations: function(recommendations) {
        if (!recommendations || recommendations.length === 0) {
            return '<p>Nenhuma recomendação disponível no momento.</p>';
        }
        
        let html = '<div class="results__grid">';
        
        for (const rec of recommendations) {
            const impactClass = rec.impact === 'high' ? 'recommendation-item--high-impact' : 
                               (rec.impact === 'medium' ? 'recommendation-item--medium-impact' : 
                               'recommendation-item--low-impact');
            
            html += `
                <div class="recommendation-item ${impactClass}">
                    <div class="recommendation-item__title">${rec.title}</div>
                    <div class="recommendation-item__description">${rec.description}</div>
                    <div class="recommendation-item__meta">
                        <span>📊 Impacto: ${rec.impact.toUpperCase()}</span>
                        <span>💪 Esforço: ${rec.effort.toUpperCase()}</span>
                        <span>🌱 Redução: ${rec.reduction} t CO₂/ano</span>
                        <span>💰 Economia: ${rec.savings}</span>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    },

    renderGoals: function(goals) {
        if (!goals) return '<p>Carregando metas...</p>';
        
        let html = `
            <div class="results__grid">
                <div class="results__card">
                    <div class="results__card-icon">🎯</div>
                    <div class="results__card-content">
                        <h3 class="results__card-title">META</h3>
                        <p class="results__card-value">${goals.reduction_target}</p>
                        <p class="results__card-subtitle">de redução até dezembro</p>
                    </div>
                </div>
                
                <div class="results__card">
                    <div class="results__card-icon">📉</div>
                    <div class="results__card-content">
                        <h3 class="results__card-title">META ANUAL</h3>
                        <p class="results__card-value">${goals.target} tCO₂e</p>
                        <p class="results__card-subtitle">Redução necessária: ${goals.reduction_needed} t</p>
                    </div>
                </div>
            </div>
            
            <div class="goal-progress">
                <div class="goal-fill" style="width: ${goals.progress_percent}%;">
                    ${goals.progress_percent}% alcançado
                </div>
            </div>
        `;
        
        // Adicionar informação sobre potencial de redução
        if (goals.potential_reduction && goals.recommendations_count) {
            html += `
                <div class="analogies" style="margin-top: 16px; background-color: #e8f5e9;">
                    <div class="analogies__title">💡 Potencial de Redução</div>
                    <p style="font-size: 14px; margin-top: 8px;">
                        Implementando as <strong>${goals.recommendations_count} recomendações</strong> sugeridas, 
                        você pode reduzir até <strong>${goals.potential_reduction} tCO₂e/ano</strong>!
                    </p>
                    <p style="font-size: 12px; color: #666; margin-top: 8px;">
                        ⚠️ Marque as ações concluídas no seu dia a dia para acompanhar seu progresso real.
                    </p>
                </div>
            `;
        }
        
        // Mostrar conquistas (desbloqueadas ou bloqueadas)
        if (goals.achievements && goals.achievements.length > 0) {
            for (const achievement of goals.achievements) {
                html += `<span class="badge">${achievement.title}</span>`;
            }
        } else {
            // Mostrar conquistas bloqueadas para motivar o usuário
            html += `
                <div style="margin-top: 16px;">
                    <p style="font-size: 12px; color: #888; margin-bottom: 8px;">🔒 Conquistas a desbloquear:</p>
            `;
            if (ROUTES_DATA && ROUTES_DATA.goals && ROUTES_DATA.goals.achievements) {
                for (const achievement of ROUTES_DATA.goals.achievements) {
                    html += `<span class="badge" style="opacity: 0.5; background: #ccc;">🔒 ${achievement.title} (${achievement.threshold}%)</span>`;
                }
            }
            html += `</div>`;
        }
        
        return html;
    },

    showLoading: function(buttonElement) {
        if (buttonElement) {
            buttonElement.dataset.originalText = buttonElement.innerHTML;
            buttonElement.disabled = true;
            buttonElement.innerHTML = '<span class="spinner"></span> Processando...';
        }
    },

    hideLoading: function(buttonElement) {
        if (buttonElement && buttonElement.dataset.originalText) {
            buttonElement.disabled = false;
            buttonElement.innerHTML = buttonElement.dataset.originalText;
        }
    }
};