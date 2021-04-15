import React from 'react'
import Swal from 'sweetalert2';
import {useMutation, gql} from '@apollo/client'
import Router  from 'next/router';


const ELIMINAR_CLIENTE = gql`
mutation eliminarCliente($id: ID!){
    eliminarCliente(id: $id)
  }
`;

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

const Cliente = ({cliente}) => {
    const {nombre, apellido, empresa, email, id} = cliente;

    // Mutación
    const [eliminarCliente ] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            const {obtenerCliente} = cache.readQuery({query: GET_CLIENTES_USUARIO});
            


            cache.writeQuery({
                query: GET_CLIENTES_USUARIO,
                data: {
                    obtenerCliente : obtenerCliente.filter(item => item.id !==  id)
                }
            })
        }
    });

    // Eliminar cliente
    const eliminarClienteId = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
          }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const {data} = await eliminarCliente({
                        variables: {
                            id
                        }
                    });
                   
                    Swal.fire(
                        'Deleted!',
                        `${data.eliminarCliente}`,
                        'success'
                      )

                } catch (error) {
                   console.log(error);
                }
              
            }
          });
    }

    const editarCliente = () => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: {id}
        })
    }

    return (
        <tr>
            <td className="border px-4 py-2">{nombre} {apellido}</td>
            <td className="border px-4 py-2">{empresa} </td>
            <td className="border px-4 py-2">{email} </td>
            <td className="border px-4 py-2">
                <div className="flex flex-row space-x-2">
                    <button
                        type="button"
                        className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                        onClick={() => eliminarClienteId()}
                        >
                        Eliminar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                        onClick={() => editarCliente()}
                        >
                        Editar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                </div>
            </td>
           
        </tr>
    )
}

export default Cliente
