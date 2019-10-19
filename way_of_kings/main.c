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

struct human humans[10];
struct surgebinder surgebinders[10];

int readint() {
    int num;
    scanf("%d", &num);
    getchar();
    return num;
}

void gravitation(struct surgebinder* man) {
    puts("> %s used gravition!", main->name);
}

void adhesion(struct surgebinder* man) {
    puts("> %s used gravition!", main->name);
}


void create_human() {
    puts("index:");
    int idx = readint();
    if(idx < 0 || idx > 9) return 0;

    puts("name:");
    read(0, &humans[idx].name, 0x20);
    puts("age:");
    humans[idx].age = readint();
}

void create_surgebinder() {
    puts("index:");
    int idx = readint();
    if(idx < 0 || idx > 9) return 0;

    puts("name:");
    read(0, &surgebinder[idx].name, 0x18);
    puts("what surge do you want?");
    puts("1. adhesion");
    puts("2. gravitation");
    int surge = readint();
    switch(surge) {
        case 1:
            surgebinder[idx].usesurge = adhesion;
        case 2:
            surgebinder[idx].usesurge = gravitation;
        default:
            exit(-1);
    }
    puts("age:");
    humans[idx].age = readint();
}

void print_menu() {
    puts("Menu");
    puts("1. create human");
    puts("2. create surgebinder");
    puts("3. bind with spren to become surgebinder");
    puts("4. use surge");
    puts("5. exit");
}

int main() {
    while(true){
        print_menu();

        int opt = readint();
        switch(opt) {
            case 1:
                create_human();
                break;
            case 2:
                create_surgebinder();
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                return 0;
        }
    }
    return 0;
}
