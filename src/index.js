import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import {Routes, HashRouter, Route} from "react-router-dom";
import routes from "./core/route.config";

const root = ReactDOM.createRoot(document.getElementById('root'));

const getRoutes = () => {
    return routes.reduce((initialVal, route) => {
        const {children, path = '', element = null} = route;
        if (path) {
            return [
                ...initialVal,
                <Route path={path} element={element} key={path} exact={true}/>
            ]
        }
        let childRoutes = children.map(child => {
            return <Route path={child.path} element={child.element} key={child.path} exact={true}/>
        });
        return [...initialVal, ...childRoutes];
    }, []);
}


root.render(
    <HashRouter>
        <Routes>
            <Route path='/' element={<App/>}>
                {getRoutes()}
            </Route>
        </Routes>
    </HashRouter>
);
