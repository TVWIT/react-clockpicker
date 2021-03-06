import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Overlay, Popover, Glyphicon } from 'react-bootstrap';
import moment from 'moment';

import './react-clockpicker.css';

const compose = (f, g) => data => f(g(data))

const TIME_FMT = 'HH:mm';

const CP_EDITING = {
  NOT_EDITING: 0,
  HOURS: 1,
  MINUTES: 2
};

export default class ClockPicker extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    
    this.state = {
      time: props.time,
      editing: CP_EDITING.NOT_EDITING
    };
  }

  static propTypes = {
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,
    addonBefore: PropTypes.node,
    disabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    hours: 13,
    minutes: 30,
    placement: 'bottom',
    disabled: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.editing === CP_EDITING.NOT_EDITING) {
      return {
        time: nextProps.time
      };
    }
    return prevState
  }

  render() {
    const { onChange, placement, disabled } = this.props;
    const { time } = this.state;

    let hours = time.format('HH');
    let minutes = time.format('mm');
    // console.log(hours + ':' + minutes);
    

    let hourTicks = [],
      minuteTicks = [];

    const tickRadius = 13,
      dialRadius = 100,
      outerRadius = 80,
      innerRadius = 54,
      leadingZero = (num) => (num < 10 ? '0' : '') + num;

    const title = (
      <div>
        <span
          className={'clockpicker-span-hours' + (this.state.editing === CP_EDITING.HOURS ? ' text-primary' : '')}
          onClick={() => this.setState({editing: CP_EDITING.HOURS})}>
          {leadingZero(hours)}
        </span>
        {' : '}
        <span
          className={'clockpicker-span-minutes' + (this.state.editing === CP_EDITING.MINUTES ? ' text-primary' : '')}
          onClick={() => this.setState({editing: CP_EDITING.MINUTES})}>
          {leadingZero(minutes)}
        </span>
      </div>
    );

    for (let i = 0; i < 24; i += 1) {
      const radian = i / 6 * Math.PI;
      const inner = i > 0 && i < 13;
      const radius = inner ? innerRadius : outerRadius;
      const left = dialRadius + Math.sin(radian) * radius - tickRadius;
      const top = dialRadius - Math.cos(radian) * radius - tickRadius;
      const text = i === 0 ? '00' : i;

      hourTicks.push(
        <div
          key={'hour_' + text}
          className="clockpicker-tick"
          onClick={() => this.setState({ 
            editing: CP_EDITING.MINUTES,
            time: moment(i + ':' + leadingZero(minutes), TIME_FMT)
          })}
          style={{left, top, fontSize: inner ? '120%' : '100%'}}>
          {text}
        </div>
      );
    }

    for (let i = 0; i < 60; i += 5) {
      const radian = i / 30 * Math.PI;
      const left = dialRadius + Math.sin(radian) * outerRadius - tickRadius;
      const top = dialRadius - Math.cos(radian) * outerRadius - tickRadius;
      const text = leadingZero(i);

      minuteTicks.push(
        <div
          key={'minute_' + text}
          className="clockpicker-tick"
          onClick={() => {
            this.setState({ editing: CP_EDITING.NOT_EDITING, minutes: i })
            onChange(
              moment(hours + ':' + leadingZero(i), TIME_FMT)
            )
          }}
          style={{left, top, fontSize: '120%'}}>
          {text}
        </div>
      );
    }

    const value = this.state.editing === CP_EDITING.HOURS ? hours : minutes,
      unit = Math.PI / (this.state.editing === CP_EDITING.HOURS ? 6 : 30),
      radian = value * unit,
      radius = this.state.editing === CP_EDITING.HOURS && value > 0 && value < 13 ? innerRadius : outerRadius,
      x = Math.sin(radian) * radius,
      y = - Math.cos(radian) * radius;

    const hand = (
      <svg className="clockpicker-svg" width="200" height="200">
        <g transform="translate(100,100)">
          <line x1="0" y1="0" x2={x} y2={y}></line>
          <circle className="clockpicker-canvas-fg" r="3.5" cx={x} cy={y}></circle>
          <circle className="clockpicker-canvas-bg" r="13" cx={x} cy={y}></circle>
          <circle className="clockpicker-canvas-bearing" cx="0" cy="0" r="2"></circle>
        </g>
      </svg>
    );

    const startEditing = () => {
      if (!disabled) {
        this.setState({ editing: CP_EDITING.HOURS });
      }
    }

    const popover = (
      <Popover id="clockpicker" className="clockpicker-popover" title={title}>
        <div className="clockpicker-plate">
          <div className="clockpicker-canvas">
            {hand}
          </div>
          { this.state.editing === CP_EDITING.HOURS ?
          <div className="clockpicker-dial clockpicker-hours">
            {hourTicks}
          </div> :
          <div className="clockpicker-dial clockpicker-minutes" style={{visibility: 'visible'}}>
            {minuteTicks}
          </div>
          }
        </div>
      </Popover>
    );

    return (
      <div>
        <div className="input-group" onClick={startEditing}>
          <span className="input-group-addon">
            <Glyphicon glyph="time"/>
          </span>
          <input
            type="text"
            ref={this.inputRef}
            className="form-control"
            disabled={disabled}
            value={time.format(TIME_FMT)}
            onChange={() => false}/>
        </div>
        <Overlay
          placement={placement}
          animation={false}
          show={this.state.editing !== CP_EDITING.NOT_EDITING}
          rootClose={true}
          container={this}
          target={() => this.inputRef.current}
          onHide={() => this.setState({
            editing: CP_EDITING.NOT_EDITING,
            hours: this.props.hours,
            minutes: this.props.minutes
          })}>
            {popover}
        </Overlay>
      </div>
    );
  }
}
