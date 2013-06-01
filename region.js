function Region(){}
Region.create = function(elements, height, walls, regions, visible) {
    var r = new Region();
    r.elements = elements;
    r.walls = walls;
    r.regions = regions;
    r.height = height;
    if (visible == undefined) {
        r.visible = false;
    } else {
        r.visible = visible;
    }
    r.virtual_walls = [];

    for (var i in r.walls) {
        r.walls[i].base = height;
    }
    return r;
}
$R = Region.create;

Region.prototype.rotate = function(angle, centre) {
    for (var i in this.elements) {
        this.elements[i] = this.elements[i].rotate(angle, centre);
    }
    for (var i in this.walls) {
        this.walls[i].rotate(angle, centre);
    }
    for (var i in this.regions) {
        this.regions[i].rotate(angle, centre);
    }
}

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
    ret.is_virtual = true;
    ret.region = this;
    return ret;
}

Region.prototype.generate_virtual_walls = function(left_to_right) {
    this.virtual_walls = [];
    for (var i in this.regions) {
        this.virtual_walls = this.regions[i].generate_cross_wall(left_to_right);
    }
}

Region.prototype.generate_draw_order = function(away, left_to_right) {
    this.generate_virtual_walls(left_to_right);
    var all_walls = this.walls.concat(this.virtual_walls);
    this.draw_order = DrawOrder.arrange(all_walls, away);
    this.draw_order.unshift(this);

    for (var i in this.draw_order) {
        if (this.draw_order[i].is_virtual) {
            this.draw_order.splice(i, 1, this.draw_order[i].region.generate_draw_order(away, left_to_right));
        }
    }

    this.draw_order = flatten(this.draw_order);
    return this.draw_order;
}
