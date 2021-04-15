import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client'
import fetch from 'node-fetch'
import {setContext} from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
    fetch
});

const authLink = setContext((_, {headers}) => {

    const token = localStorage.getItem('token')
    
    return {
        headers: {
            ...headers,
            authorization: token
        }
    }
});



const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
        obtenerCliente: {
            merge(existing, incoming) {
              return incoming;
            }
        }
      }
    }
  }
});


const client = new ApolloClient({
    connectToDevTools: true,
    cache,
    link: authLink.concat(httpLink)
});

export default client;