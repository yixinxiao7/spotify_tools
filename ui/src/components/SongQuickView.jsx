import React, { useState, useEffect } from 'react'
import { Container,
         Row,
         Col,
         Image,
         Card,
         Button,
         Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactCardFlip from 'react-card-flip';
import axios from "axios";

const SongQuickView = (props) => {
    const [token, setToken] = useState("")
    const [isFlipped, setIsFlipped] = useState(false)
    const [inPlaylists, setInPlaylists] = useState([])
    const [notInPlaylists, setNotInPlaylists] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken"))
            }
        } 
        if (isFlipped){
            setPlaylists()
        } else {
            // dump any data if exists
            setInPlaylists([])
            setNotInPlaylists([])
        }
    }, [token, isFlipped])

    const setPlaylists = () => {
        const _inPlayLists = []
        const _notInPlaylists = []
        const playlistPromise = new Promise((resolve, reject) => {
            props.allPlayListIDs.forEach((playlistID, idx) => {
                const playlistName = props.playlistNames[idx]
                const totalSongs = props.playlistLengths[idx]  // TODO: USE THIS TO KEEP CALLING API UNTIL ALL SONGS IN THE PLAYLIST ARE RETRIEVED AND VERIFIED 
                
                const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`
                console.log("CALLING: " + PLAYLIST_ENDPOINT)
                axios.get(PLAYLIST_ENDPOINT, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }).then((res) => {
                    let isInPlaylist = false
                    const items = res.data.items
                    items.every(song => {
                        const songID = song.track.id
                        if (songID === props.id) {
                            isInPlaylist = true
                            return false  // break loop
                        }
                        return true
                    })
                    if (isInPlaylist) {
                        _inPlayLists.push(playlistName)
                    } else {
                        _notInPlaylists.push(playlistName)
                    }
                    // mark as resolved if final playlist. TODO: change when multi api call is made
                    if (idx === props.allPlayListIDs.length - 1) {
                        resolve("All playlists processed.")
                    }
                }).catch((e) => {
                    console.error(`COULD NOT RETRIEVE USER PLAYLIST ${playlistID}. ${e}`)
                    reject()
                })
            })
        })
        playlistPromise.then(() => {
            setInPlaylists(_inPlayLists)
            setNotInPlaylists(_notInPlaylists)
            setIsLoading(false)
        })

    }
    const formatArtists = () => {
        const artists = props.artists.join(' & ')
        return(
            <p> {artists} </p>
        )
    }

    const flipCard = () => {
        setIsLoading(true)
        setIsFlipped(!isFlipped)
    }

    return(
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <Card>
                <Row className="px-2">
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
                <Button onClick={flipCard}>View/Adjust Playlists</Button>
            </Card>

            <Card>
                {isLoading && <Spinner />}
                {!isLoading && 
                    <Card.Body>
                        <Row>
                            <Col>
                                <Row>
                                    In these playlists:
                                </Row>
                                <Row>
                                    {inPlaylists.map(playlistName => {
                                        return <p> {playlistName} </p>
                                    })}
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    Not in these playlists: 
                                </Row>
                                <Row>
                                    {notInPlaylists.map(playlistName => {
                                        return <p> {playlistName} </p>
                                    })}
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>}
                <Button onClick={flipCard}>Go back</Button>
            </Card>
        </ReactCardFlip>

        
    )
}

SongQuickView.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    artists: PropTypes.array,
    image: PropTypes.string,
    allPlayListIDs: PropTypes.array,
    playlistNames: PropTypes.array,
    playlistLengths: PropTypes.array,
    totalSongs: PropTypes.number
}

export default SongQuickView