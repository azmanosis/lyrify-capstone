import './Dashboard.scss';
import { useRef, useState, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import useAuth from '../../components/Auth/useAuth';
import Search from '../../components/Search/Search';
import Player from '../../components/Player/Player';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';
import microPhoneIcon from '../../assets/icons/microphone.svg';

const spotifyApi = new SpotifyWebApi({
    clientId: "b7a11319b71d4c9fb5ea10737cace61f"
})

function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")
    const [translation, setTranslation] = useState("")
    const [showOriginalLyrics, setShowOriginalLyrics] = useState(true)
    const [showOriginalLyricsButton, setShowOriginalLyricsButton] = useState("show original")
    const [showIndividual, setShowIndividual] = useState(true)
    const [buttonText, setButtonText] = useState("show individual")
    const originalRef = useRef(null);
    const translationRef = useRef(null);

    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
        setTranslation("")
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
            setTranslation(res.data.translation)
        })

        // axios.put('http://localhost:8080/lyrics', {
        //     params: {
        //         track: playingTrack.title,
        //         artist: playingTrack.artist
        //     }
        // });
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

    const handleSpeech = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.start();
        recognition.addEventListener('result', (event) => {
            setSearch(event.results[0][0].transcript);
            recognition.stop();
        });
    };

    const handleClick = () => {
        setShowOriginalLyrics(!showOriginalLyrics);
        if (showOriginalLyricsButton === "show original") {
            setShowOriginalLyricsButton("show translated");
        } else {
            setShowOriginalLyricsButton("show original");
        }
    }

    const handleScrollOriginal = () => {
        translationRef.current.scrollTop = originalRef.current.scrollTop;
    };

    const handleScrollTranslation = () => {
        originalRef.current.scrollTop = translationRef.current.scrollTop;
    };

    const handleIndividualClick = () => {
        setShowIndividual(!showIndividual);
        if (buttonText === "show individual") {
            setButtonText("show side by side");
        } else {
            setButtonText("show individual");
        }
    }

    return (
        <>
            <div className="header">
                {/* <Link to="/"> */}
                <Logo className="header__logo" />
                <h1 className="header__text">Lyrify</h1>
                {/* </Link> */}
            </div>
            <div className="dashboard">
                <div className="dashboard__container">
                    <div className="dashboard__container--search">
                        <input
                            className="dashboard__container--search--input"
                            type="text"
                            placeholder="Search Songs/Artists"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            src={microPhoneIcon}
                        />
                        <button onClick={handleSpeech} className="dashboard__container--search--microphonebox">
                            <img
                                src={microPhoneIcon}
                                className="dashboard__container--search--microphonebox--microphoneimage"
                                alt="">
                            </img>
                        </button>
                    </div>
                    <div
                        className="dashboard__container--results">
                        {searchResults.map(track => (<Search track={track} key={track.uri} chooseTrack={chooseTrack} />
                        ))}
                    </div>
                </div>
                <div className="dashboard__player">
                    <Player
                        accessToken={accessToken}
                        trackUri={playingTrack?.uri}
                    />
                </div>
            </div>
            <div className="dashboard__line"></div>
            <div className="dashboard__line"></div>
            <div className="dashboard__centred">
                {showIndividual &&
                    <div>
                        <div>
                            {searchResults.length === 0 && (
                                <div className='dashboard__lyrics' ref={originalRef} onScroll={handleScrollOriginal}>
                                    {lyrics}
                                </div>
                            )}
                        </div>
                        <div>
                            {searchResults.length === 0 && (
                                <div className='dashboard__lyrics' ref={translationRef} onScroll={handleScrollTranslation}>
                                    {translation}
                                </div>
                            )}
                        </div>
                    </div>
                }
                {!showIndividual &&
                    <div>
                        {showOriginalLyrics &&
                            <div>
                                {searchResults.length === 0 && (
                                    <div className='dashboard__lyrics'>
                                        {lyrics}
                                    </div>
                                )}
                            </div>
                        }
                        {!showOriginalLyrics &&
                            <div>
                                {searchResults.length === 0 && (
                                    <div className='dashboard__lyrics'>
                                        {translation}
                                    </div>
                                )}
                            </div>
                        }
                        <div>
                            <button onClick={handleClick}>{showOriginalLyricsButton}</button>
                        </div>
                    </div>
                }
                <button onClick={handleIndividualClick}>{buttonText}</button>
            </div>
        </>
    )
}

export default Dashboard;