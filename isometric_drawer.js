/*
 * x_proj and y_proj are vectors
 */
function IsometricDrawer(name, x_proj, y_proj, origin) {
    this.canvas = $("#"+name)[0];
    this.ctx = this.canvas.getContext("2d");
    this.x_proj = x_proj;
    this.y_proj = y_proj;
    this.origin = origin;

    // create a frame buffer for rendering to before preprocessing
    this.fb = $FB(1400, 800);

    // flag used in each frame to determine if the character has been drawn yet
    this.player_drawn = false;

    var x_len = x_proj.modulus();
    var y_len = y_proj.modulus();
    this.horizontal_unit = Math.sqrt(x_len*x_len+y_len*y_len);

    this.ctx.moveToV = function(v) {
        return this.moveTo(v.elements[0], v.elements[1]);
    }
    this.ctx.lineToV = function(v) {
        return this.lineTo(v.elements[0], v.elements[1]);
    }

    var drawer = this;
    LineSegment.prototype.draw = function() {
        drawer.ctx.strokeStyle = "blue";
        drawer.ctx.beginPath();
        drawer.ctx.moveToV(drawer.convert(this.elements[0]));
        drawer.ctx.lineToV(drawer.convert(this.elements[1]));
        drawer.ctx.stroke();
    }

    PositionedImage.prototype.draw = function(ctx_arg) {
        var ctx = ctx_arg == undefined ? drawer.ctx : ctx_arg;
        if (this.image) {
            ctx.drawImage(this.image, this.position[0], this.position[1]);
        }
    }

    Wall.prototype.draw = function() {
        var ctx;
        if (drawer.player_drawn) {
            ctx = drawer.fb.ctx;
        } else {
            ctx = drawer.ctx;
        }
        
        if (this.positioned_image) {
            this.positioned_image.draw(ctx);
            return;
        }
        var c_elements = [];
        for (var i in this.elements) {
            c_elements[i] = drawer.convert(this.elements[i]).subtract($V([0, this.base]));
        }

        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveToV(c_elements[0]);
        ctx.lineToV(c_elements[1]);
        ctx.lineToV(c_elements[1].subtract($V([0, this.height])));
        ctx.lineToV(c_elements[0].subtract($V([0, this.height])));
        ctx.lineToV(c_elements[0]);
        ctx.stroke();
        ctx.fill();

    }

    Region.prototype.draw = function() {
        if (this.visible) {
            if (this.positioned_image) {
                this.positioned_image.draw();
            } else {

                var c_elements = [];
                for (var i in this.elements) {
                    c_elements[i] = drawer.convert(this.elements[i]);
                }

                drawer.ctx.strokeStyle = "black";
                drawer.ctx.lineWidth = 2;
                drawer.ctx.fillStyle = "white";
                drawer.ctx.beginPath();
                drawer.ctx.moveToV(c_elements[c_elements.length-1].subtract($V([0, this.get_height(this.elements[this.elements.length - 1]) ])));
                for (var i in c_elements) {
                    drawer.ctx.lineToV(c_elements[i].subtract($V([0, this.get_height(this.elements[i])])));
                }
                drawer.ctx.fill();
                drawer.ctx.stroke();
            }
        }
        for (var i in this.sprite_segments) {
            this.sprite_segments[i].draw();
        }
    }




    Character.prototype.draw = function() {
        var base = this.base();
        var c_elements = [drawer.convert(base.elements[0]),
                          drawer.convert(base.elements[1])];
        /*
        drawer.ctx.strokeStyle = "red";
        drawer.ctx.lineWidth = 2;
        drawer.ctx.beginPath();
        drawer.ctx.moveToV(c_elements[0]);
        drawer.ctx.lineToV(c_elements[1]);
        drawer.ctx.stroke();
        */
    }

    SpriteSegment.prototype.draw = function() {
        var c_position = drawer.convert(this.position);
        var top_left = c_position.subtract($V([this.frame.width/2 - this.start * this.frame.width, this.frame.height]));
        if (this.end == 1) {
            this.width -= 0.001;
        }
        drawer.ctx.drawImage(
            // image to draw
            this.frame.image,
            // offset into the original image to start drawing
            this.frame.x + this.frame.width * this.start, this.frame.y,
            // amount of original image to draw
            this.width, this.frame.height,
            // offset on the canvas to start drawing
            top_left.elements[0], top_left.elements[1] - this.height,
            // actual size of drawn image on canvas
            this.width, this.frame.height
        );

        if (this.start == 0) {
            drawer.player_top_left_x = top_left.elements[0];
            drawer.player_top_left_y = top_left.elements[1] - this.height;
        }

        if (this.end == 1) {
            drawer.player_width = this.width;
            drawer.player_height = this.frame.height;
            drawer.player_drawn = true;
        }

/*
        drawer.ctx.strokeStyle = "red";
        drawer.ctx.beginPath();
        drawer.ctx.strokeRect(top_left.elements[0], top_left.elements[1] - this.height, this.width, this.frame.height);
        drawer.ctx.stroke();

        var a = drawer.convert(this.base.elements[0]);
        var b = drawer.convert(this.base.elements[1]);
        drawer.ctx.strokeStyle = "green";
        drawer.ctx.beginPath();
        drawer.ctx.moveTo(a.elements[0], a.elements[1]);
        drawer.ctx.lineTo(b.elements[0], b.elements[1]);
        drawer.ctx.stroke();
*/
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
    this.fb.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
