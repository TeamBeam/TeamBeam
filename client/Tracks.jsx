import React from 'react';
import { Panel } from 'react-bootstrap'

// Likely refactor. Need to store tracks

const Tracks = (props) => {

	let albums = props.albums.map(album => {
		let songs = JSON.parse(album.songs).map(song => <li className="tracks"> {song} </li> );
		  return <div className="album-title"> {album.title} {songs} </div>});

	return (
		<div className="recent-track">
			<h3> Recent Tracks </h3>
				<div> {albums} </div>
		</div>
  )
}

export default Tracks

