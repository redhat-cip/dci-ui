FROM centos:7

LABEL name="DCI APP"
LABEL version="0.1.1"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ARG REACT_APP_BACKEND_HOST
ARG REACT_APP_SSO_URL
ARG REACT_APP_SSO_REALM
ARG REACT_APP_SSO_CLIENT_ID

ENV LANG en_US.UTF-8

RUN yum install -y centos-release-scl && \
    yum install -y rh-nodejs10 && \
    yum clean all

WORKDIR /opt/dci-ui
COPY package.json package-lock.json /opt/dci-ui/
RUN scl enable rh-nodejs10 "npm install"
COPY . /opt/dci-ui/

EXPOSE 8000

CMD scl enable rh-nodejs10 "npm start"