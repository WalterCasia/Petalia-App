// Ruta: src/services/ExternalApiService.js
require('dotenv').config();

class ExternalApiService {
  static getApiKey() {
    return process.env.PERENUAL_API_KEY || '';
  }

  static getMockPlants(query) {
    const mockPlants = [
      {
        id: 1001,
        common_name: 'Monstera Deliciosa (Mock)',
        scientific_name: ['Monstera deliciosa'],
        watering: 'Frequent',
        default_image: {
          regular_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 1002,
        common_name: 'Calathea Orbifolia (Mock)',
        scientific_name: ['Calathea orbifolia'],
        watering: 'Average',
        default_image: {
          regular_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 1003,
        common_name: 'Sansevieria Trifasciata (Mock)',
        scientific_name: ['Sansevieria trifasciata'],
        watering: 'Minimum',
        default_image: {
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        }
      }
    ];

    if (!query) return mockPlants;
    return mockPlants.filter(p => 
      p.common_name.toLowerCase().includes(query.toLowerCase()) || 
      p.scientific_name[0].toLowerCase().includes(query.toLowerCase())
    );
  }

  static getMockPlantDetails(speciesId) {
    const mockDetails = {
      1001: {
        id: 1001,
        common_name: 'Monstera Deliciosa (Mock)',
        scientific_name: ['Monstera deliciosa'],
        watering: 'Frequent',
        watering_general_benchmark: { value: '7', unit: 'days' },
        description: 'Popular mock plant for testing.',
        default_image: {
          regular_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'
        },
        sunlight: ['part shade', 'full sun']
      },
      1002: {
        id: 1002,
        common_name: 'Calathea Orbifolia (Mock)',
        scientific_name: ['Calathea orbifolia'],
        watering: 'Average',
        watering_general_benchmark: { value: '5', unit: 'days' },
        description: 'Elegant mock plant with striped leaves.',
        default_image: {
          regular_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'
        },
        sunlight: ['part shade']
      },
      1003: {
        id: 1003,
        common_name: 'Sansevieria Trifasciata (Mock)',
        scientific_name: ['Sansevieria trifasciata'],
        watering: 'Minimum',
        watering_general_benchmark: { value: '14', unit: 'days' },
        description: 'Hardy mock plant requiring little care.',
        default_image: {
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        },
        sunlight: ['shade', 'part shade']
      }
    };

    return mockDetails[speciesId] || mockDetails[1001];
  }

  static async searchPlants(query) {
    const apiKey = this.getApiKey();
    
    // If no API key is set, use mock data as fallback for development
    if (!apiKey) {
      console.warn('PERENUAL_API_KEY is not defined in .env. Using fallback mock data.');
      return this.getMockPlants(query);
    }

    const url = `https://perenual.com/api/species-list?key=${apiKey}&q=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Perenual API returned status ${response.status}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching from Perenual API, using mock fallback:', error.message);
      return this.getMockPlants(query);
    }
  }

  static async getPlantDetails(speciesId) {
    const apiKey = this.getApiKey();
    
    // If no API key or ID is mock, use mock details
    if (!apiKey || speciesId >= 1000) {
      if (!apiKey) {
        console.warn('PERENUAL_API_KEY is not defined in .env. Using fallback mock data.');
      }
      const data = this.getMockPlantDetails(speciesId);
      return this.mapPlantDetails(data);
    }

    const url = `https://perenual.com/api/species/details/${speciesId}?key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Perenual API returned status ${response.status}`);
      }
      const data = await response.json();
      return this.mapPlantDetails(data);
    } catch (error) {
      console.error(`Error fetching plant details for ID ${speciesId}, using mock fallback:`, error.message);
      const mockData = this.getMockPlantDetails(1001);
      return this.mapPlantDetails(mockData);
    }
  }

  static mapPlantDetails(data) {
    // Determine watering frequency in days
    let wateringFrequencyDays = 7; // Default fallback
    
    if (data.watering_general_benchmark && data.watering_general_benchmark.value) {
      const val = data.watering_general_benchmark.value;
      const numbers = val.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const avg = numbers.reduce((sum, n) => sum + parseInt(n), 0) / numbers.length;
        wateringFrequencyDays = Math.round(avg);
      }
    } else if (data.watering) {
      const w = data.watering.toLowerCase();
      if (w.includes('frequent')) wateringFrequencyDays = 3;
      else if (w.includes('average')) wateringFrequencyDays = 7;
      else if (w.includes('minimum')) wateringFrequencyDays = 14;
    }

    return {
      id: data.id,
      name: data.common_name || (data.scientific_name && data.scientific_name[0]) || 'Unknown Plant',
      scientific_name: (data.scientific_name && data.scientific_name[0]) || '',
      watering_frequency_days: wateringFrequencyDays,
      description: data.description || `A beautiful ${data.common_name || 'plant'} requiring ${data.watering || 'moderate'} watering.`,
      image_url: data.default_image?.regular_url || data.default_image?.original_url || '',
      watering_needs: data.watering || 'Average',
      sunlight: data.sunlight || []
    };
  }
}

module.exports = ExternalApiService;
