import React,{Suspense} from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import routes from "./routes";

const App = () => { 
  const getRoutes = (routes: any[]) => {
    return routes.map((prop, key) => {
      console.log("I am from routes----------->>>>", prop);
      let Component = prop.component;
        return (
          <Route
            exact
            path={prop.path}
            key={key}
            render={(props:any) => <Component {...prop} {...props} />}
          />
        );
    });
  };
  return (
    
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {getRoutes(routes)}
        </Switch>
        </Suspense>

      </BrowserRouter>
      
  );
};
export default App;
