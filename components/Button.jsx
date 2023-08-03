export default (props)=>{
    const mode = props.primary ? 'w3-black' : 'w3-white w3-border';
    if (props.href) {
        return (
            <a
                type="button"
                className={['w3-button', `w3-${props.size}`, mode].join(' ')}
                {...props}
            >
                {props.label}
            </a>
        );
    } else {
        return (
            <button
                type="button"
                className={['w3-button', `w3-${props.size}`, mode].join(' ')}
                {...props}
            >
                {props.label}
            </button>
        );
    }
};
