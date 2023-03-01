import { useState, useEffect } from 'react';
import axios from 'axios';

function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        axios.post('https://lyrify-api.up.railway.app/login', {
            code,
        }).then(res => {
            console.log(res.data)
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({}, null, '/lyrify')
        })
    }, [code])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
            axios.post('https://lyrify-api.up.railway.app/refresh', {
                refreshToken,
            }).then(res => {
                console.log(res.data)
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

