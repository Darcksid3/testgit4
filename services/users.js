// Import
const bcrypt = require('bcrypt');

const Users = require('../models/users');
const inscriptionSchema = require('../joi/inscriptionSchema');
const modifyUsersSchema = require('../joi/modifyUsersSchema');

exports.getAllUsers = async (req, res, next) => {
    // mise raccourci de la session
    session = req.session;
    //* récupération de la page
    session.page = req.query.page;

    try {
        let users = [];
        //* récupération des Utilisateur dans la DB
        if (session.page === 'findAllUsers') {
            users = await Users.find({}); 
        }

    } catch (error) {
            res.status(500).send(`Une erreur est arrivé durant la recherche d'utilisateur.`);
        }
};

exports.getOneUsers = async (req,res) => {
    // mise raccourci de la session
    session = req.session;
    //* Récupération de l'email
    let emailFind = req.params.email;
    //* Récupératin de la page demandé
    const pageDemande = req.query.page;
    //* recherche dans la base de l'utilisateur' demandé
    try {
        let user = [];
        user = await Users.findOne({ email: emailFind });
        //* switch de la page
        switch (pageDemande) {
            case 'modifyUsers' :
                session.page = 'modifyUsers';
                res.status(200).render('pages/users', {session: session, user: user});
                break;
            case 'findOneUsers' :
                session.page = 'findOneUsers';
                res.status(200).render('pages/users', {session: session, user: user})
            default :
                session.page = 'findOneUsers';
                res.status(200).render('pages/users', {session: session})
        }
    } catch (error) {
        res.status(500).send(`Une erreur est arrivé durant la recherche d'utilisateur.`);
    }
};

exports.modifyUsers = async (req,res,next) => {
    const session = req.session;

    // Validation du schéma par JOI
    const { error } = modifyUsersSchema.validate(req.body);
    if (error) {
        session.errMsg = error.details[0].message;
        session.formData = req.body;
        return res.status(400).json({ 
            message: 'Erreur de validation des données.',
            details: error.details[0].message
        });
    };

    const updateFields = {
        name: req.body.name,
        email: req.body.email,
    };

    try {
        // Cryptage du mot de passe si il est fournis
        if (req.body.password) {
        // Hachage uniquement si le mot de passe est fourni
        const hash = await bcrypt.hash(req.body.password, 10);
        updateFields.password = hash; // Ajout du hash à l'objet de mise à jour
        }

        let updatedUser = await Users.findOneAndUpdate(
            { email : req.params.email},
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            C.log('red', 'Utilisateur non trouvé.');
            session.errMsg = 'Utilisateur non trouvé';
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        //* si l'utilisateur change ces propre information
        if (session.email === req.params.email) {
            session.email = updatedUser.email; 
            session.name = updatedUser.name;
        }
        return res.status(200).json({ message: "Utilisateur mis à jour.", success: true });

    } catch (error) {
        session.errMsg = `Erreur serveur lors de la mise à jour: ${error.message}`;
        return res.status(500).json({ message: `Erreur serveur: ${error.message}` });
    }
        
};

exports.deleteUsers = async (req, res, next) => {
    // Récupérer l'ID du catway à supprimer
    const emailFind = req.params.email;
    try {
        // Logique de suppression dans Mongoose
        const result = await Users.findOneAndDelete({ email: emailFind });

        if (!result) {
            // Si Mongoose ne trouve rien
            return res.status(404).send(`'Mongoose ne trouve pas l'itilisateur''`);
        }

        // Redirection vers la liste de tous les catways après suppression
        return res.status(200).send('Supression OK'); 

    } catch (error) {
        return res.status(500).send('ERREUR Serveur');
    }
};

exports.createUser = async (req, res, next) => { 
    // mise raccourci de la session
    session = req.session;
    session.page = 'createUsers';

    // recherche si l'utilisateur est déja présent
    try {
        // Vérification de l'utilisateur existant 
        const oldUser = await Users.findOne({ email: req.body.email });
        if (oldUser) {
            session.errorMessage = 'Cet email est déjà enregistré.';
            session.formData = req.body;
            return res.status(409).redirect('/users?page=createUsers');
        }

        // Validation du schéma par JOI
        const { error } = inscriptionSchema.validate(req.body);
        if (error) {
            session.errorMessage = error.details[0].message;
            session.formData = req.body;
            return res.status(400).redirect('/users?page=createUsers');
        }

        // 4. Cryptage du mot de passe (avec await)
        const hash = await bcrypt.hash(req.body.password, 10);

        // 5. Création et Sauvegarde de l'utilisateur
        const newUser = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hash // Utilisation du hachage
        });

        const userSaved = await newUser.save();
        
        // 6. Redirection après succès
        session.successMessage = `Utilisateur ${userSaved.email} créé avec succès.`;
        return res.status(302).redirect('/users?page=findAllUsers');

    } catch (dbError) {
        session.errorMessage = `Erreur serveur lors de la création de l'utilisateur.`;
        // Redirige vers la liste avec l'erreur serveur pour ne pas perdre l'utilisateur
        return res.status(500).redirect('/users?page=findAllUsers'); 
    }
};

