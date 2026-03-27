/**
 * CALCULATOR.js
 * All calculation logic for carbon footprint
 */

const Calculator = {
    calculateTransportEmissions: function(data) {
        var kmPerWeek = parseFloat(data.transport_km) || 0;
        var kmPerYear = kmPerWeek * 52;
        
        var fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.GASOLINA;
        if (data.fuel_type === 'Etanol') fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.ETANOL;
        else if (data.fuel_type === 'Diesel') fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.DIESEL;
        else if (data.fuel_type === 'Elétrico') fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.ELETRICO;
        
        var publicTransportFactor = 1;
        if (data.public_transport === 'Sim, frequentemente') publicTransportFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.PUBLIC_TRANSPORT_REDUCTION.FREQUENT;
        else if (data.public_transport === 'Às vezes') publicTransportFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.PUBLIC_TRANSPORT_REDUCTION.SOMETIMES;
        else if (data.public_transport === 'Raramente') publicTransportFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.PUBLIC_TRANSPORT_REDUCTION.RARELY;
        
        return kmPerYear * fuelFactor * publicTransportFactor;
    },

    calculateEnergyEmissions: function(data) {
        var kwhMonth = CONFIG.EMISSION_FACTORS.ENERGY_RANGES[data.energy_kwh] || 200;
        
        if (data.has_ac === 'Sim') {
            kwhMonth = kwhMonth * CONFIG.EMISSION_FACTORS.AC_MULTIPLIER;
        }
        
        var kwhYear = kwhMonth * 12;
        return kwhYear * CONFIG.EMISSION_FACTORS.ENERGY;
    },

    calculateFoodEmissions: function(data) {
        return CONFIG.EMISSION_FACTORS.DIET[data.diet] || 1100;
    },

    calculateTotalEmissions: function(rawData) {
        var transport = this.calculateTransportEmissions(rawData);
        var energy = this.calculateEnergyEmissions(rawData);
        var food = this.calculateFoodEmissions(rawData);
        
        var totalKg = transport + energy + food;
        var totalTon = totalKg / 1000;
        
        var total = transport + energy + food;
        var percentages = {
            transport: total > 0 ? Math.round((transport / total) * 100) : 0,
            energy: total > 0 ? Math.round((energy / total) * 100) : 0,
            food: total > 0 ? Math.round((food / total) * 100) : 0
        };
        
        var comparison = ((totalTon - CONFIG.BRAZIL_AVG_FOOTPRINT) / CONFIG.BRAZIL_AVG_FOOTPRINT * 100).toFixed(0);
        
        var sources = [
            { name: 'Transporte', value: transport },
            { name: 'Energia', value: energy },
            { name: 'Alimentação', value: food }
        ];
        sources.sort(function(a, b) {
            return b.value - a.value;
        });
        var mainSources = [sources[0].name, sources[1].name];
        
        return {
            transport_kg: Math.round(transport),
            energy_kg: Math.round(energy),
            food_kg: Math.round(food),
            total_kg: Math.round(totalKg),
            total_ton: totalTon.toFixed(1),
            percentages: percentages,
            comparison_vs_brazil: (comparison > 0 ? '+' : '') + comparison + '%',
            main_sources: mainSources
        };
    },

    generateAnalogies: function(totalTon) {
        var carKm = Math.round(totalTon * 1000 / CONFIG.ANALOGIES.CAR_EMISSION_PER_KM);
        var trees = Math.round(totalTon * 1000 / CONFIG.ANALOGIES.TREE_ABSORPTION_PER_YEAR);
        var flightHours = Math.round(totalTon * 1000 / CONFIG.ANALOGIES.AIRPLANE_EMISSION_PER_HOUR);
        
        return {
            car_km: carKm.toLocaleString(),
            trees: trees,
            flight_hours: flightHours
        };
    },

    generateRecommendations: function(data, emissions) {
        var recommendations = [];
        
        if (emissions.transport_kg > 1000) {
            recommendations.push(ROUTES_DATA.recommendations.transport[0]);
        }
        
        if (data.has_ac === 'Sim') {
            recommendations.push(ROUTES_DATA.recommendations.energy[1]);
        }
        recommendations.push(ROUTES_DATA.recommendations.energy[0]);
        
        if (data.diet === 'Consumo carne diariamente') {
            recommendations.push(ROUTES_DATA.recommendations.food[0]);
        } else if (data.diet === 'Carne algumas vezes por semana') {
            recommendations.push(ROUTES_DATA.recommendations.food[1]);
        } else if (data.diet === 'Pescetariano') {
            recommendations.push(ROUTES_DATA.recommendations.food[1]);
        }
        
        var impactOrder = { high: 0, medium: 1, low: 2 };
        recommendations.sort(function(a, b) {
            return impactOrder[a.impact] - impactOrder[b.impact];
        });
        
        return recommendations.slice(0, 5);
    },

    calculateGoals: function(currentFootprint, recommendations) {
        var targetReduction = ROUTES_DATA.goals.default_reduction_target;
        var targetFootprint = currentFootprint * (1 - targetReduction);
        var reductionNeeded = currentFootprint - targetFootprint;
        
        var progressPercent = 0;
        
        var achievements = [];
        for (var i = 0; i < ROUTES_DATA.goals.achievements.length; i++) {
            var achievement = ROUTES_DATA.goals.achievements[i];
            if (progressPercent >= achievement.threshold) {
                achievements.push(achievement);
            }
        }
        
        var potentialReduction = 0;
        for (var j = 0; j < recommendations.length; j++) {
            potentialReduction = potentialReduction + recommendations[j].reduction;
        }
        
        return {
            current: currentFootprint,
            target: targetFootprint.toFixed(1),
            reduction_needed: reductionNeeded.toFixed(1),
            reduction_target: (targetReduction * 100) + '%',
            progress_percent: progressPercent,
            achievements: achievements,
            potential_reduction: potentialReduction.toFixed(1),
            recommendations_count: recommendations.length
        };
    }
};