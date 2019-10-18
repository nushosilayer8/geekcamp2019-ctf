
swapped = "6m590n2c24T2baifF08{160Cib2fe7ffb9442610}"

def unswap(arr):
    for _ in range(0, 1000000):
        c = ord(arr[1]) % (len(arr) - 1) + 1
        arr.insert(c, arr.pop(0))
    return arr

if __name__ == "__main__":
    unswapped = list(swapped)
    unswap(unswapped)
    print(''.join(unswapped))
