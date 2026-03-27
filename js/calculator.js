/**
 * CALCULATOR.JS
 * All calculation logic for carbon footprint
 */

const Calculator = {
    /**
     * Calculate emissions from transport
     */
    calculateTransportEmissions: function(data) {
        const kmPerWeek = parseFloat(data.transport_km) || 0;
        const kmPerYear = kmPerWeek * 52;
        
        let fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.GASOLINA;
        if (data.fuel_type === 'Etanol') fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.ETANOL;
        else if (data.fuel_type === 'Diesel') fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.DIESEL;
        else if (data.fuel_type === 'Elétrico') fuelFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.ELETRICO;
        
        let publicTransportFactor = 1;
        if (data.public_transport === 'Sim, frequentemente') publicTransportFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.PUBLIC_TRANSPORT_REDUCTION.FREQUENT;
        else if (data.public_transport === 'Às vezes') publicTransportFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.PUBLIC_TRANSPORT_REDUCTION.SOMETIMES;
        else if (data.public_transport === 'Raramente') publicTransportFactor = CONFIG.EMISSION_FACTORS.TRANSPORT.PUBLIC_TRANSPORT_REDUCTION.RARELY;
        
        return kmPerYear * fuelFactor * publicTransportFactor;
    },
    
    /**
     * Calculate emissions from energy
     */
    calculateEnergyEmissions: function(data) {
        let kwhMonth = CONFIG.EMISSION_FACTORS.ENERGY_RANGES[data.energy_kwh] || 200;
        
        if (data.has_ac === 'Sim') {
            kwhMonth *= CONFIG.EMISSION_FACTORS.AC_MULTIPLIER;
        }
        
        const kwhYear = kwhMonth * 12;
        return kwhYear * CONFIG.EMISSION_FACTORS.ENERGY;
    },
    
    /**
     * Calculate emissions from food
     */
    calculateFoodEmissions: function(data) {
        return CONFIG.EMISSION_FACTORS.DIET[data.diet] || 1100;
    },
    
    /**
     * Calculate total emissions and breakdown
     */
    calculateTotalEmissions: function(rawData) {
        const transport = this.calculateTransportEmissions(rawData);
        const energy = this.calculateEnergyEmissions(rawData);
        const food = this.calculateFoodEmissions(rawData);
        
        const totalKg = transport + energy + food;
        const totalTon = totalKg / 1000;
        
        // Calculate percentages
        const total = transport + energy + food;
        const percentages = {
            transport: total > 0 ? (transport / total * 100).toFixed(0) : 0,
            energy: total > 0 ? (energy / total * 100).toFixed(0) : 0,
            food: total > 0 ? (food / total * 100).toFixed(0) : 0
        };
        
        // Compare to Brazil average
        const comparison = ((totalTon - CONFIG.BRAZIL_AVG_FOOTPRINT) / CONFIG.BRAZIL_AVG_FOOTPRINT * 100).toFixed(0);
        
        // Identify main sources
        const sources = [
            { name: 'Transporte', value: transport },
            { name: 'Energia', value: energy },
            { name: 'Alimentação', value: food }
        ];
        sources.sort((a, b) => b.value - a.value);
        const mainSources = sources.slice(0, 2).map(s => s.name);
        
        return {
            transport_kg: Math.round(transport),
            energy_kg: Math.round(energy),
            food_kg: Math.round(food),
            total_kg: Math.round(totalKg),
            total_ton: totalTon.toFixed(1),
            percentages: percentages,
            comparison_vs_brazil: `${comparison > 0 ? '+' : ''}${comparison}%`,
            main_sources: mainSources
        };
    },
    
    /**
     * Generate explanations with analogies
     */
    generateAnalogies: function(totalTon) {
        const carKm = Math.round(totalTon * 1000 / CONFIG.ANALOGIES.CAR_EMISSION_PER_KM);
        const trees = Math.round(totalTon * 1000 / CONFIG.ANALOGIES.TREE_ABSORPTION_PER_YEAR);
        const flightHours = Math.round(totalTon * 1000 / CONFIG.ANALOGIES.AIRPLANE_EMISSION_PER_HOUR);
        
        return {
            car_km: carKm.toLocaleString(),
            trees: trees,
            flight_hours: flightHours
        };
    },
    
    /**
     * Generate personalized recommendations
     */
    generateRecommendations: function(data, emissions) {
        const recommendations = [];
        
        // Transport recommendations
        if (emissions.transport_kg > 1000) {
            recommendations.push(ROUTES_DATA.recommendations.transport[0]);
        }
        
        // Energy recommendations
        if (data.has_ac === 'Sim') {
            recommendations.push(ROUTES_DATA.recommendations.energy[1]);
        }
        recommendations.push(ROUTES_DATA.recommendations.energy[0]);
        
        // Food recommendations
        if (data.diet === 'Consumo carne diariamente') {
            recommendations.push(ROUTES_DATA.recommendations.food[0]);
        } else if (data.diet === 'Carne algumas vezes por semana') {
            recommendations.push(ROUTES_DATA.recommendations.food[1]);
        } else if (data.diet === 'Pescetariano') {
            recommendations.push(ROUTES_DATA.recommendations.food[1]);
        }
        
        // Sort by impact (high to low)
        const impactOrder = { high: 0, medium: 1, low: 2 };
        recommendations.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
        
        return recommendations.slice(0, 5);
    },
    
    /**
     * Calculate goals and progress
     */
    calculateGoals: function(currentFootprint, recommendations) {
        const targetReduction = ROUTES_DATA.goals.default_reduction_target;
        const targetFootprint = currentFootprint * (1 - targetReduction);
        const reductionNeeded = currentFootprint - targetFootprint;
        
        // Calculate potential reduction from recommendations
        let potentialReduction = 0;
        for (const rec of recommendations) {
            potentialReduction += rec.reduction;
        }
        
        const progressPercent = Math.min(100, Math.round((potentialReduction / reductionNeeded) * 100));
        
        // Determine achieved achievements
        const achievements = [];
        for (const achievement of ROUTES_DATA.goals.achievements) {
            if (progressPercent >= achievement.threshold) {
                achievements.push(achievement);
            }
        }
        
        return {
            current: currentFootprint,
            target: targetFootprint.toFixed(1),
            reduction_needed: reductionNeeded.toFixed(1),
            reduction_target: `${targetReduction * 100}%`,
            progress_percent: progressPercent,
            achievements: achievements
        };
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}