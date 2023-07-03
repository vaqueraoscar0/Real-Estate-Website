import React from 'react'


function Rating({value, text, color}){
    return(
        <div className={'rating'}>
            <span> {text && text} </span>
            <span>
                <i style={{color}} aria-hidden="true" className={
                    value >= 1 ? 'fa fa-star' : value >= 0.5 ? 'fa fa-star-half': ''
                }/>

            </span>
            <span>
                <i style={{color}} aria-hidden="true" className={
                    value >= 2 ? "fa fa-star" : value >= 1.5 ? "fa fa-star-half": ""
                }/>


            </span>
            <span>
                <i style={{color}} aria-hidden="true" className={
                    value >= 3 ? "fa fa-star" : value >= 2.5 ? "fa fa-star-half": ""
                }/>

            </span>
            <span>
                <i style={{color}} aria-hidden="true" className={
                    value >= 4 ? "fa fa-star" : value >= 3.5 ? "fa fa-star-half": ""
                }/>

            </span>
            <span>
                <i style={{color}} className={
                    value >= 5 ? "fa fa-star" : value >= 4.5 ? "fa fa-star-half": ""
                }/>

            </span>
        </div>
    )
}

export default Rating