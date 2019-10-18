import binascii
import base64
import sys
import hashlib
import random

if __name__ == "__main__":
    sys.stdout.write("Tell me the flag and I will let you know if you are right: ")

    pw = raw_input()

    if len(pw) != 26:
        print("WRONG")
        exit(0)

    p = binascii.hexlify(pw[0:8])
    if int(b"0x" + p, 0) != 7883954021068981883:
        print("WRONG")
        exit(0)

    b = base64.b64encode(pw[8:16])
    if b != ''.join(map(chr, [98, 71, 70, 116, 89, 109, 82, 104, 99, 49, 56, 61])):
        print("WRONG")
        exit(0)

    h = hashlib.md5(pw[16:22]).hexdigest()
    if h != "0465826670a35ed60456fc2e494c16d9":
        print("WRONG")
        exit(0)

    rs = [9, 82, 76, 73]
    for i, r in zip(range(22, 26), rs):
        c = pw[i]
        random.seed(c)
        if r != random.randint(0, 100):
            print("WRONG")
            exit(0)

    print("That's the flag, go submit it.")
    