import React, { useEffect } from 'react';


const CLIENT_ID = "f302afa9ce974067be62558b9cbcca0f";
const AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:8000/home";  // TODO: change this
const SCOPES = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-currently-playing'
];
const SCOPES_URI_PARAMS = SCOPES.join("%20");

const Login = () => {
    
    useEffect(() => {
        if (window.location.hash) {
            handleRedirect(window.location.hash)
        }
    })

    const handleLogin = () => {
        window.location = `${AUTHORIZE_ENDPOINT}` +
        `?client_id=${CLIENT_ID}` +
        `&redirect_uri=${REDIRECT_URI}` + 
        `&scope=${SCOPES_URI_PARAMS}` + 
        `&response_type=token` + 
        `&show_dialog=true`;
    }
    
    /** Get and store all parameters returned by spotify after the user is logged in*/
    const handleRedirect = (hash) => {
        // parse returned parameters
        const uriParams = hash.substring(1);
        const splitParams = uriParams.split("&");
        const reducedParams = splitParams.reduce((accumulator, currVal) => {
            const [key, val] = currVal.split("=")
            accumulator[key] = val;
            return accumulator;
        }, {});
        const {
            access_token,
            expires_in,
            token_type
        } = reducedParams;

        // store parameters
        localStorage.clear();
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("expiresIn", expires_in);
        localStorage.setItem("tokenType", token_type);
    }

    return(
        <div>
            <button onClick={handleLogin}> Log in</button>
        </div>
    )

}

export default Login;