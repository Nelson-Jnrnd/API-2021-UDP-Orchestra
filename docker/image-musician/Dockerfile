FROM node:current
WORKDIR /opt/app
COPY src/ .
RUN npm install
ENTRYPOINT ["node", "index.js"]