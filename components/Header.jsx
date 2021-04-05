import React from 'react'
import {useQuery, gql} from '@apollo/client'
import {useRouter} from 'next/router'
import PrivateRoute from './PrivateRoute';
import Loading from './Loading';

const GET_USUARIO = gql`
query obtenerUsuario{
    obtenerUsuario{
      id
      nombre
      apellido
    }
  }
`;

const Header = () => {

    const {data, loading, errors} = useQuery(GET_USUARIO);
    
    const router = useRouter();
    
    let nombre;
    let apellido;
    
    // Controlar el flujo con loading
    if(loading) return <Loading/>;


    if(data.obtenerUsuario){
       nombre = data.obtenerUsuario.nombre;
       apellido = data.obtenerUsuario.apellido; 
    }
    

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login')
    }


    return data.obtenerUsuario ? (
        <div className="flex justify-between mb-6">
            <p className="mr-2">Hola: {nombre} {apellido}</p>
            <button 
            onClick={() => cerrarSesion()}
            className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
            type="button">
                Cerrar Sesión
            </button>
        </div>
    ) : null
}

export default PrivateRoute(Header)
