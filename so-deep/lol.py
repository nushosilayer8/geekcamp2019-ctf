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

blep = '|'.join(map(lambda x: x[0], filter(lambda x: x[1], tests)))

print('({})'.format(blep))
