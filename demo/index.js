
var RGB_B=255;
var SVG=null;

function newNode(nodeId, strandId, canv) {
    var nd = {};
    nd.id = nodeId;
    nd.strandId = strandId;
    var el = document.createElement("a");
    el.innerHTML = nodeId;
    canv.appendChild(el);

    nd.el = el;

    RGB_B -= 50;
    if (RGB_B < 0) RGB_B=0;
    return nd;
}

function newEdge(lastNode, newNode, canv) {
    var edg = {};
    edg.strandId = lastNode.strandId;

    var topX = parseInt(window.getComputedStyle(lastNode.el).left.replace("px",""));
    var topY = parseInt(window.getComputedStyle(lastNode.el).top.replace("px",""));
    var botX = parseInt(window.getComputedStyle(newNode.el).left.replace("px",""));
    var botY = parseInt(window.getComputedStyle(newNode.el).top.replace("px",""));
    var cpoffset = 0; // control-point offset
    if ((botY - topY) > 8) cpoffset = 20;
    if ((topY - botY) > 8) cpoffset = -20;
    
    var cpx = (topX + botX)/2; // control-point x
    var cpy = (topY + botY)/2 + cpoffset;

    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path.setAttribute('d', 'M '+topX+' '+topY+' Q '+cpx+' '+cpy+' '+botX+' '+botY+'');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('stroke', 'black');
    path.setAttribute('fill', 'none');
    path.id=lastNode.strandId+":"+lastNode.id+","+newNode.id;
    SVG.appendChild(path);

    return edg;
}

function getx(el) {
    return parseInt(window.getComputedStyle(el).left.replace("px",""));
}

function gety(el) {
    return parseInt(window.getComputedStyle(el).top.replace("px",""));
}


function drawDemo(canv) {
    SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    SVG.setAttribute('width', '1000px');
    SVG.setAttribute('height', '1000px');
    canv.appendChild(SVG);
    var strands = [];
    var nodes = [];
    var edges = [];
    var uniq_node_ids=[];
    //var node2strands = {}; // todo:   nodeid: strandIds:[]
    var data = [
        "jaguar/golden-lion-tamarin/medoncia-velloziana",
        "jaguar/harpy-eagle/goliath-bird-eating-spider",
        "jaguar/harpy-eagle/golden-lion-tamarin/medoncia-velloziana",
        "orchid-bee/tibouchina-tree",
        "helmeted-woodpecker/strangler-fig",
        "helmeted-woodpecker/claudina-butterfly/tibouchina-tree",
        "helmeted-woodpecker/fruit-fly/medoncia-velloziana",
        "jaguar/harpy-eagle/green-headed-tanger/brazilian-rosewood-tree",
        "jaguar/harpy-eagle/blue-manakin/brazilian-rosewood-tree",
        "jaguar/harpy-eagle/golden-lancehead-snake/blue-manakin/brazilian-rosewood-tree"
    ];

    function randOf() {
        var offset = Math.random() * 32;
        return offset;
    }
    
    var incr = 0;
    var x = 10;
    var y = 10;
    var captY = -1;
    for (var i=0; i<data.length; i++) {
        var names = data[i].split("/");
        var lastNode = null;
        strands.push([]);
        for (var j=0; j<names.length; j++) {
            var node = newNode(names[j], i, canv);
            if (uniq_node_ids.indexOf(names[j])>-1) {
                uniq_node_ids.push(names[j]);
            }
            node.el.style.position='absolute';
            node.el.style.left=(x+randOf())+"px";
            node.el.style.top=(y+randOf())+"px";
            nodes.push(node);
            strands[i].push(node);
            if (lastNode != null) {
                var edge = newEdge(lastNode, node, canv);
                edges.push(edge);
                strands[i].push(edge);
            }
            lastNode = node;
            y += 50;
        }
        incr += 200;
        x += 200;
        if (incr < 900) { y = 10; }
        else if (incr > 900 && incr < 900+200) { y += 200; x = 10; captY=y; }
        else { y = captY; }
    }

    for (var i=0; i<uniq_node_ids.length;i++) {
        var nodeId = uniq_node_ids[i];
        var baseX=-1;
        var baseY=-1;
        for (var j=0; j<nodes.length;j++) {
            if (nodes[j].id == nodeId && baseX<0) {
                baseX = getx(nodes[j].el);
                baseY = gety(nodes[j].el);
                continue;
            }
            if (nodes[j].id == nodeId) {
                var x = getx(nodes[j].el);
                var y = gety(nodes[j].el);

                // move the whole strand
                var mvX = x-baseX;
                var mvY = y-baseY;
                
            }
        }
    }
}

window.addEventListener("DOMContentLoaded", function() {
    drawDemo(document.getElementById("graph_canvas"));
});