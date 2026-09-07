/* HuMAI Academy: Hero Command Center (inspired by Avengers Theme)
App Interface Layer (Main Controller)

  This file is the main controller for HuMAI Academy website. It runs like a small game app. 

  This file does not contain all of the the matching game rules, quiz questions, or falling object game rules. 
  Those three games each have their own separate JavaScript files. 
  This file mainly: 

- Changes from one screen to another without having to refresh the browser.
- Detects which buttons, cards, and keyboard keys the user uses.
- Opens the correct game module when the user selects a mission.
- Stops game timers and animations when the user leaves a game.
- Conects buttons in the index.HTML to JavaScript functions.
- Starts HuMi's offline chat feature. 
- Starts HuMi's rotating learning tips.
- Sets up XP, rewards, badges, and level progress.

This Project is designed specifically to run locally in the browser without the use of API keys,
a database, live AI model, or Internet access for gameplay. 

All imported JavaScript files must be in the correct folder in order for application to work:
- humai-academy/ 
    -index.html (loads the following files with app.js)
    - app.js
    - state.js
    - ui.js
    - humi-coach.js
    - humi-tips.js
    - level-progress.js
    - memory-glitch.js (Memory game)
    - thinkquest.js (Quiz activity game)
    - catch-knowledge.js (Catch falling objects with a basket game)

  Import the shard state object from state.js. "state" serves as the website's shared score sheet; 
  stores information that more thant one part of the app needs such as: 
  - XP total
  - Day streak
  - Earned badges
  - Number of games played
  - Which game is currently active
  - Whether sound is turned on */


/* Main Platform - Importing "state" which stores users shared information: XP, streak, badges, total games played, and active game */
import { state } from './state.js';

/* User interface tools that updates the visual parts of HuMAI Academy - Import helper functions from ui.js */
import { 
  updateDashboard, /* Updates visible XP totals, badge count, reward totals, streak numbers and the level progress display */
  renderGameGrid, /* Creates the three larger game cards inside the Game Zone screen using the games list found later in this file */
  hideResult, /* Hides the shared "mission complete" result pop-up */
  showToast, /* Shows a temporary message near the bottom of the browser window */
} from './ui.js'; /* ui.js manages the pieces of the user interface that multiple games use */

/* Imports functions from HuMi's Memory Glitch.js game file - responsible for shuffling cards, matching cards, score, hints, 
move count, streak, timer, XP reward, and the Pattern Pilot badge */
import { 
  startMemoryGlitch, /* Starts a fresh Memory Glitch game round. Shuffles the matching cards, resets the timer, moves, and matches */
  stopMemoryGlitch, /* Stops the Memory Glitch timer when the user leaves the game */
  selectMemoryCard, /* Handles a click on one of the matching cards */
  useMemoryHint /* Runs the hint button in the Memory Glitch game */
} from './memory-glitch.js';

/* Imports functions from the ThinkQuest.js Quiz game file - contains the local quiz questions, answer checking, feedback messages, 
quiz score, and XP reward */
import { 
  startThinkQuest,  /* Starts or restarts the quiz at question one */
  stopThinkQuest, /* Stops the active quiz session when the user leaves the screen */
  answerThinkQuest, /* Checks the answer chosen by the user */
  continueThinkQuest /* Moves from the current question to the next question */
} from './thinkquest.js'; 

/* Imports functions from the Catch Knowledge.js game file - creates falling knowledge/glitch itmes, moves the "catch" basket, 
checks catches, tracks score and time, and awards XP */
import { 
  resetCatchKnowledge, /* Resets the Catch the Knowledge game and shows its start screen */
  stopCatchKnowledge, /* Stops timers, falling objects, and animation loops if the user leaves */
  moveKnowledgeBasket /* Moves the basket left or right; done by using the on-screen arrow buttons and keyboard arrow keys */
} from './catch-knowledge.js';

