let socials_networks ;
let networks = [];
let dateRange = {
    min : new Date(2080-06-08).valueOf(),
    max : 0
}
let graphRange = {
    min:150,
    max:window.innerWidth
}

// UI SETTINGS
let nodeSize = 20;

// INTERACTIONs SETTINGS
let similarsShow = [];

// colors by category
let grd ;
let colors = [
    {
        color : '#333399',
        category : ''
    },
    {
        color : '#ff00cc',
        category : ''
    },
    {
        color : '#000046',
        category : ''
    },
    {
        color : '#1CB5E0',
        category : ''
    },
    {
        color : '#f6d743',
        category : ''
    },
    {
        color : '#649d66',
        category : ''
    },
    {
        color : '#f6f578',
        category : ''
    },
    {
        color : '#f79071',
        category : ''
    },
];

function preload(){
    socials_networks = loadJSON('./data/socials_networks.json');
}

function setup () {
    defineRanges();
    
    createCanvas(graphRange.max, window.innerHeight);
    smooth();
    colorMode(RGB, 255,255,255,255);

    grd = drawingContext.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, 'rgb(247, 238, 239)');   
    grd.addColorStop(1, 'rgb(245, 234, 219)');

    let heightLine = height / (Array.from(socials_networks.socials).length + 1) ;
    let iconBar = document.getElementById('iconsBar');
    iconBar.style.paddingTop = `calc(${heightLine}px - 1vh - 15px)`;
    iconBar.style.paddingBottom = `calc(${heightLine}px - 1vh - 15px)`;
    iconBar.style.gridRowGap = heightLine - 32 + 'px';

    socials_networks.socials.forEach( (network) => {
        networks.push( new Network(network.network, network.creation, network.changelog, createVector(definePos(network.creation), heightLine)));
        heightLine += height / (Array.from(socials_networks.socials).length + 1) ;
        setIcons(iconBar, network.network);
    })

    // noLoop();

    
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}



function draw() {
    // clear();
    push();
        // drawingContext.fillStyle = grd;
        // noStroke();
        // rect(0, 0, graphRange.max, window.innerHeight);
        background(245, 234, 219);
    pop();

    displayEras();
    
    // links between nodes
    for (let slug of similarsShow){
        let slugArray = [];
        for (let network of networks){
            let networkNodesArray = network.changelog.filter ( node => node.slug == slug)
            slugArray = slugArray.concat(networkNodesArray);
        }

        drawLinksBetweenNodes(slugArray);

        // console.log(slugArray)
    }

    for (let network of networks){
        network.display();
    }
}



function mouseClicked(){
    for (let network of networks){
        network.changelog.find( node => {
            if (isHover(node.pos, nodeSize/2 )){
                if (!similarsShow.includes(node.slug)){
                    similarsShow.push(node.slug);
                } else {
                    similarsShow.splice(similarsShow.indexOf(node.slug),1)
                }           
            }
        })
    }

    console.log(mouseX, mouseY)
    // redraw();
}



function loadJSON(path){  
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            return JSON.parse(xobj.responseText);
            // callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}


function defineRanges(){
    let testdateMin = socials_networks.socials[0].creation.split('-').reverse().join('-');
    dateRange.min = new Date(testdateMin).valueOf();

    socials_networks.socials.forEach( (social) => {
        let creation = social.creation.split('-').reverse().join('-')
        let bornJS = new Date(creation).valueOf();
        dateRange.min = bornJS < dateRange.min ? bornJS : dateRange.min ;

        social.changelog.forEach( (log) => {
            let testdate = log.date.split('-').reverse().join('-')
            let dateJS = new Date(testdate).valueOf();

            dateRange.max = dateJS > dateRange.max ? dateJS : dateRange.max ;
        })
    })


    graphRange.min = 150 ;
    let rangeBetweenDays = abs(new Date('2000-01-01').valueOf() - new Date('2000-02-01').valueOf());
    graphRange.max = nodeSize * dateRange.max / rangeBetweenDays;
    graphRange.max = graphRange.max > 16000 ? 16000 : graphRange.max
}



function setIcons(target, network){
    let icon = document.createElement('div');
    icon.classList = `icon ${network.toLowerCase()}`;
    // icon.style.marginTop = heightLine - (16 * (Array.from(socials_networks.socials).length) - 1) + 'px';
    target.appendChild(icon);
}




function drawLinksBetweenNodes(array){

    for (let node of array){
        if (array[array.indexOf(node) + 1] != undefined){

            let node1 = array[array.indexOf(node) + 1];
            let c1 = createVector(map(noise(0.05, 10, 20), 0 , 1, -150, 150), map(noise(0.1, 2, 87), 0 , 1, -150, 150));
            let c2 = createVector(map(noise(0.02, 5, 12), 0 , 1, -150, 150), map(noise(0.04, 15, 30), 0 , 1, -150, 150));

            push();
                strokeWeight(.5);
                stroke(node.colorNode);
                noFill();
                curve(node.pos.x + c1.x, node.pos.y + c1.y,
                    node.pos.x, node.pos.y, 
                    node1.pos.x, node1.pos.y, 
                    node1.pos.x + c2.x, node1.pos.y + c2.y
                );            
            pop();
        }
    }

    // redraw();
}



function displayEras(){
    let endPreviousEra = graphRange.min - 10 ;
    for (let era in socials_networks.eras){
        let widthEra = definePos(socials_networks.eras[era]) - endPreviousEra ;
        push();
            fill(255,90);
            noStroke();
            rect(endPreviousEra + 4, 0.01 * height, widthEra - 4, 0.99 * height, 8);

            textSize(24);
            textStyle(BOLD);
            fill(30,200);
            text(era.toUpperCase(), endPreviousEra + (widthEra/2), 50);
        pop();
        
        endPreviousEra += widthEra ;
    }
}



const defineColor = (category) => {
    let definedColor = colors.find( c => c.category == category);

    if (definedColor == undefined){
        let filteredColors = colors.filter( c => c.category == '');

        if (filteredColors != undefined){
            let i = int(random(filteredColors.length - 1));
            definedColor = filteredColors[i].color;
            filteredColors[i].category = category;
        } else {
            definedColor = colors[0].color;
            
        }
    } else {
        definedColor = definedColor.color
    }

    return color(definedColor) ;
}


const definePos = (date) => {
    let testdate = date.split('-').reverse().join('-')
    let dateJS = new Date(testdate).valueOf();

    let x = map(dateJS, dateRange.min, dateRange.max, graphRange.min, graphRange.max - 250);
    
    return x ;
}


const isHover = (pos, rad) => {
    return dist(mouseX, mouseY, pos.x, pos.y) < rad ;
}


// CONVERT COLORS
const componentToHex = (c) => {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }