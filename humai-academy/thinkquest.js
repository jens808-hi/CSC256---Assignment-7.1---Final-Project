/* HuMAI Academy: Hero Command
   Offline Quiz Game Module - thinkquest.js 
 
  This file runs the ThinkQuest quiz game without an API.

  All five questions, answer choices, feedback, scoring, XP, and final results
  are already stored in this file.

  All JavaScript files are stored in the same folder */

/* Imports the function that adds XP to the user's progress */
import { addXp } from './state.js';
/* Imports functions that update the dashboard and show the results screen */
import { updateDashboard, showResult } from './ui.js';
/* $ is a shortcut for finding one HTML element on the page */
const $ = (selector) => document.querySelector(selector);
/* $$ is a shortcut for finding multiple HTML elements on the page */
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* Stores all five quiz questions in an array. Each question has choices, 
the correct answer number, and an explanation*/
/* The answer numbers start at zero: 0 = first choice, 1 = second, etc */
const questions = [
  {
    /* Question 1 teaches users how to check if AI information is trustworthy */
    question: 'Which clue can help you check whether an AI answer is trustworthy?',
     /* Gives the user four possible answers */
    choices: ['It uses lots of emojis', 'It explains where the information came from', 'It is the longest answer', 'It appears first on a screen'],
    /* The second answer is correct because its array position is 1 */
    answer: 1,
     /* Shows this explanation after the user answers */
    explanation: 'Power boost! Good answers can be checked against reliable sources.'
  },
  {
    /* Question 2 teaches users about online safety */
    question: 'What is a smart thing to do before sharing a picture online?',
    /* Gives the user four possible answers*/
    choices: ['Share it right away', 'Ask a trusted adult if it is safe to share', 'Add your home address', 'Send it to every stranger'],
    /* The second answer is correct */
    answer: 1,
    /* Shows this message after the user answers */
    explanation: 'That is great digital safety thinking. A trusted adult can help you decide what is safe.'
  },
  {
    /* Question 3 teaches users that AI can make mistakes */
    question: 'AI can be helpful, but what can it sometimes do?',
    /* Gives the user four possible answers */
    choices: ['Make mistakes', 'Know every secret', 'Read minds', 'Never need checking'],
    /* The first answer is correct because its array position is 0 */
    answer: 0,
    /* Explains why checking AI information is important */
    explanation: 'Correct! AI can make mistakes, so smart learners check important information.'
  },
  {
    /* Question 4 teaches users how to write a clear AI prompt */
    question: 'Which question gives an AI the clearest instruction?',
    /* Gives the user four possible answers */
    choices: ['Help', 'Tell me stuff', 'Explain how plants use sunlight in three simple sentences', 'Do the thing'],
    /* The third answer is correct because its array position is 2 */
    answer: 2,
   /* Explains why specific questions usually produce clearer answers */
    explanation: 'Exactly! Clear questions help you get clearer answers.'
  },
  {
    /* Question 5 teaches users to check surprising information online */
    question: 'You see a surprising fact online. What should you do first?',
    /* Gives the user four possible answers */
    choices: ['Believe it immediately', 'Check a reliable source or ask a trusted adult', 'Share it without reading', 'Delete every website'],
    /* The second answer is correct */
    answer: 1,
     /* Explains why checking sources is an important thinking skill */
    explanation: 'Data detective move! Checking reliable sources helps you learn what is true.'
  }
];

/* Stores the current ThinkQuest game information */
let game = null;

/* Starts a new quiz and displays the first question */
export function startThinkQuest() {
  game = { /* Creates the starting information for the new quiz */
    index: 0, /* Starts on the first question */
    score: 0, /* Starts the quiz score at zero points */
    answered: false  /* The user has not answered the first question yet */
  };

  /* Displays the first question and its answer choices */
  renderQuestion();
}

/* Stops the quiz and removes the current game session from memory. */
export function stopThinkQuest() {
  game = null; /* Clears the current quiz information. */
}

/*  renderQuestion displays one question and its four answer choices */
function renderQuestion() {
  if (!game) return; /* Stops if there is no active quiz game */

   /* Gets the question that matches the current question number */
  const currentQuestion = questions[game.index];
  /* Finds the HTML element where the question will appear */
  const questionElement = $('#quizQuestion');
  /* Finds the HTML element that shows the question number */
  const countElement = $('#questionCount');
  /* Finds the HTML element that displays the score */
  const scoreElement = $('#quizScore');
  /* Finds the HTML element where answer feedback will appear */
  const feedbackElement = $('#quizFeedback');
  /* Finda the button used to move to the next question */
  const nextButton = $('#nextQuestionButton');
  /* Finda the area where the answer choices will be created */
  const answersArea = $('#answerList');
  /* Checks that all required quiz elements exist in the HTML */
  if (!questionElement || !countElement || !scoreElement || !feedbackElement || !nextButton || !answersArea) {
    /* Showa a warning in the browser console if something is missing */
    console.warn('ThinkQuest HTML elements are missing. Check IDs in index.html.');
    /* Stops the function because the quiz cannot display correctly */
    return;
  }

  /* Marks the current question as unanswered */
  game.answered = false;
  /* Puts the current question text onto the page */
  questionElement.textContent = currentQuestion.question;
  /* Shows the current question number and total number of questions.\ */
  countElement.textContent = `${game.index + 1} / ${questions.length}`;
   /* Shows the user's current score */
  scoreElement.textContent = game.score;
  /* Reseta the feedback area back to its normal appearance */
  feedbackElement.className = 'quiz-feedback';
  /* Removes any feedback from the previous question */
  feedbackElement.textContent = '';
  /* Hides the Next Question button until the user answers */
  nextButton.classList.add('hidden');

  /* Creates one button for every answer choice
  - map() creates the buttons and join('') combines them into one HTML string 
  - Creates a button for this answer choice 
  - Shows A, B, C, or D beside the answer
  - Shows the actual answer text
  - Closes the answer button */
  answersArea.innerHTML = currentQuestion.choices.map((choice, index) => `
    <button class="answer-button" data-thinkquest-answer="${index}" type="button">
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span>${choice}</span>
    </button>
  `).join('');
}

