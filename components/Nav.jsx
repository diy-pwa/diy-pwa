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
  const NavTop = Styled.div`
    color: #000;
    background-color: #fff;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    overflow: hidden;
  `;
  const TopMenu = Styled.div`
    display: none;
    float: right;
    @media (min-width: 601px){
      display: inline-block;
    }
  `;
  const NavA = Styled.a`
    border: none;
    display: inline-block;
    padding: 8px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    background-color: inherit;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;

  `;
  const NavHome = Styled(NavA)`
    letter-spacing: 4px;
  `;
  const NavSideClose = Styled(NavA)`
    padding-top: 16px;
    padding-bottom: 16px;
    font-size: 18px;
  `;
  const NavOpenSide = Styled(NavA)`
    float: right;
    @media (min-width: 601px){
      display: none;
    }
  `;
  const NavOpenSideSvg = Styled(Bars)`
    height: 1em;
    padding-right: .5em;
  `;
  const NavSideA = Styled(NavA)`
    display: block;
    text-align: left;
  `;
  return (
    <nav>
      {/*<!-- Navbar (sit on top) -->*/}
      <NavTop>
        <NavHome href={props.data.to}>
          {props.data.logo}
        </NavHome>
        {/*<!-- Right-sided navbar links -->*/}
        <TopMenu>
          {props.data.items.map((item, key) => (
            <NavA key={key} href={item.to}>
              {item.text}
            </NavA>
          ))}
        </TopMenu>
        {/*<!-- Hide right-floated links on small screens and replace them with a menu icon -->*/}

        <NavOpenSide
          href="#"
          onClick={toggle}
        >
          <NavOpenSideSvg />
        </NavOpenSide>
      </NavTop>

      {/*<!-- Sidebar on small screens when clicking the menu icon -->*/}
      <div id='navSide'
        className={sClassName}
      >
        <NavSideClose
          href="#"
          onClick={toggle}
        >{props.data.close} ×</NavSideClose>
        {props.data.items.map((item,key) => (
          <NavSideA key={key}
            href={item.to}
            onClick={toggle}
          >
            {item.text}
          </NavSideA>
        ))}
      </div>
    </nav>
  );
}
