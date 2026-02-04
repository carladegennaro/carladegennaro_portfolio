function setup() {
    createCanvas(400, 400);
    background(200, 220, 0);
}

function draw() {
    textSize(37)
    fill(random(255))
    textAlign(CENTER, CENTER)
    textFont("Courier New")
    text("SLAY",width/2,height/2);

    let c = get(0,0,width,height);
    translate(width/2,height/2);
    rotate(mouseX*0.1)
    imageMode(CENTER);
    image(c,mouseX*0.1,mouseY*0.1,c.width+2,c.height+2);

}
