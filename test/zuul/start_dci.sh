set -ex

export DCI_LOGIN=admin
export DCI_PASSWORD=admin
export DCI_CS_URL=http://localhost:5000

pushd "../dci-control-server"
sudo "PATH=$PATH" python -m pip install -r requirements.txt
sudo "PATH=$PATH" python setup.py install
sh scripts/start_db.sh
python bin/dci-dbinit
FILES_UPLOAD_FOLDER=/tmp/dci-control-server python bin/dci-runtestserver &
bin/dci-db-restore
popd
npm install
npm run build
npm start &
sleep 10
curl -u admin:admin http://localhost:5000/api/v1/jobs
curl http://localhost:8000/
