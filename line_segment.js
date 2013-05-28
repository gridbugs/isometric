
function LineSegment(){}
LineSegment.prototype.setVectors = function(pts) {
    this.elements = pts;
}
LineSegment.create = function(pts) {
    var a = new LineSegment();
    a.setVectors(pts);
    return a;
}
$LS = LineSegment.create;
