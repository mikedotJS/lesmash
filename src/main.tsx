import * as React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme as chakraProTheme } from "@chakra-ui/pro-theme";

import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { App } from "./App";
import "./fonts.css";

const proTheme = extendTheme({
  ...chakraProTheme,
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});
const config = {
  colors: { ...proTheme.colors, brand: proTheme.colors.teal },
};

const theme = extendTheme(config, proTheme);

const client = new Client({
  url: "https://api.start.gg/gql/alpha",
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = import.meta.env.VITE_STARTGG_API_TOKEN;

    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

const rootElement: HTMLElement | null = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <Provider value={client}>
          <App />
        </Provider>
      </ChakraProvider>
    </React.StrictMode>
  );
}
