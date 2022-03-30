
var RGB_R=100;
var RGB_B=150;
var RGB_G=200;
var SVG=null;

function edge_move(edg, mvX, mvY, strandId) {
    if (edg.strandId !== strandId) return;

    var topX = edg.topX;
    var topY = edg.topY;
    var botX = edg.botX;
    var botY = edg.botY;

    topX += mvX;
    botX += mvX;
    topY += mvY;
    botY += mvY;

    var cpoffset = 0; // control-point offset
    if ((botY - topY) > 8) cpoffset = 20;
    if ((topY - botY) > 8) cpoffset = -20;
    
    var cpx = (topX + botX)/2; // control-point x
    var cpy = (topY + botY)/2 + cpoffset;

    edg.path.setAttribute('d', 'M '+topX+' '+topY+' Q '+cpx+' '+cpy+' '+botX+' '+botY+'');
}

var called=0;
function move(nodes, edges, mvX, mvY, strandId) {
   // if (called>1) return;
    for (var i=0; i<nodes.length; i++) {
        var nd = nodes[i];
        if (nd.strandId !== strandId) continue;
        var x = getx(nd.el);
        var y = gety(nd.el);
        nd.el.style.left = (x+mvX)+"px";
        nd.el.style.top = (y+mvY) +"px";
    }
    for (var i=0; i<edges.length; i++) {
        edge_move(edges[i], mvX, mvY, strandId);
    }
    //called+=1;
}

function newNode(nodeId, strandId, canv) {
    var nd = {};
    nd.id = nodeId;
    nd.strandId = strandId;

    var el = document.createElement("a");
    el.innerHTML = nodeId;
    canv.appendChild(el);

    nd.el = el;

    //RGB_B -= 50;
    //if (RGB_B < 0) RGB_B=0;
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

    edg.botX = botX;
    edg.botY = botY;
    edg.topX = topX;
    edg.topY = topY;
    edg.path = path;
    
    return edg;
}

function getx(el) {
    return parseInt(window.getComputedStyle(el).left.replace("px",""));
}

function gety(el) {
    return parseInt(window.getComputedStyle(el).top.replace("px",""));
}

function getMatchingNode(nodes, strandA, strandB) {
    var a=0;
    var b=0;
    for (var i=0; i<nodes.length; i++) {
        if (nodes[i].strandId == strandA) a+=1;
        if (nodes[i].strandId == strandB) b+=1;
    }
    var maxId = (a>=b) ? strandA : strandB;
    var minId = (a>=b) ? strandB : strandA;
    var minNodes = [];
    for (var i=0; i<nodes.length; i++) {
        if (nodes[i].strandId == minId) minNodes.push(nodes[i]);
    }
    for (var i=0; i<nodes.length; i++) {
        if (nodes[i].strandId == maxId) {
            for (var j=0; j<minNodes.length; j++) {
                if (minNodes[j].id == nodes[i].id) {
                    var res = {};
                    res.aNode = (a>=b) ? nodes[i] : minNodes[j];
                    res.bNode = (a>=b) ? minNodes[j] : nodes[i];
                    return res;
                }
            }
        }
    }
    return {aNode: null, bNode: null};
}
/* These 2 has functions cyrb53 and TSH
   were copied from stackoverflow: https://stackoverflow.com/a/52171480
  */
