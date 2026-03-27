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
        
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressPercent) progressPercent.textContent = Math.round(percent) + '%';
        
        const timeline = document.getElementById('agentsTimeline');
        if (timeline && CONFIG.AGENTS) {
            timeline.innerHTML = '';
            CONFIG.AGENTS.forEach(function(agent, index) {
                const step = document.createElement('div');
                step.className = 'timeline-step';
                if (index < currentStep) step.classList.add('completed');
                if (index === currentStep) step.classList.add('active');
                step.innerHTML = agent.icon + '<br>' + agent.name;
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

    renderIntakeForm: function(questions, answers) {
        answers = answers || {};
        let html = '';
        
        for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            html += '<div class="form-group" data-question-id="' + q.id + '">';
            html += '<label class="form-group__label">' + q.text + '</label>';
            html += '<div class="form-group__helper-text">💡 ' + q.explanation + '</div>';
            
            if (q.type === 'number') {
                html += '<input type="number" id="' + q.id + '" class="form-group__input" ';
                html += 'placeholder="' + q.placeholder + '" ';
                html += 'value="' + (answers[q.id] || '') + '" ';
                html += 'min="' + (q.min || 0) + '" max="' + (q.max || 1000) + '">';
            } 
            else if (q.type === 'select') {
                html += '<select id="' + q.id + '" class="form-group__input">';
                html += '<option value="">Selecione...</option>';
                for (var j = 0; j < q.options.length; j++) {
                    var opt = q.options[j];
                    var selected = (answers[q.id] === opt) ? 'selected' : '';
                    html += '<option value="' + opt + '" ' + selected + '>' + opt + '</option>';
                }
                html += '</select>';
            }
            else if (q.type === 'radio') {
                html += '<div class="radio-group">';
                for (var k = 0; k < q.options.length; k++) {
                    var opt = q.options[k];
                    var checked = (answers[q.id] === opt) ? 'checked' : '';
                    html += '<label class="radio-group__option">';
                    html += '<input type="radio" name="' + q.id + '" value="' + opt + '" class="radio-group__input" ' + checked + '>';
                    html += opt;
                    html += '</label>';
                }
                html += '</div>';
            }
            
            html += '</div>';
        }
        
        return html;
    },

    renderResults: function(emissions, explanationData) {
        var transportPercent = explanationData.breakdown.transporte || 0;
        var energyPercent = explanationData.breakdown.energia || 0;
        var foodPercent = explanationData.breakdown.alimentacao || 0;
        
        var html = '';
        html += '<div class="results__grid">';
        html += '<div class="results__card results__card--highlight">';
        html += '<div class="results__card-icon">🌿</div>';
        html += '<div class="results__card-content">';
        html += '<h3 class="results__card-title">PEGADA TOTAL</h3>';
        html += '<p class="results__card-value results__card-value--large">' + explanationData.total_ton + ' tCO₂e</p>';
        html += '<p class="results__card-subtitle">vs Brasil: ' + explanationData.comparison + '</p>';
        html += '</div></div>';
        
        html += '<div class="results__card">';
        html += '<div class="results__card-icon">🚗</div>';
        html += '<div class="results__card-content">';
        html += '<h3 class="results__card-title">TRANSPORTE</h3>';
        html += '<p class="results__card-value">' + this.formatNumber(emissions.transport_kg) + ' kg</p>';
        html += '<p class="results__card-subtitle">' + transportPercent + '% do total</p>';
        html += '</div></div>';
        
        html += '<div class="results__card">';
        html += '<div class="results__card-icon">⚡</div>';
        html += '<div class="results__card-content">';
        html += '<h3 class="results__card-title">ENERGIA</h3>';
        html += '<p class="results__card-value">' + this.formatNumber(emissions.energy_kg) + ' kg</p>';
        html += '<p class="results__card-subtitle">' + energyPercent + '% do total</p>';
        html += '</div></div>';
        
        html += '<div class="results__card">';
        html += '<div class="results__card-icon">🍖</div>';
        html += '<div class="results__card-content">';
        html += '<h3 class="results__card-title">ALIMENTAÇÃO</h3>';
        html += '<p class="results__card-value">' + this.formatNumber(emissions.food_kg) + ' kg</p>';
        html += '<p class="results__card-subtitle">' + foodPercent + '% do total</p>';
        html += '</div></div>';
        html += '</div>';
        
        html += '<div class="breakdown">';
        html += '<div class="breakdown__item"><div class="breakdown__header"><span>🚗 Transporte</span><span>' + transportPercent + '%</span></div>';
        html += '<div class="breakdown__bar"><div class="breakdown__fill" style="width: ' + transportPercent + '%; background-color: #3b82f6;"></div></div></div>';
        html += '<div class="breakdown__item"><div class="breakdown__header"><span>⚡ Energia</span><span>' + energyPercent + '%</span></div>';
        html += '<div class="breakdown__bar"><div class="breakdown__fill" style="width: ' + energyPercent + '%; background-color: #f59e0b;"></div></div></div>';
        html += '<div class="breakdown__item"><div class="breakdown__header"><span>🍖 Alimentação</span><span>' + foodPercent + '%</span></div>';
        html += '<div class="breakdown__bar"><div class="breakdown__fill" style="width: ' + foodPercent + '%; background-color: #10b981;"></div></div></div>';
        html += '</div>';
        
        html += '<div class="analogies">';
        html += '<div class="analogies__title">🌳 Para você entender melhor:</div>';
        html += '<ul class="analogies__list">';
        html += '<li class="analogies__item">🚗 Dirigir um carro médio por <strong>' + explanationData.analogies.car_km + ' km</strong> em um ano</li>';
        html += '<li class="analogies__item">🌲 Plantar <strong>' + explanationData.analogies.trees + '</strong> árvores para compensar</li>';
        html += '<li class="analogies__item">✈️ Voar por <strong>' + explanationData.analogies.flight_hours + ' horas</strong> em um avião</li>';
        html += '</ul></div>';
        
        return html;
    },

    renderRecommendations: function(recommendations) {
        if (!recommendations || recommendations.length === 0) {
            return '<p>Nenhuma recomendação disponível no momento.</p>';
        }
        
        var html = '<div class="results__grid">';
        
        for (var i = 0; i < recommendations.length; i++) {
            var rec = recommendations[i];
            var impactClass = '';
            if (rec.impact === 'high') impactClass = 'recommendation-item--high-impact';
            else if (rec.impact === 'medium') impactClass = 'recommendation-item--medium-impact';
            else impactClass = 'recommendation-item--low-impact';
            
            html += '<div class="recommendation-item ' + impactClass + '">';
            html += '<div class="recommendation-item__title">' + rec.title + '</div>';
            html += '<div class="recommendation-item__description">' + rec.description + '</div>';
            html += '<div class="recommendation-item__meta">';
            html += '<span>📊 Impacto: ' + rec.impact.toUpperCase() + '</span>';
            html += '<span>💪 Esforço: ' + rec.effort.toUpperCase() + '</span>';
            html += '<span>🌱 Redução: ' + rec.reduction + ' t CO₂/ano</span>';
            html += '<span>💰 Economia: ' + rec.savings + '</span>';
            html += '</div></div>';
        }
        
        html += '</div>';
        return html;
    },

    renderGoals: function(goals) {
        if (!goals) return '<p>Carregando metas...</p>';
        
        var html = '';
        html += '<div class="results__grid">';
        html += '<div class="results__card">';
        html += '<div class="results__card-icon">🎯</div>';
        html += '<div class="results__card-content">';
        html += '<h3 class="results__card-title">META</h3>';
        html += '<p class="results__card-value">' + goals.reduction_target + '</p>';
        html += '<p class="results__card-subtitle">de redução até dezembro</p>';
        html += '</div></div>';
        
        html += '<div class="results__card">';
        html += '<div class="results__card-icon">📉</div>';
        html += '<div class="results__card-content">';
        html += '<h3 class="results__card-title">META ANUAL</h3>';
        html += '<p class="results__card-value">' + goals.target + ' tCO₂e</p>';
        html += '<p class="results__card-subtitle">Redução necessária: ' + goals.reduction_needed + ' t</p>';
        html += '</div></div>';
        html += '</div>';
        
        html += '<div class="goal-progress">';
        html += '<div class="goal-fill" style="width: ' + goals.progress_percent + '%;">';
        html += goals.progress_percent + '% alcançado';
        html += '</div></div>';
        
        if (goals.potential_reduction && goals.recommendations_count) {
            html += '<div class="analogies" style="margin-top: 16px; background-color: #e8f5e9;">';
            html += '<div class="analogies__title">💡 Potencial de Redução</div>';
            html += '<p style="font-size: 14px; margin-top: 8px;">';
            html += 'Implementando as <strong>' + goals.recommendations_count + ' recomendações</strong> sugeridas, ';
            html += 'você pode reduzir até <strong>' + goals.potential_reduction + ' tCO₂e/ano</strong>!';
            html += '</p>';
            html += '<p style="font-size: 12px; color: #666; margin-top: 8px;">';
            html += '⚠️ Marque as ações concluídas no seu dia a dia para acompanhar seu progresso real.';
            html += '</p></div>';
        }
        
        html += '<div style="margin-top: 16px;">';
        html += '<p style="font-size: 12px; color: #666; margin-bottom: 8px;">';
        if (goals.progress_percent >= 20) {
            html += '🏆 Conquistas desbloqueadas:';
        } else {
            html += '🔒 Próximas conquistas:';
        }
        html += '</p>';
        
        if (ROUTES_DATA && ROUTES_DATA.goals && ROUTES_DATA.goals.achievements) {
            for (var i = 0; i < ROUTES_DATA.goals.achievements.length; i++) {
                var achievement = ROUTES_DATA.goals.achievements[i];
                var isUnlocked = goals.progress_percent >= achievement.threshold;
                if (isUnlocked) {
                    html += '<span class="badge" style="background: linear-gradient(135deg, #f59e0b, #10b981);">✅ ' + achievement.title + '</span>';
                } else {
                    html += '<span class="badge" style="opacity: 0.5; background: #9ca3af;">🔒 ' + achievement.title + ' (' + achievement.threshold + '%)</span>';
                }
            }
        }
        html += '</div>';
        
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