/* Imports the HuMi Coach chat functions from humi-coach.js - is an offline scripted chat feature that uses pre-loaded responses for demo purposes 
for it's coaching replies, instead of using a live API. Does not send messages to a real AI service */
import { 
  initializeCoach, /* Sets up the offline HuMi chat when the Coach screen is opened, places HuMi's opening message into the chat area */
  sendCoachMessage /* Takes the user's message and responds with one of the pre-loaded locally scripted HuMi responses */
} from './humi-coach.js';

/* Imports HuMi tips functions from humi-tips.js - contains 20 pre-loaded HuMi coaching tips. The user can move through the tips
with Previous, Next, or Random Tip buttons */
import {
  initializeHumiTips, /* Shows the first HuMi learning tip when the website starts */
  showNextHumiTip, /* Shows the next tip in the pre-loaded list */
  showPreviousHumiTip, /* Shows the previous tip in the pre-loaded list */
  showRandomHumiTip /* Chooses and shows a random tip */
} from './humi-tips.js';

/* Imports Level Progress helpers from level-progress.js - updates the Level 2: Pattern Pilot progress bar and controls the visual-only  
 future games preview modal when the user reaches enough XP */
import {
  initializeLevelProgress, /* Builds the Pattern Pilot level progress display when the website loads */
  hideNextGamePreview /* Closes the future games preview modal if it is open */
} from './level-progress.js';
  
/* HTML Lookup Shortcuts: 
$ - creates a shorcut helper, instead of repeatedly writing: document.querySelector('')
Example: $('#missionPlayButton') finds the dashboard Start Mission button */
const $ = (selector) => document.querySelector(selector); /* Finds the first matching item in the HTML element that matches a selector */


/* Game Menu: Creates the list of games used by the automatic Game Zone card builder.
Array is a list of objects that describes one game:
- id: The short internal name id used by JavaScript.
- title: The title that is shown to the user.
- tag: The small label at the top of th card. 
- tagClass: The CSS color class for that label. 
- description: The short messagae on the card.
- xp: The XP shown on the card. 
- artClass: The CSS class that gives the art area its special colors/design.
- art: The small HTML design placed inside the art area. 
The Game Zone screen uses renderGameGrid(games) to read this list and build the cards automatically */
const games = [ /* First game object ThinkQuest, a quiz game module */
  { id: 'thinkquest', /* Unique identifier for the game name */
    title: 'ThinkQuest', /* Game title displayed on the card */
    tag: 'QUIZ QUEST', /* Small label displayed above the title */
    tagClass: 'purple', /* CSS class that gives the tag its purple styling */
    description: 'Test your super-smart thinking skills.', /* Short description displayed under the card title */
    xp: 50, /* Amount of XP points shown on the Game Zone card for completing the game; only controls the number displayed on the card. The actual XP award logic is in thinkquest.js */
    artClass: 'thinkquest-card', /* CSS class that gives the ThinkQuest card art its special design */
    art: '<span class="art-star">✦</span><span class="brain">🧠</span><span class="question-orb">?</span>', /* Small piece of HTML stored as text that creates: a brain emoji, ? mark circle, and a glowing star (spark) art on ThinkQuest game card */
  },
  /* Second game object: HuMi's Memory Glitch; a matching card game */
  { id: 'memory', /* Unique identifier for the game name */
    title: 'HuMi’s Memory Glitch', /* Game title displayed on the card */
    tag: 'MATCH GAME', /* Small label displayed above the title */
    tagClass: 'blue', /* CSS class that gives the tag its blue styling */
    description: 'Reconnect HuMi’s scrambled memories.', /* Short description displayed under the card title */
    xp: 50, /* Amount of  XP points shown on the Game Zone card for completing the game; only controls the number displayed on the card. The actual XP award logic is in memory-glitch.js */
    artClass: 'memory-preview-card', /* CSS class that gives the Memory Glitch card art its special design and keeps it separate from the actual flip-card game style  */
    art: '<div class="mini-cards"><span>⚡</span><span>🤖</span><span>🧠</span><span>🔵</span></div><span class="art-star">✦</span>', /* Small piece of HTML stored as text that creates: 2x2 group of mini cards: lightning bolt, robot, brain, and blue circle emoji's on the Memory Glitch game card  */
  },
  /* Third game object: Catch the Knowledge, a falling objects basket catch game */
  { id: 'catch', /* Unique identifier for the game name */
    title: 'Catch the Knowledge', /* Game title displayed on the card */
    tag: 'ARCADE', /* Small label displayed above the title */
    tagClass: 'orange', /* CSS class that gives the tag its orange styling */
    description: 'Catch the facts. Dodge the glitches.', /* Short description displayed under the card */
    xp: 35, /*  Amount of  XP points shown on the Game Zone card for completing the game; only controls the number displayed on the card. The actual XP award logic is in catch-knowledge.js */
    artClass: 'catch-card', /* CSS class that gives the Catch the Knowledge card art its special design */
    art: '<span class="basket">🧺</span><span class="falling-item item-one">💡</span><span class="falling-item item-two">✓</span><span class="falling-item item-three">⭐</span>', /* Small piece of HTML stored as text that creates: a basket, light bulb, checkmark and star emoji's on the Catch the Knowledge game card */
  },
];

