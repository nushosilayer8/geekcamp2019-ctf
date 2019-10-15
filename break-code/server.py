import re
import random

from flask import Flask, request, make_response

app = Flask(__name__)

source = open('server.py', 'r').read()
flag = open('flag.txt', 'r').read()

@app.route('/', methods=['GET'])
def show_source():
    resp = make_response(source)
    resp.headers['Content-Type'] = 'text/plain'
    return resp

@app.route('/flag', methods=['POST'])
def try_flag():
    regex = request.form['r']
    r = re.compile(regex)
    
    result = 'regex: ' + regex + '\n'
    failed = False

    result += 'basic:\n'
    for text, match in tests:
        if bool(r.match(text)) != match:
            result += 'failed'
            failed = True
        else:
            result += 'passed'
        result += ': ' + text + '\n'
    result += 'advanced:\n'
    for i in range(30):
        text = generate()
        if bool(r.match(text)) != False or bool(r.match(text + 'now')) != True:
            result += 'failed'
            failed = True
        else:
            result += 'passed'
        result += ': ' + text + '\n'

    if not failed:
        result += '\nflag! ' + flag

    resp = make_response(result)
    resp.headers['Content-Type'] = 'text/plain'
    return resp

tests = (
    ('code break', False),
    ('break code', False),
    ('code break now', False),
    ('break code now', True),
    ('now break code', False),
    ('break now code', False),
    ('break code break now', False),
    ('break code code now', True),
    ('break code break code now', True),
    ('break code break code', False),
    ('break code break code break code now', True),
    ('code break code break code break code now', False),
    ('code break code break code break code break now', False),
    ('break code break code break code break code now', True),
    ('break code code code break break break code now', True),
)

def generate(n=10, c=10):
    string = ''
    for i in range(n):
        string += 'break ' * random.randint(1, c)
        string += 'code ' * random.randint(1, c)
    return string
