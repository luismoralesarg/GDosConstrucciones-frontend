import React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

//Views Components
import Home from './components/views/home/Home';
import FormEgresos from './components/views/egresos/FormEgresos';
import FormIngresos from './components/views/ingresos/FormIngresos';
import NavbarComponent from './components/marco/navbar/Navbar';
import Proyectos from './components/views/proyectos/Proyectos';
import FormProyectos from './components/views/proyectos/FormProyectos';

//Hooks
import { useUser } from './hooks/useUser';

const Routers = () => {
    const { user } = useUser();
    console.log(user);

    return (
        <BrowserRouter>
            <NavbarComponent />
            <Container>
                <Route exact path="/" render={() => {
                    return (
                        user.token
                            ? (user.rango === 'admin'
                                ? <Proyectos />
                                : <FormEgresos />)
                            :
                            <Home />
                    )
                }} />

                {
                    user.rango === 'admin' ? 
                        <>
                            <Route exact path="/ingresar/egreso" component={FormEgresos} />
                            <Route exact path="/ingresar/ingreso" component={FormIngresos} />
                            <Route exact path="/ingresar/proyecto" component={FormProyectos} />
                        </>
                        : 
                        <Redirect to="/" /> 
                }
            </Container>

        </BrowserRouter>
    )
}

export default Routers;