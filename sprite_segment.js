function SpriteSegment(image, position, start, end){
    this.image = image;
    this.position = position;
    this.start = start;
    this.end = end;

    this.top_left = position.subtract($V([image.width/2, image.height]));
}
SpriteSegment.create = function(image, position, start, end) {
    return new SpriteSegment(image, position, start, end);
}
$SS = SpriteSegment.create;
