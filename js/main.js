var datos_anual, datos_ccaa;

function read_data(){
    datos_anual = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'recursos/por_anio.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();


    datos_ccaa= (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'recursos/por_ccaa.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function despelgar_ccaa(){
    $("boton_ccaa").submit(function(e) {
        e.preventDefault();
    });
    if ($('#boton_ccaa').text()=="Desplegar CCAA"){
        $('#comunidades_visual_form').css("display","block")
        $('#boton_ccaa').text("Ocultar CCAA")
    } else{
        $('#comunidades_visual_form').css("display","none")
        $('#boton_ccaa').text("Desplegar CCAA")
    }

}


function init3dmap(norm, anio, visual, ccaa, ccaa_sel){
    var valores = [];
    referencia = 1;
    var max = 0.0;
    var desf = 0;
    if (visual.length == 1){
        desf = 0;
    } else if (visual.length == 2) {
        desf = LADO*1.5;
    } else {
        desf = -LADO*2.5;
    }
    for (var i = 0; i < visual.length; i++) {
        dat = datos_anual[anio][visual[i]]
        if (norm == 'total'){
                referencia = dat[dat.length-1]
        }
        for (var j = 0; j < dat.length; j++){
            if (ccaa_sel.indexOf(ccaa[j])!=-1){
                valor = []
                valor[0] = ccaa[j];
                valor[1] = dat[j]/referencia;
                valor[2] = visual[i];
                valor[3] = desf
                if (valor[0] != 'Total'){
                    max = Math.max(max, valor[1]);
                    valores.push(valor);
                }
            }
        }
        desf = desf + LADO*1.5;
    }
    console.log(max);
    TR3.loadFile(CCAA_loc, valores, LADO, FORMATOS, max);
    return valores;
}


function plot_bar_chart(norm, anio, visual, ccaa, ccaa_sel){
    $('#barchart').append("<canvas id=\"canvasChart\" width=\"100\"></canvas>");
    var densityData = []

    for (var i = 0; i < visual.length; i++) {
        dat = datos_anual[anio][visual[i]];
        var data = [];
        var referencia = dat[dat.length-1]
        for (var j = 0; j < dat.length; j++){
            if (ccaa_sel.indexOf(ccaa[j])!=-1){
                if (norm == 'total'){
                    data.push(dat[j]/referencia * 100);
                }
                else{
                    data.push(dat[j]);
                }
            }
        }

        var dic = {
          label: visual[i],
          data: data,
          backgroundColor: FORMATOS_BAR[visual[i]].back,
          borderColor: FORMATOS_BAR[visual[i]].border
        };
        densityData.push(dic)

    }
    var canvas_ref = document.getElementById("canvasChart");
    canvas_ref.style.width ='100%';
    canvas_ref.style.height='100%';
    canvas_ref.width  = canvas_ref.offsetWidth;
    canvas_ref.height = canvas_ref.offsetHeight;
    var barChart = new Chart(canvas_ref, {
      type: 'bar',
      data: {
        labels:ccaa_sel,
        datasets: densityData
      }
    });
}

var densityData;
function plot_line_chart(norm, visual, ccaa, ccaa_sel){
    $('#linechart').append("<canvas id=\"canvasLineChart\"></canvas>");
    densityData = []
    console.log(norm)
    for (var i = 0; i < ccaa.length; i++) {
        dat = datos_ccaa[ccaa[i]][visual]

        var dic = {
          label: ccaa[i],
          data: dat,
          fill: false,
          borderColor: getRandomColor(),
          backgroundColor: 'transparent',
        };
        if (ccaa_sel.indexOf(ccaa[i])!=-1){
            densityData.push(dic);
        }
    }
    var canvas_ref = document.getElementById("canvasLineChart");
    canvas_ref.style.width ='100%';
    canvas_ref.style.height='100%';
    canvas_ref.width  = canvas_ref.offsetWidth;
    canvas_ref.height = canvas_ref.offsetHeight;

    var chartOptions = {
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 20,
              fontColor: 'black'
            }
          }
        };
    var lista_anios = [];
    for(var i=2002; i <2020; i++){lista_anios.push(i);}
    var lineChart = new Chart(canvas_ref, {
      type: 'line',
      data: {
            labels: lista_anios,
            datasets: densityData
        },
    options: chartOptions
    });
}



