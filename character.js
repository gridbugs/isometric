function Character(){}
Character.create = function(initial_pos, width, sprite) {
    var ch = new Character();
    ch.position = initial_pos;
    ch.width = width;
    ch.radius = width/2;
    ch.sprite = sprite;
    ch.potential_regions = [];
    ch.current_region = ch.find_current_region();
    return ch;
}
$CH = Character.create;

Character.prototype.find_current_region = function(alternate_pos) {
    var position = default_value(alternate_pos, this.position);
    for (var i in this.potential_regions) {
        position.elements = position.elements.slice(0, 2);
        if (in_polygon(this.potential_regions[i].elements, position)) {
            return this.potential_regions[i];
        }
    }
    return null;
}

Character.prototype.base = function() {
    return $LS([[this.position.elements[0] - this.radius, this.position.elements[1]],
                [this.position.elements[0] + this.radius, this.position.elements[1]]]);
}

Character.prototype.get_height = function(offset) {
    var offset = default_value(offset, 0);
    var p;
    if (this.position.dimensions() == 2) {
        p = this.position.add($V([offset, 0]));
    } else {
        p = this.position.add($V([offset, 0, 0]));
    }
    console.debug(p);
    var r = this.find_current_region(p);
    if (r == null) {
        return 0;
    }
    return r.get_height(p);
}

Character.prototype.locate_self = function() {
    var ch = this;
    var base = this.base();
    var base_v = base.elements[1].subtract(base.elements[0]);
    // needed to compare to the result of intersections
    base.elements[0].elements[2] = 0;
    base.elements[1].elements[2] = 0;
    base_v.elements[2] = 0;

    // this will store the right-most region through which the base passes
    var last_region;

    // find all the intersection points
    var base_breaks =
    filter(Region.shared_edges.map(function(sh) {
        var ret = base.intersection_exc(sh.line_segment);
        return {pt: ret, edge: sh};
    }), function(x){return x.pt != null})
    .map(function(ict, i) {
        var pt = ict.pt;
        var edge = ict.edge;
        // how far along the base is the intersection
        var along = pt.subtract(base.elements[0]).modulus() / ch.width;

        // find a point slightly towards the start of the base
        var just_before = base.elements[0].add(base_v.multiply(along - 0.1));
        /*
         * just_before lies in either edge.regions[0] or regions[1]
         * Here, we determine which it is.
         */
        var lhs_region, rhs_region;
        if (in_polygon(edge.regions[0].elements, just_before)) {
            lhs_region = edge.regions[0];
            rhs_region = edge.regions[1];
        } else {
            lhs_region = edge.regions[1];
            rhs_region = edge.regions[0];
        }

        return {along: along, lhs_region: lhs_region, rhs_region: rhs_region};
    });

    if (base_breaks.length == 0) {
        if (this.current_region == null) {
            this.current_region = this.find_current_region();
        }
        this.current_region.sprite_segments.push(
            $SS(this.sprite, this.position, 0, 1, this.current_region, this));
        return;
    }
    this.current_region = null;

    // order by how far along the base the point is
    base_breaks = base_breaks.sort(function(x, y){return x.along > y.along});
    /*
     * create an array of segments - these represent parts of the base,
     * each existing in a separate region
     */
    var segments = [{left: 0, right: base_breaks[0].along, region: base_breaks[0].lhs_region,
            toString: function(){return "{"+this.left + ", " + this.right+"}"}
    }];
    for (var i = 1;i!=base_breaks.length;++i) {
        segments[i] = {
            left: base_breaks[i-1].along,
            right: base_breaks[i].along,
            region: base_breaks[i].lhs_region,
            toString: function(){return "{"+this.left + ", " + this.right+"}"}
        };
    }
    segments.push({
        left: segments[segments.length-1].right,
        right: 1,
        region: base_breaks[base_breaks.length-1].rhs_region,
        toString: function(){return "{"+this.left + ", " + this.right+"}"}
    });

    /* If there are two consecutive segments spanning regions of different gradients
     * there can be undesired artifacts caused by splitting, so just don't split
     * and hope for the best.
     * This is where we merge any such pairs back into the same section.
     */
    var new_segments = [];
    var s, t;
    while(s = segments.shift()) {
        if (! (t = segments[0])) {
            new_segments.push(s);
        } else if (s.region.equal_gradient(t.region)) {
            new_segments.push(s);
        } else {
            console.debug("merge");
            // determine which region is drawn last
            var last_drawn;
            if (s.region.draw_order_position > t.region.draw_order_position) {
                last_drawn = s.region;
            } else {
                last_drawn = t.region;
            }
            new_segments.push({
                left: s.left,
                right: t.right,
                region: last_drawn
            });
            segments.shift();
        }
    }
    segments = new_segments;
    console.debug(segments);

    for (var i in segments) {
        segments[i].region.sprite_segments.push(
            $SS(this.sprite, this.position, segments[i].left, segments[i].right, segments[i].region, this)
        );
    }

}

Character.prototype.rotate = function(angle, centre) {
    if (this.position.elements.length == 3) {
        this.position.elements = this.position.elements.splice(0, 2);
    }
    this.position = this.position.rotate(angle, centre);
}
