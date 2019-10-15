import wave
import struct
import math


# https://stackoverflow.com/a/10238140
def tobits(s):
    result = []
    for c in s:
        bits = bin(ord(c))[2:]
        bits = '00000000'[len(bits):] + bits
        result.extend([int(b) for b in bits])
    return result

def frombits(bits):
    chars = []
    for b in range(int(len(bits) / 8)):
        byte = bits[b*8:(b+1)*8]
        chars.append(chr(int(''.join([str(bit) for bit in byte]), 2)))
    return ''.join(chars)


i = wave.open('bark.wav', 'rb')
samplerate = i.getframerate()
samplewidth = i.getsampwidth()

print(samplerate, samplewidth)

# From Audacity
start = 2300 - 1204
step = 1204

i.readframes(start)
c = 0
offsets = 0
b = []
while True:
    frame = i.readframes(step)
    if not frame:
        break
    print(frame[0])
    if frame[0]:
        b.append(1)
    else:
        b.append(0)
    c += 1
    if c == 90 or c == 182 or c == 275:
        #print(i.tell())
        offsets += 1
        i.setpos(start + c * step - 417 * offsets)
        print("Offset", i.tell())

print(b, len(b), len(b) / 8)
print(frombits(b))
i.close()
