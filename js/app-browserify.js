// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/polyfill")

var Promise = require('es6-promise').Promise

var Backbone = require('Backbone')

var React = require('react')

var clientId = '5b0d197fa9c0a7e2f9ccdf975be97e8a',
	secret = '85f60ef57548dd8eff54f32023da205e',
	endUserAuthorization = 'https://soundcloud.com/connect',
	token = 'https://api.soundcloud.com/oauth2/token'

console.log('loaded');

//IIFE




var Track = Backbone.Model.extend({

	defaults: {
		permalink: "nobody",
		title: "nothing"
	},

	initialize: function(trackId) {
		this.trackId = trackId
		console.log(trackId)
		this.url = `https://api.soundcloud.com/tracks/${this.trackId}?client_id=${clientId}`
	},

	parse: function(results) {
		console.log('lockngajfd')
		console.log(results)
		return results
	}
})

class TrackView extends React.Component {

	constructor(props) {
		super(props)
		console.log(this)
		this.state = {playing: "notready"}
		this.props.trackData.on('sync', () => this.forceUpdate())
		console.log(this.props.trackData)
	}

	_dragBall(e) {
		console.log(this)
		window.view = this
		trackData.addEventListener('mousemove',followCursor)
		trackData.addEventListener('mouseup',unDrag.bind(null,sound))
	}

	_followCursor(){
		var mouseWithinDiv = e.clientX - barLeft
		ball.style.left = mouseWithinDiv - ballWidth/2 + 'px' // position within div is div's left border minus the cursor's position
	}	

 	_playOrPause() {

 		console.log('invoked and playing with state' + this.state.playing)
 		if (this.state.playing == "notready"){
 			this.setState({playing:"playing"})
 			SC.stream(`/tracks/${this.props.trackData.trackId}`,
 				(sound) => {
 					this.state.sound = sound
 					this.state.sound.play()
 				})
 			return
 		}
 		
 		else if (this.state.playing == "notplaying"){ 
 			console.log('playing')
 			this.state.sound.play()
 			this.setState({playing:"playing"})
 		}

 		else if (this.state.playing == "playing"){
 			console.log('pausing')
 			this.state.sound.pause()
 			this.setState({playing:"notplaying"})
 		}
		
	}

	render() {

		var playState = this.state.playing == "playing" ? "pause": "play"
		console.log(playState)
		return (
			<div className="track-view">
				<i className={playState + " material-icons"} onClick={this._playOrPause.bind(this)}></i>
				<div ref="track-data" className="track-data">
					<p className="title">{this.props.trackData.attributes.permalink}</p>
					<p className="artist">{this.props.trackData.attributes.title}</p>
					<div ref="bar" className="bar">
						<div ref="ball" className="ball" onMouseDown={(e) => this._dragBall.bind(this,e)()}></div>
					</div>
				</div>
	    	</div>
		)
	}
}

SC.initialize({
    client_id: clientId,
})

var track = new Track(77777)
React.render(<TrackView trackData={track}/>,document.querySelector('.container'))
track.fetch()
// SC.stream(`/tracks/${track.trackId}`,
//  				(sound) => {
//  					sound.play()
//  				})



// SC.get(`/tracks/${trackId}/`, (track) => initPlay(track))



// just Node?
// var fetch = require('node-fetch')
// Browserify?
// require('whatwg-fetch') //--> not a typo, don't store as a var

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }

