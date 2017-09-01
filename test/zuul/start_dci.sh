set -ex

export DCI_LOGIN=admin
export DCI_PASSWORD=admin
export DCI_CS_URL=http://localhost:5000
export DCI_SETTINGS_FILE="$(pwd)/test/zuul/settings.py"

pushd "../dci-control-server"
sudo "PATH=$PATH" python -m pip install -r requirements.txt
sudo "PATH=$PATH" python setup.py install
sh scripts/start_db.sh
python scripts/db_provisioning.py -y
python bin/dci-runtestserver &
curl -u admin:admin http://localhost:5000/api/v1/jobs
popd
npm install
npm run build
npm start &
sleep 10
curl http://localhost:8000/
