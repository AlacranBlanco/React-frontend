import React from 'react'
import Layout from '../components/Layout'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useMutation, gql} from '@apollo/client'
import {useRouter} from 'next/router'

const AUTH_USER = gql`
mutation autenticarUsuario($input: AutenticarInput){
    autenticarUsuario(input: $input){
      token
    }
  }
`;

const login = () => {


    // State para el mensaje
    const [mensaje, setMensaje] = React.useState(null);

    // Query para validar el usuario
    const [autenticarUsuario] = useMutation(AUTH_USER);

    // Routing
    const router = useRouter();

    // Validación del formulario
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio')
        }),
        onSubmit: async values => {
            const { email, password } = values;
            try {
                const {data} = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })
                // Guardar el token en localStorage
                const {token} = data.autenticarUsuario;
                localStorage.setItem('token', token);
                router.push('/')

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
                    <h1 className="text-center text-2xl text-white font-light">Login</h1>
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-sm">
                            <form onSubmit={formik.handleSubmit} className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
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
                                       Password
                                    </label>
                                   <input 
                                       onBlur={formik.handleBlur}
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
                               value = "Iniciar Sesión"/>
                            </form>
                        </div>
                    </div>
            </Layout>
        </>
    )
}

export default login
