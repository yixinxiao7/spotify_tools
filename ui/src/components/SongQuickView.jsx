import React from 'react'
import PropTypes from 'prop-types';

const SongQuickView = (props) => {

    const formatArtists = () => {
        console.log(props.image)
        const artists = props.artists.join(' & ')
        return(
            <p> {artists} </p>
        )
    }

    return(
        <div style={{borderStyle: 'solid'}}>
            <p>
                {props.name}
            </p>
            {formatArtists()}
            <img src={props.image} />
        </div>
    )
}

SongQuickView.propTypes = {
    name: PropTypes.string,
    artists: PropTypes.array,
    image: PropTypes.string,
}

export default SongQuickView