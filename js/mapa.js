	/*load Libreries*/
	document.writeln("<script src=\"libs/three.min.js\"></script>");
	document.writeln("<script src=\"libs/OrbitControls.js\"></script>");
	document.writeln("<script src=\"libs/Detector.js\"></script>");

	TR3 = new Object();
	/*Scene Container*/
	TR3.scene; TR3.renderer; TR3.camera; TR3.controls; TR3.material; TR3.mesh; TR3.fov = 30;

	/*Maps Params*/
	TR3.srsImg; TR3.widthImg; TR3.heightImg;

	/*Container*/
	TR3.desty;
	TR3.canvasDestW; TR3.canvasDestH;
	TR3.optionsSet = {cursor3d: true, anaglyph: false};

	TR3.animate = function(){

		if(TR3.optionsSet.anaglyph){
			effect.render(TR3.scene, TR3.camera);
		}else{
			TR3.renderer.render(TR3.scene, TR3.camera);
		}

		TR3.controls.update();
		//request new frame
		requestAnimationFrame( TR3.animate );
	};

	TR3.makeWorld = function(imgConteint){

		TR3.widthImg = imgConteint.width;
		TR3.heightImg = imgConteint.height;

		/*Position Camera Ini*/
		var radianFOV = TR3.fov*2*Math.PI/360;
		TR3.camera.position.y = Math.cos(radianFOV/2)*(TR3.widthImg/2)/Math.sin(radianFOV/2)/1.5;
		TR3.camera.position.z = TR3.camera.position.y*Math.sin(Math.PI/4);

		/*Texture-Material*/
		var texture = new THREE.Texture(imgConteint);
		texture.needsUpdate = true;
		TR3.material = new THREE.MeshBasicMaterial({map: texture});

		/*Image-Mesh*/
		var geometry = new THREE.PlaneBufferGeometry( TR3.widthImg, TR3.heightImg );
		//geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
		TR3.mesh = new THREE.Mesh( geometry, TR3.material);
		//TR3.mesh.geometry.dynamic = true;
		TR3.mesh.name = "mesh3d";
		TR3.mesh.rotation.x = -Math.PI/2;
		TR3.scene.add(TR3.mesh);
	};

	TR3.cvsDesty = function(){

		var canvasDest = document.getElementById('canvasDest');
		if(!canvasDest){
			canvasDest = document.createElement('CANVAS');
			canvasDest.id = 'canvasDest';
			canvasDest.setAttribute("width", TR3.canvasDestW);
			canvasDest.setAttribute("height", TR3.canvasDestH);

			document.getElementById(TR3.desty).appendChild(canvasDest);
		}

		return canvasDest;
	};

	TR3.setMeshOptions = function(cursorOpt, anaglyphOpt){
		/*DTM*/
		var b4DTMopt = TR3.optionsSet.DTM;

		//if(DTMopt=="def"){DTMopt=false;}

		/*Cursor3d*/
		var cursorOpt = cursorOpt;

		if(cursorOpt=="def"){cursorOpt=true;}
		var infoGeo3d = document.getElementById('infoGeo3d');
		var cvsDesty = document.getElementById(TR3.desty)
		if( cursorOpt == true ){
			if(!infoGeo3d){
				infoGeo3d = document.createElement('div');
				infoGeo3d.id = "infoGeo3d";
				infoGeo3d.style.position = "absolute";
				infoGeo3d.style.top = 0;
				infoGeo3d.style.fontSize = "10px";
				infoGeo3d.style.margin = "5px";
				cvsDesty.appendChild(infoGeo3d);
			}else{
				infoGeo3d.style.display = 'block';
			}
			//cvsDesty.style.cursor = "none";
		}else{
			infoGeo3d.style.display = 'none';
			//cvsDesty.style.cursor = "auto";
		}

		/*Anaglyph*/
		var anaglyphOpt = anaglyphOpt;

		if(anaglyphOpt=="def"){anaglyphOpt=false;}

		TR3.optionsSet = {cursor3d: cursorOpt, anaglyph: anaglyphOpt};
	};

	TR3.divContainer = function(desty){

		var contMeshMap = document.getElementById(desty);
		if(!contMeshMap){
			alert("invalid destiny");
		}else{
			TR3.canvasDestW = parseInt(contMeshMap.style.width) || 600;
			TR3.canvasDestH = parseInt(contMeshMap.style.height) || 600;
			contMeshMap.style.position='relative';
		}
	};

	TR3.setMeshMap = function(imgOri,desty){

		/*INI params*/
		//imgOri = imgOri || 'http://www.ign.es/wms-inspire/pnoa-ma?&VERSION=1.1.1&REQUEST=GetMap&LAYERS=OI.OrthoimageCoverage&FORMAT=image/jpeg&SRS=EPSG:25830&BBOX=647399,4220032,649899,4222532&EXCEPTIONS=application/vnd.ogc.se_inimage&width=500&height=500';
		TR3.desty = desty || 'contMeshMap';
		TR3.setMeshOptions(true, false);

		/*Div container*/
		TR3.divContainer(desty);

		/*Detector Renderer*/
		if(Detector.canvas){
			/*Get canvas Destiny*/
			var canvasDest = TR3.cvsDesty();
			if ( ! Detector.webgl ) {
				alert("Your browser does not seem to support WebGL. Please, upgrade your browser or try another one.");
			}else{
				TR3.renderer = new THREE.WebGLRenderer({ canvas: canvasDest });
			}
		}else{
			alert("Your browser does not seem to support HTML5 canvas. Please, upgrade your browser or try another one.");
		};

		TR3.renderer.setSize( TR3.canvasDestW, TR3.canvasDestH );

		/*Scene*/
		TR3.scene = new THREE.Scene();

		/*Camera*/
		TR3.camera = new THREE.PerspectiveCamera(TR3.fov, TR3.canvasDestW / TR3.canvasDestH, 1, 20000);

		/*Orbit Controls*/
		TR3.controls = new THREE.OrbitControls( TR3.camera, canvasDest );
		//TR3.controls.center.set(0.0, 0.0, 0.0);
		TR3.controls.maxPolarAngle = Math.PI/2;
		TR3.controls.minPolarAngle = 0 + 0.05;
		TR3.controls.userPanSpeed = 100;
		TR3.controls.autoRotate = true;

		TR3.scene.background =  new THREE.Color( 0xffffff )
		/*Create Image-Mesh*/
		TR3.makeWorld( imgOri );

		/*Animate*/
		TR3.animate();

		/*Events*/
		window.addEventListener( 'resize', TR3.onWindowResize, false );
		canvasDest.addEventListener( 'click', function() {TR3.controls.autoRotate = false;}, false );
	};

	TR3.onWindowResize = function(){

		TR3.camera.aspect = TR3.canvasDestW / TR3.canvasDestH;
		TR3.camera.updateProjectionMatrix();

		TR3.renderer.setSize( TR3.canvasDestW, TR3.canvasDestH );
	};

	TR3.loadFile = function ( ciudades, valores, lado, FORMATOS, max) {
	//Definimos la luz
	TR3.scene.add( new THREE.AmbientLight( 0xffffff, 0.7 ) )
	console.log(valores)
	// const axesHelper = new THREE.AxesHelper( 5 );
	// TR3.scene.add( axesHelper );

	// var material = new THREE.LineBasicMaterial({
	// 			   color: 0x00ff00
	// 		   });
	//
	// 		   var geometry = new THREE.Geometry();
	// 		   geometry.vertices.push(
	// 			   new THREE.Vector3( -200, 300, 0 ),
	// 			   new THREE.Vector3( -200, 0, 0 )
	// 		   );
	//
	// 		   var line = new THREE.Line( geometry, material );
	// 		   TR3.scene.add( line );

	scal = 300/max
		for(var i=0;i<valores.length;i++){
			var valor = valores[i]
			posi = ciudades[valor[0]]
			color = FORMATOS[valor[2]].color;
			tipo = FORMATOS[valor[2]].tipo;
			desf = valor[3]
			if (tipo=="cruz"){

			}
			valor[1] = valor[1]*scal;
			var geometry = new THREE.BoxBufferGeometry(lado, valor[1], lado);
			var material = new THREE.MeshStandardMaterial({color: new THREE.Color(color)});
			var barra =new THREE.Mesh( geometry, material );
			//console.log(valor[0])
			barra.position.set( posi[0]-desf, valor[1]/2, posi[2])
			TR3.scene.add( barra );
			if (tipo=="cruz"){
				y = valor[1]*0.8;
				var geometry = new THREE.BoxBufferGeometry(2*lado, lado/2, lado);
				var material = new THREE.MeshStandardMaterial({color: new THREE.Color(color)});
				var cruz =new THREE.Mesh( geometry, material );
				cruz.position.set( posi[0]-desf,y, posi[2])
				TR3.scene.add( cruz );

			}
		}


	}
