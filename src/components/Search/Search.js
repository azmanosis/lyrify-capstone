import React from 'react';
import './Search.scss';

function Search({ track, chooseTrack }) {
    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div className="search" onClick={handlePlay}>
            <img src={track.albumUrl} className="search__image" alt="" />
            <div className="search__text">
                <div className="search__text--title">
                    {track.title}
                </div>
                <div className="search__text--artist">{track.artist}</div>
            </div>
        </div>
    )
}

export default Search;