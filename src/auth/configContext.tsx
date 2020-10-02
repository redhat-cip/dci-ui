import React, { useEffect, useState } from "react";
import pages from "../pages";
import http from "../services/http";
import { useDispatch } from "react-redux";
import { setConfig as setConfigAction } from "../config/configActions";
import { IConfig } from "types";

interface ConfigContextProps {
  config: IConfig;
}

const ConfigContext = React.createContext({} as ConfigContextProps);

const getConfig: () => Promise<IConfig> = () => {
  return http
    .get(`${process.env.PUBLIC_URL}/config.json`)
    .then((response) => response.data);
};

type ConfigProviderProps = {
  children: React.ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [config, setConfig] = useState<IConfig>({
    apiURL: "https://api.distributed-ci.io",
    sso: {
      url: "https://sso.redhat.com",
      realm: "redhat-external",
      clientId: "dci",
    },
  });
  const dispatch = useDispatch();
  useEffect(() => {
    getConfig()
      .then((config) => {
        setConfig(config);
        dispatch(setConfigAction(config)); // todo(gvincent): remove me
      })
      .catch(console.error)
      .then(() => setIsLoadingConfig(false));
  }, [dispatch]);
  if (isLoadingConfig) {
    return <pages.NotAuthenticatedLoadingPage />;
  }
  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
}

const useConfig = () => React.useContext(ConfigContext);

export { ConfigProvider, useConfig };
