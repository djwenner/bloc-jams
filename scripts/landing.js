var animatePoints = function() {
    var points = document.getElementsByClassName('point');

/* assignment work for refactoring code */
    var revealPoint = function(indexOfPoints) {
        points[indexOfPoints].style.opacity = 1;
        points[indexOfPoints].style.transform = "scaleX(1) translateY(0)";
        points[indexOfPoints].style.msTransform = "scaleX(1) translateY(0)";
        points[indexOfPoints].style.WebkitTransform = "scaleX(1) translateY(0)";
    }
    for (var i = 0; i < points.length; i++) {
        revealPoint(i);
    }
};
