function Wall() {};
Wall.prototype = new LineSegment();
Wall.create = function(pts, ht) {
    var w = new Wall();
    w.setVectors(pts);
    w.height = ht;
    return w;
}
$W = Wall.create;
