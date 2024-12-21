#!/bin/bash

# Download the interpreter package
wget https://github.com/nitoua-21/CodeFr/raw/main/builds/codefr-interpreter_1.0_amd64.deb -O /tmp/codefr-interpreter.deb

# Install the package
sudo dpkg -i /tmp/codefr-interpreter.deb

# Install dependencies if needed
sudo apt-get install -f

# Clean up
rm /tmp/codefr-interpreter.deb

# Verify installation
codefr --version