const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};
TSH=s=>{return cyrb53(s);}//{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return h^h>>>9}
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
    var strandGroups = {};
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

    var map = {
    };

    for (var i=0; i<data.length; i++) {
        var names = data[i].split("/");
        for (var j=0; j<names.length; j++) {
            var name = names[j];
            if (name in map) {} else {
                map[name] = {};
                map[name].x = -1000;
                map[name].y = -1000;
                map[name].lcount = 0;
                map[name].rcount = 0;
                map[name].name = name;
                map[name].hash = TSH(name+name+name+".%$#@!abcdefgh"+name+name);//-1000;
            }
        }
    }

    for (var key in map) {
        var o = map[key];
        for (var i=0; i<data.length; i++) {
            var path = data[i];
            if (path.indexOf(o.name) > -1) {
                var pair = path.split(o.name);
                var lhs = pair[0];
                var rhs = pair[1];
                var lcount = lhs.split("/").length - 1;
                var rcount = rhs.split("/").length - 1;
                o.lcount = Math.max(lcount, o.lcount);
                o.rcount = Math.max(rcount, o.lcount);
            }
        }
    }

    for (var key in map) {
        var o = map[key];
        o.x = ((Math.abs(o.hash)) % 1000);
        o.y = /*center y*/400 - o.rcount*44 + o.lcount*144 + (o.x%44);//800 + (o.lcount*140) - (o.rcount*140) +((o.x%180));
    }

    function randOf() {
        var offset = Math.random() * 50;//32;
        return offset;
    }
    console.log(map);
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
            if (uniq_node_ids.indexOf(names[j])==-1) {
                uniq_node_ids.push(names[j]);
            }
            node.el.style.position='absolute';
            node.el.style.left=map[node.id].x + 'px'; //(x+randOf())+"px";
            node.el.style.top=map[node.id].y + 'px';//(y+randOf())+"px";
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
    console.log(strands.length);
    for (var i=0; i<strands.length; i++) {
        for (var j=0; j<strands[i].length; j++) {
            var obj = strands[i][j];
            if (obj.path != null) {
                var path = obj.path;
                path.setAttribute('stroke', 'rgb('+(RGB_R+'')+','+(RGB_B)+','+(RGB_G+'')+')');
                //console.log(path);
            }
            RGB_R = (RGB_R + 150) % 255;
            RGB_G = (RGB_G + 100) % 255;
            RGB_B = (RGB_B + 50) % 255;
        }
    }
    
    // for (var i=0; i<uniq_node_ids.length;i++) {
    //     var nodeId = uniq_node_ids[i];
    //     var baseX=-1000;
    //     var baseY=-1000;
    //     var baseStrandId = -1000;
    //     for (var j=0; j<nodes.length;j++) {
    //         if (nodes[j].id == nodeId && (baseX==-1000&&baseY==-1000)) {
    //             baseX = getx(nodes[j].el);
    //             baseY = gety(nodes[j].el);
    //             baseStrandId = nodes[j].strandId;
    //             //if (getx(nodes[j].el)>300 || gety(nodes[j].el)>300) {
    //             //    console.log(nodes[j].id);
    //             //}
    //             //while (getx(nodes[j].el)>300 || gety(nodes[j].el)>300) {
    //             //    move(nodes, edges, -50, -50, nodes[j].strandId);
    //             //}
    //             continue;
    //         }

    //         var strandId = nodes[j].strandId;

    //         if (nodes[j].id == nodeId) {
    //             var x = getx(nodes[j].el);
    //             var y = gety(nodes[j].el);

    //             // move the whole strand
    //             var mvX = (baseX<x)?baseX-x:x-baseX;
    //             var mvY = (baseY<y)?baseY-y:y-baseY;
    //             move(nodes, edges, mvX, mvY, strandId);
    //             if (baseStrandId in strandGroups) {} else{
    //                 strandGroups[baseStrandId] = [];
    //             }
    //             strandGroups[baseStrandId].push(strandId);
    //         } else {
    //             if (baseStrandId in strandGroups) {
    //                 if (strandGroups[baseStrandId].includes(strandId)) {
    //                     // strand A get node from strand B
    //                     var nodepair=getMatchingNode(nodes, baseStrandId, strandId);
    //                     if (nodepair.aNode == null) continue;
    //                     var baseNode = nodepair.aNode;
    //                     var bx = getx(baseNode.el); // base x
    //                     var by = gety(baseNode.el);
    //                     var x = getx(nodepair.bNode.el);
    //                     var y = gety(nodepair.bNode.el);
    //                     //console.log(x,y,bx,by);
    //                     // move the whole strand
    //                     var mvX = (bx<x)?bx-x:x-bx;
    //                     var mvY = (by<y)?by-y:y-by;
    //                     move(nodes, edges, mvX, mvY, strandId);

    //                     // bring back into canvas region
    //                     var canv_mvX = 0;
    //                     var canv_mvY = 0;
    //                     while (getx(baseNode.el) + canv_mvX < 0) {
    //                         canv_mvX += 1;
    //                     }
    //                     while (gety(baseNode.el) + canv_mvY < 0) {
    //                         canv_mvY += 1;
    //                     }
    //                     move(nodes, edges, canv_mvX, canv_mvY, strandId);
    //                     move(nodes, edges, canv_mvX, canv_mvY, baseStrandId);
    //                 }
    //             }
    //         }
    //     }
    // }
}

window.addEventListener("DOMContentLoaded", function() {
    drawDemo(document.getElementById("graph_canvas"));
});