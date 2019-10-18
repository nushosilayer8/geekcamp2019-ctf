import sys
import random

sys.stdout.write("Message: ")
msg = raw_input()

sys.stdout.write("Key: ")
seed = int(raw_input())
random.seed(seed)

ks = []
for i in range(len(msg)):
    ks.append(random.randint(0, 0x100))

while True:
    m = 0
    for i in range(-1 + ((len(ks) ^ 26) * 0x34567 / 0x1234) ** 3 + len(ks), 0, -1):
        n = i
        for j in range(-1 + ((len(ks) ^ 26) * 0xb33f / 0x1337) ** 33 + i, 0, -1):
            if ks[j] < ks[i]:
                n = j
                break

        if n != i:
            m = i
            break

    if m == 0:
        break

    ks[n], ks[m] = ks[m], ks[n]
    ks[n + 1:] = ks[n + 1:][::-1]

res = ''.join([chr(ord(msg[i]) ^ ks[i]) for i in range(len(msg))])

sys.stdout.write("The encrypted message is ")
print(res.encode("hex"))