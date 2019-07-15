import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import { MdSend, MdPerson, MdMood, MdFace } from 'react-icons/md';

import { Message } from './Message';
import { firebaseConfig$, setRxConfig } from '../../helpers/rxConfig';
import { Action } from 'rxjs/internal/scheduler/Action';

import { SegmentControl, SegmentControlSource } from '../SegmentControl/index';
import { Toggle, ToggleType } from '../Generics/Toggle';
import { Panel } from '../Generics/Panel';
import { Button, DestructiveButton, ActionButton } from '../Generics/Button';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Chat.scss');
const segStyles: any = require('../SegmentControl/SegmentControl.scss');

interface popup {
  styles: any;
  stateTheme: any;
  text?: string | Function | Element | any;
  Config?: any;
  closeCurrentPopup: Function | any;
}

const AccountsPopup = ({
  styles,
  stateTheme,
  text = '',
  Config = {},
  closeCurrentPopup
}: popup) => {
  const [config, setConfig] = useState(Config);
  const [authKey, setAuthKey] = useState(config.authKey || '');

  useEffect(() => {
    let listener = firebaseConfig$.subscribe((data: any) => {
      delete data.first;
      setConfig(data);
    });
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const saveToDB = tConfig => {
    setRxConfig(tConfig);
  };

  const needRestart = () => {
    return config.authKey !== authKey;
  };

  return (
    <div className={`${styles.popup}`}>
      <h2>Account Settings</h2>
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        {!!config.authKey ? (
          <DestructiveButton 
            title={"Reconnect Bot Account"} 
            stateTheme={stateTheme} 
            onClick={() => {
              let tconfig = Object.assign({}, config);
              delete tconfig.authKey;
              setConfig(tconfig);
              // setTimeout(() => {
              //   closeCurrentPopup();
              // }, 50);
            }} />
        ) : null}
        {!config.ported ? (
          <ActionButton 
            title={"Import Old Users (1.5 and Older)"} 
            stateTheme={stateTheme}  
            onClick={() => {
              ipcRenderer.send('getAllOldData');
              if (needRestart()) {
                saveToDB(config);
                setTimeout(() => {
                  ipcRenderer.send('shutdown');
                }, 250);
              }
              closeCurrentPopup();
            }} />
        ) : null}
      </div>
      <Button 
        title={"Close"} 
        isSubmit={true} 
        stateTheme={stateTheme}  
        onClick={() => {
            // Check to see if a change has happened
            if (needRestart()) {
              saveToDB(config);
              setTimeout(() => {
                ipcRenderer.send('shutdown');
              }, 250);
            }
            closeCurrentPopup();
          }} />
      {needRestart() ? (
        <i style={{ marginTop: '5px' }}>Bot will need to be restarted...</i>
      ) : null}
    </div>
  );
};

export { AccountsPopup };