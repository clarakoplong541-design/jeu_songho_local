// engine.js - Moteur de calcul du Songo

function createGame(firstPlayer = "south") {
    return {
        board: {
            north: [5, 5, 5, 5, 5, 5, 5],
            south: [5, 5, 5, 5, 5, 5, 5]
        },
        scores: {
            north: 0,
            south: 0
        },
        currentPlayer: firstPlayer,
        status: "playing",
        winner: null
    };
}

function applyMove(state, move) {
    const { player, pitIndex } = move;

    if (state.status === "ended") {
        return { ok: false, state, error: "La partie est déjà terminée." };
    }
    if (player !== state.currentPlayer) {
        return { ok: false, state, error: "Ce n'est pas le tour de ce joueur." };
    }
    if (pitIndex < 0 || pitIndex > 6) {
        return { ok: false, state, error: "Indice de case invalide." };
    }

    const nextState = JSON.parse(JSON.stringify(state));
    const pits = nextState.board[player];
    let seeds = pits[pitIndex];

    if (seeds === 0) {
        return { ok: false, state, error: "La case sélectionnée est vide." };
    }

    pits[pitIndex] = 0; 
    
    let path = [];
    for (let i = 0; i < 7; i++) path.push({ side: "south", index: i });
    for (let i = 6; i >= 0; i--) path.push({ side: "north", index: i });

    let currentPathIndex = path.findIndex(p => p.side === player && p.index === pitIndex);

    let lastSide = player;
    let lastIndex = pitIndex;

    while (seeds > 0) {
        currentPathIndex = (currentPathIndex + 1) % path.length;
        const target = path[currentPathIndex];

        if (target.side === player && target.index === pitIndex) {
            continue; 
        }

        nextState.board[target.side][target.index]++;
        seeds--;

        if (seeds === 0) {
            lastSide = target.side;
            lastIndex = target.index;
        }
    }

    const opponent = player === "south" ? "north" : "south";

    if (lastSide === opponent) {
        let capturedSeeds = 0;
        let indexToCheck = lastIndex;
        
        const step = opponent === "south" ? -1 : 1;
        const firstProtectedIndex = opponent === "south" ? 0 : 6;

        while (indexToCheck >= 0 && indexToCheck <= 6) {
            const currentSeeds = nextState.board[opponent][indexToCheck];

            if (currentSeeds === 2 || currentSeeds === 3 || currentSeeds === 4) {
                if (indexToCheck === firstProtectedIndex && capturedSeeds === 0) {
                    break; 
                }
                capturedSeeds += currentSeeds;
                nextState.board[opponent][indexToCheck] = 0;
                indexToCheck += step;
            } else {
                break;
            }
        }

        const opponentTotalSeeds = nextState.board[opponent].reduce((a, b) => a + b, 0);
        if (opponentTotalSeeds === 0 && capturedSeeds > 0) {
            let indexToCheck = lastIndex;
            while (indexToCheck >= 0 && indexToCheck <= 6) {
                if (nextState.board[opponent][indexToCheck] === 0) {
                    nextState.board[opponent][indexToCheck] = 2; 
                    indexToCheck += step;
                } else {
                    break;
                }
            }
        } else {
            nextState.scores[player] += capturedSeeds;
        }
    }

    nextState.currentPlayer = opponent;

    const totalSeedsOnBoard = nextState.board.south.reduce((a,b)=>a+b, 0) + nextState.board.north.reduce((a,b)=>a+b, 0);

    if (nextState.scores.south >= 40) {
        nextState.status = "ended";
        nextState.winner = "south";
    } else if (nextState.scores.north >= 40) {
        nextState.status = "ended";
        nextState.winner = "north";
    }
    else if (totalSeedsOnBoard < 10) {
        nextState.status = "ended";
        
        const southTotal = nextState.board.south.reduce((a,b)=>a+b, 0);
        const northTotal = nextState.board.north.reduce((a,b)=>a+b, 0);
        
        nextState.scores.south += southTotal;
        nextState.scores.north += northTotal;

        nextState.board.south = [0,0,0,0,0,0,0];
        nextState.board.north = [0,0,0,0,0,0,0];

        if (nextState.scores.south > nextState.scores.north) {
            nextState.winner = "south";
        } else if (nextState.scores.north > nextState.scores.south) {
            nextState.winner = "north";
        } else {
            nextState.winner = "draw";
        }
    }

    return { ok: true, state: nextState, error: null };
}

window.createGame = createGame;
window.applyMove = applyMove;