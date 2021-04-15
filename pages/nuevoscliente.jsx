import React from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {useMutation, gql} from '@apollo/client'
import { useRouter } from 'next/router'

const NUEVO_CLIENTE = gql`
mutation nuevoCliente($input: ClienteInput){
    nuevoCliente(input: $input){
      id
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

const nuevoscliente = () => {

    //  Router
    const router = useRouter();

    // State para el mensaje a mostrar al usuario
    const [mensaje, setMensaje] = React.useState(null);

    // Mutation para crear el nuevo cliente
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
        update(cache, {data: {nuevoCliente}}) {
            // Obtener el objeto de ache que deseamos actualizar
            const {obtenerCliente} = cache.readQuery({query: GET_CLIENTES_USUARIO});
            // Reescribimos el cache
            cache.writeQuery({
                query: GET_CLIENTES_USUARIO,
                data: {
                    obtenerCliente :  [...obtenerCliente, nuevoCliente]
                }
            })

        }
    });

    // Validación del formulario con formik
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            empresa: Yup.string().required('La empresa es obligatorio'),
            email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
            telefono : Yup.string().required('El teléfono es obligatorio')
        }),
        onSubmit: async (values, {resetForm}) => {
            try {
                const {data}  = await nuevoCliente({
                    variables: {
                        input: {...values}
                    }
                });
                
                // Mensaje al usaurio sobre el estado del registro
                setMensaje(`Se creo correctamente el Cliente ${data.nuevoCliente.nombre +' '+ data.nuevoCliente.apellido}`)
                router.push('/');


            } catch (error) {
                resetForm();
                setMensaje(error.message.replace('GraphQL error: ', ''))
                setTimeout(() => {
                    setMensaje(null);
                }, 3000)
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
       <Layout>
          <h1 className="text-2xl text-gray font-light">Nuevo Cliente</h1>
          {
               mensaje && mostrarMensaje()
          }
          <div className="flex justify-center mt-5">
              <div className="w-full max-w-lg">
                  <form onSubmit={formik.handleSubmit} 
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  >
                       <div className="mb-4">
                            <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="nombre">
                                Nombre
                            </label>
                                <input 
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.nombre}
                                type="text" 
                                id="nombre"
                                placeholder="Nombre Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        {
                            formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                    <p className="font-bold">  
                                        Error
                                    </p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null
                        }
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="apellido">
                                Apellido
                            </label>
                                <input 
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.apellido}
                                type="text" 
                                id="apellido"
                                placeholder="Apellido Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        {
                            formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                    <p className="font-bold">  
                                        Error
                                    </p>
                                    <p>{formik.errors.apellido}</p>
                                </div>
                            ) : null
                        }
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="empresa">
                                Empresa
                            </label>
                                <input 
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.empresa}
                                type="text" 
                                id="empresa"
                                placeholder="Empresa Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        {
                            formik.touched.empresa && formik.errors.empresa ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                    <p className="font-bold">  
                                        Error
                                    </p>
                                    <p>{formik.errors.empresa}</p>
                                </div>
                            ) : null
                        }
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="email">
                                Email
                            </label>
                                <input 
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                type="email" 
                                id="email"
                                placeholder="Email Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        {
                            formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                    <p className="font-bold">  
                                        Error
                                    </p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null
                        }
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="telefono">
                                Teléfono
                            </label>
                                <input 
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.telefono}
                                type="tel" 
                                id="telefono"
                                placeholder="Teléfono Cliente"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        {
                            formik.touched.telefono && formik.errors.telefono ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                    <p className="font-bold">  
                                        Error
                                    </p>
                                    <p>{formik.errors.telefono}</p>
                                </div>
                            ) : null
                        }
                        <input type="submit" 
                        className="bg-gray-800 w-full mt-5 py-2 text-white uppercase font-bold hover:bg-gray-900"
                        value="Registrar Cliente"
                        >
                        </input>
                  </form>
              </div>
          </div>
       </Layout>
    )
}

export default nuevoscliente
