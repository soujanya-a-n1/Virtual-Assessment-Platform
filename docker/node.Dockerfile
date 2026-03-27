# Node.js Environment
FROM node:18-alpine

# Set working directory
WORKDIR /code

# Security: Create non-root user (alpine uses adduser)
RUN adduser -D -u 1000 coderunner && \
    chown -R coderunner:coderunner /code

# Switch to non-root user
USER coderunner

# Set read-only filesystem (will be enforced at runtime)
# Writable /tmp will be mounted at runtime
