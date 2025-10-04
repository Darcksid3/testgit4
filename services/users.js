// Import
const bcrypt = require('bcrypt');

//TODO "Nodemailer" const nodemailer = require('nodemailer');
const C = require('../test/test');

const inscriptionSchema = require('../joi/inscriptionSchema');
const modifyUsersSchema = require('../joi/modifyUsersSchema');

exports.getAllUsers = async (req, res, next) => {
    // mise raccourci de la session
    session = req.session;
    //* récupération de la page
    session.page = req.query.page;
    //? console log de la page à afficher
    C.page('users', session.page);

    try {
        let users = [];
        //* récupération des Utilisateur dans la DB
        if (session.page === 'findAllUsers') {
            users = await Users.find({}).sort({ catwayNumber: 1 });; 
            C.log('green', `trouvé ${users.length} utilisateur`);
        }

        //? vérification de la présence d'un email en session
        if (session.email !== undefined) {
            C.log('green', `ouverture page users if req.session.email => ${session.email}`)
            res.status(200).render('pages/users', { session: session, allUsers: users });
        } else {
            C.log('red', `ouverture page users else req.session.email => ${session.email}`)
            res.status(401).render('pages/users', { visite: session.visit});
        }

    } catch (error) {
            C.log('red', `Erreur de recherche d'utilisateurs: ${error.message}`);
            res.status(500).send(`Une erreur est arrivé durant la recherche d'utilisateur.`);
        }
};

exports.getOneUsers = async (req,res) => {
    // mise raccourci de la session
    session = req.session;
    //* Récupération de l'email
    let emailFind = req.params.email;
    C.log('cyan', `Début de la page user/email l'email est : ${emailFind}`);
    //* Récupératin de la page demandé
    const pageDemande = req.query.page;
    C.log('cyan', `Affichage de la page demandé ${pageDemande}`);
    //* recherche dans la base de l'utilisateur' demandé
    try {
        let user = [];
        user = await Users.findOne({ email: emailFind });
        C.log('green', `L'email :' ${user.email} a été trouvé`);
        C.log('yellow', `Information l'utilisateur récupéré ${JSON.stringify(user)}`)
        //* switch de la page
        switch (pageDemande) {
            case 'modifyUsers' :
                C.page('users', pageDemande);
                session.page = 'modifyUsers';
                res.status(200).render('pages/users', {session: session, user: user});
                break;
            case 'findOneUsers' :
                C.page('users', pageDemande);
                session.page = 'findOneUsers';
                res.status(200).render('pages/users', {session: session, user: user})
            default :
                C.page('user', pageDemande);
                session.page = 'findOneUsers';
                res.status(200).render('pages/users', {session: session})
        }
    } catch (error) {
        C.log('red', `Erreur de recherche d'utilisateur': ${error.message}`);
        res.status(500).send(`Une erreur est arrivé durant la recherche d'utilisateur.`);
    }
};

exports.modifyUsers = async (req,res,next) => {
    const session = req.session;
    C.log('green', `Début requête modification d'utilisateur'`);

    // Validation du schéma par JOI
    const { error } = modifyUsersSchema.validate(req.body);
    if (error) {
        session.errMsg = error.details[0].message;
        session.formData = req.body;
        C.log('red', `Inscription: Erreur JOI - ${error.details[0].message}`);
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
        C.log('Juste avant  le 302 redirect')
        return res.status(200).json({ message: "Utilisateur mis à jour.", success: true });

    } catch (error) {
        console.error("Erreur de mise à jour (DB ou bcrypt):", error);
        session.errMsg = `Erreur serveur lors de la mise à jour: ${error.message}`;
        return res.status(500).json({ message: `Erreur serveur: ${error.message}` });
    }
        
};

exports.deleteUsers = async (req, res, next) => {
    C.log('green', `Début requette de suppression d'un utilisateur`);
    // Récupérer l'ID du catway à supprimer
    const emailFind = req.params.email;
    try {
        // Logique de suppression dans Mongoose
        const result = await Users.findOneAndDelete({ email: emailFind });

        if (!result) {
            // Si Mongoose ne trouve rien
            C.log('red', `Mongoose ne trouve pas l'utilisateur`)
            return res.status(404).send(`'Mongoose ne trouve pas l'itilisateur''`);
        }

        // Redirection vers la liste de tous les catways après suppression
        C.log('green', `Supression de l'utilisateur ${emailFind} réussit`)
        return res.status(200).send('Supression OK'); 

    } catch (error) {
        C.log('red', 'Serveur erreur de suppression')
        console.error("Erreur de suppression:", error);
        return res.status(500).send('ERREUR Serveur');
    }
};

