import React, {Component} from 'react';

class QueryResults extends Component {
  constructor() {
    super();

    this.state = {show: undefined};
  }

  drawHeader(keys) {
    return keys.map((key, i) => <div key={i} style={{flex: 1}}>{key}</div>);
  }

  drawValue(val, i) {
    if (typeof val !== 'object') {
      return <div key={i} style={{flex: 1}}>{val}</div>;
    }
    if (Array.isArray(val)) {
      return <div key={i} style={{flex: 1}}>{'[...]'}</div>;
    }
    return <div key={i} style={{flex: 1}}>{'{...}'}</div>;
  }

  determineKeys(results) {
    return results.map(result => Object.keys(result)).reduce((a, b) => {
      if (b.length >= a.length) {
        return b;
      }
      return b;
    }, []);
  }

  showResults(results) {
    const keys = this.determineKeys(results);
    const drawnKeys = this.drawHeader(keys);
    const rows = this.drawResults(results, keys);

    return (
      <div style={{margin: '20px'}}>
        <div style={{
          display: 'flex',
          padding: '10px 0',
          border: '1px solid grey',
          backgroundColor: '#c0c0c0'
        }}>{drawnKeys}</div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          border: '1px solid grey',
          borderTop: '0',
          borderBottom: '0',
          backgroundColor: '#dedede'
        }}>{rows}</div>
      </div>
    );
  };

  drawResults(results, keys) {
    return results.map((result, i) => {

      return <div key={`t-${i}`}>
        <div style={{
          display: 'flex',
          padding: '10px 0',
          borderBottom: '1px solid grey'
        }} onClick={this.toggleShow.bind(this, i)}>{this.drawResult(result, keys)}</div>
        <div style={{borderBottom: '1px solid grey', display: this.showDetails(i)}}>
          <pre style={{
            textAlign: 'left',
            padding: '1em 0',
            margin: '0',
            backgroundColor: '#ececec'
          }}>{JSON.stringify(result, undefined, 2)}</pre>
        </div>
      </div>
    });
  }

  toggleShow(i) {
    let val;
    if (this.state.show === i) {
      val = null;
    } else {
      val = i;
    }

    this.setState({show: val});
  }

  showDetails(i) {
    return this.state.show === i ? 'block' : 'none';
  }

  drawResult(e, keys) {
    return keys.map((k, i) => {
      const val = e[k];
      return this.drawValue(val, i);
    });
  }


  render() {
    if (!this.props.results) {
      return null;
    }

    if (this.props.results.length <= 0) {
      return null;
    }

    return <div>{this.showResults(this.props.results)}</div>;
  }
}


export default QueryResults;
