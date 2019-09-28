import React from 'react';

class Stopwatch extends React.Component {
    render() {
        const {duration} = this.props
        const minutes = Math.floor(duration / 1000 / 60)
        const seconds = Math.floor(duration / 1000 % 60)

        let display
        if (minutes < 10 && seconds < 10) {
            display = "0" + minutes + ":0" + seconds 
        } else if (minutes < 10) {
            display = "0" + minutes + ":" + seconds
        } else {
            display = + minutes + ":" + seconds
        }
        
        return (
            <div>
                {display}
            </div>
        );
    }
}

export default Stopwatch