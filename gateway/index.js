require("dotenv").config();
const { ApolloServerPluginCacheControl } = require("apollo-server-core");
const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway();

const server = new ApolloServer({
  gateway,
  // Subscriptions are not currently supported in Apollo Federation
  subscriptions: false,
  plugins: [
    ApolloServerPluginCacheControl({ calculateHttpHeaders: false }),
    {
      async requestDidStart() {
        console.log("request start");
        return {
          async willSendResponse(requestContext) {
            const { response, overallCachePolicy } = requestContext;
            console.log("overallCachePolicy", overallCachePolicy);
            const policyIfCacheable = overallCachePolicy.policyIfCacheable();
            console.log("policyIfCacheable", policyIfCacheable);
            if (policyIfCacheable && !response.headers && response.http) {
              response.http.headers.set(
                "cache-control",
                // ... or the values your CDN recommends
                `max-age=0, s-maxage=${
                  overallCachePolicy.maxAge
                }, ${policyIfCacheable.scope.toLowerCase()}`
              );
            }
          },
        };
      },
    },
  ],
});

server
  .listen(4000, "0.0.0.0")
  .then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
