export default function(props){
    return(
    <section id="product" className='w3-container'>
        <h1>{props.data.name}</h1>
        <h2>{props.data.description}</h2>
        <p><img className="main_image" src={props.data.images[0]} alt={props.data.name}></img></p>
    </section>
    )
}