import react,{ Component } from "react";
export default class Alert extends Component{
    render()
    {
        if(this.props.alertMessage!=null ||this.props.alertMessage!=undefined)
        return(
            <div class="alert alert-success" role="alert">
                {this.props.alertMessage}
            </div>
        )
        return <div></div>
    }
}