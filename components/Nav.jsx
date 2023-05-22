import React, { useState } from 'react';
import Styled from 'styled-components';
import { ReactComponent as Bars} from './svgs/solid/bars.svg';

export default function (props) {
  const [sClassName, setsClassName] = useState("w3-sidebar w3-bar-block w3-black w3-card w3-animate-left w3-hide-medium w3-hide-large w3-hide");
  function toggle() {
    if (sClassName.includes("w3-hide")) {
      setsClassName(sClassName.replace(" w3-hide", ""));
    } else {
      setsClassName(sClassName + " w3-hide");
    }
  }
  return (
    <nav>
      {/*<!-- Navbar (sit on top) -->*/}
      <div id="NavTop">
        <a id="NavHome" href={props.data.to}>
          {props.data.logo}
        </a>
        {/*<!-- Right-sided navbar links -->*/}
        <div id="TopMenu">
          {props.data.items.map((item, key) => (
            <a key={key} href={item.to}>
              {item.text}
            </a>
          ))}
        </div>
        {/*<!-- Hide right-floated links on small screens and replace them with a menu icon -->*/}

        <a id="NavOpenSide"
          href="#"
          onClick={toggle}
        >
          <Bars />
        </a>
      </div>

      {/*<!-- Sidebar on small screens when clicking the menu icon -->*/}
      <div id='navSide'
        className={sClassName}
      >
        <a id="NavSideClose"
          href="#"
          onClick={toggle}
        >{props.data.close} ×</a>
        {props.data.items.map((item,key) => (
          <a key={key}
            href={item.to}
            onClick={toggle}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
