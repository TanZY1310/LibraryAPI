# ── Stage 1: Build the React app ──────────────────────
FROM node:20-alpine AS build
 
WORKDIR /app
 
# Install dependencies first (better Docker layer caching)
COPY package.json package-lock.json* ./
RUN npm install
 
# Copy source and build
COPY . .
RUN npm run build
 
# ── Stage 2: Serve with Nginx ──────────────────────────
FROM nginx:alpine
 
# Copy built React files into Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html
 
# Copy custom Nginx config (handles React Router + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]