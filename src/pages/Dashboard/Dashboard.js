import "./Dashboard.scss";
import { useState, useEffect } from 'react';
import useAuth from '../../components/Auth/useAuth';
import Search from '../../components/Search/Search';
import Player from '../../components/Player/Player';
import { Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
    clientId: "b7a11319b71d4c9fb5ea10737cace61f"
})

function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }

    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:8080/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])


    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
                res.body.tracks.items.map(track => {
                    const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                    }, track.album.images[0])

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url
                    }
                })
            )
        })

        return () => cancel = true
    }, [search, accessToken])

    return (
        <div className="dashboard">
            <Form.Control className="dashboard__search" type="search" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)} />

            <div className="dashboard__results">{searchResults.map(track => (<Search track={track} key={track.uri} chooseTrack={chooseTrack} />
            ))}
                {searchResults.length === 0 && (
                    <div className='dashboard__lyrics'>
                        {lyrics}
                    </div>
                )}
            </div>
            <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            </div>
        </div>
    )
}

export default Dashboard;