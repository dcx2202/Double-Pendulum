class Point
{
    constructor(x, y)
    {
        this.position = createVector(x, y);
    }

    show()
    {
        colorMode(HSB);
        stroke(this.hue, 255, 255);
        ellipse(this.position.x, this.position.y, 1);
    }
}