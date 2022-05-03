import React, {useEffect, useState} from 'react'
import { Container,
         Row } from 'react-bootstrap';
import { useLocation } from 'react-router'
import axios from "axios"
import ReactPaginate from 'react-paginate';

import SongQuickView from '../components/SongQuickView'
import {
    PlaylistEntry, Artist
} from '../interfaces'

interface LocationState {
    id: string
    itemsPerPage: number
    name: string
    allPlaylistIDs: string[]
    playlistNames: string[]
    playlistLengths: number[]
}

const PlaylistPage = () => {
    const [token, setToken] = useState<string>("")
    const location = useLocation()
    const locationState = location.state as LocationState
    const { itemsPerPage } = locationState

    // pagination states
    const [totalSongs, setTotalSongs] = useState(0)
    const [playlist, setPlaylist] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)

    const PLAYLIST_ENDPOINT = locationState.id === 'likedsongs' ? 
        `https://api.spotify.com/v1/me/tracks` :
        `https://api.spotify.com/v1/playlists/${locationState.id}/tracks`
            
    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken")!)
            }
        } else {
            async function fetchData() {
                const PLAYLIST_ENDPOINT_W_PARAMS = PLAYLIST_ENDPOINT
                    + `?limit=${itemsPerPage}&offset=${itemOffset}`
                try {
                    const res = await axios.get(PLAYLIST_ENDPOINT_W_PARAMS, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    })
                    setPlaylist(res.data.items)
                    setTotalSongs(res.data.total)
                    setPageCount(Math.ceil(res.data.total / itemsPerPage))
                } catch (e) {
                    console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
                }
            }
            fetchData()
        }
    }, [token, itemOffset])

    const getSongArtists = (song: PlaylistEntry) => {
        return song.track.artists.map((artist: Artist) => {
            return artist.name
        })
    }

    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % totalSongs
        setItemOffset(newOffset)
        window.scrollTo(0, 0)
    }

    return(
        <Container style={{width:'50%'}}>
            <h1> {locationState.name} </h1>
            {playlist && playlist.map((song: PlaylistEntry, idx) => {
                return(
                    <Row key={idx} className="py-1">
                        <SongQuickView
                            id={song.track.id}
                            name={song.track.name}
                            artists={getSongArtists(song)}
                            image={song.track.album.images[2].url}
                            allPlayListIDs={locationState.allPlaylistIDs}
                            playlistNames={locationState.playlistNames}
                            playlistLengths={locationState.playlistLengths}
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
                // renderOnZeroPageCount={null}
            />
        </Container>
    )
    
}

export default PlaylistPage