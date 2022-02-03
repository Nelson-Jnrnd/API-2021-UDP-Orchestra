FROM node:current
EXPOSE 2205
EXPOSE 9907/udp
WORKDIR /opt/app
COPY src/ .
RUN npm install
CMD ["node", "index.js"]