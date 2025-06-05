import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../controller/AuthProvider';

const PrivateRoute = ({ component: Component }) => {
    const { token } = useAuth();

    return token ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;