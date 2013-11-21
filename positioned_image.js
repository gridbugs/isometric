function PositionedImage(){}
PositionedImage.create = function(image, position) {
    var p = new PositionedImage();
    if (image) {
        p.position = position;
        p.image = image;
    }
    return p;
}
$PI = PositionedImage.create;
