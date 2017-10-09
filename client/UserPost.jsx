import React from 'react';
import { Panel } from 'react-bootstrap'

const UserPost = (props) => {
	let posts = props.posts.map(post => <li> {post.message} </li>);

	return (
		<div className="post">
			<h3> Recent Posts </h3>
			<div> {posts} </div>
		</div>
	)
}


export default UserPost