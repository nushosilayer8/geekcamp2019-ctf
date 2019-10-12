#include <stdio.h>

typedef struct {
    char name[0x2];
    char** what; //gon be leaked
    double weight;
} atom;

int natoms;
atom* atoms[0x10];
int nbonds;
atom* bonds[2][0x10];

int main() {

    return 0;
}
