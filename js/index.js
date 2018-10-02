let currentGame;

$('#start-quizz').click(function (event) {
    $.getJSON('data/questions.json', function (data) {
        currentGame = new Game(data);
        currentGame.start();
    })
});

$('#start-perso').click(function (event) {
    $.getJSON('data/perso.json', function (data) {
        currentGame = new PersonnalityGame(data);
        currentGame.start();
    })
});

