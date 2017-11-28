FROM centos:7

LABEL name="DCI UI"
MAINTAINER DCI Team <distributed-ci@redhat.com>

RUN echo -e "[google-chrome]\n\
name=google-chrome - x86_64\n\
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64\n\
enabled=1\n\
gpgcheck=1\n\
showdupesfromrepos=1\n\
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub\n" > \
    /etc/yum.repos.d/google-chrome.repo

RUN yum install -y epel-release && \
    yum install -y http-parser nodejs npm google-chrome-stable liberation-mono-fonts && \
    yum clean all

RUN mkdir -p /opt/dci-ui
WORKDIR /opt/dci-ui

COPY package.json /opt/dci-ui/
RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]
