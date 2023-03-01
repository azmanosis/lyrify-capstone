import './Login.scss';
import React from 'react';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=b7a11319b71d4c9fb5ea10737cace61f&response_type=code&redirect_uri=lyrify-api.up.railway.app/lyrify&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

// const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=b7a11319b71d4c9fb5ea10737cace61f&response_type=code&redirect_uri=http://localhost:3000/lyrify&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

function Login() {
    return (
        <>
            <div className="login">
                <div className="login__header">
                    <Logo />
                </div>
                <div className="login__spotify">
                    <a
                        className="login__spotify--url"
                        href={AUTH_URL}>
                        Login via Spotify
                    </a>
                </div>
            </div>
        </>
    )
}

export default Login;