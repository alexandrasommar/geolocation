(function () {
	var zombie = localStorage.getItem('zombie'),
			photo = document.querySelector('.js-zombie'),
			h1 = document.querySelector('.js-heading');

	// Animate the h1
	TweenMax.fromTo(h1, 1, {alpha: 0}, {alpha: 1, yoyo: true, repeat: -1});

	function complete () {
		photo.className = 'hidden';
		localStorage.setItem('zombie', photo.className);
	}
	// If it is the first time the user visits the site, animate the zombie image
	// else don't display it
	if(!zombie) {
		TweenMax.from(photo, 1, {x:'700', rotate: '45deg', yoyo: true, ease:Power2.easeInOut, repeat: 4, onComplete: complete});
	} else {
		photo.className = 'hidden';
	}
})();
