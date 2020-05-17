class Network {

    constructor(name, creation, changelog, pos){
        this.name = name ;
        this.creation = creation ;
        this.changelog = changelog.map( (log) => {
            return new Node(log, pos, name);
        }) ;
        this.posLine = pos ;
        this.colorLine = hexToRgb('#FFFFFF');
        this.colorLine = color( this.colorLine.r, this.colorLine.g, this.colorLine.b);
        this.colorLine.setAlpha(130);
    }

    display(){

        push();
            fill(this.colorLine);
            noStroke(); 
            text(this.name, this.posLine.x, this.posLine.y - 50);

            rect(this.posLine.x, this.posLine.y - 10, 8, 20, 2);
        pop();

        push()
            strokeWeight(.8);
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
        this.colorNode.setAlpha(120);


        let div = document.createElement('div');
        div.id = this.id;
        div.classList.add('nodeCard');
        div.style.left = this.pos.x + 'px';
        div.style.top = this.pos.y + 'px';

        div.innerHTML = `
            <span class="date">${this.date}</span>
            <h4>${this.category}</h4>
            <h3>${this.feature}</h3>
            <p class="desc">${this.desc}</p>

        `

        document.querySelector('body').appendChild(div)

        let divInDOM = document.getElementById(this.id);
        let pos = divInDOM.getBoundingClientRect() ;
        // let nodeCards = document.getElementsByClassName('nodeCard');

        if (pos.bottom > height){
            // console.log(this.id, 'ça déborde par le bas')
            divInDOM.style.top = (this.pos.y - pos.height) + 'px';
        }

        if (pos.right > width){
            // console.log(this.id, 'ça déborde par la droite')
            divInDOM.style.left = (this.pos.x - pos.width) + 'px';
        }
        

    }

    display(){
        if (isHover(this.pos, (nodeSize/2) - 2)){
            push()
                noStroke();
                fill(245);
                rect(this.pos.x, this.pos.y, )
                noFill();
                stroke(255);
                strokeWeight(.8);
                ellipse(this.pos.x, this.pos.y,30,30);
            pop();

            if (!Array.from(document.getElementById(this.id).classList).includes('visible')){
                document.getElementById(this.id).classList.add('visible');
                this.colorNode.setAlpha(255);
            }

        } else {
            if (Array.from(document.getElementById(this.id).classList).includes('visible')){
                this.colorNode.setAlpha(120);
                document.getElementById(this.id).classList.remove('visible');
            }

            if (similarsShow.includes(this.slug)){
                this.colorNode.setAlpha(255);
            } else {
                this.colorNode.setAlpha(120);
            }
        }

        push()
            fill(this.colorNode);
            noStroke();
            ellipse(this.pos.x, this.pos.y, nodeSize, nodeSize);

            // for (let i = nodeSize + 10 ; i > nodeSize ; i --){
            //     let k = map(i, nodeSize + 10, nodeSize, 90, 0);
            //     let w = this.colorNode.toString('rgba%').split('rgba(')[1].split('%').join('').split(',');
            //     w[w.length - 1] = k.toString() ;
            //     w.join();
            //     if(frameCount % 30 == 0) console.log(w.join())
            //     push();
            //         noFill();
            //         stroke(w.join());
            //         strokeWeight(1)
            //         ellipse(this.pos.x, this.pos.y, i, i);
            //     pop();
            // }
        pop();
    }
}