/* answerThinkQuest checks the user's answer, changes the score, and displays feedback */
export function answerThinkQuest(selectedIndex) {
  /* Stops if there is no active game or the question was already answered */
  if (!game || game.answered) return;
  /* Gets the question the user is currently answering */
  const currentQuestion = questions[game.index];
  /* Finds all four answer buttons on the page */
  const answerButtons = $$('.answer-button');
   /* Converts the selected answer into a number. */
  const chosenAnswer = Number(selectedIndex);

  /* Stops if there are no answer buttons or the selected answer is not a number */
  if (!answerButtons.length || Number.isNaN(chosenAnswer)) return;

  /* Marks the question as answered so another answer cannot be selected */
  game.answered = true;

  /* Locks every answer button after the user makes a choice */
  answerButtons.forEach((button) => {
     /* Disables the button so it cannot be clicked again */
    button.disabled = true;
  });

  /* Checks whether the user selected the correct answer */
  const isCorrect = chosenAnswer === currentQuestion.answer;

  /*Reveals the correct answer in green */
  answerButtons[currentQuestion.answer]?.classList.add('correct');

  /* If the user was wrong, marks their selected answer as wrong in red */
  if (!isCorrect) {
    /* Adds the wrong CSS class to the selected answer */
    answerButtons[chosenAnswer]?.classList.add('wrong');
  }

  /* Gives the user 100 points for a correct answer */
  if (isCorrect) {
     /* Adds 100 points to the current ThinkQuest score */
    game.score += 100;
  }

  /* Finds the score display on the page */
  const scoreElement = $('#quizScore');
  /* Finds the feedback area on the page */
  const feedbackElement = $('#quizFeedback');
   /* Finds the button that moves to the next question */
  const nextButton = $('#nextQuestionButton');
  /* Updates the visible score after the user answers */
  if (scoreElement) scoreElement.textContent = game.score;
  /* Shows either positive or helpful feedback based on the answer */
  if (feedbackElement) {
    /* Adds the correct or wrong CSS class to the feedback area */
    feedbackElement.classList.add(isCorrect ? 'correct' : 'wrong');
     /* Displays the matching emoji and explanation */
    feedbackElement.textContent = `${isCorrect ? '✅ ' : '💡 '}${currentQuestion.explanation}`;
  }
  /* Shows the button for continuing to the next question */
  if (nextButton) {
    /* Makes the Next Question button visible */
    nextButton.classList.remove('hidden');
      /* Changes the button text to Finish Mission on the last question.
      Otherwise, tell the user to move to the next question */
    nextButton.textContent = game.index === questions.length - 1
      ? 'Finish mission →'
      : 'Next question →';
  }
}

/* continueThinkQuest moves to the next question or finishes the quiz */
export function continueThinkQuest() {
  /* Does nothing if the current question has not been answered yet */
  if (!game?.answered) return;

  /* Checks whether there are still more questions left */
  if (game.index < questions.length - 1) {
    /* Moves to the next question in the array */
    game.index += 1;
    /* Displays the next question */
    renderQuestion();
    /* Stops here so the game does not finish early */
    return;
  }

   /* The user has finished all five questions, calculates how many answers were correct */
  const correctAnswers = game.score / 100;
  /* Gives 20 starting XP plus 4 extra XP for every correct answer */
  const earnedXp = 20 + (correctAnswers * 4);
  /* Adds the earned XP to the users overall progress */
  addXp(earnedXp);
  /* Refresh the dashboard so the new XP and game count appear. */
  updateDashboard();
  /* Show the final ThinkQuest results screen. */
  showResult({
    /* Shows a brain for four or more correct answers, otherwise show a star */
    emoji: correctAnswers >= 4 ? '🧠' : '🌟',
    /* Displays the small heading above the results title */
    eyebrow: 'QUEST COMPLETE!',
    /* Displays the main results title */
    title: 'Your thinking power grew!',
    /* Tells the user how many questions they answered correctly */
    text: `You answered ${correctAnswers} of ${questions.length} questions correctly. Keep checking clues and asking great questions!`,
    /* Shows the amount of XP earned from the quiz */
    xp: earnedXp,

    /* Gives a special message for a perfect score. Otherwise, give the learner an encouraging message */
    badge: correctAnswers === 5
      ? '🌟 Perfect ThinkQuest run!'
      : '🤖 HuMi loved your curious thinking!',
      /* Tells the results screen which game should be replayed */
      replay: 'thinkquest',

    /* Shows the final score and number of correct answers */
    stats: [
      { label: 'CORRECT', value: `${correctAnswers}/5` },
      { label: 'SCORE', value: game.score }
    ]
  });
}
