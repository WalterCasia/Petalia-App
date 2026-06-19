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

    const url = `https://perenual.com/api/v2/species-list?key=${apiKey}${query ? '&q=' + encodeURIComponent(query) : ''}`;

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

  static async getPlantDetails(id) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return this.getMockPlantDetails(id);
    }
    const url = `https://perenual.com/api/v2/species/details/${id}?key=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Perenual API returned status ${response.status}`);
      }
      const data = await response.json();
      return this.mapDetailsPlant(data);
    } catch (error) {
      console.error('Error fetching details from Perenual API, using mock details:', error.message);
      return this.getMockPlantDetails(id);
    }
  }

  static mapDetailsPlant(data) {
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
      nombre_cientifico: (data.scientific_name) || 'Unknown species',
      descripcion: data.description || `Planta exótica catalogada como ${data.common_name || 'desconocida'} con requerimiento de riego: ${data.watering || 'moderado'}.`,
      frecuencia_riego_dias: wateringFrequencyDays,
      luz_recomendada: (data.sunlight && data.sunlight.join(', ')) || 'Luz indirecta',
      temperatura_min: 15,
      temperatura_max: 30,
      imagen_url: data.default_image?.regular_url || data.default_image?.thumbnail || data.default_image?.original_url || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
      
      // Technical attributes for modal detail grid
      ciclo: data.cycle || 'Perennial',
      riego: data.watering || 'Average',
      sol: (data.sunlight && data.sunlight.join(', ')) || 'Luz indirecta',
      hardiness: (data.hardiness && `${data.hardiness.min} - ${data.hardiness.max}`) || '10 - 11',
      tolerante_sequia: data.drought_tolerant ? 'Sí' : 'No',
      flores: data.flowers ? 'Sí' : 'No',
      foliage: (data.foliage && data.foliage.map(f => f.leaf_color).join(', ')) || 'Verde',
      crecimiento: data.growth_rate || 'Medium',
      mantenimiento: data.maintenance || 'Medium',
      nivel_atencion: data.care_level || 'Medium'
    };
  }

  static getMockPlantDetails(id) {
    const idNum = parseInt(id, 10);
    const mockDetails = {
      1: {
        id_catalogo: 1,
        nombre_comun: 'Monstera Deliciosa',
        nombre_cientifico: 'Monstera deliciosa',
        descripcion: 'Planta tropical de interior conocida por sus hojas grandes y perforadas. Es de crecimiento rápido y fácil mantenimiento.',
        imagen_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600',
        frecuencia_riego_dias: 7,
        luz_recomendada: 'Luz indirecta',
        temperatura_min: 18,
        temperatura_max: 30,
        ciclo: 'Perennial',
        riego: 'Average',
        sol: 'Luz indirecta',
        hardiness: '10 - 12',
        tolerante_sequia: 'No',
        flores: 'Sí',
        foliage: 'Verde oscuro',
        crecimiento: 'Rápido',
        mantenimiento: 'Bajo',
        nivel_atencion: 'Medio'
      },
      2: {
        id_catalogo: 2,
        nombre_comun: 'Sansevieria Trifasciata',
        nombre_cientifico: 'Sansevieria trifasciata',
        descripcion: 'Planta sumamente resistente, ideal para interiores y principiantes, conocida popularmente como lengua de suegra.',
        imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
        frecuencia_riego_dias: 15,
        luz_recomendada: 'Luz indirecta',
        temperatura_min: 15,
        temperatura_max: 35,
        ciclo: 'Perennial',
        riego: 'Minimum',
        sol: 'Luz brillante / Sombra',
        hardiness: '9 - 11',
        tolerante_sequia: 'Sí',
        flores: 'Rara vez',
        foliage: 'Verde y amarillo',
        crecimiento: 'Lento',
        mantenimiento: 'Muy bajo',
        nivel_atencion: 'Bajo'
      },
      3: {
        id_catalogo: 3,
        nombre_comun: 'Epipremnum Aureum',
        nombre_cientifico: 'Epipremnum aureum',
        descripcion: 'Planta colgante o trepadora muy popular por su adaptabilidad y hojas variegadas en forma de corazón.',
        imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
        frecuencia_riego_dias: 5,
        luz_recomendada: 'Luz indirecta',
        temperatura_min: 18,
        temperatura_max: 30,
        ciclo: 'Perennial',
        riego: 'Average',
        sol: 'Luz brillante indirecta',
        hardiness: '10 - 11',
        tolerante_sequia: 'No',
        flores: 'No',
        foliage: 'Verde, Amarillo, Blanco',
        crecimiento: 'Rápido',
        mantenimiento: 'Bajo',
        nivel_atencion: 'Bajo'
      },
      4: {
        id_catalogo: 4,
        nombre_comun: 'Ficus Lyrata',
        nombre_cientifico: 'Ficus lyrata',
        descripcion: 'Espectacular árbol ornamental de interior con grandes hojas brillantes en forma de violín o lira.',
        imagen_url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600',
        frecuencia_riego_dias: 7,
        luz_recomendada: 'Luz brillante',
        temperatura_min: 18,
        temperatura_max: 28,
        ciclo: 'Perennial',
        riego: 'Average',
        sol: 'Luz brillante filtrada',
        hardiness: '10 - 12',
        tolerante_sequia: 'No',
        flores: 'No',
        foliage: 'Verde brillante',
        crecimiento: 'Medio',
        mantenimiento: 'Medio',
        nivel_atencion: 'Medio'
      },
      5: {
        id_catalogo: 5,
        nombre_comun: 'Aloe Vera',
        nombre_cientifico: 'Aloe vera',
        descripcion: 'Planta suculenta de hojas espinosas rellenas de gel curativo, muy decorativa y de bajo riego.',
        imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
        frecuencia_riego_dias: 14,
        luz_recomendada: 'Sol directo',
        temperatura_min: 10,
        temperatura_max: 35,
        ciclo: 'Perennial',
        riego: 'Minimum',
        sol: 'Sol directo',
        hardiness: '8 - 11',
        tolerante_sequia: 'Sí',
        flores: 'Sí',
        foliage: 'Verde grisáceo',
        crecimiento: 'Medio',
        mantenimiento: 'Bajo',
        nivel_atencion: 'Bajo'
      }
    };

    if (mockDetails[idNum]) {
      return mockDetails[idNum];
    }

    return {
      id_catalogo: idNum,
      nombre_comun: `Planta Exótica #${idNum}`,
      nombre_cientifico: `Species mockensis #${idNum}`,
      descripcion: 'Detalles simulados de una planta exótica del catálogo de Perenual.',
      imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
      frecuencia_riego_dias: 7,
      luz_recomendada: 'Luz indirecta',
      temperatura_min: 15,
      temperatura_max: 30,
      ciclo: 'Perennial',
      riego: 'Average',
      sol: 'Luz indirecta',
      hardiness: '10 - 11',
      tolerante_sequia: 'No',
      flores: 'Sí',
      foliage: 'Verde',
      crecimiento: 'Medio',
      mantenimiento: 'Medio',
      nivel_atencion: 'Medio'
    };
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
