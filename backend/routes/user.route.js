import express from 'express';
import {  login } from '../controller/user.controller.js';

const router = express.Router();

// Signup route
// router.post('/signup', signup);

// Login route
router.post('/login', login);

export default router;