//import
const Joi = require('joi'); // Joi

const catwaySchema = require('../joi/catwaySchema'); // Votre schéma Joi
const Catway = require('../models/catway')
const Reservation = require('../models/reservation');
const C = require('../test/test');

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
            // S'il y a un conflit, renvoyer 409 Conflict
            return res.status(409).json({ available: false, message: "Catway indisponible." });
        }

        // S'il n'y a pas de conflit, renvoyer 200 OK
        return res.status(200).json({ available: true, message: "Catway disponible." });

    } catch (error) {
        console.error("Erreur de vérification de disponibilité:", error);
        res.status(500).json({ error: "Erreur serveur interne." });
    }
};

exports.disponibility = async (req, res) => {
    // 1. Récupérer les dates depuis les paramètres de requête
  C.log('green', `Debut route disponibility`)
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Les dates de début et de fin sont requises." });
    }

    try {
        // --- LOGIQUE DE SERVICE (SIMPLIFIÉE) ---
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        // 2. Trouver tous les Catways (pour avoir tous les numéros et les types)
        const allCatways = await Catway.find({}, { catwayNumber: 1, catwayType: 1, _id: 0 }).lean();

        // 3. Trouver toutes les réservations qui interfèrent avec la période donnée
        // C'est la partie la plus importante : si une réservation chevauche (startDate, endDate), le catway est indisponible.
    const conflictingReservations = await Reservation.find({
      // La réservation existante chevauche la nouvelle période
      endDate: { $gt: newStart },      // La fin de l'ancienne > le début de la nouvelle
      startDate: { $lt: newEnd }       // ET le début de l'ancienne < la fin de la nouvelle
    }).lean();

        // 4. Identifier les Catways indisponibles
        const unavailableCatwayNumbers = conflictingReservations.map(res => res.catwayNumber);

        // 5. Filtrer et catégoriser les disponibles
        const availableShort = [];
        const availableLong = [];
        
        allCatways.forEach(catway => {
            // Si le numéro n'est pas dans la liste des indisponibles, il est disponible
            if (!unavailableCatwayNumbers.includes(catway.catwayNumber)) {
                if (catway.catwayType === 'short') {
                    availableShort.push(catway.catwayNumber);
                } else if (catway.catwayType === 'long') {
                    availableLong.push(catway.catwayNumber);
                }
            }
        });
        
        // --- FIN LOGIQUE DE SERVICE ---

        // 6. Renvoyer les résultats
        res.status(200).json({
            short: availableShort.sort((a, b) => a - b),
            long: availableLong.sort((a, b) => a - b)
        });

    } catch (error) {
        console.error("Erreur de disponibilité:", error);
        res.status(500).json({ error: "Erreur serveur lors de la vérification des disponibilités." });
    }
};

exports.reservation = async (req, res, next) => {
  
    // Vérification de la connexion (si ce n'est pas déjà un middleware)
    if (!req.session.verif) {
        return res.status(401).redirect('/');
    }
  session = req.session

  //* Access a la page de création d'une réservation
  if (req.query.page === 'createReserv') {
    C.log('green', `Début de la route create réservation `)
    session.page = 'createReserv';
    return res.render(`pages/reservation`, { session: session });
  }
  C.log('green', `Début de la route réservation All`)
  //* sinon afficher toutes les réservations
    try {
        // Logique pour trouver TOUTES les réservations, quel que soit le Catway
        let reservations = await Reservation.find({}).sort('startDate');

  session.page = 'findAllReserv'

        return res.render('pages/reservation', { 
      session: session,
            allReservations: reservations, 
            idCatway: null // Indique qu'on est en mode "toutes"
        });
        //return res.render('pages/reservation')
    //return res.status(200).json({ message: "Liste de TOUTES les réservations (Globale)" });

    } catch (error) {
        console.error("Erreur de liste globale des réservations:", error);
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

        // 1. Requête Mongoose :
        // - On filtre par la query (type ou vide pour 'all')
        // - On sélectionne uniquement le champ catwayNumber (le '1' signifie l'inclure)
        // - On trie par catwayNumber ascendant (1)
        const catways = await Catway.find(query, { catwayNumber: 1, _id: 0 })
            .sort({ catwayNumber: 1 })
            .lean(); // .lean() est recommandé pour les lectures rapides

        // 2. Transformer le résultat en un tableau simple de numéros [1, 2, 5, 9, ...]
        const numbers = catways.map(catway => catway.catwayNumber);

        // 3. Réponse en JSON
        return res.status(200).json(numbers);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des numéros de catway:", error);
        return res.status(500).json({ error: "Erreur serveur lors de la récupération des numéros." });
    }
};

