import logo from './logo.svg';
import './App.css';
import {get, post} from './APIInterface/Utils';
import React from "react";
import { searchForMedia } from './APIInterface/MediaManagement';

function App() {

  const [test, setTest] = React.useState(undefined);
  React.useEffect(() => {
    searchForMedia('Avengers').then((res) => {
      console.log(res);
    })
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {test ? test : ''}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
