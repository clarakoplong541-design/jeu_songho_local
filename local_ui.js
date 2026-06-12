/**
 * Module UI : Gère l'affichage des graines dans les boutons en bois
 */
function updateDOM(state) {
    // 1. Mise à jour des scores en haut du plateau
    document.getElementById("score-north").innerText = state.scores.north;
    document.getElementById("score-south").innerText = state.scores.south;

    // 2. Mise à jour du message indiquant à qui le tour
    const infoTurn = document.getElementById("info-turn");
    if (state.status === "playing") {
        infoTurn.innerText = `Tour : Joueur ${state.currentPlayer === "south" ? "Sud" : "Nord"}`;
    }

    // 3. Dessiner le nombre de graines pour la rangée du Nord
    const northPits = document.querySelectorAll(".north-row .pit");
    state.board.north.forEach((seeds, index) => {
        if (northPits[index]) northPits[index].innerText = seeds;
    });

    // 4. Dessiner le nombre de graines pour la rangée du Sud
    const southPits = document.querySelectorAll(".south-row .pit");
    state.board.south.forEach((seeds, index) => {
        if (southPits[index]) southPits[index].innerText = seeds;
    });

    // 5. Affichage de l'écran de fin de partie
    if (state.status === "ended") {
        const overlay = document.getElementById("celebration-overlay");
        const msg = document.getElementById("winner-message");
        
        if (overlay && msg) {
            overlay.classList.remove("hidden");
            if (state.winner === "draw") {
                msg.innerText = "Match nul !";
            } else {
                msg.innerText = `Le joueur ${state.winner === "south" ? "SUD" : "NORD"} a gagné !`;
            }
        }
    }
}

// Rendre la fonction disponible pour local_app.js
window.updateDOM = updateDOM;