import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const GRAPHQL_FEDERATION_API = process.env.GRAPHQL_FEDERATION_API;
console.log("GRAPHQL_FEDERATION_API: ", GRAPHQL_FEDERATION_API);

export const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache({
    typePolicies: {
      Books: { keyFields: ["id"] },
    },
  }),
});