/* Stops all active game modules before the user moves to a different screen */
function stopAllGames() {
  stopMemoryGlitch(); /* Stops the Memory Glitch countdown timer and game activity from continously running after the user exits the game module */
  stopThinkQuest(); /* Stops the ThinkQuest quiz session from continuing the session when another game opens, marks the session as inactive */
  stopCatchKnowledge();  /* Stops the falling objects in the Catch the Knowledge game from continously spawning invisibly */
}                              

/* One page navigation routing: 
routeTo() makes the page act like an actual one page app instead of opening separate webpages and having to refresh. Moves the user to a different screen without 
loading another webpage. It hides all screens stored inside index.htmal at the same time. 
Examples: 
- routeTo('dashboard') shows #dashboard-screen
- routeTo('games') shows #games-screen
- routeTo('memory') shows #memory-screen
- routeTo ('thinkquest') shows #thinkquest-screen
- routeTo('catch') shows #catch-screen */
function routeTo(route) {
  stopAllGames();  /* Stops old timers and game animations that may still be running before changing screens */ 

  /* Converts the route name into the ID of the matching HTML section */
  const requestedScreenId = route === 'dashboard' ? 'dashboard-screen' : `${route}-screen`; 

  /* Finds the screen that should appear. Having many issues with the screens not popping up, doing this before hiding anything to 
  show a helpful warning in the browser Console and falls back to the Dashboard. If the ID is wrong, it won't accidentally hide the whole website */
  let selectedScreen = document.getElementById(requestedScreenId);

  /* Displays the requested screen. If the screen or ID is missing from index.html, shows a helpful warning message in the browser Console and falls back to the Dashboard */
  if (!selectedScreen) { 
    console.warn(`HuMAI route could not find #${requestedScreenId}. Returning to dashboard instead.`); /* Message that helps find any misspelled ID's */
    /* Finds the one HTML element that has the dashboard screen id, which I'm using as my fallback fi a requested screen cannot be found */
    selectedScreen = document.getElementById('dashboard-screen');
  } 
  /* If the dashboard is missing, something major is wrong with index.html; logs a clear error and stops the function */
  if (!selectedScreen) {
    console.error('HuMAI cannot find any screen. Check that index.html has id="dashboard-screen".');
    return;
} /* Finds every screen using .screen class, removes active from all of them, hiding the old page */
  document.querySelectorAll('.screen').forEach((screen) => {screen.classList.remove('active');
  });

  /* Adds the active class only to the requested screen. CSS makes this screen visible */
  selectedScreen.classList.add('active');

  /* Finds every section that has class="screen" because these are website pages that can be shown or hidden; had previous issues with this not working the way I intended it to */
  const allScreens = document.querySelectorAll('.screen');

  /* Loops through everry screen one at a time to avoid confusion between variable names inside callback */
  for (let i = 0; i < allScreens.length; i +=1) { /* i starts at 0, loop continues while i is less than the number of screens, and adds one to i after each loop */
    allScreens[i].classList.remove('active'); /* Removes the active class from every screen. CSS hides inacitve screens */
  }

  /* Adds temporary message to the browser Console during testing. Confirms that JavaScript is recieving clicks and shows which screen it is trying to display */
  console.log('HuMAI route opened: ', selectedScreen.id);
 
  /* Finds every navigation button that has both nav link class and data route value */
  const navButtons = document.querySelectorAll('.nav-link[data-route]');

  /* Loops through each navigation button to avoid confusion between variable names inside callback */
  for (let i = 0; i < navButtons.length; i +=1) {
    navButtons[i].classList.toggle('active', navButtons[i].dataset.route === route); /* Adds active to the button if its data-route matches the route currently being opened. Removes active from all other navigation buttons */
  }                                                                                  /* And creates the highlighted active navigation tab */

  /* Finds the mobile navigation menu */
  const mobileNav = document.getElementById('mobileNav');

  /* If the mobile menu exists, remove the open class. This closes the mobile menu after a user selects a page */
  if (mobileNav) {
    mobileNav.classList.remove('open');
  }
  
  /* If the user opens the Coach screen, it starts the offline chat */
  if (route === 'coach') { initializeCoach();
  }
   /* If the user opened the Game Zone screen, it builds or refreshes the Game Zone cards using the games array */
  if (route === 'games') { renderGameGrid(games); /* renderGameGrid(games) sends the complete games list to ui.js, which creates the card HTML inside #gamesGrid */
  } 

  /* Scrolls the selected screen into view */
  selectedScreen.scrollIntoView({ behavior: 'smooth', block: 'start',
  });
}

