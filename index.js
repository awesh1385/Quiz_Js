const _question = document.getElementById("question");
const _options = document.querySelector(".quiz-options");
const _correctScore = document.getElementById("correct-score");
const _totalQuestion = document.getElementById("total-question");
let correctAnswer = "";
let correctScore = (askedCount = 0);
let totalQuestion = 10;
const _checkBtn = document.getElementById("check-answer");
const _playAgainBtn = document.getElementById("play-again");
const _result = document.getElementById("result");

//event listner
function eventListner() {
  _checkBtn.addEventListener("click", checkAnswer);
  _playAgainBtn.addEventListener('click',restartQuiz);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  eventListner();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  const APIUrl = "https://opentdb.com/api.php?amount=10";
  const resopnse = await fetch(APIUrl);

  const data = await resopnse.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
}

//display question and Option
function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;

  let incorrectAnswer = data.incorrect_answers;
  let optionList = incorrectAnswer;
  optionList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  ); //inserting correct answer in random position in the option list
  _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  _options.innerHTML = `${optionList
    .map(
      (option, index) => `<li>
      ${index + 1}. <span> ${option} </span>
    </li>
  `
    )
    .join("")}`;
  selectOption();
}

//option selection
function selectOption() {
  _options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (_options.querySelector(".selected")) {
        const activeOption = _options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}
console.log(HTMLDecode(correctAnswer));
//answer checking
function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p class="correct"><i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      _result.innerHTML = `<p class="incorrect"><i class = "fas fa-times"></i>Incorrect Answer!</p> <p><small><b>Correct Answer:</b>
      ${correctAnswer}</small></p>`;
    }
    checkCount();
  }else{
    _result.innerHTML=`<p><i class="fas fa-question"></i>Please select an option!</p>`;
    _checkBtn.disabled=false;
  }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount === totalQuestion) {
    _result.innerHTML += `<p>Your Score is ${correctScore}.</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 300);
  }
}
function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function restartQuiz(){
    correctScore=askedCount=0;
    _playAgainBtn.style.display="none";
    _checkBtn.style.display="block";
    _checkBtn.disabled=false;
    setCount();
}