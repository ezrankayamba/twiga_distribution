import React, {Component} from 'react';

class LoadingIndicator extends Component {
    render() {
        const {isLoading} = this.props
        return isLoading ? (
            <div className="loading-indicator bg-info text-white">
                <i>Loading, please wait ...</i>
            </div>
        ) : null;
    }
}

export default LoadingIndicator;