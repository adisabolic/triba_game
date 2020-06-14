"use strict";

// Provjera da li je objekat u nizu
function daLiJeUNizu(niz, obj) {
	for(var i = 0 ; i < niz.length ; i++)
		if(niz[i][0] == obj[0] && niz[i][1] == obj[1])
			return i;
	return -1;
}

// Provjerava da li postoje dva ista para medju proslijedjenim

function nemaIstiPar(i1, j1, i2, j2, i3, j3) {
	if((i1 == i2 && j1 == j2) || (i1 == i3 && j1 == j3) || (i2 == i3 && j2 == j3))
		return false;
	return true;
}