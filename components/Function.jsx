import React from 'react';
import JSONPretty from 'react-json-pretty';
import { useState, useEffect } from 'react';

export default function Function(props) {
  const [theData, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const theData = await props.function(...args);
      setData(theData);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);
  if (!theData) return <div>Loading...</div>;
  const args = props.args[0].args;
  const formatter = (arg, i) => {
    let theOutput = '';
    if (i > 0) {
      theOutput += ', ';
    }
    theOutput += JSON.stringify(arg);
    return theOutput;
  };
  return (
    <>
      {props.function.name}(
      {args.map((arg) => (
        <>{formatter(arg)}</>
      ))}
      )<p>Results:</p>
      <JSONPretty id="json-pretty" data={theData}></JSONPretty>
    </>
  );
}