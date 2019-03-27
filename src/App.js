

import React from 'react';
import {Route, Switch } from 'react-router-dom';

import Index from './pages/Index';

const Main = () => (
    <main style={{ height: '100%' }}>
        <Switch>
            <Route exact path="/" component={Index} />
        </Switch>
    </main>
)

class App extends React.Component {
    render() {
        return (
            <div style={{ height:'100%'}}>
                <Main/>
            </div>
        )
    }
}

export default App;

