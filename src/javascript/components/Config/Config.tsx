import * as React from 'react';
import { useState } from 'react';

import { ModBox } from './ModBox';
import { BannedBox } from './BannedBox';

import { MdModeEdit } from 'react-icons/md';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');
import { setRxConfig } from '../../helpers/rxConfig';

const Popup = ({
  configOption,
  styles,
  closeCurrentPopup,
  stateTheme,
  config
}) => {
  const [value, setValue] = useState<string>(configOption.value.toString());

  return (
    <div className={styles.popup} style={stateTheme.main}>
      <h1>{configOption.name}</h1>
      <textarea
        className={styles.input}
        onChange={e => {
          setValue(e.target.value);
        }}
        value={value}
      />
      <div
        className={styles.submit}
        onClick={() => {
          let Config = Object.assign({}, config);
          switch (configOption.type) {
            case 'number':
              Config[configOption.key] = Number(value);
            default:
              Config[configOption.key] = value;
          }
          setRxConfig(Config);
          closeCurrentPopup();
        }}
      >
        SAVE
      </div>
    </div>
  );
};

const updateConfigOption = (
  option,
  styles,
  closeCurrentPopup,
  stateTheme,
  addPopup,
  config
) => {
  console.log('UPDATE CONFIG OPTION', closeCurrentPopup);
  addPopup(
    <Popup
      configOption={option}
      styles={styles}
      closeCurrentPopup={closeCurrentPopup}
      stateTheme={stateTheme}
      config={config}
    />
  );
};

const Config = ({
  styles,
  configOption,
  nth,
  stateTheme,
  addPopup,
  closeCurrentPopup,
  config
}) => {
  const [hidden, setHidden] = useState<boolean>(!!configOption.hidden);

  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.chat.message,
        nth % 2 ? stateTheme.chat.message.alternate : {}
      )}
    >
      <div className={styles.toggle_wrappers}>
        <div className={styles.username}>{configOption.name}</div>
        <div
          className={styles.value}
          onClick={() => {
            if (!configOption.hidden) return;
            setHidden(!hidden);
          }}
        >
          {hidden ? 'HIDDEN, CLICK TO SHOW' : configOption.value}
        </div>
        <div className={styles.edit}>
          <MdModeEdit
            onClick={() => {
              console.log('ON CLICK EDIT');
              updateConfigOption(
                configOption,
                styles,
                closeCurrentPopup,
                stateTheme,
                addPopup,
                config
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { Config };
