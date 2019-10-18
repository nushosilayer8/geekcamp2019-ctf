
flag_txt = open('flag.txt', 'r').read().strip()

def swap(arr):
    for _ in range(0, 1000000):
        c = ord(arr[0]) % (len(arr) - 1) + 1
        arr.insert(0, arr.pop(c))
    return arr

if __name__ == "__main__":
    flag = list(flag_txt)
    swap(flag)
    print(''.join(flag))
