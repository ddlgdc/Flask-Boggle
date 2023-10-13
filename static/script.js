$(document).ready(function(){
    let score = 0;
    let timer = 60;
    let gameActive = true;

    function displayScore(){
        $('#score').text('Score: ' + score);
    }

    function displayTimer(){
        $('#timer').text('Time remaining ' + timer + ' seconds');
    }

    function disableGame(){
        $('#guess').prop('disabled', true);
        $('#submit-button').prop('disabled', true);
    }

    displayScore();
    displayTimer();

    const interval = setInterval(function(){
        if(timer > 0){
            timer--;
            displayTimer(); 
        } else {
            gameActive = false;
            disableGame();
            clearInterval(interval);
        }
    }, 1000);

    $('#word-form').submit(function(event){
        event.preventDefault();

        if(!gameActive){
            return;
        }

        const userGuess = $('#guess').val();

        axios.post('/check_word', {guess: userGuess}, {
            headers: {
                'Content-Type':'application/json'
            }
        })
            .then(function(response){
                const result = response.data.result;
                if(result === 'ok'){
                    score += 1;
                    displayScore();
                }
                displayResult(response.data);
            })
            .catch(function(error){
                console.error('Error:', error);
            });
    });

    function displayResult(result){
        const resultMessage = $('#result-message');
        const wordResult = result.result;
        const wordScore = result.score;

        if (wordResult === 'ok') {
            resultMessage.text('Valid word on the board. Score: ' + wordScore);
        } else if (wordResult === 'not-on-board') {
            resultMessage.text('Valid word, but not on the board. Score: ' + wordScore);
        } else if (wordResult === 'not-word') {
            resultMessage.text('Not a valid word. Score: ' + wordScore);
        }
        
    }
});
