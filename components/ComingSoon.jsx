import "w3-css/w3.css";
import "./ComingSoon.css";

export default (args)=>{
    return( 
    <section id="main" style={{ 
        backgroundImage: `url(${args.backgroundImage})` 
      }}>
        <header className="w3-display-topleft w3-padding-large w3-xlarge">{args.logo}</header>
        <section className="w3-display-middle">
        <h1>{args.title}</h1>
        <hr className="w3-border-grey" />
        {args.tagline}
        </section>
        <footer className="w3-display-bottomleft w3-padding-large">
        {args.footer} <a href="https://www.w3schools.com/w3css/default.asp" target="_blank"> w3.css</a>
        </footer>
      </section>
      )
}