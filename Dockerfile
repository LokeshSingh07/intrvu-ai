FROM node:20
WORKDIR /app
COPY package* .

RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "dev"]
