import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate  } from 'react-router'
import axios from "axios"
import { LoggedUser } from '../interfaces'


const USER_ENDPOINT = "https://api.spotify.com/v1/me"

const HomePage = () => {
    const [token, setToken] = useState("")
    const [userData, setUserData] = useState<LoggedUser|undefined>(undefined)
    const navigate = useNavigate()

    useEffect(() => {
        if (token === "" && window.location.hash) {
            handleRedirect(window.location.hash)
        } else {
            getUserData()
        }
    }, [token])

     /** Get and store all parameters returned by spotify after the user is logged in*/
     const handleRedirect = (hash: any) => {
        // parse returned parameters
        const uriParams = hash.substring(1)
        const splitParams = uriParams.split("&")
        const reducedParams = splitParams.reduce((accumulator: any, currVal: string) => {
            const [key, val] = currVal.split("=")
            accumulator[key] = val
            return accumulator
        }, {});
        const {
            access_token,
            expires_in,
            token_type
        } = reducedParams;

        // store parameters
        localStorage.clear();
        localStorage.setItem("accessToken", access_token)
        localStorage.setItem("expiresIn", expires_in)
        localStorage.setItem("tokenType", token_type)

        // set token
        setToken(access_token)
    }

    const getUserData = async () => {
        try {
            const res = await axios.get(USER_ENDPOINT, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            setUserData(res.data)
        } catch (e) {
            console.error(`COULD NOT RETRIEVE USER DATA. ${e}`)
        }
    } 

    const pushToPlaylistsPage = () => {
        navigate("/playlists")
    }

    return(
        <div>
            {!userData && 
                <div>
                    <Spinner animation="border"/>
                </div>
            }
            {userData && 
                <div>
                    <h2>
                        Welcome {userData.display_name ? userData.display_name : ''}
                    </h2>
                    <Button onClick={pushToPlaylistsPage}> Check out your playlists </Button>
                </div>
            }
        </div>
    )
}

export default HomePage