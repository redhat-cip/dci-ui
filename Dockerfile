FROM centos:7

LABEL name="DCI APP" version="0.0.2"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ENV LANG en_US.UTF-8

RUN echo -e "[google-chrome]\n\
name=google-chrome - x86_64\n\
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64\n\
enabled=1\n\
gpgcheck=1\n\
showdupesfromrepos=1\n\
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub\n" > \
    /etc/yum.repos.d/google-chrome.repo

RUN echo -e "[dci-extras]\n\
name=Distributed CI - Extras - CentOS 7\n\
baseurl=http://packages.distributed-ci.io/repos/extras/el/7/x86_64/\n\
enabled=1\n\
gpgcheck=0\n" > /etc/yum.repos.d/dci-extras.repo

RUN yum install -y epel-release && \
    yum install -y http-parser nodejs npm google-chrome-stable liberation-mono-fonts && \
    yum clean all

RUN mkdir -p /opt/dci-ui
WORKDIR /opt/dci-ui

COPY package.json /opt/dci-ui/
RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]
