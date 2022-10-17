import {Layout} from 'antd';
import React, {Suspense} from 'react';
import {Outlet} from 'react-router-dom';

const {Header, Content} = Layout;
import './App.scss'
import {HashRouter} from "react-router-dom";
import IMenu from "./layouts/IMenu";

const App = props => {

    console.log(props);

    return <Layout>
        <Header
            style={{
                position: 'fixed',
                zIndex: 1,
                width: '100%',
            }}
        >
            <div className="logo"/>
            <IMenu/>
        </Header>
        <Content className="site-layout">
            <div className="site-layout-background">
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Outlet/>
                </Suspense>
            </div>
        </Content>
    </Layout>
};

export default App;