let socials_networks ;
let networks = [];
let dateRange = {
    min : new Date(2080-06-08).valueOf(),
    max : 0
}
let graphRange = {
    min:0,
    max:window.innerWidth
}

// UI SETTINGS
let nodeSize = 20;

// INTERACTIONs SETTINGS
let similarsShow = [];

// colors by category
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


    let heightLine = height / (Array.from(socials_networks.socials).length + 1) ;

    socials_networks.socials.forEach( (network) => {
        networks.push( new Network(network.network, network.creation, network.changelog, createVector(definePos(network.creation), heightLine)));
        heightLine += height / (Array.from(socials_networks.socials).length + 1) ;
    })
  }



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}



function draw() {
    clear();
    for (let network of networks){
        network.display();
    }
}



function mouseClicked(){
    for (let network of networks){
        network.changelog.find( node => {
            if (isHover(node.pos, nodeSize )){
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


    graphRange.min = 50 ;
    let rangeBetweenDays = abs(new Date('2000-01-01').valueOf() - new Date('2000-02-01').valueOf());
    graphRange.max = nodeSize * dateRange.max / rangeBetweenDays;
    graphRange.max = graphRange.max > 16000 ? 16000 : graphRange.max
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

    let x = map(dateJS, dateRange.min, dateRange.max, graphRange.min, graphRange.max - 250)
    
    return x ;
}


const isHover = (pos, rad) => {
    return dist(mouseX, mouseY, pos.x, pos.y) < rad ;
}