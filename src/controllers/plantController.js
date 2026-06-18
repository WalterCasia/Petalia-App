// Ruta: src/controllers/plantController.js
const Plant = require('../models/Plant');
const ExternalApiService = require('../services/ExternalApiService');

const getAllPlants = async (req, res, next) => {
  try {
    const { search, q } = req.query;
    const queryTerm = search || q;

    if (queryTerm) {
      // 1. Search locally
      const localPlants = await Plant.search(queryTerm);

      // 2. Search externally
      let externalPlants = [];
      try {
        externalPlants = await ExternalApiService.searchPlants(queryTerm);
      } catch (err) {
        console.error('Failed to search Perenual API:', err.message);
      }

      // 3. Save external plants to local database to ensure foreign key integrity
      for (const extPlant of externalPlants) {
        try {
          await Plant.create(extPlant);
        } catch (err) {
          console.error(`Failed to save plant ${extPlant.id_catalogo} to DB:`, err.message);
        }
      }

      // 4. Merge results in-memory avoiding duplicates by id_catalogo
      const mergedMap = new Map();
      for (const p of localPlants) {
        mergedMap.set(p.id_catalogo, p);
      }
      for (const p of externalPlants) {
        if (!mergedMap.has(p.id_catalogo)) {
          mergedMap.set(p.id_catalogo, p);
        }
      }

      const mergedList = Array.from(mergedMap.values());
      return res.json(mergedList);
    }

    const plants = await Plant.findAll();
    res.json(plants);
  } catch (error) {
    next(error);
  }
};

const getPlantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findById(id);
    
    if (!plant) {
      const error = new Error('Plant not found');
      error.status = 404;
      return next(error);
    }
    
    res.json(plant);
  } catch (error) {
    next(error);
  }
};

const searchExternalPlants = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      const error = new Error('Query parameter "q" is required');
      error.status = 400;
      return next(error);
    }
    const plants = await ExternalApiService.searchPlants(q);
    res.json(plants);
  } catch (error) {
    next(error);
  }
};

const getExternalPlantDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const details = await ExternalApiService.getPlantDetails(id);
    res.json(details);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  searchExternalPlants,
  getExternalPlantDetails
};
