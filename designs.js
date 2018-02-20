function makeGrid() {
    // reset background color
    $('#pixelCanvas').each(function(){
        $(this).css("backgroundColor","");
    }).empty();
    // make the grid
    let height = $('#inputHeight').val();
    let width = $('#inputWidth').val();
    let grid = '';
    for (var row = 0; row < height; row++){
        grid += "<tr>";
        for(var col = 0; col < width; col++){
            grid += "<td></td>"
        }
        grid += "</tr>";
    }
    $('#pixelCanvas').append(grid);

    //while mouse is held down, use mouseover to change color
    $("#pixelCanvas td").on("mousedown touchstart", function(e){
        e.preventDefault(); // prevent drag n drop
        let color = $("#colorPicker").spectrum('get').toRgbString();
        let cell = $(e.target);
        const cells = $("td");

        cell.css("backgroundColor", color);
        cells.on("mouseover touchmove",function(e){
            //check for touch, mobile users
            //pinpoint x,y, from user's position, color elementFromPoint
            if (e.type === 'touchmove'){
                e.preventDefault(); // prevent scrolling in mobile
                let x = e.changedTouches[0].clientX;
                let y = e.changedTouches[0].clientY;
                let hoverCell = document.elementFromPoint(x,y);
                $(hoverCell).filter("td").css("backgroundColor",color);
            } else {
                $(e.target).css("backgroundColor",color);
            }
        });//end mouseover touchmove

    });// end mousedown
    //end mouseover on mouseup
    $(document).on("mouseup touchend touchcancel", function(e){
        $("td").off("mouseover touchmove");
    });
}

//make screenshot using html2canvas
function screenshot(){
    if (!$("#borderOption").is(":checked")){
      $("#borderOption").prop('checked',true).trigger("change");
    }
    html2canvas(document.querySelector("table")).then(canvas => {
      $("canvas").remove();
      $("#screenshotContainer").append(canvas).show();
      $("#borderOption").prop('checked',false).trigger("change");
    });
}

// callback func that sets inputs using max value,
// then link height and width inputs
function squareSize(event){
    //if checkbox is checked
    if (event.target.checked){
        let height = Number($("#inputHeight").val());
        let width = Number($("#inputWidth").val());
        let max = Math.max(height, width);

        $("#inputHeight, #inputWidth").val(max).on("change", function(e){
            //link inputs together
            if ($(e.target).is("#inputWidth")){
                $("#inputHeight").val($(e.target).val());
            } else {
                $("#inputWidth").val($(e.target).val());
            }
        });
    } else {
        $("#inputHeight, #inputWidth").off("change");
    }
}

$('.wrap').hide(); //hide wrapper, show when new grid

/*************************************
 *
 * Event Handlers
 *
 *************************************/
$("#sizePicker").submit(function(e){
    e.preventDefault();
    $("#borderOption").prop('checked',false);
    $(".wrap").show();
    makeGrid();
});

$("#reset").on("click", function(e){
    $('#pixelCanvas td').each(function(ele){
        $(this).css("backgroundColor","");
    });
});

$("#squareCheck").on('change', squareSize);

//crossbrowser color picker jquery plugin
$("#colorPicker").spectrum({
    showPalette: true
});

$("#borderOption").on("change", function(e){
    if (e.target.checked){
        $("table, tr, td").css("border", "none");
    } else {
        $("table, tr, td").css("border","");
    }
    return false;
});

$("#screenshot").click(screenshot);