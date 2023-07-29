import random

def generateHex():
    characters = "0123456789ABCDEF"
    hex = ""
    hex_length = 6
    i = 0

    while i < hex_length:
        hex += characters[random.randrange(0,16)];
        i += 1;
    return hex

g = 0
while g < 6:
    print(generateHex())
    g += 1