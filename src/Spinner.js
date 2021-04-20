import { Component } from "react";
import "./Spinner.css";

 export default class Spinner extends Component{

    render()
    {
        return(

            <div className="spin-c container">
                {/* <i class="fas fa-circle-notch align-middle text-primary"></i> */}
                <img class=" fa-circle-notch align-middle" src="https://img.icons8.com/doodle/48/000000/instagram-new.png"/>
                
            </div>
        )
    }
}