// things needed to be present:
// 1. buffer addr loc known
// 2. malloc, free
// 3. free our own pointer
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

struct elantrian_info {
    char desc[0x50];
    long weight;
    long height;
};

struct elantrian {
    char name[0x10];
    struct elantrian_info* info;
};

struct elantrian elantrians[10];

void print_menu() {
    printf("Menu:\n");
    printf("1. create elantrian\n");
    printf("2. delete elantrian\n");
    printf("3. edit elantrian name\n");
    printf("4. read to scratchpad\n");
    printf("5. write out scratchpad\n");
}

void create_elantrian() {
    int idx;

    printf("Index:");
    scanf("%d", &idx);

    if(idx < 0 || idx > 9 || elantrians[idx].info != NULL) exit(-2);

    elantrians[idx].info = malloc(sizeof(struct elantrian_info));
    printf("name:");
    fgets(&elantrians[idx].name, 0x10, stdin);
    printf("desc:");
    fgets(&elantrians[idx].info->desc, 0x50, stdin);
    printf("weight:");
    scanf("%d", &elantrians[idx].info->weight);
    printf("height:");
    scanf("%d", &elantrians[idx].info->height);
}

void delete_elantrian() {
    int idx;

    printf("Index:");
    scanf("%d", &idx);

    if(idx < 0 || idx > 9 || elantrians[idx].info == NULL) exit(-3);

    free(elantrians[idx].info);
    memset(&elantrians[idx], sizeof( struct elantrian), 0);
}

void edit_elantrian_name() {
    int idx;

    printf("Index:");
    scanf("%d", &idx);

    if(idx < 0 || idx > 9 || elantrians[idx].info == NULL) exit(-4);

    printf("new name:");
    read(0, &elantrians[idx].name, 0x18);
}

int main() {
    int opt;
    char scratch[200];
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

    printf("welcome to the world of sel!\n");
    printf("let's make some elantrians");

    while(1) {
        print_menu();
        scanf("%d", &opt);
        switch(opt) {
            case 1:
                create_elantrian();
                break;
            case 2:
                delete_elantrian();
                break;
            case 3:
                edit_elantrian_name();
                break;
            case 4:
                read(0, scratch, 200);
                break;
            case 5:
                write(1, scratch, 200);
                break;
            case 1337:
                printf("%p", printf);
                break;
        }
    }

    return 0;
}
