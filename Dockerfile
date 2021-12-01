# pull base image
FROM node:16.13.0-buster

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19000
ENV PORT $PORT
EXPOSE $PORT 19001 19002

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm -g npm@latest expo-cli@latest

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/todolistapp && chown node:node /opt/todolistapp
WORKDIR /opt/todolistapp

ENV PATH /opt/todolistapp/.bin:$PATH

COPY --chown=node:node ./App/package.json ./
COPY --chown=node:node ./App/package-lock.json ./
USER node
RUN npm install

# copy in our source code last, as it changes the most
WORKDIR /opt/todolistapp/app

#COPY ./App .

CMD ["expo","start"]