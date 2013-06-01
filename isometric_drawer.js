/*
 * x_proj and y_proj are vectors
 */
function IsometricDrawer(name, x_proj, y_proj, origin) {
    this.canvas = $("#"+name)[0];
    this.ctx = this.canvas.getContext("2d");
    this.x_proj = x_proj;
    this.y_proj = y_proj;
    this.origin = origin;

    this.ctx.beginPath();
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(100,100);
    this.ctx.stroke();

    this.ctx.moveToV = function(v) {
        return this.moveTo(v.elements[0], v.elements[1]);
    }
    this.ctx.lineToV = function(v) {
        return this.lineTo(v.elements[0], v.elements[1]);
    }

    var _this = this;
    LineSegment.prototype.draw = function() {
        _this.ctx.beginPath();
        _this.ctx.moveToV(_this.convert(this.elements[0]));
        _this.ctx.lineToV(_this.convert(this.elements[1]));
        _this.ctx.stroke();
    }
    Wall.prototype.draw = function() {
        var c_elements = [];
        for (var i in this.elements) {
            c_elements[i] = _this.convert(this.elements[i]).subtract($V([0, this.base]));
        }

        _this.ctx.fillStyle = "white";
        _this.ctx.beginPath();
        _this.ctx.moveToV(c_elements[0]);
        _this.ctx.lineToV(c_elements[1]);
        _this.ctx.lineToV(c_elements[1].subtract($V([0, this.height])));
        _this.ctx.lineToV(c_elements[0].subtract($V([0, this.height])));
        _this.ctx.lineToV(c_elements[0]);
        _this.ctx.stroke();
        _this.ctx.fill();

    }

    Region.prototype.draw = function() {
        if (this.visible) {
            var c_elements = [];
            for (var i in this.elements) {
                c_elements[i] = _this.convert(this.elements[i]);
            }

            _this.ctx.fillStyle = "white";
            _this.ctx.beginPath();
            _this.ctx.moveToV(c_elements[c_elements.length-1].subtract($V([0, this.height])));
            for (var i in c_elements) {
                _this.ctx.lineToV(c_elements[i].subtract($V([0, this.height])));
            }
            _this.ctx.stroke();
            _this.ctx.fill();
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
