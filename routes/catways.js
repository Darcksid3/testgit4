const express = require('express');
const router = express.Router();

const reservationRouter = require('./reservation');
const catwayService = require('../services/catway');

const { checkJWT } = require('../middleware/private');
router.use(checkJWT)

/**
 * @swagger
 * /disponibility-check:
 *   get:
 *     tags:
 *       - Utilities
 *     summary: Lors de la modification d'une réservation compare la disponibilité d'un catway pour des dates données
 *     responses:
 *       200:
 *         description: renvoie si le catway est disponible ou non sans tenir compte de la réservation en cours
 */
router.get('/disponibility-check', catwayService.disponibilityCheck);

/**
 * @swagger
 * /disponibility:
 *   get:
 *     tags:
 *       - Utilities
 *     summary: Lors de la création d'une réservation compare la disponibilité des catways pour des dates données
 *     responses:
 *       200:
 *         description: renvoie les catways disponible ou non au dates données
 */
router.get('/disponibility', catwayService.disponibility);

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags:
 *       - Catway
 *     summary: Récupère toutes les réservations
 *     responses:
 *       200:
 *         description: Liste toutes les réservations outrepasse la sous-route
 */
router.get('/reservations', catwayService.reservation);

/**
 * @swagger
 * /numbers/{type}:
 *   get:
 *     tags:
 *       - Catway
 *     summary: Filtre les catways par type (short, long, all)
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type de catway (short, long, all)
 *     responses:
 *       200:
 *         description: renvoie un tableau de numéros de catways filtrés par type pour les formulaires
 */
router.get('/numbers/:type', catwayService.numbersType);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Catway
 *     summary: Récupère un catway par son numéro et affiche la page demandée (modifyCatway, findOneCatway)
 *     responses:
 *       200:
 *         description: renvoie le catway filtré
 *   put:
 *     tags:
 *       - Catway
 *     summary: Modifie un catway par son numéro dans la base de donnée
 *     responses:
 *       200:
 *         description: renvoie sur la liste des catways
 *   delete:
 *     tags:
 *       - Catway
 *     summary: Supprime un catway par son numéro dans la base de donnée
 *     responses:
 *       200:
 *         description: renvoie sur la liste des catways
 */
router.get('/:id', catwayService.findOneCatway);
router.put('/:id', catwayService.modifyCatway);
router.delete('/:id', catwayService.deleteCatway);

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Catway
 *     summary: Recherche tous les catways dans la base de donnée
 *     responses:
 *       200:
 *         description: renvoie la liste des catways
 *   post:
 *     tags:
 *       - Catway
 *     summary: Ajoute un catway à la base de donnée
 *     responses:
 *       200:
 *         description: renvoie sur la liste des catways
 */
router.get('/', catwayService.getAllCatway);
router.post('/', catwayService.addCatway);

/**
 * @swagger
 * /{idCatway}/reservations:
 *   get:
 *     tags:
 *       - Catway
 *     summary: Sous-route pour les réservations associées à un catway
 *     responses:
 *       200:
 *         description: renvoie sur les routes de réservations nécessitant l'ID du catway
 */
router.use('/:idCatway/reservations', reservationRouter);




module.exports = router;