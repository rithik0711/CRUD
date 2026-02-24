# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy client package files
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy client source and build
COPY client/ ./client/
RUN cd client && npm run build

# Run Stage
FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server source
COPY server/ ./server/

# Copy built frontend assets from builder stage to server's public/dist directory
COPY --from=builder /app/client/dist ./server/dist

EXPOSE 8080

WORKDIR /app/server
CMD ["npm", "start"]