exports.createUser = async (req, res, next) => { 
    // mise raccourci de la session
    session = req.session;
    session.page = 'createUsers';
    C.log('magenta', ` Debut ajout utilisateur`)

    // recherche si l'utilisateur est déja présent
    try {
        // Vérification de l'utilisateur existant 
        const oldUser = await Users.findOne({ email: req.body.email });
        if (oldUser) {
            session.errorMessage = 'Cet email est déjà enregistré.';
            session.formData = req.body;
            C.log('red', `Inscription: Email déjà utilisé.`);
            return res.status(409).redirect('/users?page=createUsers');
        }

        // Validation du schéma par JOI
        const { error } = inscriptionSchema.validate(req.body);
        if (error) {
            session.errorMessage = error.details[0].message;
            session.formData = req.body;
            C.log('red', `Inscription: Erreur JOI - ${error.details[0].message}`);
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
        console.log(`Nouvel utilisateur ajouté: ${userSaved.email}`);
        
        // 6. Redirection après succès
        session.successMessage = `Utilisateur ${userSaved.email} créé avec succès.`;
        return res.status(302).redirect('/users?page=findAllUsers');

    } catch (dbError) {
        console.error(`Erreur lors de la création de l'utilisateur : ${dbError.message}`);
        session.errorMessage = `Erreur serveur lors de la création de l'utilisateur.`;
        // Redirige vers la liste avec l'erreur serveur pour ne pas perdre l'utilisateur
        return res.status(500).redirect('/users?page=findAllUsers'); 
    }
        

    //TODO "Nodemailer" Création du contenu de l'e-mail 
    /*
    const mailOptions = {
        from: 'votre_email@gmail.com',
        to: userSaved.email,
        subject: 'Vérification de votre adresse e-mail',
        html: `
        <p>Bonjour ${userSaved.name},</p>
        <p>Merci de vous être inscrit. Veuillez cliquer sur ce lien pour confirmer votre adresse e-mail :</p>
        <a href="http://localhost:3000/users/verify/${userSaved.emailVerificationToken}">Confirmer mon e-mail</a>
        `
    };

    // Envoi de l'e-mail
    await transporter.sendMail(mailOptions);
    */
    /*
    res.status(201).render('pages/users', {
        message: 'Utilisateur créé. ' //TODO "Nodemailer" Un e-mail de confirmation a été envoyé.
    });
    */
};

//TODO "Nodemailer" Configuration de Nodemailer en attente(je pense utilisez Alwaysdata pour la mise en ligne)
/*  
const transporter = nodemailer.createTransport({
    service: 'alwaysdata',
    auth: {
    user: 'User Email', // Remplacez par votre adresse email
    pass: 'UserPassApp'  // Remplacez par votre mot de passe d'application
    }
});
*/



//TODO "Nodemailer" Route pour la vérification par email
/*
exports.verifyEmail = async (req, res, next) => {
    try {
    const user = await Users.findOne({
        emailVerificationToken: req.params.token,
        emailVerificationTokenExpires: { $gt: Date.now() } // Vérifie si le token n'est pas expiré
    });

    if (!user) {
        return res.status(404).render('pages/users', {
        message: 'Le lien de vérification est invalide ou a expiré.'
        });
    }

    // Le token est valide, on met à jour l'utilisateur
    user.isVerified = true;
    user.emailVerificationToken = undefined; // On supprime le token pour qu'il ne puisse pas être réutilisé
    user.emailVerificationTokenExpires = undefined;

    await user.save();
    
    // Vous pouvez aussi créer une session ici pour connecter l'utilisateur
    req.session.email = user.email;
    req.session.verif = true;
    req.session.name = user.name;

    res.status(200).render('pages/users', {
        message: 'Votre adresse e-mail a été vérifiée avec succès ! Vous pouvez maintenant vous connecter.'
    });

    } catch (error) {
    console.error(`Erreur lors de la vérification de l'e-mail : ${error.message}`);
    res.status(500).render('pages/users', {
        message: 'Une erreur est survenue lors de la vérification.'
    });
    }
};*/