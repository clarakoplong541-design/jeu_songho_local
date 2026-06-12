// Création de l'état initial du jeu de Songo
let gameState = createGame("south");

document.addEventListener("DOMContentLoaded", () => {
    // Premier affichage au chargement de la page
    updateDOM(gameState);
});

function handlePitClick(player, pitIndex) {
    if (gameState.status === "ended") return;

    if (player !== gameState.currentPlayer) {
        alert("Ce n'est pas votre tour !");
        return;
    }

    // Appel de la fonction de distribution présente dans engine.js
    const result = applyMove(gameState, { player, pitIndex });

    if (result.ok) {
        gameState = result.state;
        // Rafraîchir l'affichage des graines
        updateDOM(gameState);
    } else {
        alert(`Mouvement impossible : ${result.error}`);
    }
}
function recommencerLocal() {
    if (confirm("Voulez-vous vraiment recommencer la partie ?")) {
        // On recrée un état de jeu tout neuf avec le moteur
        state = createGame("south"); 
        // On force la mise à jour de l'affichage
        updateDOM(state); 
    }
}

function quiterJeu() {
    if (confirm("Voulez-vous quitter le jeu et fermer cette page ?")) {
        window.close(); // Ferme l'onglet
        // Si la fermeture est bloquée par le navigateur, on redirige vers Google ou une page blanche
        window.location.href = "about:blank"; 
    }
}

// Rendre la fonction accessible au clic sur les boutons HTML
window.handlePitClick = handlePitClick;