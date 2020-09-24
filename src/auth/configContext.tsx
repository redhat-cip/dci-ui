import React, { useEffect } from "react";
import pages from "../pages";
import http from "../services/http";
import { useDispatch } from "react-redux";
import { setConfig } from "../config/configActions";

export type configProps = {
  apiURL: string;
  sso: {
    url: string;
    realm: string;
    clientId: string;
  };
};

type ConfigContextProps = {
  isLoadingConfig: boolean;
  config: configProps;
};

const ConfigContext = React.createContext({} as ConfigContextProps);

const getConfig: () => Promise<configProps> = async () => {
  return http
    .get(`${process.env.PUBLIC_URL}/config.json`)
    .then((response) => response.data);
};

const fallbackConfig = {
  apiURL: "https://api.distributed-ci.io",
  sso: {
    url: "https://sso.redhat.com",
    realm: "redhat-external",
    clientId: "dci",
  },
};

type ConfigProviderProps = {
  children: React.ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  const dispatch = useDispatch();
  const [state, setState] = React.useState<ConfigContextProps>({
    isLoadingConfig: true,
    config: fallbackConfig,
  });

  useEffect(() => {
    (async () => {
      try {
        const config = await getConfig();
        dispatch(setConfig(config));
        setState({ config, isLoadingConfig: false });
      } catch (e) {
        setState({ config: fallbackConfig, isLoadingConfig: false });
      }
    })();
  }, [dispatch]);

  return (
    <ConfigContext.Provider value={state}>
      {state.isLoadingConfig ? <pages.NotAuthenticatedLoadingPage /> : children}
    </ConfigContext.Provider>
  );
}

const useConfig = () => React.useContext(ConfigContext);

export { ConfigProvider, useConfig };
