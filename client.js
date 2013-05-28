$(function(){

    var drawer = new Drawer('screen');

    var lines = [
        $LS([$V([40, 5]), $V([40, 45])]),
        $LS([$V([80, 35]), $V([80, 75])]),
        $LS([$V([60, 65]), $V([60, 105])]),
        $LS([$V([30, 55]), $V([70, 55])]),
        $LS([$V([50, 25]), $V([90, 25])]),
        $LS([$V([90, 70]), $V([130, 70])])
    ];

    for (i in lines) {
        for (j in lines[i].elements) {
            lines[i].elements[j] = 
                lines[i].elements[j].rotate(Math.PI/4, $V([50, 50]))
                .multiply(2);
        }
    }

    for (i in lines) {
        lines[i].draw();
    }
})
