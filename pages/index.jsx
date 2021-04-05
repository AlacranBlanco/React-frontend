import Layout from '../components/Layout'
import {useQuery, gql} from '@apollo/client'
import PrivateRoute from '../components/PrivateRoute';
import Loading from '../components/Loading';

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

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Empresa</th>
              <th className="w-1/5 py-2">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white">
              {data.obtenerCliente.map(cliente => (
                <tr key={cliente.id}>
                  <td className="border px-4 py-2">{cliente.nombre} {cliente.apellido}</td>
                  <td className="border px-4 py-2">{cliente.empresa}</td>
                  <td className="border px-4 py-2">{cliente.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    </div>
  ) : null
}

export default PrivateRoute(Index)
