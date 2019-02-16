let width;
let height;
let canvas;

let song;

let pivot;
let weight1;
let weight2;

const radius1 = 20;
const radius2 = 20;
const customArmLengths = false;
let arm1_length = 50;
let arm2_length = 50;
const mass1 = 10;
const mass2 = 10;
let angle1;
let angle2;
let a1_v = 0;
let a2_v = 0;
let a1_acc = 0;
let a2_acc = 0;
const g = 1;

let showLabel = true;
let showWeight1Trace = false;

var points1;
var points2;

function preload()
{
    song = loadSound("music.mp3");
    song.setLoop(true);
}

function setup()
{
    width = window.innerWidth - 20;
    height = window.innerHeight - 20;
    canvas = createCanvas(width, height);

    textAlign(CENTER);
    textSize(16);

    pivot = createVector(width / 2, height / 2);

    angle1 = random(0, 2 * PI);
    angle2 = random(0, 2 * PI);

    if(!customArmLengths)
    {
        if(height < width)
        {
            arm1_length = height / 4 - 50;
            arm2_length = arm1_length;
        }
        else
        {
            arm1_length = height / 4 - 50;
            arm2_length = arm1_length;
        }
    }

    weight1 = new Weight(0, 0, radius1, arm1_length, mass1, angle1, a1_v, a1_acc);
    weight2 = new Weight(0, 0, radius2, arm2_length, mass2, angle2, a2_v, a2_acc);

    points1 = [];
    points2 = [];

    song.play();
}

function mousePressed()
{
    showWeight1Trace = !showWeight1Trace;

    getAudioContext().resume();
    showLabel = false;
}

function updateAccelerations()
{
    let num1 = -g * (2 * weight1.mass + weight2.mass) * sin(weight1.angle);
    let num2 = -weight2.mass * g * sin(weight1.angle - 2 * weight2.angle);
    let num3 = -2 * sin(weight1.angle - weight2.angle) * weight2.mass;
    let num4 = weight2.ang_vel * weight2.ang_vel * weight1.arm_length + weight1.ang_vel * weight1.ang_vel * weight1.arm_length * cos(weight1.angle - weight2.angle);
    let den = weight1.arm_length * (2 * weight1.mass + weight2.mass - weight2.mass * cos(2 * weight1.angle - 2 * weight2.angle));
    weight1.ang_acc = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(weight1.angle - weight2.angle);
    num2 = (weight1.ang_vel * weight1.ang_vel * weight1.arm_length * (weight1.mass + weight2.mass));
    num3 = g * (weight1.mass + weight2.mass) * cos(weight1.angle);
    num4 = weight2.ang_vel * weight2.ang_vel * weight2.arm_length * weight2.mass * cos(weight1.angle - weight2.angle);
    den = weight2.arm_length * (2 * weight1.mass + weight2.mass - weight2.mass * cos(2 * weight1.angle - 2 * weight2.angle));
    weight2.ang_acc = (num1 * (num2 + num3 + num4)) / den;
}

function updatePositions()
{
    weight1.position.x = weight1.arm_length * sin(weight1.angle);
    weight1.position.y = weight1.arm_length * cos(weight1.angle);

    weight2.position.x = weight1.position.x + weight2.arm_length * sin(weight2.angle);
    weight2.position.y = weight1.position.y + weight2.arm_length * cos(weight2.angle);
}

function updateVelocitiesAndAngle()
{
    weight1.ang_vel += weight1.ang_acc;
    weight2.ang_vel += weight2.ang_acc;
    weight1.angle += weight1.ang_vel;
    weight2.angle += weight2.ang_vel;
}

function draw()
{
    background(0);

    fill(255);
    text("click to toggle weight 1 trace", width / 2, height - 50);

    if(showLabel)
        text("if on chrome, click to start playing music", width / 2, height - 20);

    // Update components
    updateAccelerations();
    updateVelocitiesAndAngle();
    updatePositions();

    // Draw double pendulum
    translate(pivot.x, pivot.y);
    stroke(255);
    strokeWeight(2);

    line(0, 0, weight1.position.x, weight1.position.y);
    fill(0);
    ellipse(weight1.position.x, weight1.position.y, weight1.radius, weight1.radius);

    line(weight1.position.x, weight1.position.y, weight2.position.x, weight2.position.y);
    fill(0);
    ellipse(weight2.position.x, weight2.position.y, weight2.radius, weight2.radius);

    // Add second weight position
    points1.push(new Point(weight1.position.x, weight1.position.y));

    // Add second weight position
    points2.push(new Point(weight2.position.x, weight2.position.y));

    // Draw the first weight's previous positions
    if(showWeight1Trace)
    {
        for(var i = 0; i < points2.length - 1; i++)
        {
            colorMode(HSB);
            stroke(map(i, 0, points1.length, 200, 250), 255, map(i, 0, points1.length, 0, 255));
            line(points1[i].position.x, points1[i].position.y, points1[i + 1].position.x, points1[i + 1].position.y);
        }
    }

    // Draw the second weight's previous positions
    for(var i = 0; i < points2.length - 1; i++)
    {
        colorMode(HSB);
        stroke(map(i, 0, points2.length, 100, 150), 255, map(i, 0, points2.length, 0, 255));
        line(points2[i].position.x, points2[i].position.y, points2[i + 1].position.x, points2[i + 1].position.y);
    }

    // Draw outside circle
    noFill();
    colorMode(RGB);
    stroke(255, 255, 255, 50);
    ellipse(0, 0, 2 * (weight1.arm_length + weight2.arm_length + 5));

    // Only store at most 500 points
    if(points1.length > 500)
        points1.splice(0, 1);

    if(points2.length > 500)
        points2.splice(0, 1);
}