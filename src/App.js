import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import routes from "./client/routes";

const RouteWithSubRoutes = ( route ) => (
  <Route path={route.path} render={( props ) => (
      // pass the sub-routes down to keep nesting
     <route.component {...props} routes={route.routes}/>
  ) }/>
);

const App = ( ) => (
    <div>
      <ul>
        <Route path="/" exact={true} children={ ({match}) => {
            if( match ){
              return ( <li className="active">Home</li> )
            } else{
              return ( <li><Link to="/">Home</Link></li> )
            }
        } } />
        <Route path="/about" exact={true} children={ ({match}) => {
            if( match ){
              return ( <li className="active">About</li> )
            } else{
              return ( <li><Link to="/about">About</Link></li> )
            }
        } } />
      </ul>
    <Switch>
        {routes.map(( route, i ) => ( <RouteWithSubRoutes key={i} {...route}/> ))}
    </Switch>
  </div>
)

export default App;