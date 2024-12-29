const gameModes = {
    sequence: {
        easy: {
            name: 'easy',
            highlightTimer: 2000,
            timerSelection: 20000,
            speedOfSelection: 2000,
            turnDelay: 1200,
            repetitionEnabled: true,
        },
        normal: {
            name: 'normal',
            highlightTimer: 1000,
            timerSelection: 10000,
            speedOfSelection: 1000,
            turnDelay: 600,
            repetitionEnabled: true,
        },
        hard: {
            name: 'hard',
            highlightTimer: 500,
            timerSelection: 5000,
            speedOfSelection: 500,
            turnDelay: 350,
            repetitionEnabled: true,
        },
        impossible: {
            name: 'impossible',
            highlightTimer: 250,
            timerSelection: 2500,
            speedOfSelection: 250,
            turnDelay: 200,
            repetitionEnabled: true,
        },
        xurst: {
            name: 'xurst',
            highlightTimer: 100,
            timerSelection: 750,
            speedOfSelection: 100,
            turnDelay: 100,
            repetitionEnabled: true,
        },
        gojo: {
            name: 'gojo',
            highlightTimer: 25,
            timerSelection: 250,
            speedOfSelection: 50,
            turnDelay: 5,
            repetitionEnabled: false,
        }
    },
    number: {
        easy: {
            name: 'easy',
            highlightTimer: 1000,    // How long each digit is shown
            timerSelection: 20000,   // How long to input answer
            numberLength: 3,         // Number of digits
        },
        normal: {
            name: 'normal',
            highlightTimer: 750,
            timerSelection: 10000,
            numberLength: 5,
        },
        hard: {
            name: 'hard',
            highlightTimer: 500,
            timerSelection: 5000,
            numberLength: 7,
        },
        impossible: {
            name: 'impossible',
            highlightTimer: 250,
            timerSelection: 2500,
            numberLength: 9,
        },
        xurst: {
            name: 'xurst',
            highlightTimer: 100,
            timerSelection: 1000,
            numberLength: 12,
        },
        gojo: {
            name: 'gojo',
            highlightTimer: 50,
            timerSelection: 500,
            numberLength: 15,
        }
    }
};

export default gameModes;

// args for sequence:
// highlightTimer = how long the boxes will stay highlighted for when the computer selects them (milliseconds)
// timerSelection = how long the user turn has before the game will automatically end (milliseconds)
// speedOfSelection = how long before the bot selects the next box (milliseconds)
// turnDelay = how long the bot will wait before giving the user the turn (milliseconds)
// repetitionEnabled = whether box repetition is enabled or not (boolean)

// args for number:
// highlightTimer = how long each digit is shown (milliseconds)
// timerSelection = how long to input answer (milliseconds)
// numberLength = number of digits to remember