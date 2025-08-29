
(function() {
	const splineContainer = document.querySelector('.spline-container');
	const links = document.querySelectorAll('.nav-link[data-target]');
	const hamburger = document.getElementById('hamburger');
	const navContainer = document.getElementById('nav-container');
	const sections = {
		skills: document.getElementById('skills'),
		projects: document.getElementById('projects'),
		contact: document.getElementById('contact')
	};

	function resetChildrenInitialState(sectionEl) {
		if (!sectionEl) return;
		const items = sectionEl.querySelectorAll('.container > *');
		items.forEach(function(el) {
			el.style.opacity = '0';
			el.style.transform = 'translateY(18px)';
		});
		void sectionEl.offsetHeight;
	}

	function showSection(key) {
		Object.keys(sections).forEach(function(k) {
			const sectionEl = sections[k];
			if (sectionEl) sectionEl.classList.remove('active');
		});
		const next = sections[key];
		if (!next) return;
		next.classList.add('entering');
		resetChildrenInitialState(next);
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				next.classList.add('active');
				next.classList.remove('entering');
				next.querySelectorAll('.container > *').forEach(function(el){
					el.style.opacity = '';
					el.style.transform = '';
				});
			});
		});
	}

	links.forEach(function(link) {
		link.addEventListener('click', function(ev) {
			ev.preventDefault();
			const target = this.getAttribute('data-target');
			if (!target) return;

			// Gestione ritorno alla home page
			if (target === 'home') {
				// Nascondi tutte le sezioni
				Object.keys(sections).forEach(function(k) {
					const sectionEl = sections[k];
					if (sectionEl) {
						sectionEl.classList.remove('active', 'leaving');
					}
				});
				
				// Mostra la home page (spline container)
				if (splineContainer) {
					splineContainer.classList.remove('fade-out');
				}
				return;
			}

			if (!splineContainer) return;

			if (!document.querySelector('.section.active')) {
				splineContainer.classList.add('fade-out');
				const onTransitionEnd = function() {
					splineContainer.removeEventListener('transitionend', onTransitionEnd);
					showSection(target);
				};
				splineContainer.addEventListener('transitionend', onTransitionEnd, { once: true });
				setTimeout(function() {
					if (getComputedStyle(splineContainer).opacity !== '0') return;
					showSection(target);
				}, 1100);
				return;
			}

			const current = document.querySelector('.section.active');
			if (current && sections[target]) {
				current.classList.add('leaving');
				setTimeout(function() {
					current.classList.remove('active');
					current.classList.remove('leaving');
					showSection(target);
				}, 750);
			} else {
				showSection(target);
			}
		});
	});

	// Gestione menu hamburger per mobile
	if (hamburger && navContainer) {
		hamburger.addEventListener('click', function() {
			hamburger.classList.toggle('active');
			navContainer.classList.toggle('active');
		});

		// Chiudi menu quando si clicca su un link
		links.forEach(function(link) {
			link.addEventListener('click', function() {
				hamburger.classList.remove('active');
				navContainer.classList.remove('active');
			});
		});
	}

	// (Rimosso) gestione/rimozione logo: ora gestito inline in index.html accanto a <spline-viewer>
})();