exports.findOneCatway = async (req,res,next) => {
  //* récupération de la session
  session = req.session;
  //* Récupération du numéro de catway
  let idFind = req.params.id;
  C.log('cyan', `Début de la page catways/id l'id est : ${idFind}`);
  //* Récupératin de la page demandé
  const pageDemande = req.query.page;
  C.log('cyan', `Affichage de la page demandé ${pageDemande}`)
  //* recherche dans la base du catway demandé
  try {
    let catway = [];
    catway = await Catway.findOne({ catwayNumber: idFind });
    C.log('green', `Le numéro de catway ${catway.catwayNumber} a été trouvé`);
    C.log('yellow', `Information sur la catway récupéré ${JSON.stringify(catway)}`)
    //* switch de la page
    switch (pageDemande) {
      case 'modifyCatway' :
        C.page('catway', pageDemande);
        session.page = 'modifyCatway';
        res.status(200).render('pages/catways', {session: session, catway: catway});
        break;
      case 'findOneCatway' :
        C.page('catway', pageDemande);
        session.page = 'findOneCatway';
        res.status(200).render('pages/catways', {session: session, catway: catway})
        break;
      default :
        C.page('catway', pageDemande);
        session.page = 'findOneCatway';
        res.status(200).render('pages/catways', {session: session})
    }
  } catch (error) {
    C.log('red', `Erreur de recherche de catways: ${error.message}`);
    return res.status(500).send('Une erreur est arrivé durant la recherche de catways.');
  }
};

exports.modifyCatway = async (req,res,next) => {
  C.log('green', `Début requête modification de catway`);

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
      C.log('red', 'Catway non trouvé.')
      return res.status(404).send('Catway non trouvé.');
    }

    res.status(200).json({ message: "Catway mis à jour." });
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    return res.status(500).send(error.message);
  }
    
};

exports.deleteCatway = async (req, res, next) => {
    C.log('green', `Début requette de suppression de catway`);
    // Récupérer l'ID du catway à supprimer
	const idFind = req.params.id;
	
	
    //const catwayNumberToDelete = req.params.id;

    try {
        // Logique de suppression dans Mongoose
        const result = await Catway.findOneAndDelete({ catwayNumber: idFind });

        if (!result) {
            // Si Mongoose ne trouve rien
			C.log('red', 'Mongoose ne trouve pas le catway')
            return res.status(404).send('Mongoose ne trouve pas le catway');//redirect('/catways?page=findAllCatway');
        }

        // Redirection vers la liste de tous les catways après suppression
		C.log('green', `Supression du catway numéro ${idFind} réussit`)
        return res.status(200).send('Supression OK');//redirect('/catways?page=findAllCatway'); 

    } catch (error) {
		C.log('red', 'Serveur erreur de suppression')
        console.error("Erreur de suppression:", error);
        return res.status(500).send('ERREUR Serveur');//redirect('/catways?page=findAllCatway');
    }
};

exports.getAllCatway = async (req, res, next) => {
	//raccourci de la session
	session = req.session;

	//?Vérification de la connexion de l'utilisateur sinon redirection à l'accueil
	if (session.verif) {
		C.log('green', `catways connexion vérifié`);
	} else {
		C.log('red', `catways connexion non vérifié`)
		res.status(401).redirect('/')
	}

	//*récupération de la page
	session.page = req.query.page;
	//*switch des pages à afficher
	C.page(session.page);
	
	try {
		let catways = [];
		// récupératin des réservation dans la DB
		if (session.page === 'findAllCatway') {
			catways = await Catway.find({}).sort({ catwayNumber: 1 }); // Fetch all reservations
			C.log('green', `trouvé ${catways.length} reservations `);
			C.triCat(catways);
		} 


		//vérification de la présence d'un email en session
		if (session.email !== undefined){
			C.log('green', `ouverture page catways if req.session.email => ${session.email}`)
			res.status(200).render('pages/catways', { session: session, allCatways: catways });

		} else {
			C.log('red', `ouverture page catways else req.session.email => ${session.email}`)
			res.status(401).render('pages/catways', { visite: session.visit});
		}
	} catch (error) {
			C.log('red', `Erreur de recherche de catways: ${error.message}`);
			res.status(500).send('Une erreur est arrivé durant la recherche de catways.');
		}
};

exports.addCatway = async (req,res,next) => {
	//?récupération de la session
	C.log('green', `Début route post`);
	session = req.session;
	session.page = 'createCatway';
	//récupération des donnée du formulaire

	const catwayType = req.body.catwayType;
	C.log('magenta', catwayType);
	const catwayState = req.body.catwayState;
	C.log('magenta', catwayState);

	const { error } = catwaySchema.validate(req.body);

	if (error) {
	return res.status(400).render('pages/catways', {
	message: error.details[0].message
	});
	};
	
	try {
		   // --- NOUVELLE LOGIQUE POUR TROUVER L'ID ---
    
    // 1. Récupérer tous les numéros de catway existants et les trier
    const existingNumbers = await Catway.find({}, { catwayNumber: 1, _id: 0 })
        .sort({ catwayNumber: 1 }) // Trie par numéro croissant
        .then(docs => docs.map(doc => doc.catwayNumber));

    let newCatwayNumber;

    // 2. Trouver le plus petit entier manquant (le trou)
    for (let i = 1; i <= existingNumbers.length; i++) {
        // Si le numéro 'i' n'est pas présent dans la liste
        if (existingNumbers[i - 1] !== i) {
            newCatwayNumber = i;
            break;
        }
    }

    // 3. Si aucun trou n'est trouvé, prendre le dernier + 1
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
	console.log(`Nouveau catway ajouté: ${catwaySaved.catwayNumber}`);
	res.status(302).redirect('/catways?page=findAllCatway');

	} catch (dbError) {
		console.error(`Erreur lors de la création du catway : ${dbError.message}`);
		res.status(500).redirect('/catways?page=findAllCatway');
	}
};