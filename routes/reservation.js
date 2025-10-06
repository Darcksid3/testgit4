const express = require('express');
const router = express.Router({ mergeParams: true }); 

const serviceReservation = require('../services/reservation');
const C = require('../test/test'); 

const { checkJWT } = require('../middleware/private');
router.use(checkJWT)

/**
 * @swagger
 * /catways/{catwayNumber}/reservations{idReservation}:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Récupère une reservation par son numéro et affiche la page demandée (modifyReserv, findOneReserv)
 *     parameters:
*        - in: path
*          name: type
*          required: true
*          schema:
*            type: string
*            description: identifiant de la reservation
*        - in: query
 *     responses:
 *       200:
 *         description: renvoie le reservation filtré
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Modifie un reservation par son numéro dans la base de donnée
 *     parameters:
*        - in: path
*          name: type
*          required: true
*          schema:
*            type: string
*            description: identifiant de la reservation
*        - in: query
 *     responses:
 *       200:
 *         description: renvoie sur la liste des reservations
 *   delete:
 *     tags:
 *       - Reservation
 *     summary: Supprime une reservation par son numéro dans la base de donnée
 *     parameters:
*        - in: path
*          name: type
*          required: true
*          schema:
*            type: string
*            description: identifiant de la reservation
*        - in: query
 *     responses:
 *       200:
 *         description: renvoie sur la liste des reservations
 */
router.put('/:idReservation', serviceReservation.modifyReservation);
router.get('/:idReservation', serviceReservation.getOneReservation);
router.delete('/:idReservation', serviceReservation.deleteReservation);

/**
 * @swagger
 * /catways/{catwayNumber}/reservations:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Recherche toutes les reservation pour un catway dans la base de donnée
 *     responses:
 *       200:
 *         description: renvoie la liste des reservation
 *   post:
 *     tags:
 *       - Reservation
 *     summary: Ajoute une reservation  à la base de donnée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: number
 *               clientName:
 *                 type: string
 *               boatName:   
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:   
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: renvoie sur la liste des reservation
 */
router.get('/', serviceReservation.getAllReservForOneCatway);
router.post('/', serviceReservation.createReservation);


module.exports = router;