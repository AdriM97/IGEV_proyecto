var CCAA_loc = {
    "Comunidad de Madrid": [30,0,-70],
    "Castilla y Leon": [-20,0,-150],
    "Galicia": [-150,0,-250],
    "Principado de Asturias": [-70,0,-260],
    "Cantabria": [10,0,-240],
    "Comunidad Foral de Navarra": [130,0,-220],
    "Aragon": [190,0,-130],
    "Islas Baleares": [350,0,-20],
    "Comunidad Valenciana": [190,0,0],
    "Castilla-La Mancha": [80,0,0],
    "Extremadura": [-70,0,0],
    "Andalucia": [-20,0,150],
    "Region de Murcia": [150,0,100],
    "Canarias": [-250,0,250],
    "Cataluna": [290,0,-150],
    "La Rioja": [100,0,-190],
    "Pais Vasco": [80,0,-240],
    "Total": [-220,0,-70]
    };

    var CCAA_norm= {
        "Comunidad de Madrid": "C. de Madrid",
        "Castilla y Leon": "Castilla y León",
        "Galicia": "Galicia",
        "Principado de Asturias": "Principado de Asturias",
        "Cantabria": "Cantabria",
        "Comunidad Foral de Navarra": "C. Foral de Navarra",
        "Aragon": "Aragón",
        "Islas Baleares": "Islas Baleares",
        "Comunidad Valenciana": "C. Valenciana",
        "Castilla-La Mancha": "Castilla-La Mancha",
        "Extremadura": "Extremadura",
        "Andalucia": "Andalucía",
        "Region de Murcia": "Región de Murcia",
        "Canarias": "Islas Canarias",
        "Cataluna": "Cataluña",
        "La Rioja": "La Rioja",
        "Pais Vasco": "País Vasco",
        "Total": "Total nacional"
        };

var FORMATOS = {
    infracciones: {color: 'orange', tipo:'barra'},
    ac_victima: {color:'red', tipo:'barra'},
    ac_mortales: {color:'black', tipo:'cruz'}
};

var FORMATOS_BAR= {
    infracciones: {back: 'rgba(100, 100, 0, 0.6)', border: 'rgba(100, 100, 0, 0.6)'},
    ac_victima: {back: 'rgba(255, 0, 0, 0.6)', border: 'rgba(255, 0, 0, 0.6)'},
    ac_mortales:  {back: 'rgba(0, 0, 0, 0.6)', border: 'rgba(0, 0, 0, 0.6)'}
};


var LADO = 10;
