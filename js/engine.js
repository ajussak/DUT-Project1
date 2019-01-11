class Game {
    constructor(json) {
        this.data = json;
        this.currentQuestion = -1;
        this.finalPoint = 0;
    }

    start() {
        let content = $('#content');
        content.empty();
        content.append('<div class="row"><h1 class="center">' + this.data['title'] + '</h1><p id="step" class="center"></p><h2 id="question-title" class="center"></h2></div>');
        content.append('<div class="row"><div class="col s10 offset-s1 l6 offset-l3" id="game-content"></div></div>');
        content.append('<div class="row" id="button-row"><p class="center-align"><a id="ok-button" class="waves-effect waves-light btn center">Valider</a></p></div>');
        content.append('<div class="row"><a id="back-home" class="center" href="index.html">Retourner à l\'accueil</a></div>');

        let game = this;

        $('#ok-button').click(function (event) {
            game.buttonClicked(event);
        });
        this.nextQuestion();
    }

    buttonClicked() {
        let gameContent = $('#game-content');

        let button = $('#ok-button');

        if (button.text() === 'Suivant') {
            button.text('Valider');
            this.nextQuestion();
        }
        else {
            let userAnswers = [];
            let correction = this.currentQuestionData['correction'];
            let point = 0;

            let label = $('label');

            label.each(function (index) {
                if ($(this)[0].childNodes[0].checked) {
                    userAnswers.push(index);
                }
            });

            if(userAnswers.length > 0) {
                label.each(function (index) {
                    $(this)[0].childNodes[0].disabled = true;
                    if (!correction.includes(index) && userAnswers.includes(index)) {
                        point--;
                    }
                    else if(correction.includes(index)) {
                        $('span').eq(index).css('color', 'green').css('font-weight', 'bold');
                        point++;
                    }
                });

                if (point === this.currentQuestionData['correction'].length)
                    this.finalPoint++;

                if (this.currentQuestionData.hasOwnProperty('note'))
                    gameContent.append('<a class="note">Note : </a><blockquote>' + this.currentQuestionData['note'] + '</blockquote>');
                button.text('Suivant');
            }
        }
        $('#question-title').scrollTop();
    }

    getAnswers() {
        return this.currentQuestionData['answers'];
    }

    getCorrection() {
        return this.currentQuestionData['correction'];
    }

    displayResult() {
        $('#button-row').remove();

        $('#step').text('');

        let percent =  Math.round(this.finalPoint / this.data['questions'].length * 100);

        $('#question-title').text('Votre note final : ' + percent + '%');
        let content = $('#back-home');

        content.before('<div class="row"><p class="center">Vous avez répondu juste à ' + this.finalPoint + ' questions sur ' + this.data['questions'].length + '.<br/>' + this.getCommentFromPercent(percent) + '</p></div>');

        $('#game-content').remove();
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

            $('#step').text(' Question ' + (this.currentQuestion + 1) + '/' + this.data['questions'].length);
            $('#question-title').text(this.currentQuestionData['title']);

            let form = $('<form id="answers" action="#"></form>');

            let addRadio = function (ans) {
                form.append('<p><label><input name="radioAnswer" type="radio" class="with-gap"><span>' + ans + '</span></label></p>');
            };

            let addCheckbox = function (ans) {
                form.append('<p><label><input type="checkbox" class="filled-in"><span>' + ans + '</span></label></p>')
            };

            this.getAnswers().forEach(this.getCorrection().length > 1 ? addCheckbox : addRadio);

            let questionContent = $('<div class="row"></div>');
            questionContent.append(form);
            gameContent.append(questionContent);
        }
    }

    getCommentFromPercent(percent)
    {
        let min = 0;

        for(let key in this.data['notesComments'])
        {
            if(percent === key)
                return this.data['notesComments'][key];
            else if(percent >= key)
                min = key;
        }

        return this.data['notesComments'][min];
    }

}

class PersonnalityGame extends Game {

    constructor(data) {
        super(data);
        this.userEntry = {};
    }

    getAnswers() {
        return ['D\'accord', 'Plutôt d\'accord', 'Neutre', 'Plutôt pas d\'accord', 'Pas d\'accord'];
    }

    buttonClicked() {

        let selectedIndex = -1;

        $('label').each(function (index) {
            if ($(this)[0].childNodes[0].checked) {
                selectedIndex = index;
            }
        });

        if (selectedIndex !== -1) {
            let answerNumber = this.getAnswers().length;
            let category = this.currentQuestionData['category'];

            if (!this.userEntry.hasOwnProperty(category))
                this.userEntry[category] = [];

            this.userEntry[category].push(1 - (selectedIndex / (answerNumber - 1)));

            this.nextQuestion();
        }
    }

    displayResult() {
        $('#button-row').remove();

        $('#step').text('');

        let gameContent = $('#game-content');
        gameContent.empty();

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        let add = 0;
        for (let property in this.userEntry) {
            let categoryStats = this.userEntry[property];
            add += categoryStats.reduce(reducer) / categoryStats.length;
        }

        let result = $('<div class="row"></div>');

        let percent = Math.round(add / Object.keys(this.userEntry).length * 100);

        $('#question-title').text('Vous correspondez à ' + percent + ' % à la formation');



        let newDiv = $('<div class="row"></div>');

        newDiv.append('<p class="center">' + this.getCommentFromPercent(percent) + '</p>');

        newDiv.append('<h3 class="center">Vos statistiques détaillées</h3>');

        for (let property in this.userEntry) {
            let categoryStats = this.userEntry[property];

            let pc = Math.round(categoryStats.reduce(reducer) / categoryStats.length * 100);

            newDiv.append('<a class="category-name">' + property + ' (' + pc + ' %)</a><div class="progress"><div class="determinate" style="width: ' + pc +'%"></div></div><br />')
        }

        gameContent.append(result);
        gameContent.append(newDiv);
    }

    getCorrection() {
        return [];
    }

}
