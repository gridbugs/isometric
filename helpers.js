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
