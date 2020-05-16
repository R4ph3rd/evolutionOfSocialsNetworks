class Network {

    constructor(name, creation, changelog, pos){
        this.name = name ;
        this.creation = creation ;
        this.changelog = changelog.map( (log) => {
            return new Node(log, pos, name);
        }) ;
        this.posLine = pos ;
        this.colorLine = hexToRgb('#000000');
        this.colorLine = color( this.colorLine.r, this.colorLine.g, this.colorLine.b);
        this.colorLine.setAlpha(100);
    }

    display(){

        push();
            fill(this.colorLine);
            noStroke();
            text(this.name, this.posLine.x, this.posLine.y - 50);

            rect(this.posLine.x, this.posLine.y - 10, 8, 20, 2);
        pop();

        push()
            strokeWeight(.5);
            stroke(this.colorLine);
            // console.log(this.colorLine)
            line(this.posLine.x + 8, this.posLine.y, width, this.posLine.y);

            // console.log(this.colorLine)
        pop();

        for (let node of this.changelog){
            node.display();
        }

        // redraw();
        
    }
}

class Node {

    constructor(log, posLine, networkName){
        this.feature = log.feature ;
        this.date = log.date ;
        this.category = log.category ;
        this.slug = log.slug ;
        this.desc = log.desc != undefined ? log.desc : ''
        this.pos = createVector(definePos(log.date), posLine.y) ;
        this.id = networkName + '_' + this.feature.trim().toLowerCase();
        this.colorNode = defineColor(log.category);
        this.colorNode.setAlpha(50);

        let div = document.createElement('div');
        div.id = this.id;
        div.classList.add('nodeCard');
        div.style.left = this.pos.x + 'px';
        div.style.top = this.pos.y + 'px';

        div.innerHTML = `
            <span class="date">${this.date}</span>
            <h3>${this.feature}</h3>
            <p class="desc">${this.desc}</p>

        `

        document.querySelector('body').appendChild(div)
    }

    display(){
        if (isHover(this.pos, (nodeSize/2) + 10)){
            push()
                noStroke();
                fill(245);
                rect(this.pos.x, this.pos.y, )
                noFill();
                stroke(0);
                strokeWeight(.5);
                ellipse(this.pos.x, this.pos.y,30,30);
            pop();

            if (!Array.from(document.getElementById(this.id).classList).includes('visible')){
                document.getElementById(this.id).classList.add('visible');
                this.colorNode.setAlpha(255);
            }

        } else {
            if (Array.from(document.getElementById(this.id).classList).includes('visible')){
                this.colorNode.setAlpha(50);
                document.getElementById(this.id).classList.remove('visible');
            }

            if (similarsShow.includes(this.slug)){
                this.colorNode.setAlpha(255);
            } else {
                this.colorNode.setAlpha(50);
            }
        }

        push()
            fill(this.colorNode);
            noStroke();
            ellipse(this.pos.x, this.pos.y, nodeSize, nodeSize);
        pop();
    }
}