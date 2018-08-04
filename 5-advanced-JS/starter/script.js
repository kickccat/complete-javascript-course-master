// Function constructor
(function () {
    function Question(question, answers, correct) {
        this.question = question;
        this.answers = answers;
        this.correct = correct;
    }

    Question.prototype.displayQuestion = function () {
        console.log(this.question);
        for (let i = 0; i < this.answers.length; i++) {
            console.log(i + ': ' + this.answers[i]);
        }
    };

    Question.prototype.checkAnswer = function (ans, callback) {
        let sc;
        if (ans === this.correct) {
            console.log('Correct answer');
            sc = callback(true);
        } else {
            console.log('Wrong answer. Try again.');
            sc = callback(false);
        }
        this.displayScore(sc);
    };

    Question.prototype.displayScore = function (score) {
        console.log('Your current score is: ' + score);
        console.log('--------------------------------');
    };

    let q1 = new Question('Is JavaScript the coolest programming language in the world?', ['Yes', 'No'], 1);

    let q2 = new Question('What\'s the name of the laptop?', ['fuzzy', 'buffer', 'jagge', 'puppy'], 3);

    let q3 = new Question('What does best describe coding', ['Boring', 'Hard', 'Fun', 'Tedious'], 2);

    let questions = [q1, q2, q3];

    function score() {
        let sc = 0;
        return function (correct) {
            if (correct) {
                sc++;
            }
            return sc;
        }
    }

    let keepScore = score();

    function nextQuestion() {

        let x = Math.floor(Math.random() * questions.length);

        questions[x].displayQuestion();

        let answer = prompt('Please select the correct answer.');

        if (answer !== 'exit') {
            questions[x].checkAnswer(parseInt(answer), keepScore);
            nextQuestion();
        }
    }

    nextQuestion();
})();
