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
    for b in range(len(bits) / 8):
        byte = bits[b*8:(b+1)*8]
        chars.append(chr(int(''.join([str(bit) for bit in byte]), 2)))
    return ''.join(chars)

# https://zach.se/generate-audio-with-python/
def sine_wave(high, samplerate, duration=0.0075):
    b = b''
    freq = 400
    samples = samplerate / freq
    length = int(duration * samplerate)
    for i in range(length):
        sample = i % samples 
        value = math.sin(math.pi * 2 * (sample / samples)) * (2**18) * high
        b += int(value).to_bytes(3, byteorder='little', signed=True)
    return b

flag = "miniCTF{df8b57491b57d72ad7972ee0d5c4a7c9}"


i = wave.open('original.wav', 'rb')
o = wave.open('bark.wav', 'wb')
o.setnchannels(i.getnchannels())
o.setsampwidth(i.getsampwidth())
o.setframerate(i.getframerate())

flagbits = tobits(flag)

for bit in flagbits:
    frame = i.readframes(1024)
    #if len(frame) != 1024 * i.getsampwidth() * i.getnchannels():
    if not frame:
        print('Rewinding')
        i.rewind()
        frame = i.readframes(1024)
    o.writeframes(frame)
    waveframe = sine_wave(bit, i.getframerate())
    o.writeframes(waveframe)

i.close()
o.close()
