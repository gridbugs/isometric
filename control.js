const LEFT=37;
const RIGHT=39;
const UP=38;
const DOWN=40;

function Control(character, acc, max_speed, left, right, up, down){
    this.keys_down = [];
    this.keys_down[LEFT] = false;
    this.keys_down[RIGHT] = false;
    this.keys_down[UP] = false;
    this.keys_down[DOWN] = false;

    this.directions = [];
    this.directions[LEFT] = left;
    this.directions[RIGHT] = right;
    this.directions[UP] = up;
    this.directions[DOWN] = down;

    this.movement = new Movement();
    this.character = character;
    this.acc = acc;
    this.max_speed = max_speed;
}

Control.prototype.key_down = function(code) {
    this.keys_down[code] = true;
}
Control.prototype.key_up = function(code) {
    this.keys_down[code] = false;
}

Control.prototype.bind_keys = function() {
    var control = this;
    document.onkeydown = function(e) {
        control.key_down(e.keyCode);
    }
    document.onkeyup = function(e) {
        control.key_up(e.keyCode);
    }
}

Control.prototype.velocity_change = function(speed) {
    var ret = $V([0, 0]);
    for (var i in this.directions) {
        if (this.keys_down[i]) {
            ret = ret.add(this.directions[i]);
        }
    }
    return ret.toUnitVector().multiply(speed);
}

Control.prototype.tick = function() {
    this.movement.change(this.velocity_change(this.acc), this.max_speed);
    this.movement.decay(0.9, 0.1);
    this.character.position = this.character.position.to2d().add(this.movement.velocity.to2d());
}
