function Character(){}
Character.create = function(initial_pos, radius) {
    var ch = new Character();
    ch.position = initial_pos;
    ch.radius = radius;
    return ch;
}
$CH = Character.create;
Character.prototype.locate_self = function() {
    
}

Character.prototype.rotate = function(angle, centre) {
    this.position = this.position.rotate(angle, centre);
    console.debug("rotated");
    console.debug(this.position);
}
