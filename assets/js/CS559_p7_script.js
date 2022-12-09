function start() {

    // Get canvas, WebGL context
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");

    // Sliders at center
    var slider1 = document.getElementById('slider0');
    slider0.value = 0;
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 50;
    var slider3 = document.getElementById('slider3');
    slider3.value = 0

    /**
     * Helper function for creating a shader program
     * name : specify the name of the shader on HTML file
     * normal : specify if this shader will use normal vectors
     * texture : specify if this shader will use textures
     */
    function shaderCreate(name="", normal = false, texture = false) {
        // Read shader source
        var vertexSource = document.getElementById("vertexShader"+name).text;
        var fragmentSource = document.getElementById("fragmentShader"+name).text;

        // Compile vertex shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader,vertexSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader)); return null; }
        
        // Compile fragment shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader,fragmentSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader)); return null; }
        
        // Attach the shaders and link
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialize shaders"); 
        }

        // with the vertex shader, we need to pass it positions
        // as an attribute - so set up that communication
        shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
        gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

        if (normal) {
            shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
            gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
        }
        
        shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
        gl.enableVertexAttribArray(shaderProgram.ColorAttribute);    
        
        if (texture) {
            shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
            gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
        }

        // this gives us access to the matrix uniform
        shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
        shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
        shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

        // Attach samplers to texture units
        shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
        gl.uniform1i(shaderProgram.texSampler1, 0);
        shaderProgram.texSampler2 = gl.getUniformLocation(shaderProgram, "texSampler2");
        gl.uniform1i(shaderProgram.texSampler2, 1);

        return shaderProgram;
    }

    // The three shaders
    shaderProgram = shaderCreate(); // This shader is for arrows (only ambient lights)
    shaderProgramBox = shaderCreate('Box', normal = true); // This shader is for the cubes (ambient + diffuse + specular lights)
    shaderProgramBG = shaderCreate('BG'); // This shader is for the "background box" (distance lighting: the brightness is based on the distance)
    
    /**
     * Draw a cube, the content is mostly adapted from the in-class demo week 10
     * pos (vec3) = position of the center of the box
     * color (vec3) = color of the box
     * size = the half of the length of a side of the cube
     */
    function drawCube(pos, size, color) {
        var vertexPos = new Float32Array(
        [  size, size, size,  -size, size, size,  -size,-size, size,   size,-size, size,
           size, size, size,   size,-size, size,   size,-size,-size,   size, size,-size,
           size, size, size,   size, size,-size,  -size, size,-size,  -size, size, size,
          -size, size, size,  -size, size,-size,  -size,-size,-size,  -size,-size, size,
          -size,-size,-size,   size,-size,-size,   size,-size, size,  -size,-size, size,
           size,-size,-size,  -size,-size,-size,  -size, size,-size,   size, size,-size ]);
        for (let i = 0; i < 72; i += 3) {
            vertexPos[i] += pos[0];
            vertexPos[i+1] += pos[1];
            vertexPos[i+2] += pos[2];
        }

        // vertex colors
        var vertexColors = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
        for (let i = 0; i < 72; i += 3) {
            vertexColors[i] = color[0];
            vertexColors[i+1] = color[1];
            vertexColors[i+2] = color[2];
        }

        var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
           12,13,14,  12,14,15,    // left
           16,17,18,  16,18,19,    // bottom
       20,21,22,  20,22,23 ]); // back

        // vertex normals
        var vertexNormals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, 
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, 
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, 
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, 
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, 
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  ]);

                // vertex texture coordinates
        var vertexTextureCoords = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   0, 1,
           1, 0,   1, 1,   0, 1,   0, 0,
           0, 1,   0, 0,   1, 0,   1, 1,
           0, 0,   1, 0,   1, 1,   0, 1,
           1, 1,   0, 1,   0, 0,   1, 0,
           1, 1,   0, 1,   0, 0,   1, 0 ]);

        return [vertexPos, vertexColors, triangleIndices, vertexNormals];
    }

    function drawTable(row, col, center, size, distance, color) {
        var topleft = [center[0]-((row-1)*(2*size+distance))/2, center[1]-((col-1)*(2*size+distance))/2, center[2]];
        var result = [];
        for (let i = 0; i < row; ++i) {
            for (let j = 0; j < col; ++j) {
                var pos = [topleft[0]+i*(2*size+distance), topleft[1]+j*(2*size+distance), topleft[2]];
                let res = drawCube(pos, size, color);
                result.push(res);
            }
        }
        return result;
    }

    /**
     * A helper function for drawing a (flat) arrow
     * s (vec3): the source
     * t (vec3): the destination
     */
    function drawArrow(s, t) {
        let dist = 0;
        for (let i = 0; i < 3; ++i) {
            dist += (s[i]-t[i])*(s[i]-t[i]);
        }
        dist = Math.sqrt(dist);
        
        let head_length = 0.2;
        let width = 0.4;
        var vertexPos = new Float32Array(
        [  -width/4,0,0,    width/4,0,0,    width/4,1-head_length,0,     -width/4,1-head_length,0,
            -width,1-head_length,0,  0,1,0,   width,1-head_length,0]);

        // vertex colors
        var vertexColors = new Float32Array(
            [  1, 1, 1,   1, 1, 1,   1, 1, 1,   1, 1, 1,
               1, 0, 0,   1, 0, 0,   1, 0, 0,   ]);
        
        // element index array
        var triangleIndices = new Uint8Array(
            [  0, 1, 2,   0, 2, 3,
                4, 5, 6 ]);
        
        // the 3-by-3 matrix for linear-transformation
        var transform = [
            [1,t[0]-s[0],0],
            [0,t[1]-s[1],0],
            [0,t[2]-s[2],1]
            ];

        for (let k = 0; k < vertexPos.length; k += 3) {
            let vec = [vertexPos[k], vertexPos[k+1], vertexPos[k+2]];
            let res = [s[0],s[1],s[2]];
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    res[i] += transform[i][j] * vec[j];
                }
            }
            vertexPos[k] = res[0];
            vertexPos[k+1] = res[1];
            vertexPos[k+2] = res[2];
        }

        return [vertexPos, vertexColors, triangleIndices];
    }

    // Draw all arrows between the nodes of the model
    function drawAllArrows(row, col, center, size, distance) {
        var topleft = [center[0]-((row-1)*(2*size+distance))/2, center[1]-((col-1)*(2*size+distance))/2, center[2]];
        var topleftCol = [center[0], center[1]-((col-1)*(2*size+distance))/2, center[2]+3];
        var topleftRow = [center[0]-((row-1)*(2*size+distance))/2, center[1], center[2]-3];
        var result = [];

        // connect "table nodes" to "column nodes" and "row nodes"
        for (let i = 0; i < row; ++i) {
            for (let j = 0; j < col; ++j) {
                var pos = [topleft[0]+i*(2*size+distance), topleft[1]+j*(2*size+distance), topleft[2]];
                let top = [pos[0], pos[1], pos[2]+size];
                let bottom = [pos[0], pos[1], pos[2]-size];

                var col_box = [topleftCol[0], topleftCol[1]+j*(2*size+distance), topleftCol[2]];
                var col_bottom = [col_box[0], col_box[1], col_box[2]-size];

                let res = drawArrow(col_bottom, top);
                result.push(res);

                var row_box = [topleftRow[0]+i*(2*size+distance), topleftRow[1], topleftRow[2]];
                var row_top = [row_box[0], row_box[1], row_box[2]+size];

                res = drawArrow(bottom, row_top);
                result.push(res);
            }
        }

        // connect "row nodes" to the source
        for (let i = 0; i < row; ++i) {
            var pos = [topleftRow[0]+i*(2*size+distance), topleftRow[1], topleftRow[2]];
            var dest = [center[0],center[1],center[2]-6];
            res = drawArrow([pos[0],pos[1],pos[2]-size], [dest[0],dest[1],dest[2]+size]);
            result.push(res);
        }

        // connect "column nodes" to the sink
        for (let j = 0; j < col; ++j) {
            var pos = [topleftCol[0], topleftCol[1]+j*(2*size+distance), topleftCol[2]];
            var dest = [center[0],center[1],center[2]+6];
            res = drawArrow([dest[0],dest[1],dest[2]-size], [pos[0],pos[1],pos[2]+size]);
            result.push(res);
        }

        return result;
    }

    /**
     * A helper function that draws a given object
     * shaderProgram: the shaderProgram that we will use for this object
     * data: the data of this object (triangle positions, triangle indices, vertex colors, normal vectors)
     * tMV, tMVn, tMVP: the matrices of camera transformation, normal transformation and NDC transformation, respectively
     * normal, texture: specify whether we will use normal/shader
     */
    function drawThing(shaderProgram, data, tMV, tMVn, tMVP, normal=false, texture=false) {
        gl.useProgram(shaderProgram);

        var trianglePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data[0], gl.STATIC_DRAW);
        trianglePosBuffer.itemSize = 3;
        trianglePosBuffer.numItems = data[0].length/3;

        // a buffer for normals
        if (normal) {
            var triangleNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, data[3], gl.STATIC_DRAW);
            //console.log(data[3]);
            triangleNormalBuffer.itemSize = 3;
            triangleNormalBuffer.numItems = data[3].length/3;
        }
        
        // a buffer for colors
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data[1], gl.STATIC_DRAW);
        colorBuffer.itemSize = 3;
        colorBuffer.numItems = data[1].length/3;

        // a buffer for indices
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data[2], gl.STATIC_DRAW);    
    
        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
                       gl.FLOAT, false, 0, 0);
        if (normal) {
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
              gl.FLOAT, false, 0, 0);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
                   gl.FLOAT,false, 0, 0);

        // Do the drawing
        gl.drawElements(gl.TRIANGLES, data[2].length, gl.UNSIGNED_BYTE, 0);
    }

    // Scene (re-)draw routine
    function draw() {
    
        var angle0 = slider0.value*0.01*2*Math.PI;
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;
        var r = 200+slider3.value*0.01*100;
    
        // Spherical Coorinate!
        var eye = [r*Math.sin(angle2)*Math.cos(angle1), r*Math.sin(angle2)*Math.sin(angle1), r*Math.cos(angle2)];
        var target = [0,0,0];
        var up = [-r*Math.cos(angle2)*Math.cos(angle1), -r*Math.cos(angle2)*Math.sin(angle1), r*Math.sin(angle2)];
    
        // Model transform (for BG)
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[10,10,10]);
        // Model transform (for "model")
        var tModel2 = mat4.clone(tModel);
        mat4.rotate(tModel2,tModel2,angle0,[1,1,1]);
    
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection,Math.PI/4,1,10,1000);
    
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,tCamera,tModel2); // "modelView" matrix
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,tProjection,tMV);
    
        // ========== Rendering Part ==============

        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        // Draw the "table" nodes
        var table = drawTable(3, 4, [0,0,0], 1, 1, [.63,.63,.63]);
        for (let i = 0; i < table.length; ++i) {
            drawThing(shaderProgramBox, table[i], tMV, tMVn, tMVP, normal=true);
        }

        // Draw the "column" nodes
        var table = drawTable(1, 4, [0,0,3], 1, 1, [.015,.75,.75]);
        for (let i = 0; i < table.length; ++i) {
            drawThing(shaderProgramBox, table[i], tMV, tMVn, tMVP, normal=true);
        }

        // Draw the "row" nodes
        var table = drawTable(3, 1, [0,0,-3], 1, 1, [1,.75,0]);
        for (let i = 0; i < table.length; ++i) {
            drawThing(shaderProgramBox, table[i], tMV, tMVn, tMVP, normal=true);
        }

        // Draw the source node
        var data = drawCube([0,0,6], 1, [.43,1,.686]);
        drawThing(shaderProgramBox, data, tMV, tMVn, tMVP, normal=true);

        // Draw the sink node
        var data = drawCube([0,0,-6], 1, [.43,1,.686]);
        drawThing(shaderProgramBox, data, tMV, tMVn, tMVP, normal=true);

        // Draw arrows
        var allArrows = drawAllArrows(3, 4, [0,0,0], 1, 1, [0,1,0]);
        for (let i = 0; i < allArrows.length; ++i) {
            var data = allArrows[i];
            drawThing(shaderProgram, data, tMV, tMVn, tMVP);
        }

        // Blackground box
        var data = drawCube([0,0,0], 40, [1,1,1]);
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,tCamera,tModel); // "modelView" matrix
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,tProjection,tMV);
        drawThing(shaderProgramBG, data, tMV, tMVn, tMVP);
    }

    slider0.addEventListener("input",draw);
    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    slider3.addEventListener("input",draw);
    draw();
}

window.onload=start;



