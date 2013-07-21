function flatten(arr) {
    var flat = [];
    for (i in arr) {
        if (arr[i].constructor == Array) {
            flat = flat.concat(flatten(arr[i]));
        } else {
            flat.push(arr[i]);
        }
    }
    return flat;
}

function zip(xs, ys) {
    var res = [];
    for (var i in xs) {
        res[i] = {_1: xs[i], _2: ys[i]};
    }
    return res;
}

function zip_with(fn, xs, ys) {
    return zip(xs, ys).map(function(x){return fn(x._1, x._2)});
}
