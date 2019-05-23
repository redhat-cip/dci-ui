FROM centos:7

LABEL name="DCI APP"
LABEL version="0.1.1"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ENV LANG en_US.UTF-8

RUN yum install -y epel-release && \
    yum install -y nodejs npm && \
    yum clean all

WORKDIR /opt/dci-ui
COPY package.json package-lock.json /opt/dci-ui/
RUN npm install
COPY . /opt/dci-ui/

EXPOSE 8000

CMD ["npm", "start"]