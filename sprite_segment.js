function SpriteSegment(frame, position, start, end, region, character){
    this.frame = frame;
    this.position = position;
    this.start = start;
    this.end = end;
    this.amount = end - start;
    this.width = this.amount * this.frame.width;
    this.region = region;
    this.height = character.get_height(0.5);
    console.debug(this.width);
}
SpriteSegment.create = function(sprite, position, start, end, region, character) {
    var frame = sprite.get_next_frame();
    return new SpriteSegment(frame, position, start, end, region, character);
}
$SS = SpriteSegment.create;
