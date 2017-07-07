import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const WrappedApp = () => (
    <MuiThemeProvider>
        <App />
    </MuiThemeProvider>
);


ReactDOM.render(<WrappedApp />, document.getElementById('root'));
registerServiceWorker();
