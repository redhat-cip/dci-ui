set -ex
pushd "../dci-control-server"
sh scripts/start_db.sh
sh scripts/start_api.sh
python bin/dci-dbprovisioning
popd
npm install
npm run build
npm start &
