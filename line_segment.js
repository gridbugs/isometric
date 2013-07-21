function LineSegment(){}
LineSegment.prototype.setVectors = function(pts) {
    this.elements = pts;
}

/*
 * Returns a line containing the two endpoints of the line segment
 */
LineSegment.prototype.get_extended = function() {
    return $L(this.elements[0], this.elements[1].subtract(this.elements[0]));
}

/*
 * Takes a point colinear to the line formed by extending the line segment
 * and returns true iff that point lies between (inclusive) the endpoints
 * of the line segment.
 */
LineSegment.prototype.contains_colinear_inc = function(v) {
    return ((this.elements[0].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[1].elements[0]) ||
           (this.elements[1].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[0].elements[0])) &&
           ((this.elements[0].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[1].elements[1]) ||
           (this.elements[1].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[0].elements[1]));
}

/*
 * Same as above but exclusive
 */
LineSegment.prototype.contains_colinear_exc = function(v) {
    return ((this.elements[0].elements[0] < v.elements[0] && v.elements[0] < this.elements[1].elements[0]) ||
           (this.elements[1].elements[0] < v.elements[0] && v.elements[0] < this.elements[0].elements[0])) &&
           ((this.elements[0].elements[1] < v.elements[1] && v.elements[1] < this.elements[1].elements[1]) ||
           (this.elements[1].elements[1] < v.elements[1] && v.elements[1] < this.elements[0].elements[1]));
}


/*
 * Returns the point of intersection between the lines containing two line segments
 * null if no such point exists
 */
LineSegment.prototype.intersection_between_extensions = function(other) {
    return this.get_extended().intersectionWith(other.get_extended());
}

LineSegment.prototype.intersection_inc = function(other) {
    return check(this.intersection_between_extensions(other),
        function(intersection) {
            return this.contains_colinear_inc(intersection) &&
                   other.contains_colinear_inc(intersection);
        });
}

LineSegment.prototype.intersection_exc = function(other) {
    return check(this.intersection_between_extensions(other),
        function(intersection) {
            return this.contains_colinear_exc(intersection) &&
                   other.contains_colinear_exc(intersection);
        });
}


LineSegment.create = function(pts) {
    var a = new LineSegment();
    a.setVectors(pts);
    return a;
}
$LS = LineSegment.create;
