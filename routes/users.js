const express = require('express');
const router = express.Router();

const C = require('../test/test');

const userService = require('../services/users');
const { checkJWT } = require('../middleware/private');

router.use(checkJWT)

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 */
router.get('/', userService.getAllUsers);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère un utilisateur par son email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Détail de l'utilisateur
 */
router.get('/:email', userService.getOneUsers);

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Modifie un utilisateur par son email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 */
router.put('/:email', userService.modifyUsers);

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprime un utilisateur par son email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.delete('/:email', userService.deleteUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Ajoute un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post('/', userService.createUser);

//TODO "Nodemailer" Route pour la vérification par email 
/*
router.get('/verify/:token', userService.verifyEmail);
*/

module.exports = router;
