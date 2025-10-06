//imports
const catwaySchema = require('../joi/catwaySchema'); // Votre schéma Joi
const Catway = require('../models/catway')
const Reservation = require('../models/reservation');

/**
 * logique des routes catway
 */

    
exports.disponibilityCheck = async (req, res) => {
    const { startDate, endDate, catwayNumber, excludeId } = req.query; 

    if (!startDate || !endDate || !catwayNumber || !excludeId ) {
        return res.status(400).json({ error: "Paramètres de date, Catway et ID de réservation requis." });
    }

    try {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        
        // La requête Mongoose vérifie s'il existe UNE autre réservation
        const conflictingReservation = await Reservation.findOne({
            catwayNumber: catwayNumber, // Uniquement ce numéro de Catway
            _id: { $ne: excludeId },
            endDate: { $gt: newStart },      
            startDate: { $lt: newEnd }       
        }).lean();

        if (conflictingReservation) {
            // S'il y a un conflit
            return res.status(409).json({ available: false, message: "Catway indisponible." });
        }

        // S'il n'y a pas de conflit
        return res.status(200).json({ available: true, message: "Catway disponible." });

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur interne." });
    }
};

exports.disponibility = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Les dates de début et de fin sont requises." });
    }

    try {
        
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        
        const allCatways = await Catway.find({}, { catwayNumber: 1, catwayType: 1, _id: 0 }).lean();


    const conflictingReservations = await Reservation.find({
      // La réservation existante chevauche la nouvelle période
        endDate: { $gt: newStart },     
        startDate: { $lt: newEnd }     
    }).lean();

        const unavailableCatwayNumbers = conflictingReservations.map(res => res.catwayNumber);

        const availableShort = [];
        const availableLong = [];
        
        allCatways.forEach(catway => {
            if (!unavailableCatwayNumbers.includes(catway.catwayNumber)) {
                if (catway.catwayType === 'short') {
                    availableShort.push(catway.catwayNumber);
                } else if (catway.catwayType === 'long') {
                    availableLong.push(catway.catwayNumber);
                }
            }
        });
        
        res.status(200).json({
            short: availableShort.sort((a, b) => a - b),
            long: availableLong.sort((a, b) => a - b)
        });

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur lors de la vérification des disponibilités." });
    }
};

exports.reservation = async (req, res, next) => {
    session = req.session

    //* Access a la page de création d'une réservation
    if (req.query.page === 'createReserv') {
        session.page = 'createReserv';
        return res.render(`pages/reservation`, { session: session });
    }
    //* sinon afficher toutes les réservations
    try {
        // Logique pour trouver TOUTES les réservations, quel que soit le Catway
        let reservations = await Reservation.find({}).sort('startDate');

    session.page = 'findAllReserv'

        return res.render('pages/reservation', { 
            session: session,
            allReservations: reservations, 
            idCatway: null 
        });

    } catch (error) {
        return res.status(500).send("Erreur serveur.");
    }
};

exports.numbersType = async (req, res) => {
    try {
        const type = req.params.type;
        
        let query = {};
        // Si le paramètre n'est pas 'all', on ajoute la condition de filtre par type
        if (type !== 'all') {
            query.catwayType = type;
        }

        const catways = await Catway.find(query, { catwayNumber: 1, _id: 0 })
            .sort({ catwayNumber: 1 })
            .lean(); 

        const numbers = catways.map(catway => catway.catwayNumber);

        return res.status(200).json(numbers);
        
    } catch (error) {
        return res.status(500).json({ error: "Erreur serveur lors de la récupération des numéros." });
    }
};

exports.findOneCatway = async (req,res,next) => {
    //* récupération de la session
    session = req.session;
    //* Récupération du numéro de catway
    let idFind = req.params.id;
    //* Récupératin de la page demandé
    const pageDemande = req.query.page;
    //* recherche dans la base du catway demandé
    //récupération des réservation pour le catway recherché en vue de la page de modification
    const reservations = await Reservation.find({ catwayNumber: idFind })
    try {
        let catway = [];
        catway = await Catway.findOne({ catwayNumber: idFind });
        //* switch de la page
        switch (pageDemande) {
            case 'modifyCatway' :
            session.page = 'modifyCatway';
            res.status(200).render('pages/catways', {session: session, catway: catway, reservations: reservations});
            break;
        case 'findOneCatway' :
            session.page = 'findOneCatway';
            res.status(200).render('pages/catways', {session: session, catway: catway})
            break;
        default :
            session.page = 'findOneCatway';
            res.status(200).render('pages/catways', {session: session})
        }
    } catch (error) {
        return res.status(500).send('Une erreur est arrivé durant la recherche de catways.');
    }
};

exports.modifyCatway = async (req,res,next) => {

    // Récupération des données
    const idFind = req.params.id;
    const newType = req.body.catwayType;
    const newState = req.body.catwayState;




    try {
        let updatedCatway = await Catway.findOneAndUpdate(
        { catwayNumber : idFind},
        {
            catwayType: newType,
            catwayState: newState
        },
        { new: true, runValidators: true }
    );

        if (!updatedCatway) {
            return res.status(404).send('Catway non trouvé.');
        }
        res.status(200).json({ message: "Catway mis à jour." });
    } catch (error) {
        return res.status(500).send(error.message);
    }
    
};

exports.deleteCatway = async (req, res, next) => {
    // Récupérer l'ID du catway à supprimer
	const idFind = req.params.id;
	
    try {
                
        const result = await Catway.findOneAndDelete({ catwayNumber: idFind });

        if (!result) {
            return res.status(404).send('Mongoose ne trouve pas le catway');
        }

        return res.status(200).send('Supression OK'); 

    } catch (error) {
        return res.status(500).send('ERREUR Serveur');
    }
};

exports.getAllCatway = async (req, res, next) => {
	//raccourci de la session
	session = req.session;
	//*récupération de la page
	session.page = req.query.page;	
	try {
		let catways = [];
		// récupératin des réservation dans la DB
		if (session.page === 'findAllCatway') {
			catways = await Catway.find({}).sort({ catwayNumber: 1 }); 
		} 

		res.status(200).render('pages/catways', { session: session, allCatways: catways });
	} catch (error) {
        res.status(500).send('Une erreur est arrivé durant la recherche de catways.');
    }
};

exports.addCatway = async (req,res,next) => {
	session = req.session;
	session.page = 'createCatway';

	const { error } = catwaySchema.validate(req.body);

	if (error) {
	    return res.status(400).render('pages/catways', {
	    message: error.details[0].message
	    });
	};
	
	try {
        const existingNumbers = await Catway.find({}, { catwayNumber: 1, _id: 0 })
            .sort({ catwayNumber: 1 })
            .then(docs => docs.map(doc => doc.catwayNumber));

        let newCatwayNumber;
        for (let i = 1; i <= existingNumbers.length; i++) {
            if (existingNumbers[i - 1] !== i) {
                newCatwayNumber = i;
                break;
            }
        }
        if (newCatwayNumber === undefined) {
            const lastNumber = existingNumbers.length > 0 ? existingNumbers[existingNumbers.length - 1] : 0;
            newCatwayNumber = lastNumber + 1;
        }
            const newCatway = new Catway({
                catwayNumber: newCatwayNumber,
                catwayType: req.body.catwayType,
                catwayState: req.body.catwayState,
        });

        const catwaySaved = await newCatway.save();
        res.status(302).redirect('/catways?page=findAllCatway');

	} catch (dbError) {
		res.status(500).redirect('/catways?page=findAllCatway');
	}
};