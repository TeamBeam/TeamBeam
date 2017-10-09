import React from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap'

// TODO: Refactor to get/store img data from database
// Using hardcoded images For MVP presentation

const Collaboration = (props) => {

	var divStyle = {
		height: "200px",
		width: "200px"
  };

	return (
		<div className="collab">
			<h3> Collaborations </h3>
				<Col xs={6} md={6}>
					<Row> <img style={divStyle} className="thumbnail" src="https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" alt="pic"/> </Row>
					<Row> <img style={divStyle} className="thumbnail" src="https://i.pinimg.com/736x/e8/1e/5f/e81e5fe912cb11bbc77afa34032231d4--album-design-cd-design.jpg" alt="pic"/></Row>
				</Col>

				<Col xs={6} md={6}>
					<Row> <img style={divStyle} className="thumbnail" src="https://www.indierockcafe.com/imgs/phoenix-wolfgang-art.jpg" alt="pic"/> </Row>
					<Row><img style={divStyle} className="thumbnail" src="https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/1e/8c/2c/1e8c2cf8-d524-4149-1e8f-a76d4c382602/886446424569.jpg/600x600bf.jpg" alt="pic"/></Row>
				</Col>
		</div>
	)
}

export default Collaboration