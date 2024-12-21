# Download the interpreter package
$url = "https://github.com/nitoua-21/CodeFr/raw/main/builds/codefr-interpreter_1.0_amd64.deb"
$output = "$env:TEMP\codefr-interpreter.deb"

Write-Host "Downloading CodeFr interpreter..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Installing CodeFr interpreter..."
wsl --distribution Ubuntu-24.04 sudo dpkg -i /mnt/c/Users/$env:USERNAME/AppData/Local/Temp/codefr-interpreter.deb
wsl --distribution Ubuntu-24.04 sudo apt-get install -f

Write-Host "Cleaning up..."
Remove-Item $output

Write-Host "Verifying installation..."
wsl --distribution Ubuntu-24.04 codefr --version
