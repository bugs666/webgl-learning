import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import {Routes, HashRouter, Route} from "react-router-dom";
import routes from "./core/route.config";
import loadable from '@loadable/component';

const root = ReactDOM.createRoot(document.getElementById('root'));

const getRoutes = () => {
    return routes.reduce((initialVal, route) => {
        const {children, path = '', compUrl = ''} = route;
        if (path) {
            return [
                ...initialVal,
                <Route path={path} component={loadable(() => import(compUrl))}/>
            ]
        }
        let childRoutes = children.map(child => {
            return <Route path={child.path} component={loadable(() => import(child.compUrl))}/>
        });
        return [...initialVal, ...childRoutes];
    }, []);
}


root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path='/' component={App}/>
                {getRoutes()}
            </Routes>
        </HashRouter>
    </React.StrictMode>
);
