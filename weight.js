class Weight
{
    constructor(x, y, r, arm_l, m, a, ang_vel, ang_acc)
    {
        this.position = createVector(x, y);
        this.radius = r;
        this.arm_length = arm_l;
        this.mass = m;
        this.angle = a;
        this.ang_vel = ang_vel;
        this.ang_acc = ang_acc;
    }

    show()
    {
        fill(150);
        ellipse(this.position.x, this.position.y, this.radius * 2);
    }

    updatePosition(x, y)
    {
        this.position.x = x;
        this.position.y = y;
    }
}