function cargar_comunidades(){
    ccaa = datos_anual["comunidades"];
    var sel = '<form id="ccaaSelector">'
    for (var i = 0; i < ccaa.length; i++) {
        opc = '<label><input type=\"checkbox\" name=\"ccaa_auto\" value=\"com\">norm<br/></label>';
        if (ccaa[i]=="Total"){
            opc = '<label><input type=\"checkbox\" name=\"ccaa_auto\" value=\"com\" checked>norm<br/></label>';
        }
        inp = opc.replaceAll("com", ccaa[i]);
        inp = inp.replaceAll("norm", CCAA_norm[ccaa[i]]);
        sel = sel.concat(inp);
    }
    sel = sel.concat("</form>");
    $('#ccaa_reemplaza').replaceWith(sel);


    ccaa = datos_anual["comunidades"];
    var sel = ''
    for (var i = 0; i < ccaa.length; i++) {
        opc = '<label><input type=\"checkbox\" name=\"ccaa_auto\" value=\"com\" checked>norm<br/></label>';
        if (ccaa[i]=="Total"){
            opc = '<label><input type=\"checkbox\" name=\"ccaa_auto\" value=\"com\">norm<br/></label>';
        }
        inp = opc.replaceAll("com", ccaa[i]);
        inp = inp.replaceAll("norm", CCAA_norm[ccaa[i]]);
        sel = sel.concat(inp);
    }
    $('#sustituirccaa').replaceWith(sel);

}



function cambia_tag(opc){
    if (opc==0){
        $("#ccaa_vision").css("display","block")
        $("#linechart").css("display","none")

    }else{
        $("#ccaa_vision").css("display","none")
        $("#linechart").css("display","block")
        // var visual=[]
        // $('input[name=datos]:checked', '#formulario').each(function(i){
        //       visual[i] = $(this).val();
        // });
        var norm = $('input[name=norm]:checked', '#formulario').val()
        var ccaa_sel=[]
        $('input[name=ccaa_auto]:checked', '#ccaaSelector').each(function(i){
              ccaa_sel[i] = $(this).val();
        });
        $('#linechart').empty();
        var ccaa = datos_anual['comunidades']
        plot_line_chart(norm, opc, ccaa, ccaa_sel)
    }






}


function do_onload(){
    read_data();
    cargar_comunidades();
}




var ccaa;
function init(){
    read_data()
    var norm = $('input[name=norm]:checked', '#formulario').val()
    var anio = $("#anio option:selected").text();
    var visual=[];
    $('input[name=datos]:checked', '#formulario').each(function(i){
          visual[i] = $(this).val();
    });

    console.log(norm);
    console.log(visual);
    var ccaa = datos_anual['comunidades']
    var ccaa_sel =[];
    $('input[name=ccaa_auto]:checked', '#formulario').each(function(i){
          ccaa_sel[i] = $(this).val();
    });

    valores = init3dmap(norm, anio, visual, ccaa, ccaa_sel)
    plot_bar_chart(norm, anio, visual, ccaa, ccaa_sel)
    cambia_tag(visual[0])
    $("#anio_visual").text(anio)

    $("#btnac_victima").prop("disabled",true);
    $("#btninfracciones").prop("disabled",true);
    $("#btnac_mortales").prop("disabled",true);

    for (var i=0; i<visual.length; i++){
        str='#btn';
        str=str.concat(visual[i]);
        console.log(str)
        $(str).prop("disabled",false);
    }
}
