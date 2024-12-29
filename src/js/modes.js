const gameModes = {
    easy: {
        name: 'easy',
        highlightTimer: 2000,
        timerSelection: 20000,
        speedOfSelection: 2000,
        turnDelay: 1200,
    },
    normal: {
        name: 'normal',
        highlightTimer: 1000,
        timerSelection: 10000,
        speedOfSelection: 1000,
        turnDelay: 600,
    },
    hard: {
        name: 'hard',
        highlightTimer: 500,
        timerSelection: 5000,
        speedOfSelection: 500,
        turnDelay: 350,
    },
    impossible: {
        name: 'impossible',
        highlightTimer: 250,
        timerSelection: 2500,
        speedOfSelection: 250,
        turnDelay: 200,
    },
    xurst: {
        name: 'xurst',
        highlightTimer: 50,
        timerSelection: 750,
        speedOfSelection: 100,
        turnDelay: 100,
    },
    gojo: {
        name: 'gojo',
        highlightTimer: 25,
        timerSelection: 250,
        speedOfSelection: 50,
        turnDelay: 5,
    },
};

export default gameModes;

// args:
// highlightTimer = how long the boxes will stay highlighted for when the computer selects them (milliseconds)
// timerSelection = how long the user turn has before the game will automatically end (milliseconds)
// speedOfSelection = how long before the bot selects the next box (milliseconds)
// turnDelay = how long the bot will wait before giving the user the turn (milliseconds)