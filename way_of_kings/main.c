#include <stdio.h>

struct human {
    char name[0x20];
    int age;
}

struct surgebinder {
    char name[0x18];
    void* usesurge;
    int age;
}

void gravitation(struct surgebinder* ) {
    puts("> %");
}


void print_menu() {
    puts("Menu");
    puts("1. create human");
}

int main() {

    return 0;
}
