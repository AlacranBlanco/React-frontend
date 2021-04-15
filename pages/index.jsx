import Layout from '../components/Layout'
import {useQuery, gql} from '@apollo/client'
import PrivateRoute from '../components/PrivateRoute'
import Loading from '../components/Loading'
import Link from 'next/link'
import Cliente from '../components/Cliente'

const GET_CLIENTES_USUARIO = gql`
  query obtenerCliente{
    obtenerCliente{
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;
const Index = () => {

  // Otener Clientes
  const {data, loading, errors} = useQuery(GET_CLIENTES_USUARIO);
  

  if(loading) return <Loading/>;
  
  return data.obtenerCliente ? (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray font-light">Clientes</h1>
        <Link href="nuevoscliente">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo cliente</a>
        </Link>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Empresa</th>
              <th className="w-1/5 py-2">Email</th>
              <th className="w-1/5 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
          {data.obtenerCliente.map(cliente => (
              <Cliente key={cliente.id} cliente = {cliente}/>
          ))}
          </tbody>
        </table>
      </Layout>
    </div>
  ) : null
}

export default PrivateRoute(Index)
