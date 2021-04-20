
import HomePage from "./HomePage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Profile from './Profile';
import Login from "./Login";
import Register from "./Register";
import PostAdder from "./PostAdder";
import { Component } from "react";
import ReactSession from "react-client-session/dist/ReactSession";



class App extends Component {
  
  componentDidMount(){
  
      ReactSession.setStoreType("localStorage");
      ReactSession.set("id","");
      ReactSession.set("name","");
      ReactSession.set("username","");
      ReactSession.set("password","");
  }
  render(){
    return(
      <RoutesManager/>
    )
  }

}

class RoutesManager extends Component{

  render(){

  
    return (
      
      
      <Switch>
        <Route exact path="/" component={HomePage}>
          
        </Route>
        <Route   path="/profile/:id" render={(props)=><Profile {...props} key={Math.random()}/>} >
          
        </Route>
        <Route  path="/login" component={Login}>
          
        </Route>
        <Route  path="/register" component={Register}>
          
        </Route>
        <Route path="/addPost" component={PostAdder}>

        </Route>
      </Switch>
      
      
    );
    }
  
}

export default App;
