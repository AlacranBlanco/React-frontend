import React from 'react'
import Layout from '../components/Layout'
import PrivateRoute from '../components/PrivateRoute'

const productos = () => {
    return (
        <div>
             <Layout>
             <h1 className="text-2xl text-gray font-light">Productos</h1>
            </Layout>
        </div>
    )
}

export default PrivateRoute(productos)
