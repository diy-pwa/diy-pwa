function Card(props){
    let product = props.data;
    return(
        <div className='w3-display-container'>
        <img src={product.images[0]} alt={product.name} className="w3-image" />
        <div class="w3-display-topleft w3-container">{product.name}</div>
        <div className="w3-display-bottomright w3-container">
            <a href={product.path} className="w3-button w3-padding-large w3-large w3-margin-top ">{props.actionCall}</a>
        </div>
        </div>
    )
}


export default function (props) {
    let aProducts = props.data;
    let nColumn0 = Math.round(aProducts.length / 3);
    let nColumn1 = Math.round(aProducts.length / 3);
    let aColumn0 = aProducts.slice(0, nColumn0);
    let aColumn1 = aProducts.slice(nColumn0, nColumn0 + nColumn1);
    let aColumn2 = aProducts.slice(nColumn0 + nColumn1);
    return (
        <div id="productsGrid" className="w3-row-padding">
            <div className="w3-third">
                {aColumn0.map((product, key) => (
                    <Card key={key} data={product} actionCall={props.actionCall}/>
                ))}

            </div>
            <div className="w3-third">
                {aColumn1.map((product, key) => (
                    <Card key={key} data={product} actionCall={props.actionCall}/>
                ))}

            </div>
            <div className="w3-third">
                {aColumn2.map((product, key) => (
                    <Card key={key} data={product} actionCall={props.actionCall}/>
                ))}
                
            </div>
        </div>
    );
}