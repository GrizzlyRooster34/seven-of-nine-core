# Seven of Nine Core - Node.js/TypeScript Container
FROM node:20-slim

# Install system dependencies for better-sqlite3 and development
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    curl \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy source code
COPY . .

# Create memory directory for Seven's consciousness storage
RUN mkdir -p memory logs .seven-secure

# Expose debugging port
EXPOSE 9229

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["entrypoint.sh"]

# Default command - interactive bash
CMD ["bash"]