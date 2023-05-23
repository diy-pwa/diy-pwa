import { ReactComponent as PaperAirplane} from './svgs/regular/paper-plane.svg';
import { ReactComponent as User} from './svgs/regular/user.svg';
import { ReactComponent as Envelope} from './svgs/regular/envelope.svg';
import { ReactComponent as Pen} from './svgs/solid/pen.svg';

export default (props) => {
    return(
    <form id="contact" className="w3-col s12" action="/api/contact" method="post">
        <div className="w3-row">
            <div className="input-field w3-col m6">
                <User />
                <input id="icon_prefix" name="name" type="text" className="validate white-text" />
                <label htmlFor="icon_prefix">{props.data.contact.name}</label>
            </div>
            <div className="input-field w3-col m6">
                <Envelope />
                <input id="icon_email" name="email" type="email" className="validate white-text" />
                <label htmlFor="icon_email">{props.data.contact.email}</label>
            </div>
            <div className="input-field w3-col s12">
                <Pen />
                <textarea id="icon_prefix2" name="message" className="materialize-textarea white-text"></textarea>
                <label htmlFor="icon_prefix2">{props.data.contact.message}</label>
            </div>
            <div className="w3-row">
                <div className="w3-col s12">
                    <button className="btn" type="submit">
                        Submit <PaperAirplane />
                    </button>
                </div>
            </div>
        </div>
    </form>
    );
}