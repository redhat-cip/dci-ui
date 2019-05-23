FROM centos:7

LABEL name="DCI APP"
LABEL version="0.1.1"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ENV LANG en_US.UTF-8

RUN curl --silent --location https://rpm.nodesource.com/setup_10.x | bash - 
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo

RUN yum install -y nodejs yarn && \
    yum clean all

WORKDIR /opt/dci-ui
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

EXPOSE 8000

CMD ["yarn", "start"]
