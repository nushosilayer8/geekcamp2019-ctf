#include <stdio.h>
#include <string.h>

int uid;
char user[0x10];

int main() {
    char buffer[0x400];
    uid = 1000;
    int wantsflag = 0;
    memcpy(user, "lmao", 5);
    
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

    while (1) {
        fgets(buffer, 0x400, stdin);
        if(sscanf(buffer, "GET /login/?user=%s HTTP/1.1", user) == 1) {
            printf("HTTP/1.1 200 OK\n");
            printf("Server: lmao\n");
            printf("Connection: close\n");
            printf("Content-Type: text/html\n");
            printf("<html><body><h1>Shoo Shoo %s!!</h1></body></html>", user);
        }
        else if(sscanf(buffer, "GET /flag/%d HTTP/1.1", &wantsflag) == 1 && wantsflag) {
            if (uid == 0xcafebabe) {
                system("cat flag");
            }
        }
    }

    return 0;
}
