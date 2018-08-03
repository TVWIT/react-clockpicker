import React, { Component } from 'react';
import { render } from 'react-dom';
import ClockPicker from '../src/react-clockpicker';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment().startOf('minute'),
      enabled: true
    };
  }

  render() {
    let { time, enabled } = this.state;
    let checkbox = <input type="checkbox" checked={this.state.enabled} onChange={(e) => this.setState({ enabled: e.target.checked })} />;

    return (
      <ClockPicker
        addonBefore={checkbox}
        placement='bottom'
        disabled={!enabled}
        time={time}
        onChange={(hours, minutes) => this.setState({ hours, minutes })} />
    );
  }
}

render(<App />, document.getElementById('root'));
