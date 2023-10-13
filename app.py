from flask import Flask, render_template, session, request, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dont-give-out'

boggle_game = Boggle()

user_statistics = {
    'times_played': 0, 
    'highest_score': 0
}

@app.route('/')
def home():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('index.html', board=board)

@app.route('/check_word', methods=['POST'])
def check_word():
    user_guess = request.form.get('guess')
    board = session.get('board')
    result = boggle_game.check_valid_word(board, user_guess)
    score = len(user_guess) if result == 'ok' else 0

    user_statistics['times_played'] += 1
    user_statistics['highest_score'] = max(user_statistics['highest_score'], score)

    return jsonify({'result': result, 'score': score})

@app.route('/update_statistics', methods=['POST'])
def update_statistics():
    data = request.json
    score = data.get('score')

    user_statistics['times_played'] += 1
    user_statistics['highest_score'] = max(user_statistics['highest_score'], score)

    return jsonify({'message': 'Statistics updated'})

@app.route('/user_statistics')
def get_user_statistics():
    return jsonify(user_statistics)

# ...

if __name__ == '__main__':
    app.run(port=0)

