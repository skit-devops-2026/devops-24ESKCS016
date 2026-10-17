FROM node:20-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./
RUN npm install --omit=dev 2>/dev/null || true

# Copy application source code
COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "backend/server.js"]
