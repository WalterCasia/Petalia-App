// Ruta: src/services/ExternalApiService.js
require('dotenv').config();
const { logApiCall } = require('../utils/apiLogger');

async function loggedFetch(url, options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, options);
    const duration = Date.now() - start;
    logApiCall(url, res.status, duration);
    return res;
  } catch (err) {
    const duration = Date.now() - start;
    logApiCall(url, 500, duration);
    throw err;
  }
}

class ExternalApiService {
  static getApiKey() {
    return process.env.PERENUAL_API_KEY || 'sk-sLfs6a3404708c42818211';
  }

  static getMockSpeciesList() {
    return [
      {
        id: 1,
        common_name: 'Monstera Deliciosa',
        scientific_name: ['Monstera deliciosa'],
        watering: 'Average',
        sunlight: ['part_shade'],
        indoor: true,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 2,
        common_name: 'Aloe Vera',
        scientific_name: ['Aloe vera'],
        watering: 'Minimum',
        sunlight: ['full_sun'],
        indoor: false,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 3,
        common_name: 'Sansevieria Trifasciata',
        scientific_name: ['Sansevieria trifasciata'],
        watering: 'Minimum',
        sunlight: ['part_shade', 'full_shade'],
        indoor: true,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 4,
        common_name: 'Pothos',
        scientific_name: ['Epipremnum aureum'],
        watering: 'Average',
        sunlight: ['part_shade', 'full_shade'],
        indoor: true,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 5,
        common_name: 'Ficus Lyrata',
        scientific_name: ['Ficus lyrata'],
        watering: 'Average',
        sunlight: ['full_sun', 'part_shade'],
        indoor: true,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 6,
        common_name: 'Helecho de Boston',
        scientific_name: ['Nephrolepis exaltata'],
        watering: 'Frequent',
        sunlight: ['part_shade', 'full_shade'],
        indoor: true,
        poisonous: false,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 7,
        common_name: 'Cinta',
        scientific_name: ['Chlorophytum comosum'],
        watering: 'Average',
        sunlight: ['part_shade'],
        indoor: true,
        poisonous: false,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 8,
        common_name: 'Cuna de Moisés',
        scientific_name: ['Spathiphyllum'],
        watering: 'Frequent',
        sunlight: ['part_shade', 'full_shade'],
        indoor: true,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 9,
        common_name: 'Árbol de Jade',
        scientific_name: ['Crassula ovata'],
        watering: 'Minimum',
        sunlight: ['full_sun'],
        indoor: true,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 10,
        common_name: 'Lavanda',
        scientific_name: ['Lavandula'],
        watering: 'Average',
        sunlight: ['full_sun'],
        indoor: false,
        poisonous: true,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 11,
        common_name: 'Romero',
        scientific_name: ['Salvia rosmarinus'],
        watering: 'Minimum',
        sunlight: ['full_sun'],
        indoor: false,
        poisonous: false,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        }
      },
      {
        id: 12,
        common_name: 'Orquídea',
        scientific_name: ['Orchidaceae'],
        watering: 'Average',
        sunlight: ['part_shade'],
        indoor: true,
        poisonous: false,
        default_image: {
          thumbnail: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          small_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          regular_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
          original_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'
        }
      }
    ];
  }

  static getMockPlants(query) {
    const mockPlants = this.getMockSpeciesList().map(item => this.mapListPlant(item));
    if (!query) return mockPlants;
    return mockPlants.filter(p =>
      p.nombre_comun.toLowerCase().includes(query.toLowerCase()) ||
      p.nombre_cientifico.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Search plants - Decoupled from external API to prevent errors.
   */
  static async searchPlants(query) {
    console.log(`[ExternalApiService] searchPlants called with query: "${query}"`);
    const apiKey = this.getApiKey();
    const url = `https://perenual.com/api/v2/species-list?key=${apiKey}&q=${encodeURIComponent(query)}`;

    try {
      const res = await loggedFetch(url);
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }
      const result = await res.json();
      if (result && result.data && Array.isArray(result.data)) {
        return result.data.map(p => this.mapListPlant(p));
      }
      return this.getMockPlants(query);
    } catch (err) {
      console.warn('[ExternalApiService] searchPlants API failed, returning mock fallback:', err.message);
      return this.getMockPlants(query);
    }
  }

  /**
   * Fetch paginated and filtered species list from Perenual API.
   */
  static async speciesList({ page = 1, q, indoor, sunlight, poisonous }) {
    const apiKey = this.getApiKey();
    let url = `https://perenual.com/api/v2/species-list?key=${apiKey}&page=${page}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (indoor !== undefined && indoor !== '') url += `&indoor=${indoor}`;
    if (sunlight) url += `&sunlight=${sunlight}`;
    if (poisonous !== undefined && poisonous !== '') url += `&poisonous=${poisonous}`;

    try {
      console.log(`[ExternalApiService] Fetching species-list from Perenual: ${url}`);
      const res = await loggedFetch(url);
      if (!res.ok) {
        throw new Error(`Perenual API error: status ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('[ExternalApiService] speciesList error, using mock fallback:', err.message);

      const allMocks = this.getMockSpeciesList();
      let filtered = allMocks;
      if (q) {
        filtered = filtered.filter(p =>
          p.common_name.toLowerCase().includes(q.toLowerCase()) ||
          p.scientific_name.some(name => name.toLowerCase().includes(q.toLowerCase()))
        );
      }
      if (indoor !== undefined && indoor !== '') {
        const isIndoor = indoor === '1';
        filtered = filtered.filter(p => p.indoor === isIndoor);
      }
      if (sunlight) {
        filtered = filtered.filter(p => p.sunlight.includes(sunlight));
      }
      if (poisonous !== undefined && poisonous !== '') {
        const isPoisonous = poisonous === '1';
        filtered = filtered.filter(p => p.poisonous === isPoisonous);
      }

      const perPage = 30;
      const startIndex = (page - 1) * perPage;
      const paginatedData = filtered.slice(startIndex, startIndex + perPage);

      return {
        data: paginatedData,
        current_page: parseInt(page, 10),
        last_page: Math.ceil(filtered.length / perPage) || 1
      };
    }
  }

  /**
   * Get plant details.
   */
  static async getPlantDetails(id) {
    const apiKey = this.getApiKey();
    const url = `https://perenual.com/api/v2/species/details/${id}?key=${apiKey}`;

    try {
      console.log(`[ExternalApiService] Fetching details for ID ${id} from Perenual: ${url}`);
      const res = await loggedFetch(url);
      if (!res.ok) {
        throw new Error(`Perenual API details error: status ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('[ExternalApiService] getPlantDetails error, using mock fallback:', err.message);

      const mocks = this.getMockSpeciesList();
      const mockItem = mocks.find(m => m.id === parseInt(id, 10));

      return mockItem ? {
        id: mockItem.id,
        common_name: mockItem.common_name,
        scientific_name: mockItem.scientific_name,
        watering: mockItem.watering,
        sunlight: mockItem.sunlight,
        indoor: mockItem.indoor,
        poisonous: mockItem.poisonous,
        default_image: mockItem.default_image,
        description: `Esta es una descripción detallada de fallback para la planta ${mockItem.common_name} (${mockItem.scientific_name.join(', ')}). Es una especie excelente para agregar a tu colección botánica y gestionar con Petalia.`,
        watering_general_benchmark: {
          value: mockItem.watering === 'Frequent' ? '2-3' : mockItem.watering === 'Average' ? '5-7' : '10-14',
          unit: 'days'
        }
      } : {
        id: parseInt(id, 10),
        common_name: 'Planta Exótica Offline',
        scientific_name: ['Exotic species'],
        watering: 'Average',
        sunlight: ['part_shade'],
        indoor: true,
        poisonous: false,
        default_image: {
          original_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
          thumbnail: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
        },
        description: 'No se pudo conectar con el servidor externo para obtener los detalles en tiempo real. Esta es una descripción temporal offline de la especie.',
        watering_general_benchmark: {
          value: '7',
          unit: 'days'
        }
      };
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
      nombre_comun: data.common_name || 'Planta Exotica',
      nombre_cientifico: (data.scientific_name && data.scientific_name[0]) || 'Unknown species',
      descripcion: `Planta exotica catalogada como ${data.common_name || 'desconocida'} con requerimiento de riego: ${data.watering || 'moderado'}.`,
      frecuencia_riego_dias: wateringFrequencyDays,
      luz_recomendada: (data.sunlight && data.sunlight[0]) || 'Luz indirecta',
      temperatura_min: 15,
      temperatura_max: 30,
      imagen_url: data.default_image?.regular_url || data.default_image?.thumbnail || data.default_image?.original_url || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600'
    };
  }
}

module.exports = ExternalApiService;
