window.addEventListener("scroll", function(e) {
	document.documentElement.style.setProperty("--scroll-position", window.scrollY);
	console.log("A");
});