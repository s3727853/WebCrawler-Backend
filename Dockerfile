FROM node
# Source dir inside image for app
WORKDIR /user/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
# Note this target also starts nodemon 
# which is redundant in a container. 
CMD ["npm", "run", "start:dev"]

