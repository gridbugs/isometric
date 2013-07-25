function SpriteSegment(frame, position, start, end){
    this.frame = frame;
    this.position = position;
    this.start = start;
    this.end = end;
    this.amount = end - start;
    this.width = this.amount * this.frame.width;
}
SpriteSegment.create = function(sprite, position, start, end) {
    var frame = sprite.get_next_frame();
    return new SpriteSegment(frame, position, start, end);
}
$SS = SpriteSegment.create;
