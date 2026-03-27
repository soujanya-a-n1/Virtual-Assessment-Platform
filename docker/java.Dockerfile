# Java Environment with OpenJDK
FROM openjdk:17-slim

# Set working directory
WORKDIR /code

# Security: Create non-root user
RUN useradd -m -u 1000 coderunner && \
    chown -R coderunner:coderunner /code

# Switch to non-root user
USER coderunner

# Set read-only filesystem (will be enforced at runtime)
# Writable /tmp will be mounted at runtime
