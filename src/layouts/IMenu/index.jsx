import React, {useState} from 'react';
import {Menu} from "antd";
import routes from "../../core/route.config";
import {useNavigate} from 'react-router-dom';

const IMenu = () => {

    let [currentKey, setCurrentKey] = useState('/');

    let navigate = useNavigate();

    const formatMenuItems = () => {
        let menus = routes.map(({name, children, path = ''}) => {
            if (!!children) {
                return {
                    label: name,
                    key: name,
                    children: children.map(child => {
                        return {
                            label: child.name,
                            key: child.path
                        }
                    })
                }
            }
            return {
                label: name,
                key: path
            }
        });
        menus = [{label: '首页', key: '/'}, ...menus];
        return menus;
    }

    const clickMenu = e => {
        setCurrentKey(e.key);
        navigate(e.key);
    }

    return <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[currentKey]}
        items={formatMenuItems()}
        onClick={clickMenu}
    />
}
export default IMenu;