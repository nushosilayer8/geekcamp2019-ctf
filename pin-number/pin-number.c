// gcc pin-number.c -o pin-number

#include <stdio.h>

typedef unsigned long long ull;

char check1(char c) {
    return c - 6 == 113;
}
char check2(char c) {
    return c + 188 == 69;
}
char check3(char c) {
    return c ^ 7 == 54;
}
char check4(char c) {
    return c - 3 == 21;
}
char check5(char c) {
    return c + 200 == 90;
}
char check6(char c) {
    return c ^ 10 == 19;
}
char check7(char c) {
    return c + 7 == 13;
}
char check8(char c) {
    return c - 8 == 9;
}

int main() {
    char (*checks[])(char) = {&check1, &check2, &check3, &check4, &check5, &check6, &check7, &check8};

    printf("Enter the correct pin number to get flag: ");
    ull input; scanf("%llu", &input); // 1226696063766858103

    char* cnput = &input;
    // printf("%u\n", cnput[0] - 6);
    // printf("%u\n", cnput[1] + 188);
    // printf("%u\n", cnput[2] ^ 7);
    // printf("%u\n", cnput[3] - 3);
    // printf("%u\n", cnput[4] + 200);
    // printf("%u\n", cnput[5] ^ 10);
    // printf("%u\n", cnput[6] + 7);
    // printf("%u\n", cnput[7] - 8);
    for (int i = 0; i < 8; ++i) {
        if (!checks[i](cnput[i])) {
            puts("GO HOME WHAT A NOOB");
            return 0;
        }
    }

    printf("miniCTF{");
    // printf("%2x ", 's' ^ cnput[0]);
    // printf("%2x ", '0' ^ cnput[1]);
    // printf("%2x ", '_' ^ cnput[2]);
    // printf("%2x ", 'g' ^ cnput[3]);
    // printf("%2x ", '0' ^ cnput[4]);
    // printf("%2x ", '0' ^ cnput[5]);
    // printf("%2x ", 'd' ^ cnput[6]);
    // printf("%2x ", '!' ^ cnput[7]);
    printf("%c", 4 ^ cnput[0]);
    printf("%c", 0xb9 ^ cnput[1]);
    printf("%c", 0x6e ^ cnput[2]);
    printf("%c", 0x7f ^ cnput[3]);
    printf("%c", 0xa2 ^ cnput[4]);
    printf("%c", 0x29 ^ cnput[5]);
    printf("%c", 0x62 ^ cnput[6]);
    printf("%c", 0x30 ^ cnput[7]);
    printf("}\n");

    return 0;
}