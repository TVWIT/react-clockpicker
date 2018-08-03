import React, { Component } from 'react';
import { render } from 'react-dom';
import ClockPicker from '../src/react-clockpicker';
import moment from 'moment';

// Example Statefull Component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment().startOf('minute')
    };
  }

  render() {
    let { time } = this.state;
    return (
      <ClockPicker
        placement='bottom'
        time={time}
        onChange={time => {
          this.setState({ time: time })
        }}/>
    );
  }
}

render(<App />, document.getElementById('root'));
