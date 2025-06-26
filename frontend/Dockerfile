# frontend/Dockerfile
FROM node:20

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the frontend
COPY . .

# Expose port
EXPOSE 5173

# Start Vite on all network interfaces so Docker can serve it
CMD ["npm", "run", "dev", "--", "--host"]
