import "./StoryFooter.css";
import Button from "./Button.jsx";

export default (args) => {
    return <div className="w3-row">
        <div className="w3-right story-footer-button">
            <Button primary="true" size="medium" {...args} />
        </div>
        <h3>{args.title}</h3>
        <h4>{args.tagline}</h4>
    </div>
}