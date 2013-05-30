function LineSegment(){}
LineSegment.prototype.setVectors = function(pts) {
    this.elements = pts;
}
LineSegment.prototype.get_extended = function() {
    return $L(this.elements[0], this.elements[1].subtract(this.elements[0]));
}
LineSegment.prototype.contains_colinear_inc = function(v) {
    return ((this.elements[0].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[1].elements[0]) ||
           (this.elements[1].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[0].elements[0])) &&
           ((this.elements[0].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[1].elements[1]) ||
           (this.elements[1].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[0].elements[1]));
}
LineSegment.prototype.contains_colinear_exc = function(v) {
    return ((this.elements[0].elements[0] < v.elements[0] && v.elements[0] < this.elements[1].elements[0]) ||
           (this.elements[1].elements[0] < v.elements[0] && v.elements[0] < this.elements[0].elements[0])) &&
           ((this.elements[0].elements[1] < v.elements[1] && v.elements[1] < this.elements[1].elements[1]) ||
           (this.elements[1].elements[1] < v.elements[1] && v.elements[1] < this.elements[0].elements[1]));
}
LineSegment.create = function(pts) {
    var a = new LineSegment();
    a.setVectors(pts);
    return a;
}
$LS = LineSegment.create;
