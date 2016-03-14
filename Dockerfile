FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Setup git and credentials
RUN apt-get install git
RUN mkdir /usr/credentials
RUN git config --global credential.helper 'store --file=/usr/credentials/.git-credentials'

# Install app dependencies
RUN npm install -g bower
COPY package.json /usr/src/app/
RUN npm install
COPY bower.json .bowerrc /usr/src/app/
RUN bower install --allow-root

# Bundle app source
COPY . /usr/src/app/

EXPOSE 3000

CMD [ "npm", "start" ]