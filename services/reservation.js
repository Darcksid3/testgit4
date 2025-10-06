// imports
const Reservation = require('../models/reservation'); 
const reservationSchema = require('../joi/reservationSchema');


exports.modifyReservation = async (req, res, next) => {
    session = req.session;
    const idReservation = req.params.idReservation;
    const clientName = req.body.clientName;
    const boatName = req.body.boatName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const catwayNumber = req.body.catwayNumber;
    
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    const dataToUpdate = { clientName: req.body.clientName , boatName: req.body.boatName, startDate: newStart, endDate: newEnd, catwayNumber: req.body.catwayNumber };

    //  Validation Joi 
        const { error } = reservationSchema.validate(dataToUpdate, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            message: 'Erreur de validation des données.'
        });
    };

    try {
        
        const conflictingReservation = await Reservation.findOne({
            catwayNumber: catwayNumber, 
            _id: { $ne: idReservation }, // Exclure la réservation en cours
            endDate: { $gt: newStart },      
            startDate: { $lt: newEnd}       
        }).lean();

        if (conflictingReservation) {
            // Si le Catway n'est plus disponible pour ces dates
            return res.status(409).send("Le Catway n'est plus disponible pour cette période. Veuillez choisir d'autres dates.");
        }

        
        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: idReservation },
            dataToUpdate,
            { new: true, runValidators: true } 
        );
        
        if (!updatedReservation) {
            return res.status(404).send("Réservation non trouvée pour mise à jour.");
        } 
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).send("Erreur serveur lors de la mise à jour.");
    }
};

exports.getOneReservation = async (req, res, next) => {
    
    const { idCatway, idReservation } = req.params;
    session = req.session;

    try {
        // Logique : Trouver la réservation par son ID 
        const reservation = await Reservation.findOne({ _id: idReservation });
        
        if (!reservation) {
            return res.status(404).send("Réservation non trouvée.");
        }

        if (req.query.page === 'modifyReserv') {
            session.page = 'modifyReserv';
            return res.render(`pages/reservation`, { session: session, idCatway: idCatway, modifyReservation: reservation})
        } else if (req.query.page === 'findOneReserv') {

            session.page = 'findOneReserv'
            return res.render('pages/reservation', { session:session, idCatway:idCatway, findOneReservation:reservation });
            
            }
        else {
            return res.status(400).send("Paramètre de page invalide.");
        }
    } catch (error) {
        return res.status(500).send("Erreur serveur.");
    }
};

exports.deleteReservation = async (req, res, next) => {
    const { idCatway, idReservation } = req.params;

    try {
        // Logique : Trouver et supprimer par ID de Réservation et Catway ID
        const result = await Reservation.findOneAndDelete({ _id: idReservation, catwayNumber: idCatway });
        
        if (!result) {
            return res.status(404).send("Réservation non trouvée pour suppression.");
        }
        
        return res.status(204).json({ message: `Réservation ${idReservation} supprimée sur Catway ${idCatway}` });

    } catch (error) {
        return res.status(500).send("Erreur serveur.");
    }
};

exports.getAllReservForOneCatway = async (req, res, next) => { 
    session = req.session;
    const idCatway = req.params.idCatway; 
    session.page = 'findForCatway';
    try {
        // Logique : Trouver toutes les réservations dont le champ 'catwayId' (ou équivalent) est égal à idCatway
        const reservations = await Reservation.find({ catwayNumber: idCatway }).sort('startDate');
        
        return res.render('pages/reservation', { session:session, oneCatReservations:reservations, idCatway:idCatway });
        

    } catch (error) {
        console.error("Erreur de liste :", error);
        return res.status(500).send("Erreur serveur.");
    }
};

exports.createReservation = async (req, res, next) => {
    const idCatway = req.params.idCatway; 
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: new Date (req.body.startDate),
        endDate: new Date (req.body.endDate),
    });
    session = req.session;
    session.page = 'createCatway'

    // 1. Validation Joi 
    const { error } = reservationSchema.validate(temp);

    if (error) {
    return res.status(400).render('pages/reservation', {
    message: error.details[0].message
    });
    };

    try {
        const newReservation = new Reservation({
            catwayNumber: temp.catwayNumber,
            clientName: temp.clientName,
            boatName: temp.boatName,
            startDate: temp.startDate,
            endDate: temp.endDate
        });
        
        const reservationSaved = await newReservation.save();
        
        return res.status(302).redirect(`/catways/reservations?page=findAllReserv`);

    } catch (error) {
        console.error("Erreur de création de réservation:", error);
        return res.status(500).send("Erreur serveur.");
    }
};
