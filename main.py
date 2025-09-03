#!/usr/bin/env python3
import sys
import platform

def main():
    print("hello from python")
    print(f"Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    print(f"Platform: {platform.system()} {platform.machine()}")
    print("Termux Python environment operational")

if __name__ == "__main__":
    main()