import express from 'express';
import userPredictionRoutes from './userPredictionRoutes.js';
import validatePredictionRoutes from './validatePredictionRoutes.js';
import raceResultRoutes from './raceResultRoutes.js';
import baseRoutes from './baseRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/api/v1', userPredictionRoutes);
router.use('/api/v1', validatePredictionRoutes);
router.use('/api/v1', raceResultRoutes);
router.use('/api/v1', userRoutes);
router.use('/', baseRoutes);

export default router;