set -ex

export DCI_LOGIN=admin
export DCI_PASSWORD=admin
export DCI_CS_URL=http://127.0.0.1:5000
export DCI_SETTINGS_FILE="$(pwd)/test/zuul/settings.py"

pushd "../dci-control-server"
sudo "PATH=$PATH" pip install -r requirements.txt
sudo "PATH=$PATH" python setup.py install
sh scripts/start_db.sh
sh scripts/start_api.sh
sleep 10
python scripts/db_provisioning.py -y
popd
npm install
npm run build
npm start &
curl -u admin:admin http://127.0.0.1:5000/api/v1/jobs
curl http://127.0.0.1:8000/
