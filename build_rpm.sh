#!/bin/bash
set -eux
PROJ_NAME=dci-ui
DATE=$(date +%Y%m%d%H%M)
SHA=$(git rev-parse HEAD | cut -c1-8)

# Configure rpmmacros to enable signing packages
#
echo '%_signature gpg' >> ~/.rpmmacros
echo '%_gpg_name Distributed-CI' >> ~/.rpmmacros

# Create the proper filesystem hierarchy to proceed with srpm creatioon
#
rm -rf ${HOME}/rpmbuild
rpmdev-setuptree
cp ${PROJ_NAME}.spec ${HOME}/rpmbuild/SPECS/
git archive HEAD --format=tgz --output=${HOME}/rpmbuild/SOURCES/${PROJ_NAME}-0.0.${DATE}git${SHA}.tgz
sed -i "s/VERS/${DATE}git${SHA}/g" ${HOME}/rpmbuild/SPECS/${PROJ_NAME}.spec
rpmbuild -bs ${HOME}/rpmbuild/SPECS/${PROJ_NAME}.spec

# Build the RPMs in a clean chroot environment with mock to detect missing
# BuildRequires lines.
arch=epel-7-x86_64

# NOTE(spredzy) Add signing options
#
mkdir -p ${HOME}/.mock
cp /etc/mock/${arch}.cfg ${HOME}/.mock/${arch}.cfg
sed -i "\$aconfig_opts['plugin_conf']['sign_enable'] = True" ${HOME}/.mock/${arch}.cfg
sed -i "\$aconfig_opts['plugin_conf']['sign_opts'] = {}" ${HOME}/.mock/${arch}.cfg
sed -i "\$aconfig_opts['plugin_conf']['sign_opts']['cmd'] = 'rpmsign'" ${HOME}/.mock/${arch}.cfg
sed -i "\$aconfig_opts['plugin_conf']['sign_opts']['opts'] = '--addsign %(rpms)s'" ${HOME}/.mock/${arch}.cfg

RPATH='el/7/x86_64'
mkdir -p development
mock -r ${HOME}/.mock/${arch}.cfg rebuild --resultdir=development/${RPATH} ${HOME}/rpmbuild/SRPMS/${PROJ_NAME}*
