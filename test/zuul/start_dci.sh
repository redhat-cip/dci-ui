set -ex

# for all that script we assume that it as been launched from the root of this
# repository and that https://github.com/redhat-cip/dci-control-server as been
# cloned in a sibling folder i.e: ../dci-control-server

export DCI_LOGIN=admin
export DCI_PASSWORD=admin
export DCI_CS_URL=http://localhost:5000
export DCI_SETTINGS_FILE="$(pwd)/test/zuul/settings.py"
DCI_SERVER_DIR="../dci-control-server"

cd "$DCI_SERVER_DIR"

sudo pip install -r requirements.txt
sudo "PATH=$PATH" python setup.py install
sh scripts/start_db.sh
sh scripts/start_es.sh
python scripts/db_provisioning.py -y
python scripts/runtestserver.py &
python bin/dci-esindex
cd -
