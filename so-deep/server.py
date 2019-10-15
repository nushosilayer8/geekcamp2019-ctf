import re
import random
import time

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

    result = 'regex: {}\n'.format(regex)
    failed = False

    time_start = time.thread_time()

    for text, match in tests:
        if bool(r.match(text)) != match:
            result += 'failed'
            failed = True
        else:
            result += 'passed'
        result += ': {}\n'.format(text)

    time_end = time.thread_time()
    time_taken = time_end - time_start

    result += '\ntime_taken: {}\n'.format(time_taken)
    if not failed and time_taken < 0.00007:
        result += '\nflag! {}'.format(flag)

    resp = make_response(result)
    resp.headers['Content-Type'] = 'text/plain'
    return resp

tests = (
    ('baaaaad', False),
    ('shee}p', False),
    ('{}{}{}{}', True),
    ('{hello}{world}{this}', True),
    ('{bad}example{of}{content}', False),
    ('{empty}{}{too}', True),
    ('{}{}{}{}{}{}{}{}', True),
    ('{missing}{close', False),
    ('{missing}}{open}', False),
    ('ohno{no}', False),
    ('{lets{get}nested}', True),
    ('{get{nested}even{more{more}}}', True),
    ('{make}{sure{its{balanced}}', False),
    ('{this{is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long string}}', True),
    ('{this{is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long string}', True),
    ('{this is a {very {nested set of {brack{eeeee}ets}}}eeee{eeee}eeee}', True),
    ('{{{{{{}}}}}}', True),
    ('{{{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}}{{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}}}', True),
    ('{{{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}}{{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}{{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}{{{{}{}}{{}{}}}{{{}{}}{{}{}}}}}}', False),
)

