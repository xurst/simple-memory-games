# simple memory games

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

some simple memory games u can play :D (they aren't simple)

## features (prob outdated)

- sequence memory game with different modes:
  - easy: for beginners
  - normal: regular mode
  - hard: for experienced players
  - impossible: extremely challenging
  - xurst: xurst
  - gojo: not humanly possible

## game modes (prob outdated)

### sequence memory
- remember and repeat patterns of highlighted boxes
- customizable grid size and timing
- score tracking and personal bests
- adjustable difficulty settings

## tech used (prob outdated)
- javascript
- firebase auth
- express.js server
- modern css animations

## try it out

### url: https://simple-memory-games-d1097398d753.herokuapp.com

## preview (outdated)
![gameplay preview](https://media.discordapp.net/attachments/1204435079741448275/1322809838182600715/image.png?ex=67723a2a&is=6770e8aa&hm=c4eb7bb26cb0a8907e1b79bb1aee62ab90c86987d76cf917662a8229bcb20bcb&=&format=webp&quality=lossless)

## complete setup guide (prob outdated)

### 1. local setup
```bash
# Clone the repository
git clone [your-repo-url]
cd simple-memory-games

# Install dependencies
npm install
```

### 2. firebase setup (required for auth)

#### create firebase project
1. go to [Firebase Console](https://console.firebase.google.com/)
2. click 'Create a project'
3. name your project
4. disable Google Analytics (optional)
5. click 'Create project'

#### add web app to firebase
1. on project overview, click web icon (</>)
2. register app name (e.g., "simple-memory-games")
3. register app
4. copy the firebaseConfig object that looks like this:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### configure app
1. rename `src/js/services/firebase-config.template.js` to `firebase-config.js`
2. replace the placeholder config with your copied config
3. make sure to keep the `authenticationMethods` object:
```javascript
authenticationMethods: {
    popup: true,
    redirect: true
}
```

#### setup authentication
1. in Firebase Console, go to 'Authentication'
2. click 'Get Started'
3. in 'Sign-in method' tab:
  - click 'Google'
  - enable it
  - add a project support email
  - save
4. in 'Settings' > 'Authorized domains':
  - add 'localhost' for local testing
  - add your deployment domain if you have one

### 3. start the app
```bash
# Start the server
npm start

# Open in browser
open http://localhost:3000
```

## current features (prob outdated)
- google authentication
- game logs
- custom game settings
- responsive design
- touch support for mobile

## troubleshooting

#### authentication not working?
- check if firebase-config.js exists and has correct values
- verify Google auth is enabled in Firebase Console
- ensure your domain is authorized in Firebase Console
- check browser console for errors

#### can't start the app?
- make sure Node.js 18.x and NPM 10.x are installed
- verify all dependencies are installed (`npm install`)
- check if port 3000 is available

## license
this project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

more games coming soon.