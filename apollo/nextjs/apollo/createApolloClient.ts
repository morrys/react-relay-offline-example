import {HttpLink} from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import ApolloClientIDB from '@wora/apollo-offline/lib/ApolloClientIDB';

let apolloClient: any = null;

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
export function initApolloClient(initialState?: any) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  // Reuse client on the client-side
  if (!apolloClient || typeof window === 'undefined') {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
export function createApolloClient(initialState = {}) {
  const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql',
  });

  const cacheOptions = {
    dataIdFromObject: o => o.id,
  };

  const persistOptions = {
    initialState,
  };

  const client = ApolloClientIDB.create(
    {
      link: httpLink,
    },
    {
      cacheOptions,
      persistOptions,
    },
  );
  /*
  const client = new ApolloClient({
    link: httpLink,
    cache: new ApolloCache(cacheOptions, cachePersistOption),
  });*/

  client.setOfflineOptions({
    manualExecution: false, //optional
    link: httpLink, //optional
    start: async mutations => {
      //optional
      console.log('start offline', mutations);
      return mutations;
    },
    finish: async (mutations, error) => {
      //optional
      console.log('finish offline', error, mutations);
    },
    onExecute: async mutation => {
      //optional
      console.log('onExecute offline', mutation);
      return mutation;
    },
    onComplete: async options => {
      //optional
      console.log('onComplete offline', options);
      return true;
    },
    onDiscard: async options => {
      //optional
      console.log('onDiscard offline', options);
      return true;
    },
    onPublish: async offlinePayload => {
      //optional
      console.log('offlinePayload', offlinePayload);
      return offlinePayload;
    },
  });
  return client;
}
