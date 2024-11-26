FROM registry.access.redhat.com/ubi9/nodejs-20-minimal AS builder

LABEL name="DCI UI builder image"
LABEL version="0.2.0"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

ARG REACT_APP_BACKEND_HOST
ARG REACT_APP_SSO_URL
ARG REACT_APP_SSO_REALM
ARG REACT_APP_SSO_CLIENT_ID
ARG REACT_APP_SSO_SCOPE

ENV LANG en_US.UTF-8

WORKDIR /opt/dci-ui
COPY --chown=1001:1001 package*.json .
RUN npm install -g npm@latest
RUN npm install
COPY --chown=1001:1001 . ./
RUN npm run build

FROM registry.access.redhat.com/ubi9/ubi-minimal

LABEL name="DCI UI container image"
LABEL version="0.1.0"
LABEL maintainer="DCI Team <distributed-ci@redhat.com>"

RUN microdnf -y upgrade && \
    microdnf -y install nginx && \
    microdnf clean all

COPY --from=builder /opt/dci-ui/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
