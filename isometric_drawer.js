/*
 * x_proj and y_proj are vectors
 */
function IsometricDrawer(name, x_proj, y_proj, origin) {
    this.canvas = $("#"+name)[0];
    this.ctx = this.canvas.getContext("2d");
    this.x_proj = x_proj;
    this.y_proj = y_proj;
    this.origin = origin;
    
    this.ctx.moveToV = function(v) {
        return this.moveTo(v.elements[0], v.elements[1]);
    }
    this.ctx.lineToV = function(v) {
        return this.lineTo(v.elements[0], v.elements[1]);
    }

    var drawer = this;
    LineSegment.prototype.draw = function() {
        drawer.ctx.beginPath();
        drawer.ctx.moveToV(drawer.convert(this.elements[0]));
        drawer.ctx.lineToV(drawer.convert(this.elements[1]));
        drawer.ctx.stroke();
    }
    Wall.prototype.draw = function() {
        var c_elements = [];
        for (var i in this.elements) {
            c_elements[i] = drawer.convert(this.elements[i]).subtract($V([0, this.base]));
        }

        drawer.ctx.fillStyle = "white";
        drawer.ctx.beginPath();
        drawer.ctx.moveToV(c_elements[0]);
        drawer.ctx.lineToV(c_elements[1]);
        drawer.ctx.lineToV(c_elements[1].subtract($V([0, this.height])));
        drawer.ctx.lineToV(c_elements[0].subtract($V([0, this.height])));
        drawer.ctx.lineToV(c_elements[0]);
        drawer.ctx.stroke();
        drawer.ctx.fill();

    }

    Region.prototype.draw = function() {
        if (this.visible) {
            var c_elements = [];
            for (var i in this.elements) {
                c_elements[i] = drawer.convert(this.elements[i]);
            }

            drawer.ctx.fillStyle = "white";
            drawer.ctx.beginPath();
            drawer.ctx.moveToV(c_elements[c_elements.length-1].subtract($V([0, this.height])));
            for (var i in c_elements) {
                drawer.ctx.lineToV(c_elements[i].subtract($V([0, this.height])));
            }
            drawer.ctx.stroke();
            drawer.ctx.fill();
        }
    }
}

/*
 * takes a vector and returns its position in isometric space
 */
IsometricDrawer.prototype.convert = function(v) {
    return this.origin.add(this.x_proj.multiply(v.elements[0]).add(this.y_proj.multiply(v.elements[1])));
}
IsometricDrawer.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
