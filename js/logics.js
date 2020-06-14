"use strict";
var skor = [0, 0];
var naPotezu = 0;
var n;
var m;
var parnostRunde = 0;

var izabraneTacke = [];
var brojIzabranih = 0;

var matrica = []; // 0-slobodno, 1-zauzeto, 2-vrh trougla
var povuceneDuzi = [];

// Kreira matricu tacaka 
function inicijalizirajMatricu(n, m, nestandardna) {
	if(!nestandardna)
		for(var i = 0 ; i < n ; i++){
			matrica.push(new Array(m).fill(0));
		}
	else
		for(var i = 0 ; i < n ; i++){
			matrica.push(new Array(i + 1).fill(0));
		}
}

// Provjerava da li se moze dodati trougao
function mozeSeDodatiTrougao(tacke) {

	if(naIstojPravoj(tacke))
		return false;

	if(matrica[tacke[0][1]][tacke[0][0]] != 0 ||
	 matrica[tacke[1][1]][tacke[1][0]] != 0 || 
	 matrica[tacke[2][1]][tacke[2][0]] != 0)
		return false;

	if(dodajDuz(tacke[0][0], tacke[0][1], tacke[1][0], tacke[1][1]) && 
		dodajDuz(tacke[0][0], tacke[0][1], tacke[2][0], tacke[2][1]) && 
		dodajDuz(tacke[1][0], tacke[1][1], tacke[2][0], tacke[2][1])) {
		return true;
	} 
	return false;
}

// Provjerava da li se moze nacrtati duz
function dodajDuz(x1, y1, x2, y2) {

	// Ako duz sijece neku prijasnju duz, ne dodajemo je
	for(var i = 0 ; i < povuceneDuzi.length ; i++) {
		var d = povuceneDuzi[i];
		if(sijekuLiSe([x1, y1, x2, y2], [d[0], d[1], d[2], d[3]]))			
			return false;
	};

	return true;
}

function naIstojPravoj(tacke) {
	if(daLiJeTackaNaPravoj(tacke[0][0], tacke[0][1], [tacke[1][0], tacke[1][1], tacke[2][0], tacke[2][1]]))
		return true;
	return false;
}

// Dodaje trougao ako je to moguce
function dodajTrougao(tacke) {

	// Degenerisani trougao
	if (naIstojPravoj(tacke)) {
		resetujIzabrane();
	}

	// Ako neka od duzi nacrtanog trougla sijece neku duz od prije, resetuj izbor
	else if(!dodajDuz(tacke[0][0], tacke[0][1], tacke[1][0], tacke[1][1]) || 
		!dodajDuz(tacke[0][0], tacke[0][1], tacke[2][0], tacke[2][1]) || 
		!dodajDuz(tacke[1][0], tacke[1][1], tacke[2][0], tacke[2][1])) {

		resetujIzabrane();
	} 

	else  {

		povuceneDuzi.push([tacke[0][0], tacke[0][1], tacke[1][0], tacke[1][1], naPotezu]);
		povuceneDuzi.push([tacke[0][0], tacke[0][1], tacke[2][0], tacke[2][1], naPotezu]);
		povuceneDuzi.push([tacke[1][0], tacke[1][1], tacke[2][0], tacke[2][1], naPotezu]);

		zauzmiPolja(tacke[0][0], tacke[0][1], tacke[1][0], tacke[1][1]);
		zauzmiPolja(tacke[0][0], tacke[0][1], tacke[2][0], tacke[2][1]);
		zauzmiPolja(tacke[1][0], tacke[1][1], tacke[2][0], tacke[2][1]);

		matrica[tacke[0][1]][tacke[0][0]] = matrica[tacke[1][1]][tacke[1][0]] = matrica[tacke[2][1]][tacke[2][0]] = 2;
		skor[naPotezu]++;
		naPotezu = 1 - naPotezu;
		resetujIzabrane();
		krajIgre();
	}
}

// Resetuje izabrane tacke
function resetujIzabrane(tacke) {
	izabraneTacke = [];
	brojIzabranih = 0;
}

