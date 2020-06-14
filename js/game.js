"use strict";
var requestAnimatFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


function startGame() {

	var tekstMenija = document.getElementById('game').innerHTML;

	// Prikazivanje meni-a, pritisak buttona, početak igre

	document.getElementById('game').style.display = 'block';
	document.getElementById('game-overlay').style.display = 'block';

	document.getElementById('igraj-opet').addEventListener('click', function() {
        resetujIgru();
    });

	Array.prototype.forEach.call(document.getElementsByClassName('nazad'), (b) => {
		b.addEventListener('click', function() {
        	document.getElementById('game').innerHTML = tekstMenija;
        	redirect("/index.html");
        });
	});

	document.getElementById('igra1').addEventListener('click', function() {
		document.getElementById('izborPloce').style.display = "none";
		document.getElementById('game-overlay').style.display = "none";
    	myGame.start(8, 8, false);
    });

    document.getElementById('igra2').addEventListener('click', function() {
		document.getElementById('izborPloce').style.display = "none";
		document.getElementById('game-overlay').style.display = "none";
    	myGame.start(4, 6, false);
    });

    document.getElementById('igra3').addEventListener('click', function() {
		document.getElementById('izborPloce').style.display = "none";
		document.getElementById('game-overlay').style.display = "none";
    	myGame.start(8, 6, false);
    });

    document.getElementById('igra4').addEventListener('click', function() {
		document.getElementById('izborPloce').style.display = "none";
		document.getElementById('game-overlay').style.display = "none";
    	myGame.start(6, 6, true);
    });

    document.getElementById('nova-igra').addEventListener('click', function() {
    	document.getElementById('game').style.display = "none";
    	document.getElementById('izborPloce').style.display = "block";
    });

    document.getElementById('upute').addEventListener('click', function() {
    	document.getElementById('game').innerHTML = document.getElementById("tekstUputa").innerHTML;
    });

    document.getElementById('oProjektu').addEventListener('click', function() {
    	document.getElementById('game').innerHTML = document.getElementById("tekstProjekta").innerHTML;
    });
	
}

var myGame = {
	canvas : document.createElement("canvas"),
	start : function(n1, m1, nestandardna) {
		n = n1;
		m = m1;
		inicijalizirajMatricu(n, m, nestandardna);

		this.canvas.width = 1024;
		this.canvas.height = 720;
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

		this.r = 20;
		this.marginaX = 0.20 * this.canvas.width;
		this.marginaY = 0.20 * myGame.canvas.height;
		this.razmakX = (myGame.canvas.width - 2*this.marginaX - this.r) / (m - 1);
		this.razmakY = (myGame.canvas.height - 2*this.marginaY - this.r) / (n - 1);

		this.canvas.addEventListener("click", (e) => {
			var rect = e.target.getBoundingClientRect();
  			var x = e.clientX - rect.left; //x pozicija elementa
  			var y = e.clientY - rect.top;  //y pozicija elementa

			var tacka = klikNaTacku(x, y);
			if(tacka.length != 0) {
				if(daLiJeUNizu(izabraneTacke, tacka) == -1) {
					brojIzabranih++;
					izabraneTacke.push(tacka);
					if(brojIzabranih == 3)
						dodajTrougao(izabraneTacke);
				}
				else {
					var indeks = daLiJeUNizu(izabraneTacke, tacka);
					izabraneTacke.splice(indeks, 1);
					brojIzabranih--;
				}
			}
		});
		
		main();
	},
	
}

var bgReady = false;
var bg = new Image();
bg.onload = function () {
	bgReady = true;
};
bg.src = "images/background.jpg";

// Funkcija za crtanje cijelog ekrana
var render = function () {
	myGame.ctx.clearRect(0, 0, myGame.canvas.width, myGame.canvas.height);

	if (bgReady) {
		myGame.ctx.drawImage(bg, 0, 0);
	}

	var boja;
	var bojaIgraca;

	if(naPotezu == 0)
		bojaIgraca = "green";
	else
		bojaIgraca = "blue";

	// Iscrtavanje tacaka

	for(var i = 0 ; i < n ; i++) {
		for(var j = 0 ; j < matrica[i].length ; j++) {
			myGame.ctx.beginPath();
			myGame.ctx.arc(myGame.marginaX + j*myGame.razmakX + myGame.r/2, 
				myGame.marginaY + i*myGame.razmakY + myGame.r/2, myGame.r / 2, 0, 2 * Math.PI);
			if(matrica[i][j] == 0)
				boja = "gray";
			else if(matrica[i][j] == 1)
				boja = "darkred";
			else 
				boja = "orange";

			// Ako je tacka trenutno izabrana
			if(daLiJeUNizu(izabraneTacke, [j, i]) != -1)
				boja = bojaIgraca;

			myGame.ctx.fillStyle = boja;
			myGame.ctx.fill();
		}
	}

	// Iscrtavanja linija trouglova

	povuceneDuzi.forEach((tacke) => {
		var koordinate1 = pretvoriKoordinate(tacke[0], tacke[1]);
		var koordinate2 = pretvoriKoordinate(tacke[2], tacke[3]);
		myGame.ctx.beginPath();
		myGame.ctx.moveTo(koordinate1[0], koordinate1[1]);
		myGame.ctx.lineTo(koordinate2[0], koordinate2[1]);
		myGame.ctx.lineWidth = 3;
		if(tacke[4] == 0)
			myGame.ctx.strokeStyle = "green";
		else
			myGame.ctx.strokeStyle = "blue";
		myGame.ctx.stroke();

	});

	// Skor igraca

	myGame.ctx.fillStyle = "rgb(250, 250, 250)";
	myGame.ctx.font = "24px Helvetica";
	myGame.ctx.textAlign = "left";
	myGame.ctx.textBaseline = "top";
	myGame.ctx.fillText("Igrač A: " + skor[0], myGame.marginaX/2, 35);
	myGame.ctx.fillText("Igrač B: " + skor[1], myGame.canvas.width - myGame.marginaX/2 - 24*4, 35);

	// Linije koje oznacavaju koji igrac je na redu

	myGame.ctx.beginPath();
	myGame.ctx.moveTo(myGame.marginaX / 2, myGame.marginaY);
	myGame.ctx.lineTo(myGame.marginaX / 2, myGame.canvas.height - myGame.marginaY);
	myGame.ctx.moveTo(myGame.canvas.width - myGame.marginaX / 2, myGame.marginaY);
	myGame.ctx.lineTo(myGame.canvas.width - myGame.marginaX / 2, myGame.canvas.height - myGame.marginaY);
	myGame.ctx.lineWidth = 3;
	myGame.ctx.strokeStyle = bojaIgraca;
	myGame.ctx.stroke();

};

// Glavna petlja igre
var main = function () {

	render();
	requestAnimatFrame(main);
};
