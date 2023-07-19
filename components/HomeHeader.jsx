export default (props) => {
    return (
        <section id="HomeHeader" className="w3-display-container w3-grayscale-min" style={{backgroundImage: `url(${props.data.bgimg})`}}>
            <div id="HeroElement" className="w3-display-left w3-text-white">
                <span className="w3-jumbo w3-hide-small">{props.data.title}</span><br />
                <span className="w3-xxlarge w3-hide-large w3-hide-medium">{props.data.title}</span><br />
                    <span className="w3-large">{props.data.tagline}</span>
                    <p><a href={props.data.to} className="w3-button w3-padding-large w3-large w3-margin-top">{props.data.actionCall}</a></p>
            </div>
        </section>
    );
}