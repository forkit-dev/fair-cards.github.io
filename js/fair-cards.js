function documentReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
} 

function animatePhone() {
    var imageUpdated = false;
    anime({
        targets: '#phone',
        translateX: -10,
        translateY: -100,
        duration: 5000,
        easing: 'easeOutElastic(1, .3)',
        update: function(anime) {
            if (imageUpdated == true) {
                return;
            }
            if (anime.progress > 15.0) {
                imageUpdated = true;
                document.getElementById('phone-screen').setAttribute("class", "phone phone-4 active");
                console.log("done111");
            }
        }
    });  
}

function preparePhoneTimeline(divName, translateY) {
    var elements = document.querySelectorAll(divName);
    var timeline = anime.timeline({ autoplay: false });
    timeline.add({
		targets: elements,
        translateY: [translateY, -translateY],
		duration: anime.random(500, 5000), 
        easing: 'linear',
	}, 0);
    return timeline;
}

function getPercentage(divName) {
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    var box = document.querySelector(divName).getBoundingClientRect();
    var current = box.top;
    current = current > windowHeight ? windowHeight : current;
    current = current < -box.height ? -box.height : current;
    var percentage = ((windowHeight - current) / (windowHeight + box.height));
    return percentage;
}

documentReady(() => {
    Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        animatePhone();
    });
    var useCases = ['.use-cases .first', '.use-cases .second', '.use-cases .third'];
    var phoneTimelines = useCases.reduce(function(map, key) {
        map.set(key, preparePhoneTimeline(key + ' .phone-case', 80));
        return map;
    }, new Map());
    var textTimelines = useCases.reduce(function(map, key) {
        map.set(key, preparePhoneTimeline(key + ' .description', 160));
        return map;
    }, new Map());
    window.onscroll = function() {
        var keys = phoneTimelines.keys();
        var next = keys.next();
        while (!next.done) {
            var percentage = getPercentage(next.value);
            var phoneTimeline = phoneTimelines.get(next.value);
            var textTimeline = textTimelines.get(next.value);
            phoneTimeline.seek(phoneTimeline.duration * percentage);
            textTimeline.seek(textTimeline.duration * percentage);
            next = keys.next();
        }
    };
});