/* Game Launcher - function that launches the selected game module on the current page. User remains in the same tab, 
app hides the old module, opens the correct game screen, and then starts or resets the game's game logic*/
function launchGame(gameName) {
  state.activeGame = gameName; /* Saves the shared state information of the current game */
  routeTo(gameName); /* Starts the correct game after its screen is visible */
  /* Writes a helpful message in the browser Console during testing */
  console.log('Launching game:', gameName);
  /* Shows the selected game screen first */
 
  if (gameName === 'memory') { /* If the game name is "memory", start Memory Glitch. HuMi's Memory Glitch: Shows the matching game screen, then starts a new shuffled card round */
    setTimeout(() => { /* waits a very short amount of time before running code */
      startMemoryGlitch(); /* Starts a fresh shuffled round of the Memory Glitch matching game immediately */
    }, 50); /* Waits a short delay of 50ms to give the browser time to make the Memory Glitch */
    return; /* Stops here so the code does not continue checking the other games */
  }
  if (gameName === 'thinkquest') { /* If the game name is "thinkquest", start ThinkQuest Quiz */
    startThinkQuest(); /* Immediately loads Question 1 from its local question bank and resets ThinkQuest quiz */
    return; /* Stops here so the code does not check the Catch game condition */
  }
  if (gameName === 'catch') { /* If the game namev is "catch", reset Catch the Knowledge game. Resets to its initial state, clearing any previous scores or progress, lauches immediately
  without a delay, and shows an instruction overlay. Each 30-second game begins only after the user presses its Start Game button */
    resetCatchKnowledge(); /* Resets score, timer, basket location, and start game overlay */
    return; /* Stops here because the correct game has been handled */
  }
}
  /* Message notification only appears if a misspelled game ID is passed into the function */
  showToast('Mission module not found. Please choose a listed game.');


