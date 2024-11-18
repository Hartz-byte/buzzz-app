import React, { ReactNode } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Define the props type to include children
interface ApolloClientSetupProps {
  children: ReactNode;
}

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

const ApolloClientSetup: React.FC<ApolloClientSetupProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientSetup;
