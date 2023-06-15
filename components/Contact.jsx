import { ReactComponent as PaperAirplane} from './svgs/regular/paper-plane.svg';
import { ReactComponent as User} from './svgs/regular/user.svg';
import { ReactComponent as Envelope} from './svgs/regular/envelope.svg';
import { ReactComponent as Pen} from './svgs/solid/pen.svg';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default (props) => {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res= await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(inputs),
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8'
            })
        });
        if(res.status == 200){
            toast.success(props.data.contact.thank_you, {
                position: toast.POSITION.BOTTOM_CENTER
            });
            setInputs({ name: "", email: "", message: "" });
        }else{
            toast.error(`${res.status} ${res.statusText}`, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    }


    return(
    <form id="contact" className="w3-col s12" onSubmit={handleSubmit}>
        <div className="w3-row">
            <div className="input-field w3-col m6">
                <User />
                <input id="icon_prefix" 
                    name="name" 
                    type="text"
                    className="validate white-text" 
                    value={inputs.name || ""}
                    onChange={handleChange}
                />
                <label htmlFor="icon_prefix">{props.data.contact.name}</label>
            </div>
            <div className="input-field w3-col m6">
                <Envelope />
                <input 
                    id="icon_email" 
                    name="email" 
                    type="email" 
                    className="validate white-text" 
                    value={inputs.email || ""}
                    onChange={handleChange}
                />
                <label htmlFor="icon_email">{props.data.contact.email}</label>
            </div>
            <div className="input-field w3-col s12">
                <Pen />
                <textarea 
                    id="icon_prefix2" 
                    name="message" className="materialize-textarea white-text"
                    value={inputs.message || ""}
                    onChange={handleChange}                
                ></textarea>
                <label htmlFor="icon_prefix2">{props.data.contact.message}</label>
            </div>
            <div className="w3-row">
                <div className="w3-col s12">
                    <button className="w3-button" type="submit">
                        Submit <PaperAirplane />
                    </button>
                </div>
            </div>
        </div>
        <ToastContainer />
    </form>
    );
}