import React from 'react'
import { Container,
         Row,
         Col,
         Image } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SongQuickView = (props) => {

    const formatArtists = () => {
        const artists = props.artists.join(' & ')
        return(
            <p> {artists} </p>
        )
    }

    return(
        <Container style={{borderStyle: 'solid'}}>
            <Row>
                <Col xs={'auto'}>
                    <Image src={props.image} className="py-2"/>
                </Col>
                <Col xs={'auto'}>
                    <Row>
                    <p>
                        {props.name}
                    </p>
                    </Row>
                    <Row>
                        {formatArtists()}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

SongQuickView.propTypes = {
    name: PropTypes.string,
    artists: PropTypes.array,
    image: PropTypes.string,
}

export default SongQuickView