/**
 * ROUTES-DATA.JS
 * Question routes and data collection structure
 */

const ROUTES_DATA = {
    // All questions for the Intake Agent
    questions: [
        {
            id: 'transport_km',
            text: '🚗 Em média, quantos quilômetros você percorre por semana de carro?',
            type: 'number',
            placeholder: 'km/semana',
            explanation: 'Para entender seu impacto com deslocamento',
            category: 'transport',
            required: true,
            min: 0,
            max: 1000
        },
        {
            id: 'fuel_type',
            text: '⛽ Qual tipo de combustível seu carro utiliza?',
            type: 'select',
            options: ['Gasolina', 'Etanol', 'Diesel', 'Elétrico'],
            explanation: 'Diferentes combustíveis têm diferentes emissões de CO₂',
            category: 'transport',
            required: true
        },
        {
            id: 'energy_kwh',
            text: '⚡ Qual é o consumo médio de energia elétrica da sua casa por mês?',
            type: 'select',
            options: ['Até 150 kWh', '150-300 kWh', 'Acima de 300 kWh', 'Não sei'],
            explanation: 'Energia elétrica é uma das principais fontes de emissões',
            category: 'energy',
            required: true
        },
        {
            id: 'has_ac',
            text: '❄️ Sua residência possui ar-condicionado?',
            type: 'radio',
            options: ['Sim', 'Não'],
            explanation: 'Ar-condicionado aumenta significativamente o consumo de energia',
            category: 'energy',
            required: true
        },
        {
            id: 'diet',
            text: '🍖 Qual opção melhor representa sua rotina alimentar?',
            type: 'select',
            options: ['Consumo carne diariamente', 'Carne algumas vezes por semana', 'Pescetariano', 'Vegetariano', 'Vegano'],
            explanation: 'A alimentação tem grande impacto na pegada de carbono',
            category: 'food',
            required: true
        },
        {
            id: 'public_transport',
            text: '🚌 Utiliza transporte público regularmente?',
            type: 'select',
            options: ['Sim, frequentemente', 'Às vezes', 'Raramente', 'Nunca'],
            explanation: 'Transporte público reduz emissões individuais significativamente',
            category: 'transport',
            required: true
        }
    ],
    
    // Emission factors for each category
    factors: {
        transport: {
            base_emission: 'kg CO2e per km',
            factors: {
                Gasolina: 0.192,
                Etanol: 0.112,
                Diesel: 0.168,
                Elétrico: 0.05
            }
        },
        energy: {
            base_emission: 'kg CO2e per kWh',
            factor: 0.084
        },
        diet: {
            base_emission: 'kg CO2e per year',
            factors: {
                'Consumo carne diariamente': 1600,
                'Carne algumas vezes por semana': 1100,
                'Pescetariano': 800,
                'Vegetariano': 500,
                'Vegano': 350
            }
        }
    },
    
    // Recommendation templates
    recommendations: {
        transport: [
            {
                title: 'Reduza o uso do carro',
                description: 'Troque 2 dias de carro por transporte público ou bicicleta',
                impact: 'high',
                effort: 'medium',
                reduction: 0.9,
                savings: 'R$ 240/ano'
            },
            {
                title: 'Compartilhe caronas',
                description: 'Utilize aplicativos de carona ou organize com colegas',
                impact: 'medium',
                effort: 'medium',
                reduction: 0.5,
                savings: 'R$ 180/ano'
            }
        ],
        energy: [
            {
                title: 'Troque lâmpadas por LED',
                description: 'Substitua todas as lâmpadas por modelos LED',
                impact: 'low',
                effort: 'low',
                reduction: 0.2,
                savings: 'R$ 100/ano'
            },
            {
                title: 'Use ar-condicionado conscientemente',
                description: 'Mantenha em 23°C e limpe os filtros mensalmente',
                impact: 'medium',
                effort: 'low',
                reduction: 0.3,
                savings: 'R$ 150/ano'
            },
            {
                title: 'Instale energia solar',
                description: 'Considere instalar painéis solares para redução drástica',
                impact: 'high',
                effort: 'high',
                reduction: 1.5,
                savings: 'R$ 900/ano'
            }
        ],
        food: [
            {
                title: 'Reduza o consumo de carne vermelha',
                description: 'Diminua para 3 vezes por semana e opte por carnes brancas',
                impact: 'high',
                effort: 'medium',
                reduction: 0.6,
                savings: 'R$ 180/ano'
            },
            {
                title: 'Experimente refeições vegetarianas',
                description: 'Adote 2 dias por semana sem carne',
                impact: 'medium',
                effort: 'low',
                reduction: 0.3,
                savings: 'R$ 90/ano'
            },
            {
                title: 'Adote uma dieta vegetariana',
                description: 'Transição gradual para alimentação baseada em plantas',
                impact: 'high',
                effort: 'high',
                reduction: 1.1,
                savings: 'R$ 360/ano'
            }
        ]
    },
    
    // Goals configuration
    goals: {
        default_reduction_target: 0.20, // 20%
        achievements: [
            { threshold: 20, title: 'Primeiro passo para a neutralidade', icon: '🏅' },
            { threshold: 50, title: 'Campeão da Sustentabilidade', icon: '🌟' },
            { threshold: 75, title: 'Guardião do Planeta', icon: '🌍' },
            { threshold: 100, title: 'Herói do Clima', icon: '🎉' }
        ]
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ROUTES_DATA;
}