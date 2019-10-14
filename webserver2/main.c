// gcc
#include <stdio.h>
#include <string.h>

int main() {
    char buffer[0x400];
    
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

    while (1) {
        fgets(buffer, 0x400, stdin);
        char input[400];
        if(sscanf(buffer, "GET /input/%400s HTTP/1.1", input) == 1) {
            printf("HTTP/1.1 200 OK\n");
            printf("Server: lmao\n");
            printf("Connection: close\n");
            printf("Content-Type: text/html\n");
            printf("<html><body><h1>");
            printf(input);
            printf("</h1></body></html>");
        }
    }

    return 0;
}
