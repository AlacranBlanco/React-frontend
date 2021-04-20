import React from 'react'
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import {useQuery, useMutation, gql} from '@apollo/client'
import Loading from '../../components/Loading';
import  {Formik}  from 'formik';
import * as Yup from 'yup'
import Swal from 'sweetalert2';


const GET_CLIENTE_ID = gql`
query obtenerClientId($id: ID!){
    obtenerClientId(id:$id){
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
  }
`;

const EDITAR_CLIENTE = gql`
mutation actualizarCliente($id: ID!, $input: ClienteUpdateInput){
    actualizarCliente(id:$id, input: $input){
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
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

const EditarCliente = (props) => {

    // State para el mensaje a mostrar al usuario
    const [mensaje, setMensaje] = React.useState(null);

    // Mutation
    const [actualizarCliente] = useMutation(EDITAR_CLIENTE, { 
        
        update(cache,{data : {actualizarCliente}}) {
            const {obtenerCliente} = cache.readQuery({query: GET_CLIENTES_USUARIO});
            
        cache.writeQuery({
            query: GET_CLIENTES_USUARIO,
            data: { 
                obtenerCliente : obtenerCliente.map(item => item.id === id ? actualizarCliente : item)
            }
        });


        cache.writeQuery({
            query: GET_CLIENTE_ID,
            variables: {id},
            data: {
                obtenerClientId: actualizarCliente
            }
        });

    }
});
        const router = useRouter();
        let {id} = props;
        console.log(props);
        

    

    const {loading, data} = useQuery(GET_CLIENTE_ID, {
        variables: {
            id
        }
    });

    // Schema de validación
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        apellido: Yup.string().required('El apellido es obligatorio'),
        empresa: Yup.string().required('La empresa es obligatorio'),
        email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
        telefono : Yup.string().required('El teléfono es obligatorio')
    });

    if(loading) return <Loading />
    

    let {obtenerClientId} = data;
    const editarCliente = async (values) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel'
          }).then( async (result) => {
            if (result.isConfirmed) {
                const {nombre, apellido, empresa, email, telefono} = values;
                try {
                    await actualizarCliente({
                        variables: {
                            id,
                            input: {
                                nombre,
                                apellido,
                                empresa,
                                email,
                                telefono
                            }
                        }
                    })
                    Swal.fire(
                        'Updated!',
                        'User updated',
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed) {
                            router.push('/');

                        }
                    });
        
                    
                } catch (error) {
                    console.log(error);
                }
              
            }
          });
    }

   

    return (
        <Layout>
            <h1 className="text-2xl text-gray font-light">Editar Cliente</h1>
            <div className="flex justify-center mt-5">
              <div className="w-full max-w-lg">
            <Formik
                validationSchema={schemaValidacion}
                enableReinitialize
                initialValues={obtenerClientId}
                onSubmit={(values, functions) => editarCliente(values)}
            >
                {props => {
                    return (
                        <form onSubmit={props.handleSubmit} 
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        >
                            <div className="mb-4">
                                    <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="nombre">
                                        Nombre
                                    </label>
                                        <input 
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.nombre}
                                        type="text" 
                                        id="nombre"
                                        placeholder="Nombre Cliente"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                                </div>
                                {
                                    props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                            <p className="font-bold">  
                                                Error
                                            </p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null
                                }
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="apellido">
                                        Apellido
                                    </label>
                                        <input 
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.apellido}
                                        type="text" 
                                        id="apellido"
                                        placeholder="Apellido Cliente"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                                </div>
                                {
                                    props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                            <p className="font-bold">  
                                                Error
                                            </p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                    ) : null
                                }
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="empresa">
                                        Empresa
                                    </label>
                                        <input 
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.empresa}
                                        type="text" 
                                        id="empresa"
                                        placeholder="Empresa Cliente"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                                </div>
                                {
                                    props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                            <p className="font-bold">  
                                                Error
                                            </p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) : null
                                }
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="email">
                                        Email
                                    </label>
                                        <input 
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.email}
                                        type="email" 
                                        id="email"
                                        placeholder="Email Cliente"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                                </div>
                                {
                                    props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                            <p className="font-bold">  
                                                Error
                                            </p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ) : null
                                }
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="telefono">
                                        Teléfono
                                    </label>
                                        <input 
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.telefono}
                                        type="tel" 
                                        id="telefono"
                                        placeholder="Teléfono Cliente"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                                </div>
                                {
                                    props.touched.telefono && props.errors.telefono ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                            <p className="font-bold">  
                                                Error
                                            </p>
                                            <p>{props.errors.telefono}</p>
                                        </div>
                                    ) : null
                                }
                                <input type="submit" 
                                className="bg-gray-800 w-full mt-5 py-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Editar Cliente"
                                >
                                </input>
                        </form>
                        )
                    }}
            </Formik>
              </div>
          </div>

        </Layout>
    ) 
}



export default EditarCliente