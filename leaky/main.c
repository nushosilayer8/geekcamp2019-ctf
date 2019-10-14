#include <stdio.h>

int main() {
    char name[0x40];
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

    printf("welcome to the leaky service!\n");
    void* p = puts;
    puts(&p);
    printf("\noops what was that? nvm carry on!\nwhat is ur name:");
    read(0, name, 0x400);
    return 0;
}
