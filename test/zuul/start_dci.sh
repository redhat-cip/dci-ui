set -ex

export DCI_LOGIN=admin
export DCI_PASSWORD=admin
export DCI_CS_URL=http://localhost:5000
export DCI_SETTINGS_FILE="$(pwd)/test/zuul/settings.py"
DCI_SERVER_DIR="../dci-control-server"

pushd "$DCI_SERVER_DIR"
sudo "PATH=$PATH" pip install -r requirements.txt
sudo "PATH=$PATH" python setup.py install
sh scripts/start_db.sh
sh scripts/start_es.sh
python scripts/db_provisioning.py -y
python bin/dci-runtestserver &
python bin/dci-esindex
popd
npm install
npm run build
npm start &
sleep 10
curl -u admin:admin http://localhost:5000/api/v1/jobs
curl http://localhost:8000/
