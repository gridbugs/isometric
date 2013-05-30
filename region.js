function Region(){}
Region.create = function(elements, height, walls, regions) {
    var r = new Region();
    r.elements = elements;
    r.walls = walls;
    r.regions = regions;
    r.height = height;
    return r;
}
$R = Region.create;

Region.prototype.generate_cross_wall = function(left_to_right) {
    

    var left_most = this.elements[0];
    var right_most = this.elements[0];
    var left_best = left_most.projectOn(left_to_right).modulus();
    var right_best = left_best;

    for (var i = 1;i!=this.elements.length;++i) {

        var proj = this.elements[i].projectOn(left_to_right);
        var mod = proj.modulus();
        
        if (left_to_right.dot(proj) < 0) {
            mod = -mod;
        }

        
        if (mod > left_best) {
            left_most = this.elements[i];
            left_best = mod;
        }

        if (mod < right_best) {
            right_most = this.elements[i];
            right_best = mod;
        }
    }
    
    var ret = $W([left_most, right_most], 0);
    return ret;
}

Region.prototype.generate_virtual_walls = function() {
    
}