/* Function that sets up all event listeners for the website such as buttons & game card clicks, submitting the chat form and keys the user presses. Runs once when the webpage first loads */
function setupEvents() {
  /* Instead of putting a separate event listener on every game card or answer, I'm using this one listener to watch all clicks and checks of what was clicked. 
  Also works for Game Zone cards created later by renderGameGrid(). Memory cards are made by memory-glitch.js. ThinkQuest answers are made by thinkquest.js */
  document.addEventListener('click', (event) => { 
    const routeButton = event.target.closest('[data-route]'); /* Checks whether the used clicked a navigation button or something inside of it, an element that uses data-route like "dashboard", "games", "rewards", or "coach" */
    if (routeButton) { routeTo(routeButton.dataset.route); /* If a route button was found, open to the matching screen */
    return; /* Stops here so one click cannot also accidentally trigger another action */
  } 
    
    /* Checks whether the user clicked a game button or part of a game card */
    const gameButton = event.target.closest('[data-game]'); 
    if (gameButton) {launchGame(gameButton.dataset.game); /* If a game button was found, launch that game */
    return;  /* Exits the game */
  }

    /* Checks whether the user clicked on a Memory Glitch matching tile */
    const memoryCard = event.target.closest('[data-memory-card]');
    if (memoryCard) { selectMemoryCard(memoryCard.dataset.memoryCard); /* If a Memory Glitch tile was clicked, send its card number to the Memory Glitch game module */
    return; /* Stops here so the click cdoesn't trigger another part of the listener */
  } 

    /* Checks whether the user clicked a ThinkQuest answer button */
    const quizAnswer = event.target.closest('[data-thinkquest-answer]');
    if (quizAnswer) { answerThinkQuest(quizAnswer.dataset.thinkquestAnswer);} /* If the answer button was clicked, send the answer number to the ThinkQuest game module */
  });

  /* Mobile Menu - button opens or closes the mobile navigation menu */
  $('#mobileMenuButton')?.addEventListener('click', () => { $('#mobileNav')?.classList.toggle('open');
  });

  /* Dashboard Mission Button - when clicked it starts HuMi's Memory Glitch game; launches Today's Mission button */
  $('#startMissionButton')?.addEventListener('click', () => { launchGame('memory');
  });
  /* Dashboard Mission Button - when clicked it also starts HuMi's Memory Glitch game; launches Start Mission button in the priority mission card */
  $('#missionPlayButton')?.addEventListener('click', () => { launchGame('memory');
  });
  /* Memory Glitch control restart button - when clicked it starts a completely fresh matching game round */
  $('#restartMemory')?.addEventListener('click', () => { startMemoryGlitch();
  });
  /* Memory Glitch control hint button - when clicked, uses the matching game hint behavior */
  $('#hintButton')?.addEventListener('click', () => { useMemoryHint();
  });

  /* ThinkQuest Control next button - when clicked, moves from current quiz question to the next question */
  $('#nextQuestionButton')?.addEventListener('click', () => { continueThinkQuest();
  });

  /* Catch the Knowledge on-screen control left-arrow button - -1 moves the basket left */
  $('#moveLeft')?.addEventListener('click', () => { moveKnowledgeBasket(-1);
  });
  /* Catch the Knowledge on-screen control rihght-arrow button - 1 moves the basket right */
  $('#moveRight')?.addEventListener('click', () => { moveKnowledgeBasket(1);
  });

  /* HuMi's Tip Module Controls Previous HuMi tip button - shows the previous tip in the list of pre-loaded coaching scripts */
  $('#previousTipButton')?.addEventListener('click', () => { showPreviousHumiTip(); 
  });
    /* HuMi's Tip Module Controls Random HuMi tip button - chooses a random tip from the pre-loaded list */
  $('#randomTipButton')?.addEventListener('click', () => { showRandomHumiTip(); 
  });
  /* HuMi's Tip Module Controls Next HuMi tip button - shows the next tip in the list */
  $('#nextTipButton')?.addEventListener('click', () => { showNextHumiTip(); 
  });

  /* Sound Button - Changes the speaker icon, shows a toast message, and saves the true/false setting in the state object. 
  Connects background music / doesn't play actual background music or sound effects yet, for later use */
  $('#soundButton')?.addEventListener('click', () => { 
    state.soundOn = !state.soundOn; /* Changes sound)n to the opposite of whatever current state it is */
    const soundButton = $('#soundButton'); /* Finds the sound button again to change its emoji */
    if (soundButton) /* Only changes the icon if the button exits */
      { soundButton.textContent = state.soundOn ? '🔊' : '🔇'; /* Uses a speaker with sound waves when sound is on, uses a muted speaker when sound is off */
    }
    /* Shows a short message confirming the current sound setting */
    showToast(state.soundOn ? 'Hero Command sounds turned on.' : 'Hero Command  sounds turned off.');
  });

  /* Profile Button - visual placeholder */
  $('#profileButton')?.addEventListener('click', () => { showToast('👋 Explorer profile settings are coming soon!'); /* Clicking it shows a message but does not open a real profile page yet */
});

  /* HuMi Coach Chat form - user can type an offline question, click the send button, and press enter while the text box is active and 
  HuMi Coach returns a prepared respsone from humi-coach.js */
  $('#chatForm')?.addEventListener('submit', (event) => {
    event.preventDefault(); /* Stops the browser's normal form behavior to prevent the browswer from reloading the page when the form is sent */
    sendCoachMessage($('#chatInput').value || ''); /* Reads the text the user typed into chat input. If there is no text, sends an empty string instead of causing an error */
  });

  /* HuMi Coach quick reply button sends users its visibile text into the HuMi Coach chat */
  $('#quickReplies')?.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') { sendCoachMessage(event.target.textContent);} /* Only responds if the clicked item is actually a button, sends visibile words on that button as the users message */
  });

  /* Shared Results Modal - every game uses the same results popup. These buttons either close it, return to 
  Hero Training Zone games, or restarts the game that was just completed. */
  $('#modalClose')?.addEventListener('click', () => { hideResult(); /* Results modal close button. Hides the shared mission complete popup */
  });
  $('#modalHome')?.addEventListener('click', () => { hideResult(); routeTo('games'); /* Results modal "Game Zone" button. First closes the results popup, then goes to the Game Zone screen */
  });
  $('#playAgain')?.addEventListener('click', () => { hideResult(); launchGame(state.activeGame || 'memory'); /* Results modal "Play again" button. First hides the popup, then restarts the game stored in the active state */
  });                                                                                                        /* But if there is no saved active game, start Memory Glitch game as a safe fallback */
  /* Clicking the dark area outside the results card closes the results popup */
  $('#resultModal')?.addEventListener('click', (event) => { if (event.target.id === 'resultModal') hideResult(); 
  });

  /* Future Game Preview Modal - Pattern Pilot progress module can show this visual-only modal just for demo purposes.
  If the user clicks the dark area outside the modal content, it closes the preview */
  $('#nextGamesModal')?.addEventListener('click', (event) => { 
    if (event.target.id === 'nextGamesModal') { 
      hideNextGamePreview();}
  });

  /* Keyboard Controls for Catch The Knowledge Game - left and right arrow keys move the basket only when 
  the user is viewing the Catch The Knowledge screen */
  document.addEventListener('keydown', (event) => { /* Listens for any key press on the page */
    const catchScreenIsVisible = $('#catch-screen')?.classList.contains('active'); /* Checks whether the Catch the Knowledge screen is currently visible */
    if (!catchScreenIsVisible)  return; /* If Catch the Knowledge screen is not visible, stop here */
    if (event.key === 'ArrowLeft') { /* If the user pressed the left arrow key */
      event.preventDefault(); /* Prevents the page from scrolling sideways */
      moveKnowledgeBasket(-1); } /* Move the basket left */
    if (event.key === 'ArrowRight') { /* If the user pressed the right arrow key */
      event.preventDefault(); /* Prevents the page from scrolling sideways */
      moveKnowledgeBasket(1); } /* Move the basket right */
  });
}

/* Starts the HuMAI Academy Application with these startup functions that run once the module loads */
renderGameGrid(games); /* Builds the large Game Zone cards */
updateDashboard(); /* Fills header/dashboard with saved XP, badge, and rewards info */
initializeHumiTips(); /* Shows HuMi's Tip 1 out of 20 */
initializeLevelProgress(); /* Fills the Level 2: Pattern Pilot progress bar */
setupEvents(); /* Attaches all user clicks, forms and keyboard event listeners */


