let socials_networks ;
let networks = [];
let eras = [];
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
let openSans ;

// INTERACTIONs SETTINGS
let similarsShow = [];

// COLORS SETTINGS
let grd ;
let eraColor ;
let colors = [ // for nodes / links from violet to yellow
    {
        color : '#fee2b3',
        category : ''
    },
    {
        color : '#B8A3E0',
        category : ''
    },
    {
        color : '#581845',
        category : ''
    },
    {
        color : '#ad6989',
        category : ''
    },
    {
        color : '#900C3F',
        category : ''
    },
    {
        color : '#C70039',
        category : ''
    },
    {
        color : '#FF5733',
        category : ''
    },
    {
        color : '#FFC30F',
        category : ''
    },
    {
        color : '#f4a548',
        category : ''
    },
    {
        color : '#2D3E86', //blue
        category: ''
    },
    {
        color : '#cceabb', //blue
        category: ''
    },
    {
        color : '#035aa6', //blue
        category: ''
    },
    {
        color : '#6a8caf', //blue
        category: ''
    },
];

function preload(){
    socials_networks = loadJSON('./data/socials_networks.json');
    openSans = loadFont('./fonts/OpenSans-Bold.ttf');
}

function setup () {
    defineRanges();
    
    createCanvas(graphRange.max, window.innerHeight);
    smooth();
    colorMode(RGB, 255,255,255,255);

    // eraColor = color(255,12);
    // defineEras(socials_networks.eras);

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

    frameRate(30);
    textFont(openSans);

    // updateDisplay();
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // updateDisplay();
}



function draw() {
    push();
        background(8);
    pop();

    // displayEras();
    
    // links between nodes
    

    if (similarsShow.length > 0){
        for (let slug of similarsShow){
            let slugArray = [];
            for (let network of networks){
                let networkNodesArray = network.changelog.filter ( node => node.slug == slug)
                slugArray = slugArray.concat(networkNodesArray);
    
                network.display();
            }
    
            drawLinksBetweenNodes(slugArray);
        }
    } else {
        for (let network of networks){
            network.display();
        }
    }
}

function mouseClicked(){
    for (let network of networks){
        network.changelog.find( node => {
            if (isHover(node.pos, nodeSize/2 ) && node.slug != undefined && node.slug != ''){
                if (!similarsShow.includes(node.slug)){
                    similarsShow.push(node.slug);
                } else {
                    similarsShow.splice(similarsShow.indexOf(node.slug),1)
                }           
            }
        })
    }
}



function loadJSON(path){  
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            return JSON.parse(xobj.responseText);
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
    target.appendChild(icon);
}




function drawLinksBetweenNodes(array){
    for (let node of array){
        if (array[array.indexOf(node) + 1] != undefined){

            let node1 = array[array.indexOf(node) + 1];
            let c1 = createVector(map(noise(0.05, 1, 2), 0 , 1, -200, 200), map(noise(0.1, 2, 87), 0 , 1, -200, 200));
            let c2 = createVector(map(noise(0.02, 5, 12), 0 , 1, -200, 200), map(noise(0.04, 15, 30), 0 , 1, -200, 200));

            push();
                strokeWeight(2);
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
    for (let era of eras){
        push();
            fill(eraColor);
            noStroke();
            rect(era.start, 0.02 * height, era.width, 0.98 * height, 8);

            textSize(24);
            textStyle(BOLD);
            fill(222, 222, 233, 220);
            text(era.title, era.titlePos, 70);
        pop();
    }
}



const defineEras = (erasArray) => {
    let endPreviousEra = graphRange.min - 50 ;
    for (let era in erasArray){
        let widthEra = definePos(erasArray[era]) - endPreviousEra ;
        eras.push({
            start : endPreviousEra + 4,
            width : widthEra - 4,
            title: era.toUpperCase(),
            titlePos : endPreviousEra + (widthEra/2)
        });
        endPreviousEra += widthEra ;
    }
    
}



const defineColor = (category) => {
    let definedColor = colors.find( c => c.category == category);

    if (definedColor == undefined){
        let filteredColors = colors.filter( c => c.category == '');

        if (filteredColors != undefined){
            let i = int(random(filteredColors.length - 1));

            if (filteredColors[i] != undefined){
                definedColor = filteredColors[i].color;
                filteredColors[i].category = category;
            } else {
                console.log(category)
                definedColor = '#FFFFFF';
            }
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

    let x = map(dateJS, dateRange.min, dateRange.max, graphRange.min, graphRange.max - 290);
    
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





  let info = document.querySelector('.button');
  let infoContent = document.querySelector('.hidden');
  info.addEventListener('click', (e) => {
    infoContent.classList.toggle('hidden');
    info.classList.toggle('hidden');

    document.querySelector('canvas').addEventListener('click', hideWindow);
  })

  function hideWindow() {
    infoContent.classList.toggle('hidden');
    info.classList.toggle('hidden');
    document.removeEventListener('click', hideWindow);
  }