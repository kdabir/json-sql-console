import React, {Component} from 'react';
import './App.css';
import alasql from 'alasql';
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/mode/sql";
import "brace/theme/solarized_dark";
import "brace/ext/language_tools";


class App extends Component {

    constructor(props){
        super(props);
        this.state =  {json:'[]', sql:'select * from ?'};
    }

    runSql(json, sql) {
        console.log('running SQL', json, sql);
        console.table(alasql(sql, [JSON.parse(json)]));
    }

    render() {
        return (
            <div className="App">

                <div className="row">
                    <div className='column'>
                        <p>Json Data (Array)</p>
                        <AceEditor
                            style={{width: '100%'}}
                            name="jsonEditor"
                            mode="json"
                            theme="solarized_dark"
                            value={this.state.json}
                            ref='jsonEditor'/>
                    </div>
                    <div className='column'>
                        <p>SQL</p>
                        <AceEditor
                            style={{width: '100%'}}
                            name='sqlEditor'
                            mode="sql"
                            theme="solarized_dark"
                            value={this.state.sql}
                            ref='sqlEditor'/>
                    </div>
                </div>

                <button onClick={() => {
                    let json = this.refs.jsonEditor.editor.getValue(),
                        sql = this.refs.sqlEditor.editor.getValue();
                    this.setState({json,sql})
                    this.runSql(json,sql)
                }}>
                    Run
                </button>
            </div>
        );
    }
}

export default App;
