import React, {Component} from 'react';

class QueryResults extends Component {
  constructor() {
    super();

    this.state = {show: undefined};
  }

  drawHeader(results) {
    return Object.keys(results[0]).map((key, i) => <div key={i} style={{flex: 1}}>{key}</div>);
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

  showResults(results) {
    const keys = this.drawHeader(results);
    const rows = this.drawResults(results);

    return (
      <div style={{margin: '20px'}}>
        <div style={{
          display: 'flex',
          padding: '10px 0',
          border: '1px solid grey',
          backgroundColor: '#c0c0c0'
        }}>{keys}</div>
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

  drawResults(results) {
    return results.map((result, i) => {

      return <div key={`t-${i}`}>
        <div style={{
          display: 'flex',
          padding: '10px 0',
          borderBottom: '1px solid grey'
        }} onClick={this.toggleShow.bind(this, i)}>{this.drawResult(result)}</div>
        <div style={{borderBottom: '1px solid grey', display: this.showDetails(i)}}>
          <pre style={{textAlign: 'left', padding: '1em 0', margin: '0', backgroundColor: '#ececec'}}>{JSON.stringify(result, undefined, 2)}</pre>
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
    return this.state.show === i ? 'block': 'none';
  }

  drawResult(e) {
    return Object.keys(e).map((k, i) => {
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
