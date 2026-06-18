// Ruta: src/services/ExternalApiService.js
require('dotenv').config();

class ExternalApiService {
  static getApiKey() {
    return process.env.PERENUAL_API_KEY || 'sk-sLfs6a3404708c42818211';
  }

  static getMockPlants(query) {
    const mockPlants = [
      {
        id_catalogo: 1001,
        nombre_comun: 'Monstera Deliciosa (Mock)',
        nombre_cientifico: 'Monstera deliciosa',
        descripcion: 'Popular mock plant for testing.',
        frecuencia_riego_dias: 7,
        luz_recomendada: 'Luz indirecta',
        temperatura_min: 18,
        temperatura_max: 30,
        imagen_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'
      },
      {
        id_catalogo: 1002,
        nombre_comun: 'Calathea Orbifolia (Mock)',
        nombre_cientifico: 'Calathea orbifolia',
        descripcion: 'Elegant mock plant with striped leaves.',
        frecuencia_riego_dias: 5,
        luz_recomendada: 'Luz indirecta',
        temperatura_min: 18,
        temperatura_max: 28,
        imagen_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'
      },
      {
        id_catalogo: 1003,
        nombre_comun: 'Sansevieria Trifasciata (Mock)',
        nombre_cientifico: 'Sansevieria trifasciata',
        descripcion: 'Hardy mock plant requiring little care.',
        frecuencia_riego_dias: 14,
        luz_recomendada: 'Luz brillante',
        temperatura_min: 15,
        temperatura_max: 35,
        imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
      }
    ];

    if (!query) return mockPlants;
    return mockPlants.filter(p =>
      p.nombre_comun.toLowerCase().includes(query.toLowerCase()) ||
      p.nombre_cientifico.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async searchPlants(query) {
    const apiKey = this.getApiKey();

    // If no API key is set, use mock data as fallback for development
    if (!apiKey) {
      console.warn('PERENUAL_API_KEY is not defined. Using fallback mock data.');
      return this.getMockPlants(query);
    }

    const url = `https://perenual.com/api/v2/species-list?key=${apiKey}&q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Perenual API returned status ${response.status}`);
      }
      const data = await response.json();
      const rawList = data.data || [];
      return rawList.map(item => this.mapListPlant(item));
    } catch (error) {
      console.error('Error fetching from Perenual API, using mock fallback:', error.message);
      return this.getMockPlants(query);
    }
  }

  static mapListPlant(data) {
    let wateringFrequencyDays = 7;
    if (data.watering) {
      const w = data.watering.toLowerCase();
      if (w.includes('frequent')) wateringFrequencyDays = 3;
      else if (w.includes('average')) wateringFrequencyDays = 7;
      else if (w.includes('minimum')) wateringFrequencyDays = 14;
    }

    return {
      id_catalogo: data.id,
      nombre_comun: data.common_name || 'Planta Exótica',
      nombre_cientifico: (data.scientific_name && data.scientific_name[0]) || 'Unknown species',
      descripcion: `Planta exótica catalogada como ${data.common_name || 'desconocida'} con requerimiento de riego: ${data.watering || 'moderado'}.`,
      frecuencia_riego_dias: wateringFrequencyDays,
      luz_recomendada: (data.sunlight && data.sunlight[0]) || 'Luz indirecta',
      temperatura_min: 15,
      temperatura_max: 30,
      imagen_url: data.default_image?.regular_url || data.default_image?.thumbnail || data.default_image?.original_url || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
    };
  }
}

module.exports = ExternalApiService;
