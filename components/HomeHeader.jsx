import Styled from "styled-components";

export default (props) => {
    const Section = Styled.section`
    background-position: center;
    background-size: cover;
    min-height: calc(90vh - var(--header_height));
    `;
    const HeroElement = Styled.div`
    padding: 0 48px 1.5em;
    background: rgba(0,0,0,.7);
    margin: 0 auto;
    `
    return (
        <Section className="w3-display-container w3-grayscale-min" id="HomeHeader" style={{backgroundImage: `url(${props.data.bgimg})`}}>
            <HeroElement className="w3-display-left w3-text-white">
                <span className="w3-jumbo w3-hide-small">{props.data.title}</span><br />
                <span className="w3-xxlarge w3-hide-large w3-hide-medium">{props.data.title}</span><br />
                    <span className="w3-large">{props.data.tagline}</span>
                    <p><a href="#about" className="w3-button w3-white w3-padding-large w3-large w3-margin-top w3-opacity w3-hover-opacity-off">{props.data.actionCall}</a></p>
            </HeroElement>
        </Section>
    );
}