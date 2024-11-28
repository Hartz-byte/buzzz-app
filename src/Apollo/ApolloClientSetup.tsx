import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { ReactNode } from "react";

// Define the props type to include children
interface ApolloClientSetupProps {
  children: ReactNode;
}

const httpLink = createHttpLink({
  uri: "https://buzzz-server.vercel.app/graphql",
  // uri: "http://localhost:3000/graphql",
  credentials: "include",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("auth_token");

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const ApolloClientSetup: React.FC<ApolloClientSetupProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientSetup;
