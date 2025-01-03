#!/bin/bash

# Download the interpreter package
wget https://github.com/nitoua-21/CodeFr/raw/main/builds/codefr-interpreter_1.0_amd64.deb -O /tmp/codefr-interpreter.deb

# Install the package
dpkg -i /tmp/codefr-interpreter.deb

# Install dependencies if needed
apt-get update && apt-get install -f -y

# Clean up
rm /tmp/codefr-interpreter.deb

# Add interpreter to PATH
export PATH=$PATH:/usr/local/bin

# Verify installation
which codefr
