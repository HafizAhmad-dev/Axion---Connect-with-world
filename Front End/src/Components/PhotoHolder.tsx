import React from 'react'
type PhotoHolderProps = {
    css?:string
};
const PhotoHolder = (props:PhotoHolderProps) => {
    return (
        <div className={`image rounded-full h-10 w-10 bg-linear-to-br from-[#887FFF] to-[#a44cfd] ${props.css || ''}`}></div>
    )
}

export default PhotoHolder
