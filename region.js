/*
 * A convex polygon that can contain walls and sub-regions
 *
 * elements: an array of points that define the region's boundary
 * height: the vertical offset of the region (relative to its parent
 * region or 0 if it's the root)
 * walls: an array of walls that exist in this region
 * regions: an array of subregions that exist in this region
 * visible: (optional) whether the border of this region should be drawn
 */
function Region(){}

// This will contain each shared edge
Region.shared_edges = [];

Region.create = function(elements, height, walls, regions, visible, characters) {
    var r = new Region();
    r.elements = elements.map($V);
    r.walls = walls;
    r.regions = regions;
    r.height = height;
    r.characters = default_value(characters, []);
    r.visible = default_value(visible, false);

    /*
     * This is an array of walls representing regions. For each sub-region
     * of this region, there is a virtual wall which goes from the left-most
     * point on its boundary to the right-most point. These virtual walls
     * are used for finding the draw order.
     */
    r.virtual_walls = [];

    r.sprite_segments = [];

    for (var i in r.walls) {
        r.walls[i].base = height;
    }


    return r;
}
// A short name for creating regions
$R = Region.create;

Region.prototype.get_height = function() {
    return this.height;
}

Region.prototype.flush_sprites = function() {
    this.sprite_segments = [];
    this.regions.map(function(r){r.flush_sprites()});
}

// Declares an edge as shared between two regions
Region.share_edge = function(r1, r2, ls) {
    // TODO: sanity checking the edge
    Region.shared_edges.push({
        regions: [r1, r2],
        line_segment: ls
    });
}

// returns true iff a point is inside the region
Region.prototype.contains_point = function(v) {
    return in_polygon(this.elements, v);
}

// Rotates the region and everything it contains about a point
Region.prototype.rotate = function(angle, centre) {
    for (var i in this.elements) {
        this.elements[i].elements = this.elements[i].elements.slice(0, 2);
        this.elements[i] = this.elements[i].rotate(angle, centre);
    }
    for (var i in this.walls) {
        this.walls[i].rotate(angle, centre);
    }
    for (var i in this.regions) {
        this.regions[i].rotate(angle, centre);
    }
    for (var i in this.characters) {
        this.characters[i].rotate(angle, centre);
    }
//    for (var i in Region.shared_edges) {
//        Region.shared_edges[i].line_segment.rotate(angle, centre);
//    }
}

/*
 * Returns a new (virtual) wall object spanning from the left-most
 * point of the region to the right-most point.
 *
 * left_to_right: a vector defining the direction from left to right
 */
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
        this.virtual_walls.push(this.regions[i].generate_cross_wall(left_to_right));
    }
}

/*
 * Creates a static draw order for this region. The array will be stored
 * as a field of the region, and is also returned by this function
 * for convenience.
 *
 * away: a vector defining the direction away from the eye
 * left_to_right: a vector defining the right direction
 */
Region.prototype.generate_draw_order = function(away, left_to_right) {

    if (away == undefined) {
        away = $V([0, -1]);
    }
    if (left_to_right == undefined) {
        left_to_right = $V([1, 0]);
    }

    // generate the virtual walls for each sub-region
    this.generate_virtual_walls(left_to_right);

    var all_walls = this.walls.concat(this.virtual_walls);

    // sort all the walls and direct sub-regions into their draw order
    this.draw_order = DrawOrder.arrange(all_walls, away);

    /*
     * Put this region at the start of the draw order. It's drawn first
     * as any wall in the region must be drawn on top.
     */
    this.draw_order.unshift(this);

    /*
     * Find each virtual wall in the draw order, and replace them with an array
     * containing the draw order of the associated sub-region.
     */
    for (var i in this.draw_order) {
        if (this.draw_order[i].is_virtual) {
            // this.draw_order[i].region is the associated subregion of the virtual wall
            this.draw_order.splice(i, 1, this.draw_order[i].region.generate_draw_order(away, left_to_right));
        }
    }

    // since we replace virtual walls with arrays, the array now needs to be flattened
    this.draw_order = flatten(this.draw_order);
    return this.draw_order;
}

/*
 * A sloped region is a region that can have a gradient.
 * Most of the methods defined for Region still apply, so
 * a Region instance will be used as a prototype.
 */
function SlopedRegion(){}
SlopedRegion.prototype = new Region();

SlopedRegion.prototype.get_height = function(p, q) {
    var a = this.slope.constant -
           this.slope.xcoef * p.elements[0] -
           this.slope.ycoef * p.elements[1];



    return a;
}

/*
 * Returns a region that can have a gradient, defined by three points
 * on the plane. The points are given in the "slope_references" argument
 * and are 3d vectors.
 */
SlopedRegion.create = function(elements, slope_references, visible) {
    var r = new SlopedRegion();

    r.elements = elements.map($V);

    r.visible = visible;
    r.slope_references = slope_references.map($V);
    r.calculate_coefficients();
    // give it some properties to make it work with region
    r.regions = [];
    r.walls = [];
    return r;
}

SlopedRegion.prototype.calculate_coefficients = function() {
    var p1, p2, p3;
    p1 = this.slope_references[0];
    p2 = this.slope_references[1];
    p3 = this.slope_references[2];
    var p = p1;

    // normal vector to plane
    var n = p2.subtract(p1).cross(p3.subtract(p1));

    /* ratio of x and z components of normal (useful constant)
     * this is the coefficient of x in the cartesian equation of the plane
     */
    var nxz = n.elements[0] / n.elements[2];

    /* ratio of y and z components of normal (useful constant)
     * this is the coefficient of y in the cartesian equation of the plane
     */
    var nyz = n.elements[1] / n.elements[2];

    // this is the constant in the cartesian equation of the plane
    var c = nxz * p.elements[0] + nyz * p.elements[1] + p.elements[2];

    /* these values describe the slope of the region as the coefficients
     * of an equation to calculate the height of a given point:
     * h(x, y) = - nxz * x - nyz * y + c
     */
    this.slope = {
        xcoef: nxz,
        ycoef: nyz,
        constant: c,
        toString: function(){return "slope: " + nxz + ", " + nyz + ", " + c}
    };


}


/* This is extended to update the coefficients after rotating */
SlopedRegion.prototype.rotate = function(angle, centre) {
    for (var i in this.elements) {
        this.elements[i].elements = this.elements[i].elements.slice(0, 2);
        this.elements[i] = this.elements[i].rotate(angle, centre);
    }
    for (var i in this.walls) {
        this.walls[i].rotate(angle, centre);
    }
    for (var i in this.regions) {
        this.regions[i].rotate(angle, centre);
    }
    for (var i in this.characters) {
        this.characters[i].rotate(angle, centre);
    }

    /* the slope references are 3d vectors but this rotation only
     * occurs in 2 dimensions, so we need to make a 2d copy of the
     * slope references with the heights removed */
    this.slope_references =
        this.slope_references.map(
            function(x){
                return $V($V(x.elements.slice(0,2)).rotate(angle, centre).elements.concat([x.elements[2]]));
            }
        );
    this.calculate_coefficients();
}


$SR = SlopedRegion.create;
