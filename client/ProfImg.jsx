import React from 'react';

const ProfImg = (props) => {
  //if !props.profPic
    //props.profPic = stockPhotoSrc
	return (
    <div>
      <div> 
        
      </div>

      <div className='ImgContainer'> 
        <img className='profImg' src={`${props.profPic}`} /> 
      </div>
    </div>
	)
}
export default ProfImg;