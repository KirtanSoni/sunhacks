import flask

app = flask.Flask(__name__)

@app.route('/')
def index():
    json = {
        'code': "graph TD:A[Start] --> B{Is it working?}; B -- Yes --> C[Great!]; B -- No --> D[Check the script]; D --> B;" }
    return json



# run in development mode with reloader
if __name__ == '__main__':
    app.run(debug=True)





