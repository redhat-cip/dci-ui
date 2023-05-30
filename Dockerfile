FROM registry.access.redhat.com/ubi8/nodejs-18-minimal

LABEL name="DCI UI"
LABEL version="0.2.0"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ENV LANG en_US.UTF-8

COPY package*.json .
RUN npm install --silent
COPY --chown=1001:1001 . ./

EXPOSE 8000

CMD ["npm", "start"]