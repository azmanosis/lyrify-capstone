import { useState, useEffect } from 'react';
import axios from 'axios';

const backend = `http://localhost:8080`;

function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        axios.post(`${backend}/login`, {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({}, null, '/lyrify')
        })
    }, [code])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
            axios.post(`${backend}/refresh`, {
                refreshToken,
            }).then(res => {
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
                .catch(() => {
                    window.location = '/'
                })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}

export default useAuth;

