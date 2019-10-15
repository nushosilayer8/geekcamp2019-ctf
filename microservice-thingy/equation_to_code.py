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
    """
    Parse a string as Python tokens
    """
    tokens = tokenize.tokenize(BytesIO(equation.encode('utf-8')).readline)
    for token in tokens:
        toknum, tokval, _, _, _ = token
        toktype = token.exact_type
        yield toknum, tokval, toktype

def parse_equation(equation):
    """
    Read an equation and turn it into JavaScript code
    """
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
            # There should NEVER be a operand before an operand
            if previous_is_operand(prev):
                raise Exception('missingoperatior')
            # Names must be lowercase
            if not re.match('^[a-z]+$', tokval):
                raise Exception('badname')
            result.append(tokval)
        elif toknum == tokenize.NUMBER:
            # There should NEVER be a operand before an operand
            if previous_is_operand(prev):
                raise Exception('missingoperatior')
            result.append(tokval)
        elif toknum == tokenize.OP:
            if toktype == tokenize.LPAR:
                # There should ONLY be +-*/^ before a (
                if not previous_is_operator(prev):
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
                if not previous_is_operand(prev):
                    raise Exception('missingoperand')
                # This sucks, but we only can do powers to a fixed operand. :(
                # Remove the previous operand and put it in front of 'Math.pow( '
                last = result.pop()
                result.append('Math.pow( {} ,'.format(last))
                # Tell the next operand to put the closing bracket
                # If it fails to do so, we'll just have an invalid expression
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

def previous_is_operator(prev):
    if not prev:
        return True
    if prev[0] != tokenize.PLUS and prev[0] != tokenize.MINUS and prev[0] != tokenize.STAR and prev[0] != tokenize.SLASH and prev[0] != tokenize.CIRCUMFLEX:
        return False
    return True
