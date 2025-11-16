const playground = document.getElementById('pongJeu');
const raquetteJoueur = document.getElementById('raquetteJoueur');
const raquetteJoueur2 = document.getElementById('raquetteJoueur2');
const raquetteIA = document.getElementById('raquetteIA');
const balle = document.getElementById('balle');
const scoreJoueurElem = document.getElementById('scoreJoueur');
const scoreJoueur2Elem = document.getElementById('scoreJoueur2');
const scoreIAElem = document.getElementById('scoreIA');

const largeurJeu = playground.clientWidth;
const hauteurJeu = playground.clientHeight;
const largeurRaquette = 10;
const hauteurRaquette = 100;
const tailleBalle = 20;
const vitesseRaquetteJoueur = 8;
let vitesseRaquetteIA = 4;
const vitesseBalle = 5;

let jouer = true; 
let joueur_y = hauteurJeu / 2 - hauteurRaquette / 2;
let joueur2_y = hauteurJeu / 2 - hauteurRaquette / 2;
let IA_y = hauteurJeu / 2 - hauteurRaquette / 2;
let balle_x = largeurJeu / 2 - tailleBalle / 2;
let balle_y = hauteurJeu / 2 - tailleBalle / 2;
let balle_dx = vitesseBalle;
let balle_dy = vitesseBalle;
let scoreJoueur = 0;
let scoreJoueur2 = 0;
let scoreIA = 0;
let difficulte = "facile";
let nbPoints = 5;
let nbPoints_fin_var = 5;
let game_over = false;

let joueur_Monte = false;
let joueur_Descend = false;
let joueur2_Monte = false;
let joueur2_Descend = false;
let mode_IA = true;
let mode_1v1 = false;

document.getElementById('game_over').style.visibility = "hidden";
playground.style.visibility = "hidden";
raquetteIA.style.visibility = "hidden";
scoreIAElem.style.visibility = "hidden";
raquetteJoueur2.style.visibility = "hidden";
scoreJoueur2Elem.style.visibility = "hidden";

function J2_present(){
    return raquetteJoueur2.style.visibility === 'visible';
}

function IA_present(){
    return raquetteIA.style.visibility === 'visible';
}

