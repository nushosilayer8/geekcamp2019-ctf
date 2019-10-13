#include <stdio.h>

union node {
    char fruit[0x10];
    struct {
        union node* r;
        union node* l;
    } leaf;
};

int main() {

    return 0;
}
