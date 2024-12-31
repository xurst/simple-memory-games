const gameModes = {
    sequence: {
        easy: {
            name: 'easy',
            highlightTimer: 2000,
            timerSelection: 20000,
            speedOfSelection: 2000,
            turnDelay: 1200,
            repetitionEnabled: true,
            aiDifficulty: 2,
            numberOfBoxes: 2,
            boxesGrid: 1,
            boxesSize: 120
        },
        normal: {
            name: 'normal',
            highlightTimer: 1000,
            timerSelection: 10000,
            speedOfSelection: 1000,
            turnDelay: 600,
            repetitionEnabled: true,
            aiDifficulty: 4,
            numberOfBoxes: 4,
            boxesGrid: 2,
            boxesSize: 100
        },
        hard: {
            name: 'hard',
            highlightTimer: 500,
            timerSelection: 5000,
            speedOfSelection: 500,
            turnDelay: 350,
            repetitionEnabled: true,
            aiDifficulty: 6,
            numberOfBoxes: 6,
            boxesGrid: 3,
            boxesSize: 90
        },
        impossible: {
            name: 'impossible',
            highlightTimer: 250,
            timerSelection: 2500,
            speedOfSelection: 250,
            turnDelay: 200,
            repetitionEnabled: true,
            aiDifficulty: 8,
            numberOfBoxes: 8,
            boxesGrid: 2,
            boxesSize: 80
        },
        xurst: {
            name: 'xurst',
            highlightTimer: 100,
            timerSelection: 750,
            speedOfSelection: 100,
            turnDelay: 100,
            repetitionEnabled: false,
            aiDifficulty: 12,
            numberOfBoxes: 9,
            boxesGrid: 3,
            boxesSize: 70
        },
        gojo: {
            name: 'gojo',
            highlightTimer: 25,
            timerSelection: 250,
            speedOfSelection: 50,
            turnDelay: 5,
            repetitionEnabled: false,
            aiDifficulty: 50,
            numberOfBoxes: 50,
            boxesGrid: 10,
            boxesSize: 20
        }
    },
};

export default gameModes;

// args for sequence:
// highlightTimer = how long the boxes will stay highlighted for when the computer selects them (milliseconds)
// timerSelection = how long the user turn has before the game will automatically end (milliseconds)
// speedOfSelection = how long before the bot selects the next box (milliseconds)
// turnDelay = how long the bot will wait before giving the user the turn (milliseconds)
// repetitionEnabled = whether box repetition is enabled or not (boolean)
// aiDifficulty = whether how predictable the AI patterns will be
// numberOfBoxes = how many number of boxes there are
// boxesGrid = what grid the boxes have
// boxesSize = how big or small are the boxes