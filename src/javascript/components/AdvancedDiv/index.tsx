import * as React from 'react';
import { useState, useEffect } from 'react';

interface IProps {
  aStyle?: {};
  aClassName?: string;
  className?: string;
  hoverClassName?: string;
  style?: {};
  hoverStyle?: {};
  isButton?: Boolean;
  buttonStyle?: {};
  children: any;
}

export const AdvancedDiv = (props: IProps) => {
  const {
    aStyle = {},
    aClassName = '',
    className = '',
    hoverClassName = '',
    style = {},
    hoverStyle = {},
    isButton = false,
    buttonStyle = {}
  } = props;
  const [hover, setHover] = useState(false);

  if (!props.children) throw new Error('AdvancedDiv needs a child element!');

  if (!!props.children && !!props.children.length)
    throw new Error('AdvancedDiv can only have one child element!');

  return (
    <div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      style={Object.assign({}, isButton ? buttonStyle : null, aStyle)}
      className={aClassName}
    >
      {React.cloneElement(props.children, {
        isHovering: hover,
        className: `${className} ${hover ? hoverClassName : ''}`,
        style: Object.assign({}, style, hover ? hoverStyle : {})
      })}
    </div>
  );
};
