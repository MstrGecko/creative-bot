import * as React from 'react';
import { useContext, Component, useState, useEffect, useRef } from 'react';
import { theme, useComponentVisible } from '../../helpers';

import { MenuItem } from './index';
import { ContextMenu, ContextItem } from './../ContextMenu/index';

const Window: any = window;
const { ipcRenderer, shell, remote } = Window.require('electron');

const styles: any = require('./MenuBar.scss');


interface MenuBar {
    hidden?: Boolean,
    action?: any,
    menuItem: MenuItem
}

const MenuBarItem = ({menuItem, hidden = true, action} : MenuBar) => {

    const [stateTheme, setStateTheme] = useState(theme.dark);
    const [show, showMenu] = useState<Boolean>(false);

    const {
        ref,
        isComponentVisible,
        setIsComponentVisible
      } = useComponentVisible(show);

    const showContextMenu = () => {
        if (show) {
            showMenu(false);
        } else {
            showMenu(true);
        }
    }

    remote.getCurrentWindow().once('blur', function(event, args) { 
        setIsComponentVisible(false);
    });

    return (

            <li ref={ref} className={styles.menuItem} style={isComponentVisible ? stateTheme.menuItemSelected : null }>
                <div className={styles.menuItemTitleContainer} onClick={() => setIsComponentVisible(true)}>
                    <div className={styles.menuItemTitle}>{menuItem.title}</div>
                </div>
                {isComponentVisible && (<ContextMenu contextItems={menuItem.contextMenu} onClickedOutside={() => setIsComponentVisible(false)}/>)}
            </li>
     );
}

/*<ClickOutside onClickedOutside={() => {showMenu(false);}}>
                    {show === true && <ContextMenu contextItems={menuItem.contextMenu} />}
</ClickOutside>*/

export {MenuBarItem}