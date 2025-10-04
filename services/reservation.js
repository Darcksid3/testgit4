// imports
const Reservation = require('../models/reservation'); 
const reservationSchema = require('../joi/reservationSchema');
const C = require('../test/test'); 


exports.modifyReservation = async (req, res, next) => {
    session = req.session;
    C.log('green', `Début route modif réservation`)
    const idReservation = req.params.idReservation;
    const clientName = req.body.clientName;
    const boatName = req.body.boatName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const catwayNumber = req.body.catwayNumber;
    C.log('yellow', `${idReservation}, ${clientName}, ${boatName}, ${startDate},${ endDate}, ${catwayNumber} `); 
    
    
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    const dataToUpdate = { clientName: req.body.clientName , boatName: req.body.boatName, startDate: newStart, endDate: newEnd, catwayNumber: req.body.catwayNumber };

    //  Validation Joi 
        const { error } = reservationSchema.validate(dataToUpdate, { abortEarly: false });

    if (error) {
        C.log('red', `JOI validation reservation erreur`)
        console.error(`JOI validation reservation erreur: ${error.details[0].message}`);
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
            C.log('red', `Conflit détecté pour la réservation ${idReservation}`);
            return res.status(409).send("Le Catway n'est plus disponible pour cette période. Veuillez choisir d'autres dates.");
        }

        
        const updatedReservation = await Reservation.findOneAndUpdate(
            { _id: idReservation },
            dataToUpdate,
            { new: true, runValidators: true } // { new: true } renvoie le document mis à jour
        );
        
        if (!updatedReservation) {
            return res.status(404).send("Réservation non trouvée pour mise à jour.");
        }
        
        // 5. Succès
        C.log('green', `Réservation ${idReservation} mise à jour.`);
        //return res.status(302).redirect('/catways/reservations?page=findAllReserv'); 
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Erreur de mise à jour de réservation:", error);
        return res.status(500).send("Erreur serveur lors de la mise à jour.");
    }
};

exports.getOneReservation = async (req, res, next) => {
    
    const { idCatway, idReservation } = req.params;

    C.log('magenta', `numéro du catway : ${idCatway} // Numéro de la réservation : ${idReservation}`)
    session = req.session;
    
    C.log('magenta', `${req.query.page}`)
    //dispatch voir reserv et modify reserv

    try {
        // Logique : Trouver la réservation par son ID 
        const reservation = await Reservation.findOne({ _id: idReservation });
        
        if (!reservation) {
            C.log('red', `Aucune réservatin de trouvé`)
            return res.status(404).send("Réservation non trouvée.");
        }

        if (req.query.page === 'modifyReserv') {
            C.log('green', `Début de la route modification de reservation`)
            session.page = 'modifyReserv';
            return res.render(`pages/reservation`, { session: session, idCatway: idCatway, modifyReservation: reservation})
        } else if (req.query.page === 'findOneReserv') {

            session.page = 'findOneReserv'
            C.log('green', `Début de la route recherche une réservation`)
        

            //return res.redirect(`/catways/${idCatway}/reservation/${idReservation}?page=findOneReserv`)
            return res.render('pages/reservation', { session:session, idCatway:idCatway, findOneReservation:reservation });
            //return res.status(200).json({ message: `Détails de la Réservation ${idReservation} pour Catway ${idCatway}` });
            }
        else {
            C.log('red', `Erreur de query page dans reservation.js`)
            return res.status(400).send("Paramètre de page invalide.");
        }
    } catch (error) {
        console.error("Erreur de détail :", error);
        return res.status(500).send("Erreur serveur.");
    }
};

exports.deleteReservation = async (req, res, next) => {
    C.log('green', `Début de la route de suppression de réservation`)
    const { idCatway, idReservation } = req.params;

    try {
        // Logique : Trouver et supprimer par ID de Réservation et Catway ID
        const result = await Reservation.findOneAndDelete({ _id: idReservation, catwayNumber: idCatway });
        
        if (!result) {
            return res.status(404).send("Réservation non trouvée pour suppression.");
        }
        
        // return res.status(204).end(); // 204 No Content pour une suppression réussie
        return res.status(204).json({ message: `Réservation ${idReservation} supprimée sur Catway ${idCatway}` });

    } catch (error) {
        console.error("Erreur de suppression :", error);
        return res.status(500).send("Erreur serveur.");
    }
};

exports.getAllReservForOneCatway = async (req, res, next) => { 
    session = req.session;
    const idCatway = req.params.idCatway; 
    C.log('green', `Début page liste Réserv pour numéro `)
    session.page = 'findForCatway';
    C.log('yellow', `Le numéro de catway demandé est le : ${idCatway}`)
    try {
        // Logique : Trouver toutes les réservations dont le champ 'catwayId' (ou équivalent) est égal à idCatway
        const reservations = await Reservation.find({ catwayNumber: idCatway }).sort('startDate');
        
        return res.render('pages/reservation', { session:session, oneCatReservations:reservations, idCatway:idCatway });
        //return res.status(200).json({ message: `Liste des réservations pour Catway ${idCatway}` });

    } catch (error) {
        console.error("Erreur de liste :", error);
        return res.status(500).send("Erreur serveur.");
    }
};

exports.createReservation = async (req, res, next) => {
    C.log('green', `Début route Réservation Post`)
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
        C.log('red', `JOI validation reservation erreur`)
    return res.status(400).render('pages/reservation', {
    message: error.details[0].message
    });
    };

    try {
        
        // 2. Création de l'objet Reservation, en ajoutant l'idCatway
        // const newReservation = new Reservation({ ...data, catwayId: idCatway });
            const newReservation = new Reservation({
                    catwayNumber: temp.catwayNumber,
                    clientName: temp.clientName,
                    boatName: temp.boatName,
                    startDate: temp.startDate,
                    endDate: temp.endDate
            });
        // 3. Sauvegarde
        // const savedReservation = await newReservation.save();
        
            const reservationSaved = await newReservation.save();
            console.log(`Nouvelle réservation ajouté: ${reservationSaved.clientName}`);
            //return res.status(302).redirect('/catways/reservation');
        
        
        return res.status(302).redirect(`/catways/reservations?page=findAllReserv`);
        //C.log('magenta', `Réservation créée sur Catway ${idCatway} au nom de : ${data.clientName}`)
        //return res.status(201).render('pages/reservation')

    } catch (error) {
        console.error("Erreur de création de réservation:", error);
        return res.status(500).send("Erreur serveur.");
    }
};
