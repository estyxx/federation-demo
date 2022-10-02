import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";

function MyApp({ Component, pageProps }: AppProps) {
  // console.log(client)
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
