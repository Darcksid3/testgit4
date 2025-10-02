const express = require('express');
const router = express.Router({ mergeParams: true }); 
const JOI = require('joi');
const mongoose = require('mongoose');

const Reservation = require('../models/reservation'); 
const reservationSchema = require('../joi/reservationSchema')
const C = require('../test/test'); 

// Middleware de vérification de session (recommandé)
const checkAuth = (req, res, next) => {
    if (!req.session.verif) {
        C.log('red', `Réservation : connexion non vérifiée`);
        return res.status(401).redirect('/');
    }
    next();
};


// Appliquer le middleware à toutes les routes de réservation
router.use(checkAuth); 


// Liste toutes les réservations pour UN catway donné.
router.get('/', async (req, res, next) => { 
    session = req.session;
    try {
        
        const reservations = await Reservation.find({ }).sort('startDate');
        
        return res.render('pages/reservations/list', { session: session, reservations: reservations });
        // return res.status(200).json({ message: `Liste des réservations pour Catway ${idCatway}` });

    } catch (error) {
        console.error("Erreur de liste :", error);
        return res.status(500).send("Erreur serveur.");
    }
});

// Affiche une réservation spécifique.
router.get('/:idReservation', async (req, res, next) => {
    const { idCatway, idReservation } = req.params;
    
    try {
        // Logique : Trouver la réservation par son ID et s'assurer qu'elle appartient bien à ce Catway
        const reservation = await Reservation.findOne({ _id: idReservation, catwayId: idCatway });
        
        if (!reservation) {
            return res.status(404).send("Réservation non trouvée.");
        }
        
        // return res.render('pages/reservations/details', { reservation });
        return res.status(200).json({ message: `Détails de la Réservation ${idReservation} pour Catway ${idCatway}` });

    } catch (error) {
        console.error("Erreur de détail :", error);
        return res.status(500).send("Erreur serveur.");
    }
});


// -------------------------------------------------------------
// 3. POST /catways/:idCatway/reservations
// Créer une nouvelle réservation pour un Catway donné.
// -------------------------------------------------------------
router.post('/', async (req, res, next) => {
    const idCatway = req.params.idCatway; 
    const data = req.body; // Les données de la nouvelle réservation

    try {
        // 1. Validation Joi (à insérer ici)
        // 2. Création de l'objet Reservation, en ajoutant l'idCatway
        // const newReservation = new Reservation({ ...data, catwayId: idCatway });
        // 3. Sauvegarde
        // const savedReservation = await newReservation.save();
        
        // return res.status(302).redirect(`/catways/${idCatway}/reservations`);
        return res.status(201).json({ message: `Réservation créée sur Catway ${idCatway}`, data: data });

    } catch (error) {
        console.error("Erreur de création :", error);
        return res.status(500).send("Erreur serveur.");
    }
});


// Modifier une réservation spécifique.
router.put('/:idReservation', async (req, res, next) => {
    const { idCatway, idReservation } = req.params;
    const data = req.body;

    try {
        // Logique : Trouver et mettre à jour par ID de Réservation et s'assurer qu'elle est liée au bon Catway
        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: idReservation, catwayId: idCatway },
            data,
            { new: true, runValidators: true }
        );
        
        if (!updatedReservation) {
            return res.status(404).send("Réservation non trouvée pour mise à jour.");
        }
        
        // return res.status(200).json({ message: 'Réservation mise à jour', updatedReservation });
        return res.status(200).json({ message: `Réservation ${idReservation} mise à jour sur Catway ${idCatway}`, data: data });

    } catch (error) {
        console.error("Erreur de mise à jour :", error);
        return res.status(500).send("Erreur serveur.");
    }
});


// Supprimer une réservation
router.delete('/:idReservation', async (req, res, next) => {
    const { idCatway, idReservation } = req.params;

    try {
        // Logique : Trouver et supprimer par ID de Réservation et Catway ID
        const result = await Reservation.findOneAndDelete({ _id: idReservation, catwayId: idCatway });
        
        if (!result) {
            return res.status(404).send("Réservation non trouvée pour suppression.");
        }
        
        // return res.status(204).end(); // 204 No Content pour une suppression réussie
        return res.status(204).json({ message: `Réservation ${idReservation} supprimée sur Catway ${idCatway}` });

    } catch (error) {
        console.error("Erreur de suppression :", error);
        return res.status(500).send("Erreur serveur.");
    }
});

module.exports = router;