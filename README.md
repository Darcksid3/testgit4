[Français](#Description) // [English](#Presentation)


# Description
C'est une application web de gestion des réservations de catway.\
Elle implémente un systéme de authentification d'utilisateur,\
la gestion d'une base de donée pour les utilisateurs les apontements et les réservations,\
ainsi qu'un tableau de bord pour l'administration.

## Feuille de route
:x: !!Section en cours!!
1. Gestion des utilisateurs
    - :white_check_mark: Ajout des nouveau utilisateur dans la BD
2. Gestion des catways
3. Gestion des réservations

### Status
- :white_check_mark: Serveur fonctionnel.
- :white_check_mark: Options de base de gestion d'utilisateur.
- :white_check_mark: Options de base de gestion de catway.
- :white_check_mark: Options de base de gestion de reservation.

## Installation
cloner le repo.\
se rendre dans le dossier /api\
Utilisez la commande `npm install` pour ajouter les dépendances nécessaires.

### Gestion des variable d'environement
:x: !!Section en cours!!\
Crée un dossier "env" à la racine du projet, puis crée un fichier .env à l'intérieur.\
Copier ce qui suis et adapter le à vos besoins.

NODE_ENV=template\
APP_NAME=Mon API\
API_URL=127.0.0.1\
MONGO_URL='Votre url de connection'

### Démarrage du serveur
pour démarrer le serveur utilisez
`npm start`

# Presentation
This is a web application for managing catway reservations.\
It implements a user authentication system, database management\
for users, docks, and reservations, as well as an administration dashboard.

## Roadmap
:x: !!In Progress!!
1. User's system
    - :white_check_mark: Add new user in DB
2. Catway's system
3. Reservation's system

### Status
- :white_check_mark: Server On
- :white_check_mark: Simple users system
- :white_check_mark: Simple catway system.
- :white_check_mark: Simple reservation system.


## Instalation
Clone repos.\
Enter on /api folder\
Use `npm install` for add nécéssary dépandancies.

### Environement variable system
:x: !!In Progress!!
Create an "env" folder at the root of the project, then create an .env file inside.
Copy the following and adapt it to your needs.

NODE_ENV=template\
APP_NAME=My API\
API_URL=127.0.0.1\
MONGO_URL='Your connection url'

### Server start
For run the server use: `npm start`
