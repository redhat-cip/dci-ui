FROM centos:7

LABEL name="DCI APP" 
LABEL version="0.1.0"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ENV LANG en_US.UTF-8

RUN yum install -y epel-release && \
    yum install -y nodejs npm && \
    yum clean all

RUN mkdir -p /opt/dci-ui
WORKDIR /opt/dci-ui

COPY package.json /opt/dci-ui/
RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