// Racuna Euklidsku udaljenost dvije tacke
function udaljenost(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

// Provjerava da li se klik desio na tacku matrice
function klikNaTacku(x, y) {
	var tacka = [];
	for(var i = 0 ; i < n ; i++) {
		for(var j = 0 ; j < matrica[i].length ; j++) {
			var koordinate = pretvoriKoordinate(j, i);
			// Provjera da li smo kliknuli na krug tacke (i, j)
			if(udaljenost(koordinate[0], koordinate[1], x, y) <= myGame.r / 2) {
				tacka = [j, i];
				break;
			}
		}
	}
	return tacka;
}

// Zauzima polja koja se zauzimaju dodavanjem nove duzi
function zauzmiPolja(x1, y1, x2, y2) {
	for(var i = 0 ; i < n ; i++)
		for(var j = 0 ; j < matrica[i].length ; j++)
			if(daLiJeTackaNaDuzi(j, i, [x1, y1, x2, y2]))
				matrica[i][j] = 1;
}

// Provjerava da li se tacka nalazi na duzi
function daLiJeTackaNaDuzi(x, y, duz) {
	var a1 =  duz[3] - duz[1];
	var b1 =  duz[0] - duz[2];
	var c1 = a1 * duz[0] + b1 * duz[1];

	if((a1 * x + b1 * y == c1) && x >= Math.min(duz[0], duz[2]) && x <= Math.max(duz[0], duz[2]) 
		&& y >= Math.min(duz[1], duz[3]) && y <= Math.max(duz[1], duz[3]))
		return true;
	return false;
}

// Provjerava da li je tacka na pravoj
function daLiJeTackaNaPravoj(x, y, duz) {
	var a1 =  duz[3] - duz[1];
	var b1 =  duz[0] - duz[2];
	var c1 = a1 * duz[0] + b1 * duz[1];

	if(a1 * x + b1 * y == c1)
		return true;
	return false;
}

// Za dvije duzi provjerava da li se sijeku
function sijekuLiSe(duz1, duz2) {

	// Prave duz1 i duz2 (u obliku a1x + b1y = c1)
	var a1 =  duz1[3] - duz1[1];
	var b1 =  duz1[0] - duz1[2];
	var c1 = a1 * duz1[0] + b1 * duz1[1];

	var a2 =  duz2[3] - duz2[1];
	var b2 =  duz2[0] - duz2[2];
	var c2 = a2 * duz2[0] + b2 * duz2[1];

	var det = a1 * b2 - a2 * b1;

	// Ako su paralelne

	if(det == 0) {
		if(a1 == a2 && b1 == b2 && c1 == c2) {
			if(daLiJeTackaNaDuzi(duz2[0], duz2[1], [duz1[0], duz1[1], duz1[2], duz1[3]]) || 
			   daLiJeTackaNaDuzi(duz2[2], duz2[3], [duz1[0], duz1[1], duz1[2], duz1[3]]) ||
			   daLiJeTackaNaDuzi(duz1[0], duz1[1], [duz2[0], duz2[1], duz2[2], duz2[3]]) ||
			   daLiJeTackaNaDuzi(duz1[2], duz1[3], [duz2[0], duz2[1], duz2[2], duz2[3]])){
					return true;
			   }
			else return false;
		}
		return false;
	}

	// Presjecna tacka
	var x = (b2 * c1 - b1 * c2) / det; 
	var y = (a1 * c2 - a2 * c1) / det;


	// Ako presjek lezi na duz1 i na duz2 vrati true
	if(daLiJeTackaNaDuzi(x, y, [duz1[0], duz1[1], duz1[2], duz1[3]]) &&
		daLiJeTackaNaDuzi(x, y, [duz2[0], duz2[1], duz2[2], duz2[3]]))
			return true;
		
	
		
	return false;
}

// Pretvara koordinate matrice u koordinate canvasa
function pretvoriKoordinate(j, i) {
	return [myGame.marginaX + j * myGame.razmakX + myGame.r / 2, myGame.marginaY + i * myGame.razmakY + myGame.r / 2];
}

// Provjerava da li je kraj igre (tj. da li se moze dodati jos ijedan trougao)
function krajIgre() {

	for(var i1 = 0 ; i1 < n ; i1++)
		for(var j1 = 0 ; j1 < matrica[i1].length ; j1++)
			for(var i2 = 0 ; i2 < n ; i2++)
				for(var j2 = 0 ; j2 < matrica[i2].length ; j2++)
					for(var i3 = 0 ; i3 < n ; i3++)
						for(var j3 = 0 ; j3 < matrica[i3].length; j3++) {
							if(nemaIstiPar(i1, j1, i2, j2, i3, j3) && mozeSeDodatiTrougao([[j1, i1], [j2, i2], [j3, i3]])) {
								return false;
							}
						}
	var pobjednik;
	if(naPotezu == 0)
		pobjednik = "B";
	else
		pobjednik = "A";

	document.getElementById('pobjednik').innerHTML = "Pobjednik je igrač " + pobjednik + "!";
	document.getElementById('game-over').style.display = 'block';
	document.getElementById('game-over-overlay').style.display = 'block';
	
	return true;
}

// Resetuje igru, pri cemu je sada prvi igra onaj koji je igrao drugi u prethodnoj rundi
function resetujIgru() {
	for(var i = 0 ; i < n ; i++)
		for(var j = 0 ; j < matrica[i].length ; j++)
			matrica[i][j] = 0;
	povuceneDuzi = [];
	izabraneTacke = [];
	brojIzabranih = 0;
	skor[0] = skor[1] = 0;
	naPotezu = 1 - parnostRunde;
	parnostRunde = (parnostRunde + 1) % 2;
	document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
}



