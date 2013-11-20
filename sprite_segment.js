function SpriteSegment(frame, position, start, end, region, height){
    this.frame = frame;
    this.position = position;
    this.start = start;
    this.end = end;
    this.amount = end - start;
    this.width = this.amount * this.frame.width;
    this.region = region;
    this.height = height;
}
SpriteSegment.create = function(sprite, position, start, end, region, height) {
    var frame = sprite.get_next_frame();
    return new SpriteSegment(frame, position, start, end, region, height);
}
$SS = SpriteSegment.create;
