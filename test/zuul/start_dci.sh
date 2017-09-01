set -ex

# for all that script we assume that it as been launched from the root of this
# repository and that https://github.com/redhat-cip/dci-control-server as been
# cloned in a sibling folder i.e: ../dci-control-server

export DCI_LOGIN=admin
export DCI_PASSWORD=admin
export DCI_CS_URL=http://localhost:5000
export DCI_SETTINGS_FILE="$(pwd)/test/zuul/settings.py"

pushd "../dci-control-server"
sudo python -m pip install -r requirements.txt
sh scripts/start_db.sh
sh scripts/start_api.sh
python scripts/db_provisioning.py -y
popd
npm start &
google-chrome --version
pwd
ls -alh
