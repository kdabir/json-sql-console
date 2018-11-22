import React, {Component} from 'react';
import './App.css';
import alasql from 'alasql';
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/mode/sql";
import "brace/theme/solarized_dark";
import "brace/ext/language_tools";

import QueryResults from "./QueryResults";

// storage wrapper, inspired by: https://survivejs.com/react/implementing-kanban/implementing-persistency/
const sw = storage => ({
  get() {
    try {
      return JSON.parse(storage.getItem('_app_state'));
    } catch (e) {
      return null;
    }
  },
  set(v) {
    storage.setItem("_app_state", JSON.stringify(v));
  }
});


class App extends Component {

  constructor(props) {
    super(props);
    this.store = sw(localStorage);
    this.state = this.store.get() || {json: '[]', sql: 'select * from ?'};
  }

  // whenever the component updates, store the state
  componentDidUpdate() {
    this.store.set(this.state)
  }

  update() {
    let json = this.refs.jsonEditor.editor.getValue(),
      sql = this.refs.sqlEditor.editor.getValue();

    // after state is updated, run the sql - https://reactjs.org/docs/react-component.html#setstate
    this.setState({json, sql}, this.runSql)
  }

  runSql() {
    this.setState({'results': null});
    this.validateJSON(this.state.json);
    console.log('running SQL...');
    try {
      const results = alasql(this.state.sql, [JSON.parse(this.state.json)]);
      console.table(results);
      this.setState({'parseError': null, results});
    } catch (e) {
      this.setState({'parseError': e.message, 'results': null});
    }
  }

  /**
   * This function will take a text input and checks if it is valid json
   * @param {String} jsonFile The json file entered by the user
   * @returns {Boolean} The determination if the file is valid json
   */
  validateJSON(jsonFile) {
    //first a quick way to check the size of the file is to check the character length
    //Let's assume first of all that a JSON input file should be no larger than 1MB, or 1048576 characters
    if (jsonFile.length > 1048576) {
      this.state.errorMessage = "Error: The entered JSON is larger than 1MB";
      return false;
    }
    //Second check if it is a valid JSON with JSON.parse
    var validJson;
    try {
      validJson = JSON.parse(jsonFile);
    } catch (e) {
      this.state.errorMessage = "Error: Not valid JSON";
      return false;
    }
    //Thirdly check if the json is an array
    if (!Array.isArray(validJson)) {
      this.state.errorMessage = "Error: The entered JSON is not an array";
    }
    //finally check if there are more than 1000 items in the json array or 1000 keys in the object
    if (validJson.length > 1000) {
      this.state.errorMessage = "Error: The array contains more than 1000 entries";
      return false;
    }
    this.state.errorMessage = "";
    return true;
  }

  render() {
    const {parseError, results} = this.state;

    const renderError = () => {
      return (
        <div className="row">
          <pre style={{whiteSpace: 'pre-wrap', color: 'red'}}>{parseError}</pre>
        </div>
      )
    };

    return (
      <div className="App">

        <div className="row">
          <div className='column'>
            <p>Json Data (Array)</p>
            <AceEditor
              ref='jsonEditor'
              style={{width: '100%'}}
              mode="json"
              theme="solarized_dark"
              value={this.state.json}
              commands={[{
                name: 'execute',
                bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
                exec: (editor) => {
                  this.update()
                }
              }]}
            />
          </div>
          <div className='column'>
            <p>SQL -
              <button onClick={() => {
                this.update()
              }}> Run </button>
            </p>
            <AceEditor
              ref='sqlEditor'
              style={{width: '100%'}}
              mode="sql"
              theme="solarized_dark"
              value={this.state.sql}
              commands={[{
                name: 'execute',
                bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
                exec: (editor) => {
                  this.update()
                }
              }]}
            />
          </div>
        </div>
        <div className="row">
          <span className="errorMessage">{this.state.errorMessage}</span>
        </div>
        {parseError && renderError()}
        <QueryResults results={results}/>
      </div>
    );
  }
}

export default App;
