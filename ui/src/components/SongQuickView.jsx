import React from 'react'
import PropTypes from 'prop-types';

const SongQuickView = (props) => {

    const formatArtists = () => {
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
        </div>
    )
}

SongQuickView.propTypes = {
    name: PropTypes.string,
    artists: PropTypes.array
}

export default SongQuickView