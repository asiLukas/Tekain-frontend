import {useRef} from 'react'
import styled, {keyframes} from 'styled-components'
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
// NOTE: add heic convertion
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40vw;

  @media screen and (max-width: 1600px) {
    height: 60vw;
  }
  @media screen and (min-width: 2300px) {
    height: 30vw;
  }
  @media screen and (min-width: 3000px) {
    height: 25vw
  }
`

const loadingAnimation = keyframes`
  0% {
    background-color: #fff;
  }
  50% {
    background-color: #ccc;
  }
  100% {
    background-color: #fff;
  }
`

const Placeholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  animation: ${loadingAnimation} 1s infinite;
`

const StyledImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
const LazyImage = ({src, alt}) => {
  const refPlaceholder = useRef();

  const removePlaceholder = () => {
    refPlaceholder.current.remove();
  }

  return (
    <div>
    {
      src !== null ?
      <ImageWrapper>
        {src !== null && <Placeholder ref={refPlaceholder}/>}
        <LazyLoad>
          <StyledImage
            onLoad={removePlaceholder}
            onError={removePlaceholder}
            src={src}
            alt={alt}
          />
        </LazyLoad>
      </ImageWrapper> : null


    }
  </div>


  )
};


export default LazyImage
