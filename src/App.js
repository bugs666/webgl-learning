import {Layout} from 'antd';
import React from 'react';

const {Header, Content} = Layout;
import './App.scss'
import {HashRouter} from "react-router-dom";
import IMenu from "./layouts/IMenu";

const App = () => (
    <Layout>
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
                Content
            </div>
        </Content>
    </Layout>
);

export default App;