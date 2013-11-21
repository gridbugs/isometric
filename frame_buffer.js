function FrameBuffer(){}
FrameBuffer.global_count = 0;

FrameBuffer.create = function(width, height) {
    var fb = new FrameBuffer();
    fb.id = "framebuffer" + (FrameBuffer.global_count++);
    fb.canvas = document.createElement("canvas");
    fb.ctx = fb.canvas.getContext('2d');
    fb.canvas.width = width;
    fb.canvas.height = height;
    return fb;
}

$FB = FrameBuffer.create;
