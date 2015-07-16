// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/polyfill")

var Promise = require('es6-promise').Promise

var clientId = '5b0d197fa9c0a7e2f9ccdf975be97e8a',
	secret = '85f60ef57548dd8eff54f32023da205e',
	endUserAuthorization = 'https://soundcloud.com/connect',
	token = 'https://api.soundcloud.com/oauth2/token'

console.log('loaded');

//IIFE
(function(){

	var tickBall = function(player,ball,barWidth){
		var newLeft = (player._currentPosition * barWidth) / player._duration
		ball.style.left = newLeft + 'px'
		// if (player._playRequested){
			
		// 	// setTimeout(tickBall,500,player,ball,barWidth)
		// }
	}

	var advanceBall = function(sound,trackView){
		var player = sound._player,
			ball = trackView.querySelector('.ball'),
			bar = trackView.querySelector('.bar'),
			style = window.getComputedStyle(bar),
			barWidth = style.getPropertyValue('width')
		barWidth = barWidth.split('').splice(0,barWidth.length-2).join('') //remove px
		setTimeout(tickBall,100,player,ball,barWidth)
	}


	var trackTemplate = function(trackData){
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

	console.log(this)

	var playTrack = function(sound) {
		window.sound = sound
		var trackView = document.querySelector('div.track-view')
		window.trackView = trackView
		var playButton = trackView.querySelector('.play')
		var player = sound._player,
			html5audio = sound._player._html5Audio,
			ball = trackView.querySelector('.ball'),
			bar = trackView.querySelector('.bar'),
			style = window.getComputedStyle(bar),
			barWidth = style.getPropertyValue('width'),
		barWidth = barWidth.split('').splice(0,barWidth.length-2).join('') //remove px
		console.log(this)
		window.player = player
		
		var tickBall = function(player,ball,barWidth){
			// var newLeft = (player._currentPosition * barWidth) / player._duration
			var newLeft = (player.currentTime * barWidth) / player.duration
			ball.style.left = newLeft + 'px'

			// if (player._playRequested){
				
			// 	// setTimeout(tickBall,500,player,ball,barWidth)
			// }
			}

		playButton.addEventListener('click',
			() => {
				console.log(playButton.className)
				if (playButton.className == "play material-icons"){
					console.log('playing')
					playButton.className = "pause material-icons"
					html5audio.onprogress = function()  {tickBall(this,ball,barWidth)}
					sound.play()
					// advanceBall(sound,trackView)
				}
				else if (playButton.className == "pause material-icons"){
					console.log('pausing')
					playButton.className = "play material-icons"
					sound.pause()
				}
			})
		}

	var streamTrack = function(trackId){
		SC.stream(`/tracks/${trackId}`, 
			{onfinish: function() {console.log('finished')}},function(sound){playTrack(sound)}
			)
		}

	SC.initialize({
	    client_id: clientId,
	})

	var trackId = 77777
	SC.get(`/tracks/${trackId}/`, (track) => {
		var container = document.querySelector('.container')
		container.innerHTML = trackTemplate(track)
		var id = track.id
		streamTrack(id)
	})

}())


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

