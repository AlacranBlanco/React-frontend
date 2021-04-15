import React from 'react'
import {useRouter} from 'next/router'
import Layout from '../components/Layout'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const NUEVA_CUENTA = gql`
mutation nuevoUsuario($input: UsuarioInput){
    nuevoUsuario(input: $input){
      id
      nombre
      apellido
      email
    }
  }
`;

const nuevacuenta = () => {

    // State para el mensaje
    const [mensaje, setMensaje] = React.useState(null);


    // Mutation para crear nuevos usuario
    const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA);

    // Routing
    const router = useRouter();

    // Validación del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio').min(6, 'El password debe ser almenos de 6 carácteres')
        }),
        onSubmit: async values => {
            const {nombre, apellido, email, password} = values
            try {
                const {data} = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });
                console.log(data);
                // usuario creado correctamente
                setMensaje(`Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`);
                setTimeout(() => {
                    setMensaje(null);
                    router.push('/login')
                }, 3000);
                // Redirigir al usuario a iniciar sesión
            } catch (error) {
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
        <>
            
            <Layout>
                {
                    mensaje && mostrarMensaje()
                }
                    <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-sm">
                            <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                   <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="nombre">
                                        Nombre<span className="text-red-800">*</span>
                                   </label>
                                       <input 
                                       onBlur={formik.handleBlur}
                                       onChange={formik.handleChange}
                                       value={formik.values.nombre}
                                       type="text" 
                                       id="nombre"
                                       placeholder="Nombre Usuario"
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
                                        Apellido<span className="text-red-800">*</span>
                                   </label>
                                       <input 
                                       onChange={formik.handleChange}
                                       value={formik.values.apellido}
                                       type="text" 
                                       id="apellido"
                                       placeholder="Apellido Usuario"
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
                                   <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="email">
                                        Email<span className="text-red-800">*</span>
                                   </label>
                                       <input 
                                       onChange={formik.handleChange}
                                       value={formik.values.email}
                                       type="email" 
                                       id="email"
                                       placeholder="Email Usuario"
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
                               <div  className="mb-4">
                                   <label className="block text-gray-700 text-sm front-bold sm-2" htmlFor="password">
                                       Password<span className="text-red-800">*</span>
                                    </label>
                                   <input 
                                       onChange={formik.handleChange}
                                       value={formik.values.password}
                                       type="password" 
                                       id="password"
                                       placeholder="Password Usuario"
                                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                            
                               </div>
                               {
                                  formik.touched.password && formik.errors.password ? (
                                      <div className="my-2 bg-red-100 border-l-4 border-red-500 border-red-700 p-4">
                                          <p className="font-bold">  
                                              Error
                                          </p>
                                          <p>{formik.errors.password}</p>
                                      </div>
                                  ) : null
                               }
                               <input 
                               type="submit"
                               className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                               value = "Registrar"/>
                            </form>
                        </div>
                    </div>
            </Layout>
        </>
    )
}

export default nuevacuenta
