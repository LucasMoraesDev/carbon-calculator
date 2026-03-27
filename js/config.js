/**
 * CONFIG.JS
 * Global configuration and emission constants
 * Based on GHG Protocol and IPCC methodology
 */

const CONFIG = {
    VERSION: '2.0.0',
    APP_NAME: 'Carbon Footprint Calculator',
    BRAZIL_AVG_FOOTPRINT: 4.5, // tCO2e per capita per year
    
    // Emission factors (kg CO2e per unit)
    EMISSION_FACTORS: {
        // Transport (kg CO2e per km)
        TRANSPORT: {
            GASOLINA: 0.192,
            ETANOL: 0.112,
            DIESEL: 0.168,
            ELETRICO: 0.050,
            PUBLIC_TRANSPORT_REDUCTION: {
                FREQUENT: 0.30,
                SOMETIMES: 0.60,
                RARELY: 0.90,
                NEVER: 1.00
            }
        },
        
        // Energy (kg CO2e per kWh - Brazil average)
        ENERGY: 0.084,
        
        // Diet (kg CO2e per year)
        DIET: {
            'Consumo carne diariamente': 1600,
            'Carne algumas vezes por semana': 1100,
            'Pescetariano': 800,
            'Vegetariano': 500,
            'Vegano': 350
        },
        
        // Energy consumption ranges (kWh/month)
        ENERGY_RANGES: {
            'Até 150 kWh': 125,
            '150-300 kWh': 225,
            'Acima de 300 kWh': 400,
            'Não sei': 200
        },
        
        // AC multiplier
        AC_MULTIPLIER: 1.3
    },
    
    // Analogies for explainability
    ANALOGIES: {
        CAR_EMISSION_PER_KM: 0.192, // kg CO2e per km
        TREE_ABSORPTION_PER_YEAR: 21, // kg CO2e per tree per year
        AIRPLANE_EMISSION_PER_HOUR: 250 // kg CO2e per flight hour
    },
    
    // Agent configuration
    AGENTS: [
        { id: 0, name: 'Orchestrator', icon: '🎭', description: 'Controls the conversation flow' },
        { id: 1, name: 'Intake', icon: '📋', description: 'Collects personal data empathetically' },
        { id: 2, name: 'Factors', icon: '📊', description: 'Applies emission factors' },
        { id: 3, name: 'Calculator', icon: '🧮', description: 'Calculates total footprint' },
        { id: 4, name: 'Explainability', icon: '💡', description: 'Translates numbers into insights' },
        { id: 5, name: 'Advisor', icon: '🎯', description: 'Generates recommendations' },
        { id: 6, name: 'Goal', icon: '🏆', description: 'Sets goals and tracks progress' }
    ]
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}