import React, {useEffect, useState} from 'react'
import { Container,
         Row } from 'react-bootstrap';
import { useLocation } from 'react-router'
import axios from "axios"
import ReactPaginate from 'react-paginate';

import SongQuickView from '../components/SongQuickView.jsx'


const PlaylistPage = () => {
    const [token, setToken] = useState("")
    const location = useLocation()
    const itemsPerPage = location.state.itemsPerPage

    // pagination states
    const [totalSongs, setTotalSongs] = useState(0)
    const [playlist, setPlaylist] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)

    const PLAYLIST_ENDPOINT = location.state.id === 'likedsongs' ? 
        `https://api.spotify.com/v1/me/tracks` :
        `https://api.spotify.com/v1/playlists/${location.state.id}/tracks`
            
    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken"))
            }
        } else {
            const PLAYLIST_ENDPOINT_W_PARAMS = PLAYLIST_ENDPOINT
                + `?limit=${itemsPerPage}&offset=${itemOffset}`
            axios.get(PLAYLIST_ENDPOINT_W_PARAMS, {
                headers: {
                    Authorization: "Bearer " + token
                }
            }).then((res) => {
                setPlaylist(res.data.items)
                setTotalSongs(res.data.total)
                setPageCount(Math.ceil(res.data.total / itemsPerPage))
            }).catch((e) => {
                console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
            })
        }
    }, [token, itemOffset])

    const getSongArtists = (song) => {
        return song.track.artists.map((artist) => {
            return artist.name
        })
    }

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalSongs
        setItemOffset(newOffset)
        window.scrollTo(0, 0)
    }

    return(
        <Container style={{width:'50%'}}>
            <h1> {location.state.name} </h1>
            {playlist && playlist.map((song, idx) => {
                return(
                    <Row key={idx} className="py-1">
                        <SongQuickView
                            name={song.track.name}
                            artists={getSongArtists(song)}
                            image={song.track.album.images[2].url}
                        />
                    </Row>
                )
            })}
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
        </Container>
    )
    
}

export default PlaylistPage