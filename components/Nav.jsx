import React, { useState } from 'react';
import { ReactComponent as Bars} from './svgs/solid/bars.svg';

export default function (props) {
  const [sClassName, setsClassName] = useState("w3-sidebar w3-bar-block w3-black w3-card w3-animate-left w3-hide-medium w3-hide-large hidden");
  function toggle() {
    if (sClassName.includes("hidden")) {
      setsClassName(sClassName.replace(" hidden", ""));
    } else {
      setsClassName(sClassName + " hidden");
    }
  }
  let sLogo = props.navData.text;
  if(props.navData.text[0] == '/'){
    sLogo = <img src={props.navData.text} alt="logo" />
  }
  return (
    <nav>
      {/*<!-- Navbar (sit on top) -->*/}
      <div id="navTop">
        <a id="navHome" href={props.navData.to}>
          {sLogo}
        </a>
        {/*<!-- Right-sided navbar links -->*/}
        <div>
          {props.navData.items.map((item, key) => (
            <a key={key} href={item.to}>
              {item.text}
            </a>
          ))}
        </div>
        {/*<!-- Hide right-floated links on small screens and replace them with a menu icon -->*/}

        <a
          id="navOpenSide"
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
        <a
          id="navSideClose"
          href="#"
          onClick={toggle}
        ></a>
        {props.navData.items.map((item,key) => (
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
