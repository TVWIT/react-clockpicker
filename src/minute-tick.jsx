import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd';
import { flow } from 'lodash';

const dragSpec = {
    beginDrag(props) {
        // Return the data describing the dragged item
        const item = { id: props.id };
        return item;
    }
};

const dropSpec = {
    canDrop(props, monitor) {
        return true
    }
};

class MinuteTick extends Component {
    render () {
        const { onChange, style, text } = this.props;
        const { connectDropTarget, connectDragSource } = this.props;
        
        return connectDragSource(connectDropTarget(<div
            className="clockpicker-tick"
            onClick={onChange}
            style={style}>
                {text}
        </div>))
    }
}

export default flow(
    DropTarget('tick', dropSpec, connect => ({
        connectDropTarget: connect.dropTarget()
    })),
    DragSource('tick', dragSpec, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }))
)(MinuteTick)