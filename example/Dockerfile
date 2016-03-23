FROM iron/node:4-dev

ENV NODE_PORT=10080
WORKDIR /opt/webapp

COPY package.json /opt/webapp/
RUN npm install
COPY app.js config.js worker.js luster.conf.json /opt/webapp/

EXPOSE $NODE_PORT
USER nobody

CMD ["npm", "start"]
