// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/polyfill")

var Promise = require('es6-promise').Promise

var clientId = '5b0d197fa9c0a7e2f9ccdf975be97e8a',
	secret = '85f60ef57548dd8eff54f32023da205e',
	endUserAuthorization = 'https://soundcloud.com/connect',
	token = 'https://api.soundcloud.com/oauth2/token'

console.log('loaded2');

//IIFE


function ballPosToTime(player,ballLeft,barWidth){
	console.log(player._duration)
	console.log(ballLeft)
	console.log(barWidth)
	var newTime = (ballLeft * player._duration) / barWidth
	console.log('new time' + newTime)
	return newTime

}

var trackView,trackData,playButton,ball,bar,ballStyle,ballWidth,barWidth,barLeft

function initPlay(track) {
	// sets up a player view and loads the stream

	// set up view 
	var container = document.querySelector('.container')
	container.innerHTML = trackTemplate(track) //set track view. don't move
	// setup pointers to DOM
	trackView = document.querySelector('div.track-view')
	trackData = trackView.querySelector('div.track-data')
	playButton = trackView.querySelector('.play')
	ball = trackView.querySelector('.ball')
	bar = trackView.querySelector('.bar')
	ballStyle = window.getComputedStyle(ball)
	ballWidth = stripPx(ballStyle.getPropertyValue('width'))
	barWidth = stripPx(window.getComputedStyle(bar).getPropertyValue('width'))
	barLeft = bar.getBoundingClientRect().left

	// load stream
	SC.stream(`/tracks/${track.id}`, 
		{onfinish: () => console.log('finished')},
		(sound) => playTrack(sound)
	)
}

function customPause(sound){
	console.log('pausing')
	playButton.className = "play material-icons"
	sound.pause()
}

function dragBall(sound){
	// moves the ball according to cursor position
	customPause(sound)
	trackData.addEventListener('mousemove',followCursor)
	trackData.addEventListener('mouseup',unDrag)
}

function followCursor(e){
	var mouseWithinDiv = e.clientX - barLeft
	ball.style.left = mouseWithinDiv - ballWidth/2 + 'px' // position within div is div's left border minus the cursor's position
}

function unDrag(sound, html5audio){
	// stop following cursor, resume playing track
	trackData.removeEventListener('mousemove',followCursor)
	var ballLeft = stripPx(ballStyle.getPropertyValue('left'))
	window.sound = sound
	sound._player.seek(ballPosToTime(sound._player,ballLeft,barWidth))
	console.log('drag-playing')
	customPlay(sound, html5audio)
	trackData.removeEventListener('mouseup',unDrag)
}

function customPlay(sound, html5audio){
	console.log('playing')
	setTimeout(() => playButton.className = "pause material-icons",500,playButton)
	html5audio.onprogress = function(){tickBall(sound._player,ball,barWidth)}
	sound.play()
}

function playListener(sound, html5audio){
	// defines onclick functionality for the playButton

	if (playButton.className == "play material-icons") customPlay(sound, html5audio)
	else if (playButton.className == "pause material-icons") customPause(sound)
}

function playTrack(sound) {
	// adds event listeners for tracking ball and play button

	// get DOM objects and html5player
	var html5audio = sound._player._html5Audio
	
	// add the intended event listeners
	ball.addEventListener('mousedown',dragBall)
	playButton.addEventListener('click', playListener.bind(null, sound, html5audio))
}

function stripPx(string){
	return string.split('').splice(0,string.length-2).join('')
}

function tickBall(player,ball,barWidth){
	// moves the ball along one step
	var newLeft = timeToBallPos(player,barWidth)
	console.log(newLeft)
	ball.style.left = newLeft + 'px'
}

function timeToBallPos(player,barWidth){
	return (player._currentPosition * barWidth) / player._duration
}

function trackTemplate(trackData){
	// sets template for track view

	var html = `    	
		<div class="track-view">
			<i class="play material-icons"></i>
			<div class="track-data">
				<p class="title">${trackData.permalink}</p>
				<p class="artist">${trackData.title}</p>
				<div class="bar">
					<div class="ball"></div>
				</div>
			</div>
    	</div>`

	console.log(trackData)
	return html
}


SC.initialize({
    client_id: clientId,
})

var trackId = 77777

SC.get(`/tracks/${trackId}/`, (track) => initPlay(track))



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

