# Dillon koekemoer u23537052
FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY . .

RUN cd backend && npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3001

CMD ["node", "backend/server.js"]