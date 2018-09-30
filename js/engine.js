class Game {
    constructor(json) {
        this.data = json;
        this.currentQuestion = -1;
        this.finalPoint = 0;
    }

    start() {
        let content = $('#content');
        content.empty();
        content.append('<div class="row"><h1 class="center">' + this.data['title'] + '</h1></div>');
        content.append('<div class="row"><div class="col s12 l6 offset-l3" id="game-content"></div></div>');
        content.append('<div class="row" id="button-row"><p class="center-align"><a id="ok-button" class="waves-effect waves-light btn center">Valider</a></p></div>');

        let game = this;

        $('#ok-button').click(function (event) {
            game.buttonClicked(event);
        });
        this.nextQuestion();
    }

    buttonClicked() {

        let gameContent = $('#game-content');

        if (gameContent.children('blockquote').length > 0) {
            this.nextQuestion();
        }
        else {
            let userAnswers = [];
            let correction = this.currentQuestionData['correction'];
            let point = 0;

            $('label').each(function (index) {

                $(this)[0].childNodes[0].disabled = true;

                if ($(this)[0].childNodes[0].checked) {
                    userAnswers.push(index);
                    if (!correction.includes(index)) {
                        $($(this)[0].childNodes[1]).css('text-decoration', 'line-through').css('color', 'red');
                        point--;
                    }
                    else
                        point++;
                }

                if (correction.includes(index))
                    $($(this)[0].childNodes[1]).css('color', 'green').css('font-weight', 'bold');
            });

            if (point === this.currentQuestionData['correction'].length)
                this.finalPoint++;

            gameContent.append('<h6>Note : </h6><blockquote>' + this.currentQuestionData['note'] + '</blockquote>');


        }
    }

    getAnswers() {
        return this.currentQuestionData['answers'];
    }

    displayResult() {
        $('#button-row').remove();

        let gameContent = $('#game-content');
        gameContent.empty();

        gameContent.append('<div class="row"><h3 class="center">Votre note final : ' + Math.round(this.finalPoint / this.data['questions'].length * 100) + '%</h3></div>');
    }

    nextQuestion() {
        this.currentQuestion++;

        if (this.currentQuestion >= this.data['questions'].length) {
            this.displayResult();
        }
        else {
            this.currentQuestionData = this.data['questions'][this.currentQuestion];

            let gameContent = $('#game-content');
            gameContent.empty();
            gameContent.append('<h4>' + this.currentQuestionData['title'] + '</h4>');

            let form = $('<form action="#"></form>');

            let addRadio = function (ans) {
                form.append('<p><label><input name="radioAnswer" type="radio" class="with-gap"><span>' + ans + '</span></label></p>');
            };

            let addCheckbox = function (ans) {
                form.append('<p><label><input type="checkbox" class="filled-in"><span>' + ans + '</span></label></p>')
            };

            this.getAnswers().forEach(this.currentQuestionData['correction'].length > 1 ? addCheckbox : addRadio);

            let questionContent = $('<div class="row"></div>');
            questionContent.append(form);
            gameContent.append(questionContent);
        }
    }
}