import React, {Component} from 'react';
import './App.css';

import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/mode/sql";
import "brace/theme/solarized_dark";
import "brace/ext/language_tools";


class App extends Component {

    runSql(json, sql) {
        console.log('running SQL', json, sql);
    }

    render() {
        return (
            <div className="App">

                <div className="row">
                    <div className='column'>
                        <p>Json Data</p>
                        <AceEditor
                            style={{width: '100%'}}
                            name="jsonEditor"
                            mode="json"
                            theme="solarized_dark"
                            ref='jsonEditor'/>
                    </div>
                    <div className='column'>
                        <p>SQL</p>
                        <AceEditor
                            style={{width: '100%'}}
                            name='sqlEditor'
                            mode="sql"
                            theme="solarized_dark"
                            ref='sqlEditor'/>
                    </div>
                </div>

                <button onClick={() => {
                    this.runSql(
                        this.refs.jsonEditor.editor.getValue(),
                        this.refs.sqlEditor.editor.getValue()
                    )
                }}>
                    Run
                </button>
            </div>
        );
    }
}

export default App;
