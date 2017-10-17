import React, {Component} from 'react';
import './App.css';
import alasql from 'alasql';
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/mode/sql";
import "brace/theme/solarized_dark";
import "brace/ext/language_tools";

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
        console.log('running SQL...');
        try {
            const results = alasql(this.state.sql, [JSON.parse(this.state.json)]);
            console.table(results);
            this.setState({'parseError': null, results});
        } catch(e) {
            this.setState({'parseError': e.message, 'results': null});
        }
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

        const showResults = () => {
            const keys = Object.keys(results[0]).map((e, i) => <div key={i} style={{flex: 1}}>{e}</div>);

            const row = (e) => {
                const keys = Object.keys(e).map((k, i) => {
                    const val = e[k];
                    if (typeof val !== 'object') {
                        return <div key={i} style={{flex: 1}}>{val}</div>;
                    }

                    return <div key={i} style={{flex: 1}}>&#9654;</div>
                });

                return keys;
            }

            const rows = results.map((e, i) => <div key={i} style={{display: 'flex', padding: '10px 0', borderBottom: '1px solid grey'}}>{row(e)}</div>);

            return (
                <div style={{margin: '20px'}}>
                    <div style={{display: 'flex', padding: '10px 0', border: '1px solid grey'}}>{keys}</div>
                    <div style={{display: 'flex', flexDirection: 'column', flex: 1, border: '1px solid grey', borderTop: '0', borderBottom: '0'}}>{rows}</div> 
                </div>
            );
        }

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
                                exec: (editor) => {this.update()}
                            }]}
                        />
                    </div>
                    <div className='column'>
                        <p>SQL -
                            <button onClick={() => { this.update() }}> Run </button>
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
                                exec: (editor) => {this.update()}
                            }]}
                        />
                    </div>
                </div>
                {parseError && renderError()} 
                {results && showResults()}
            </div>
        );
    }
}

export default App;
