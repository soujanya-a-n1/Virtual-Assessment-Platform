# Docker Setup Guide for Code Compiler

This guide provides instructions for setting up Docker to run the Multi-Language Code Compiler system on Windows.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installing Docker Desktop on Windows](#installing-docker-desktop-on-windows)
- [Building Docker Images](#building-docker-images)
- [Verifying the Setup](#verifying-the-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
- OR Windows 11 64-bit
- Hardware virtualization enabled in BIOS
- At least 4GB of RAM (8GB recommended)
- At least 10GB of free disk space

## Installing Docker Desktop on Windows

### Step 1: Download Docker Desktop

1. Visit the [Docker Desktop download page](https://www.docker.com/products/docker-desktop/)
2. Click "Download for Windows"
3. Save the installer file (Docker Desktop Installer.exe)

### Step 2: Install Docker Desktop

1. Double-click the installer file to run it
2. Follow the installation wizard:
   - Accept the license agreement
   - Choose "Use WSL 2 instead of Hyper-V" (recommended)
   - Click "Install"
3. Wait for the installation to complete (this may take several minutes)
4. Click "Close and restart" when prompted

### Step 3: Start Docker Desktop

1. Launch Docker Desktop from the Start menu
2. Accept the Docker Subscription Service Agreement
3. Wait for Docker to start (you'll see "Docker Desktop is running" in the system tray)
4. Optionally, complete the Docker tutorial or skip it

### Step 4: Verify Docker Installation

Open PowerShell or Command Prompt and run:

```powershell
docker --version
```

You should see output like:
```
Docker version 24.0.x, build xxxxxxx
```

Test Docker is working:

```powershell
docker run hello-world
```

If successful, you'll see a "Hello from Docker!" message.

## Building Docker Images

The code compiler uses separate Docker images for each supported programming language. You need to build these images before running the compiler service.

### Supported Languages

The system supports the following languages with their respective Docker images:

- **C**: GCC compiler
- **C++**: G++ compiler  
- **Java**: OpenJDK 17
- **C#**: .NET SDK 7.0
- **Node.js**: Node.js 18
- **Python**: Python 3.11
- **JavaScript**: Node.js 18

### Building All Images

From the project root directory, run the following commands in PowerShell:

```powershell
# Build C image
docker build -t code-compiler-c:latest -f docker/c.Dockerfile docker/

# Build C++ image
docker build -t code-compiler-cpp:latest -f docker/cpp.Dockerfile docker/

# Build Java image
docker build -t code-compiler-java:latest -f docker/java.Dockerfile docker/

# Build C# image
docker build -t code-compiler-csharp:latest -f docker/csharp.Dockerfile docker/

# Build Node.js image
docker build -t code-compiler-node:latest -f docker/node.Dockerfile docker/

# Build Python image
docker build -t code-compiler-python:latest -f docker/python.Dockerfile docker/

# Build JavaScript image (uses same as Node.js)
docker build -t code-compiler-javascript:latest -f docker/node.Dockerfile docker/
```

**Note**: Building all images will take 10-20 minutes depending on your internet connection and system performance.

### Verifying Built Images

List all Docker images to verify they were built successfully:

```powershell
docker images | Select-String "code-compiler"
```

You should see all 7 images listed with their sizes and creation dates.

### Automated Build Script

For convenience, you can use the automated build script (if available):

```powershell
# Run the build script
.\scripts\build-docker-images.ps1
```

This script will build all images sequentially and report any errors.

## Verifying the Setup

### Test Individual Language Images

Test each language image to ensure it works correctly:

**Test C:**
```powershell
docker run --rm code-compiler-c:latest gcc --version
```

**Test C++:**
```powershell
docker run --rm code-compiler-cpp:latest g++ --version
```

**Test Java:**
```powershell
docker run --rm code-compiler-java:latest java --version
```

**Test C#:**
```powershell
docker run --rm code-compiler-csharp:latest dotnet --version
```

**Test Node.js:**
```powershell
docker run --rm code-compiler-node:latest node --version
```

**Test Python:**
```powershell
docker run --rm code-compiler-python:latest python3 --version
```

### Test Code Execution

Create a simple test to verify code execution works:

```powershell
# Test Python execution
echo 'print("Hello from Docker!")' | docker run --rm -i code-compiler-python:latest python3
```

Expected output:
```
Hello from Docker!
```

## Troubleshooting

### Docker Desktop Won't Start

**Problem**: Docker Desktop fails to start or shows "Docker Desktop starting..." indefinitely.

**Solutions**:

1. **Enable WSL 2**:
   ```powershell
   wsl --install
   wsl --set-default-version 2
   ```
   Restart your computer after installation.

2. **Enable Virtualization in BIOS**:
   - Restart your computer and enter BIOS (usually F2, F10, or Del key)
   - Find "Virtualization Technology" or "Intel VT-x" / "AMD-V"
   - Enable it and save changes
   - Restart your computer

3. **Reset Docker Desktop**:
   - Right-click Docker Desktop icon in system tray
   - Select "Troubleshoot"
   - Click "Reset to factory defaults"
   - Restart Docker Desktop

### "docker: command not found" Error

**Problem**: PowerShell doesn't recognize the `docker` command.

**Solutions**:

1. **Restart PowerShell**: Close and reopen PowerShell after installing Docker Desktop

2. **Check Docker is Running**: Ensure Docker Desktop is running (check system tray)

3. **Add Docker to PATH**:
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\Docker\Docker\resources\bin` to PATH
   - Restart PowerShell

### Image Build Failures

**Problem**: Docker image build fails with errors.

**Solutions**:

1. **Check Internet Connection**: Image builds require downloading base images and packages

2. **Clear Docker Cache**:
   ```powershell
   docker system prune -a
   ```
   Warning: This removes all unused images and containers.

3. **Build with No Cache**:
   ```powershell
   docker build --no-cache -t code-compiler-c:latest -f docker/c.Dockerfile docker/
   ```

4. **Check Disk Space**: Ensure you have at least 10GB free space
   ```powershell
   docker system df
   ```

### Container Execution Errors

**Problem**: Containers fail to run or execute code.

**Solutions**:

1. **Check Container Logs**:
   ```powershell
   docker logs <container-id>
   ```

2. **Test Container Interactively**:
   ```powershell
   docker run -it code-compiler-python:latest /bin/bash
   ```
   This opens a shell inside the container for debugging.

3. **Verify File Permissions**: On Windows, ensure files being mounted have proper permissions

4. **Check Resource Limits**: Ensure Docker Desktop has enough resources allocated:
   - Open Docker Desktop Settings
   - Go to Resources
   - Increase Memory to at least 4GB
   - Increase CPU to at least 2 cores

### "Access Denied" or Permission Errors

**Problem**: Docker commands fail with permission errors.

**Solutions**:

1. **Run as Administrator**: Right-click PowerShell and select "Run as Administrator"

2. **Add User to docker-users Group**:
   - Open Computer Management
   - Go to Local Users and Groups → Groups
   - Double-click "docker-users"
   - Add your user account
   - Log out and log back in

### Network Issues in Containers

**Problem**: Containers cannot access the internet during build.

**Solutions**:

1. **Check Docker Network Settings**:
   - Open Docker Desktop Settings
   - Go to Resources → Network
   - Try switching DNS servers

2. **Configure Proxy** (if behind corporate firewall):
   - Open Docker Desktop Settings
   - Go to Resources → Proxies
   - Configure HTTP/HTTPS proxy settings

3. **Reset Network**:
   ```powershell
   docker network prune
   ```

### WSL 2 Installation Issues

**Problem**: WSL 2 fails to install or update.

**Solutions**:

1. **Update Windows**: Ensure Windows is fully updated via Windows Update

2. **Manual WSL 2 Installation**:
   ```powershell
   # Enable WSL
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   
   # Enable Virtual Machine Platform
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   
   # Restart computer
   
   # Download and install WSL 2 kernel update
   # Visit: https://aka.ms/wsl2kernel
   
   # Set WSL 2 as default
   wsl --set-default-version 2
   ```

### High CPU or Memory Usage

**Problem**: Docker Desktop consumes excessive resources.

**Solutions**:

1. **Limit Resources**:
   - Open Docker Desktop Settings
   - Go to Resources
   - Reduce Memory and CPU allocation
   - Recommended: 4GB RAM, 2 CPUs for development

2. **Stop Unused Containers**:
   ```powershell
   docker ps -a
   docker stop <container-id>
   docker rm <container-id>
   ```

3. **Clean Up Resources**:
   ```powershell
   docker system prune -a --volumes
   ```

### Container Cleanup Issues

**Problem**: Containers remain running or cannot be removed.

**Solutions**:

1. **Force Stop Containers**:
   ```powershell
   docker ps -a
   docker stop -t 0 <container-id>
   docker rm -f <container-id>
   ```

2. **Remove All Stopped Containers**:
   ```powershell
   docker container prune
   ```

3. **Restart Docker Desktop**: Sometimes a restart resolves stuck containers

## Additional Resources

- [Docker Desktop Documentation](https://docs.docker.com/desktop/windows/)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [WSL 2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Troubleshooting Guide](https://docs.docker.com/desktop/troubleshoot/overview/)

## Getting Help

If you encounter issues not covered in this guide:

1. Check Docker Desktop logs:
   - Click Docker Desktop icon in system tray
   - Select "Troubleshoot"
   - Click "Get support" to view logs

2. Search the [Docker Community Forums](https://forums.docker.com/)

3. Contact the development team with:
   - Docker version (`docker --version`)
   - Windows version
   - Error messages or logs
   - Steps to reproduce the issue

## Security Notes

- All code execution happens in isolated Docker containers
- Containers run with limited resources (CPU, memory, timeout)
- Network access is disabled in execution containers
- Containers use non-root users for additional security
- Containers are destroyed immediately after execution
- No persistent data is stored in containers

## Performance Tips

1. **Use SSD**: Store Docker images on an SSD for faster builds and execution
2. **Allocate Sufficient Resources**: Give Docker at least 4GB RAM and 2 CPU cores
3. **Keep Images Updated**: Regularly rebuild images to get security updates
4. **Monitor Resource Usage**: Use `docker stats` to monitor container resource usage
5. **Clean Up Regularly**: Run `docker system prune` weekly to free up space

---

**Last Updated**: 2024
**Version**: 1.0
