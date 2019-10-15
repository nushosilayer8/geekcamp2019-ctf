from io import BytesIO
import tokenize
import re

from flask import Flask, request, make_response

app = Flask(__name__)

source = open('equation_to_code.py', 'r').read()

@app.route('/', methods=['GET'])
def show_source():
    resp = make_response(source)
    resp.headers['Content-Type'] = 'text/plain'
    return resp

@app.route('/equation_to_code', methods=['POST'])
def equation_to_code():
    equation = request.form['e']
    status = 200
    try:
        code = parse_equation(equation)
    except Exception as e:
        code = str(e)
        status = 400
    resp = make_response(code, status)
    resp.headers['Content-Type'] = 'text/plain'
    return resp
    
def tokenize_equation(equation):
    tokens = tokenize.tokenize(BytesIO(equation.encode('utf-8')).readline)
    for token in tokens:
        toknum, tokval, _, _, _ = token
        toktype = token.exact_type
        yield toknum, tokval, toktype

def parse_equation(equation):
    tokens = tokenize_equation(equation)
    result = []
    append_close = False
    prev = None
    for toknum, tokval, toktype in tokens:
        if toknum == tokenize.ENCODING:
            # Ignore
            continue
        elif toknum == tokenize.NEWLINE:
            # Ignore
            continue
        elif toknum == tokenize.NAME:
            if previous_is_operand(prev):
                raise Exception('missingoperatior')
            if not re.match('^[a-z]+$', tokval):
                raise Exception('badname')
            result.append(tokval)
        elif toknum == tokenize.NUMBER:
            if previous_is_operand(prev):
                raise Exception('missingoperatior')
            result.append(tokval)
        elif toknum == tokenize.OP:
            if toktype == tokenize.LPAR:
                if previous_is_operand(prev):
                    raise Exception('missingoperatior')
                result.append(tokval)
            elif toktype == tokenize.RPAR:
                result.append(tokval)
            elif toktype == tokenize.PLUS:
                result.append(tokval)
            elif toktype == tokenize.MINUS:
                result.append(tokval)
            elif toktype == tokenize.STAR:
                result.append(tokval)
            elif toktype == tokenize.SLASH:
                result.append(tokval)
            elif toktype == tokenize.CIRCUMFLEX:
                last = result.pop()
                result.append('Math.pow( {},'.format(last))
                append_close = True
                prev = (toknum, tokval)
                continue
            else:
                raise Exception('badtoken ({})'.format(toknum))
        elif toknum == tokenize.ENDMARKER:
            break
        else:
            raise Exception('badtoken ({})'.format(toknum))
        if append_close:
            result.append(')')
            append_close = False
        prev = (toknum, tokval)
    return ' '.join(result)

def previous_is_operand(prev):
    if not prev:
        return False
    if prev[0] != tokenize.NAME and prev[0] != tokenize.NUMBER:
        return False
    return True
