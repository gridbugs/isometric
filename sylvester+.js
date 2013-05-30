Vector.prototype.dot = function(v) {
    var sum = 0;
    for (var i in this.elements) {
        if (this.elements[i] == undefined || v.elements[i] == undefined) {
            break;
        }
        sum += this.elements[i] * v.elements[i];
    }
    return sum;
}

Vector.prototype.projectOn = function(v) {
  return v.multiply(this.dot(v)/v.dot(v));
};
