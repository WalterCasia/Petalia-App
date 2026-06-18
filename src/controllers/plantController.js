// Ruta: src/controllers/plantController.js
const Plant = require('../models/Plant');
const ExternalApiService = require('../services/ExternalApiService');

const getAllPlants = async (req, res, next) => {
  try {
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
