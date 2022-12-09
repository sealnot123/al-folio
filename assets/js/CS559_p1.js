window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    
    // slider
    const slider = document.getElementById('mySlider');
    slider.value = 1;

    // access to canvas's width and canvas's height
    // Taken from https://www.javascripttutorial.net/javascript-dom/javascript-width-height/
    const canvas_width = canvas.offsetWidth;
    const canvas_height = canvas.offsetHeight;
    
    function drawBox(x, y, d) {
        context.lineWidth = 1;
        context.strokeStyle = 'black'
        context.strokeRect(x,y,d,d);
    };

    function fillClearBox(x, y, d) {
        context.fillStyle = '#93FFBB'
        context.fillRect(x,y,d,d);
        context.fillStyle = 'black'
    };

    function drawHighlightBox(x, y, d) {
        context.fillStyle = '#ff93c1'
        context.fillRect(x,y,d,d);
        context.fillStyle = 'black'

        context.lineWidth = 5;
        context.strokeStyle = '#ff0046'
        context.strokeRect(x,y,d,d);
    };

    // size, length, stuffs
    let initial_array = [5,3,4,2,6,1]; // initial array
    let n = initial_array.length;
    const box_ratio = 7;
    const padding_top = canvas_height/10;
    const box_size = canvas_width/box_ratio;
    const start_text_section = box_size+3*padding_top;
    const end_text_section = canvas_height-padding_top;
    const step_section = (end_text_section - start_text_section)/5;
    
    // There are 4 passes of this bubblesort
    // after each pass, "clear" a box
    // In the extra pass, clear the first box
    // What do I need for each "step"?
    var explain = []; // Text for each step
    var history_array = []; // The array of number in each step
    var pivot = []; // The pivot pair that we are looking at
    var fixed_position = [] // the leftmost "done" position in each step
    // You can use 'push' function of an array to append something on the back later
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
    
    // generate each step
    let step = 0;

    ++step;
    // copy array
    copy_array = []
    for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
    // record array
    history_array.push(copy_array);
    // record pivot
    pivot.push(-1)
    // record already done position
    fixed_position.push(n)
    // record text
    explain.push('Step 1: You have an unsorted array');

    for(let pass = 0; pass < n; ++pass) {
        if(pass == n) {
            ++step;
            // copy array
            copy_array = []
            for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
            // record array
            history_array.push(copy_array);
            // record pivot
            pivot.push(-1)
            // record already done position
            fixed_position.push(n-1-pass)
            // record text
            explain.push('Step '+step+': '+copy_array[n-1-pass]+' is in its final position')
            break;
        }
        let leftmost_position = n-1-pass; // left most position that is not fixed
        for(let i = 0; i < leftmost_position; ++i) {
            ++step;
            // copy array
            copy_array = []
            for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
            // record array
            history_array.push(copy_array);
            // record pivot
            pivot.push(i)
            // record already done position
            fixed_position.push(n-pass)
            // record text
            explain.push('Step '+step+': Consider '+copy_array[i]+' and '+copy_array[i+1])
            
            ++step;
            // copy array
            copy_array = []
            for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
            // record array
            history_array.push(copy_array);
            // record pivot
            pivot.push(i)
            // record already done position
            fixed_position.push(n-pass)
            // record text
            if(copy_array[i] > copy_array[i+1]) {
                // we need to swap
                explain.push('Step '+step+': '+copy_array[i]+' is larger than '+copy_array[i+1])
            }else{
                // we need to swap
                explain.push('Step '+step+': '+copy_array[i]+' is no larger than '+copy_array[i+1])
            }

            ++step;
            // record pivot
            pivot.push(i)
            // record already done position
            fixed_position.push(n-pass)
            // record text and array
            if(copy_array[i] > copy_array[i+1]) {
                // we need to swap
                explain.push('Step '+step+': swap them and go on to '+((i+1==leftmost_position)?'next pass':'next step'));
                let dummy = initial_array[i]
                initial_array[i] = initial_array[i+1]
                initial_array[i+1] = dummy
                // copy array
                copy_array = []
                for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
                // record array
                history_array.push(copy_array);
            } else {
                // copy array
                copy_array = []
                for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
                explain.push('Step '+step+': no swap, move on to '+((i+1==leftmost_position)?'next pass':'next step'));
                // record array
                history_array.push(copy_array);
            }
        } 
        ++step;
        // copy array
        copy_array = []
        for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
        // record array
        history_array.push(copy_array);
        // record pivot
        pivot.push(-1)
        // record already done position
        fixed_position.push(n-1-pass)
        // record text
        explain.push('Step '+step+': '+copy_array[n-1-pass]+' is in its final position')
    }

    ++step;
    // copy array
    copy_array = []
    for(let j=0; j<n; ++j) copy_array.push(initial_array[j]);
    // record array
    history_array.push(copy_array);
    // record pivot
    pivot.push(-1)
    // record already done position
    fixed_position.push(0)
    // record text
    explain.push('Thank you for scrolling until the end (┬┬﹏┬┬)');

    function draw() {
        canvas.width = canvas.width
        cur = slider.value
        if(cur >= step) {
            cur = step;
        }

        // set font for numbers
        context.font = '48px serif'
        context.textAlign = 'center'
        context.textBaseline = 'middle';

        // set 'labeled box'
        let label_box = pivot[cur-1];
        // set 'fixed box'
        let clear_box = fixed_position[cur-1];

        // draw regular box
        for(let i = 0; i < n; ++i) {
            let ratio_from_left = (box_ratio-n)/2;
            let x = (ratio_from_left+i)*box_size;
            let y = padding_top;
            
            // check if this box is clear box
            if (i >= clear_box) {
                fillClearBox(x,y,box_size);   
            }

            drawBox(x,y,box_size);
        }
        
        // draw highlighed box
        for(let i = 0; i < n; ++i) {
            let ratio_from_left = (box_ratio-n)/2;
            let x = (ratio_from_left+i)*box_size;
            let y = padding_top;
            
            // check if this is a label box
            if (label_box == i) {
                drawHighlightBox(x,y,box_size);
                drawHighlightBox(x+box_size,y,box_size);
            }

            context.fillText(String(history_array[cur-1][i]), x+box_size/2, y+box_size/2);
        }

        const color_for_text = ['#e1e1e1','#bbbbbb','#000000','#bbbbbb','#e1e1e1'];

        function printText(start) {
            context.font = '24px serif'
            for(let i = -2; i <= 2; ++i) {
                if(start+i<0 || start+i >= step) continue;
                context.fillStyle = color_for_text[i+2];
                context.fillText(explain[start+i], canvas_width/2, start_text_section+(i+2)*step_section);
            }
        }
        
        printText(cur-1)
    }

    // Set Attribute value with JavaScript
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
    slider.setAttribute('max', step);
    slider.addEventListener("input", draw);
    draw();
}