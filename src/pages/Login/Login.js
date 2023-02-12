import './Login.scss';
import React from 'react';

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=b7a11319b71d4c9fb5ea10737cace61f&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

function Login() {
    return (
        <>
            <div className="login">
                <a className="login__url" href={AUTH_URL}>Login With Spotify</a>
            </div >
        </>
    )
}

export default Login;