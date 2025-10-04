[Français](#Description) // [English](#Presentation)


# Description
C'est une application web de gestion des réservations de catway.\
Elle implémente un systéme de authentification d'utilisateur,\
la gestion d'une base de donée pour les utilisateurs les apontements et les réservations,\
ainsi qu'un tableau de bord pour l'administration.

## Feuille de route
:x: !!Section en cours!!
1. :white_check_mark: Gestion des catways
2. :white_check_mark: Gestion des réservations
3. :x:Gestion des utilisateurs

### Status
- :white_check_mark: Serveur fonctionnel.
- :white_check_mark: gestion de catway complete (liste, recherche, ajout, modification et suppression).
- :white_check_mark: gestion de reservation complete (liste, recherche, ajout, modification et suppression).
    - :x: A venir !! Ajout de la recherche d'une réservation par son ID
- :x: Options de base de gestion d'utilisateur (liste, recheche, ajout modification et supression).
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
1. :white_check_mark:Catway's system
2. :white_check_mark:Reservation's system
3. :x:User's system


### Status
- :white_check_mark: Server On
- :white_check_mark: catway system (list, find one, add, modify and supress).
- :white_check_mark: reservation system (list, find one, add, modify and supress).
    - :x: TODO one feature search reservation by this ID. 
- :x: Simple users system (list, find one, add, modify and supress).



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
