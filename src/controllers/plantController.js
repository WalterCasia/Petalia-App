// Ruta: src/controllers/plantController.js
const Plant = require('../models/Plant');

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

module.exports = {
  getAllPlants,
  getPlantById
};
