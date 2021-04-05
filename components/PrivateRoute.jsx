import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, gql} from '@apollo/client'
import Loading from './Loading';
export default function PrivateRoute(Component) {
  return () => {
    
    const GET_USUARIO = gql`
      query obtenerUsuario{
          obtenerUsuario{
            id
            nombre
            apellido
          }
        }
      `;

    const router = useRouter();
    const {data, loading} = useQuery(GET_USUARIO)


    
   useEffect(() => {
      if(loading) return <Loading />
      if(!data.obtenerUsuario) router.push('/login');
    }, [data, loading])

    return <Component {...arguments} />
  }
}