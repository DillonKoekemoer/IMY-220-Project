# Dillon koekemoer u23537052
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm install
RUN cd backend && npm install

COPY . .

EXPOSE 3000 3001

CMD sh -c "cd backend && npm start & npm start"