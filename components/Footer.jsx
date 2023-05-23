import Contact from './Contact.jsx';

export default (props) => {
    return (
        <footer>
            <div className="w3-container">
                <div className="w3-row">
                    <div className="w3-col l6 s12">
                        <Contact data={props.data} />
                    </div>
                    <div className="w3-col l3 s12">
                        <h5>{props.data.column2Heading}</h5>
                        <ul>
                            {props.data.column2Links.map((item, key) => (
                                <li><a key={key} href={item.to}>
                                    {item.text}
                                </a></li>
                            ))}
                        </ul>
                    </div>
                    <div className="w3-col l3 s12">
                        <h5>{props.data.column3Heading}</h5>
                        <ul>
                            {props.data.column3Links.map((item, key) => (
                                <li><a key={key} href={item.to}>
                                    {item.text}
                                </a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}