let currentGame;

$('#start-quizz').click(function (event) {
    $.getJSON('data/questions.json', function (data) {
        currentGame = new Game(data);
        currentGame.start();
    })
});