function getRandomInt(min, max) { // fonction retournant un int aléatoire
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function mode_act(){
    if(jouer){
        if(mode_IA){
            playground.style.visibility = "visible";
            raquetteJoueur2.style.visibility = 'hidden';
            scoreJoueur2Elem.style.visibility = 'hidden';
            raquetteIA.style.visibility = 'visible';
            scoreIAElem.style.visibility = 'visible';
            mode_1v1 = false;
        }
        if(mode_1v1){
            playground.style.visibility = "visible";
            raquetteJoueur2.style.visibility = 'visible';
            scoreJoueur2Elem.style.visibility = 'visible';
            raquetteIA.style.visibility = 'hidden';
            scoreIAElem.style.visibility = 'hidden';
            mode_IA = false;
        }
    }
}

function changerDifficulte(){ //changement de difficultée via le boutton associé
    if(difficulte === "facile"){
        difficulte = "moyen";
        vitesseRaquetteIA = 5; //IA 25% plus rapide qu'en facile
        document.getElementById('difficulte').textContent = "Difficultée : Moyen";
    }
    else if(difficulte === "moyen"){
        difficulte = "difficile";
        vitesseRaquetteIA = 6; //IA 50% plus rapide qu'en facile
        document.getElementById('difficulte').textContent = "Difficultée : Difficile";
    }
    else{
        difficulte = "facile";
        vitesseRaquetteIA = 4;
        document.getElementById('difficulte').textContent = "Difficultée : Facile";
    }
}

function nbPoints_fin(){
    if(nbPoints === 5){
        nbPoints = 7;
        document.getElementById('points').textContent = "Points pour gagner : 7";
    }
    else if(nbPoints === 7){
        nbPoints = 9;
        document.getElementById('points').textContent = "Points pour gagner : 9";
    }
    else{
        nbPoints = 5;
        document.getElementById('points').textContent = "Points pour gagner : 5";
    }
}

function whoWin(){
    if(scoreIA >= nbPoints_fin_var){
        document.getElementById('win').textContent = "Le vainqueur est : IA";
    }
    else if(scoreJoueur >= nbPoints_fin_var){
        document.getElementById('win').textContent = "Le vainqueur est : Joueur1";
    }
    else if(scoreJoueur2 >= nbPoints_fin_var){
        document.getElementById('win').textContent = "Le vainqueur est : Joueur2";
    }
    document.getElementById('game_over').style.visibility = "visible";
}

function changerMode(){
    if(mode_IA){
        mode_IA = false;
        mode_1v1 = true;
        document.getElementById('mode').textContent = "Mode : Joueur1 vs Joueur2";
    }
    else{
        mode_IA = true;
        mode_1v1 = false;
        document.getElementById('mode').textContent = "Mode : Joueur1 vs IA";
    }
}

function updatePos() {
    raquetteJoueur.style.top = joueur_y + 'px';
    raquetteJoueur2.style.top = joueur2_y + 'px';
    raquetteIA.style.top = IA_y + 'px';
    balle.style.left = balle_x + 'px';
    balle.style.top = balle_y + 'px';
    scoreJoueurElem.textContent = scoreJoueur;
    scoreJoueur2Elem.textContent = scoreJoueur2;
    scoreIAElem.textContent = scoreIA;
}

function moveRaquettes() {
    if (joueur_Monte) { //déplacement Joueur1
        joueur_y -= vitesseRaquetteJoueur;
        if (joueur_y < 0) joueur_y = 0;
    }
    if (joueur_Descend) {
        joueur_y += vitesseRaquetteJoueur;
        if (joueur_y + hauteurRaquette > hauteurJeu) joueur_y = hauteurJeu - hauteurRaquette;
    }

    if(mode_1v1){ //déplacement Joueur2 (si présent)
        if (joueur2_Monte) { 
            joueur2_y -= vitesseRaquetteJoueur;
            if (joueur2_y < 0) joueur2_y = 0;
        }
        if (joueur2_Descend) {
            joueur2_y += vitesseRaquetteJoueur;
            if (joueur2_y + hauteurRaquette > hauteurJeu) joueur2_y = hauteurJeu - hauteurRaquette;
        }
    }

    if(mode_IA){ //déplacement IA (si présente)
        if (balle_y < IA_y + hauteurRaquette / 2) { 
            IA_y -= vitesseRaquetteIA;
        } else {
            IA_y += vitesseRaquetteIA;
        }
    
        if (IA_y < 0) IA_y = 0;
        if (IA_y + hauteurRaquette > hauteurJeu) IA_y = hauteurJeu - hauteurRaquette;
    }
}

function moveBalle() {
    balle_x += balle_dx;
    balle_y += balle_dy;

    //Colisions :

    //Colisions murs haut/bas :
    if (balle_y < 0 || balle_y + tailleBalle > hauteurJeu) {
        balle_dy *= -1;
    }

    //Colisions joueur1 :
    if (balle_x < raquetteJoueur.offsetLeft + largeurRaquette && balle_y + tailleBalle > joueur_y && balle_y < joueur_y + hauteurRaquette) {
        balle_dx *= -1;
        if(balle_dx > 0){
            balle_dx += 0.5;
            balle_dy += 0.1;
        }
        else{balle_dx -= 0.5;
            balle_dy -= 0.1;
        }
    }

    //Colisions joueur2(si il est présent) :
    if ((balle_x + tailleBalle > raquetteJoueur2.offsetLeft && balle_y + tailleBalle < joueur2_y && balle_y > joueur2_y + hauteurRaquette ) && J2_present) {
        balle_dx *= -1;
        if(balle_dx > 0){
            balle_dx += 0.5;
            balle_dy += 0.1;
        }
        else{balle_dx -= 0.5;
            balle_dy -= 0.1;
        }
    }

    //Colisions IA(si elle est présente) :
    if ((balle_x + tailleBalle > raquetteIA.offsetLeft && balle_y + tailleBalle > IA_y && balle_y < IA_y + hauteurRaquette) && IA_present) {
        balle_dx *= -1;
        if(balle_dx > 0){
            balle_dx += 0.5;
            balle_dy += 0.1;
        }
        else{balle_dx -= 0.5;
            balle_dy -= 0.1;
        }
    }

    // modifications des scores lorsque la balle sort du terrain à droite ou à gauche
    if (balle_x < 0) {
        if(mode_IA){
            scoreIA++;
        }
        else if(mode_1v1){
            scoreJoueur2++;
        }
        resetBalle();
    }
    if (balle_x + tailleBalle > largeurJeu) {
        scoreJoueur++;
        resetBalle();
    }

    balle.style.left = balle_x + 'px';
    balle.style.top = balle_y + 'px';
}

function resetBalle() {
    balle_dx = vitesseBalle;
    balle_dy = vitesseBalle;
    balle_x = largeurJeu / 2 - tailleBalle / 2;
    balle_y = getRandomInt(50, hauteurJeu - 50); // position aléatoire de la balle après qu'un point ait été marqué
    if(balle_y < hauteurJeu /2){ // faire en sorte que la balle se dirige vers le mur le plus proche lorsqu'elle apparaît
        balle_dy *= -1;
    }
    balle_dx *= -1;
}

window.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'z':
            joueur_Monte = true;
            break;
        case 's':
            joueur_Descend = true;
            break;
        case 'ArrowUp':
            joueur2_Monte = true;
            break;
        case 'ArrowDown':
            joueur2_Descend = true;
            break;      
    }
});

window.addEventListener('keyup', function(e) {
    switch (e.key) {
        case 'z':
            joueur_Monte = false;
            break;
        case 's':
            joueur_Descend = false;
            break;
        case 'ArrowUp':
            joueur2_Monte = false;
            break;
        case 'ArrowDown':
            joueur2_Descend = false;
            break;
    }
});

function demarrerJeu(){
    jouer = true;
    document.getElementById('game_over').style.visibility = "hidden";
    scoreIA = 0;
    scoreJoueur = 0;
    scoreJoueur2 = 0;
    resetBalle();
    nbPoints_fin_var = nbPoints;
    boucleDeJeu();
}

function boucleDeJeu() {
    if(scoreJoueur >= nbPoints_fin_var || scoreIA >= nbPoints_fin_var || scoreJoueur2 >= nbPoints_fin_var){
        whoWin();
        arreterJeu();
    }

    if(jouer){
        update();
        requestAnimationFrame(boucleDeJeu);
    }
    else{
        playground.style.visibility = "hidden";
        raquetteIA.style.visibility = "hidden";
        scoreIAElem.style.visibility = "hidden";
        raquetteJoueur2.style.visibility = "hidden";
        scoreJoueur2Elem.style.visibility = "hidden";
    }
}

function update() {
    mode_act();
    moveRaquettes();
    moveBalle();
    updatePos();
}

function arreterJeu(){
    jouer = false;
    scoreIA = 0;
    scoreJoueur = 0;
    scoreJoueur2 = 0;
}

function recommencerJeu(){
    scoreIA = 0;
    scoreJoueur = 0;
    scoreJoueur2 = 0;
    resetBalle();
}