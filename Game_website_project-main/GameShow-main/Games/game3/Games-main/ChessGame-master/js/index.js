let column = [];
let row = [];
let container = document.querySelector(".container");
var myAudio = new Audio("../images/wooden-object-place.wav");
let posiblemoves;
let selectclass;
let redselectclass;
let check = false;
let checktext = document.querySelector(".checktext");
let gameover = false;
let overlay = document.querySelector(".overlay");
let winnerText = document.querySelector(".winner-text");
let resetbtn = document.querySelector(".playagain-btn");
let overlay2 = document.querySelector(".overlay2");
let chessofficials = document.querySelector(".chessofficials");
let officialsdiv = new Array(4);
let whitePTime = 900;
let blackPTime = 900;
let myinterval = -1;
let whitePtimer = document.getElementById("whiteP-timer");
let blackPtimer = document.getElementById("blackP-timer");
let innercontainer = document.querySelector(".innercontainer");
const whites = {king: "♔",queen: "♕",rook: "♖",bishop: "♗",knight: "♘",pawn: "♙",};
const black = {king: "♚",queen: "♛",rook: "♜",bishop: "♝",knight: "♞",pawn: "♟︎",};
let whiteP = Object.values(whites);
let blackP = Object.values(black);
resetbtn.addEventListener("click", function () {
	location.reload();
});
function theme(n) {
	const themedark = ["#803E04", "#7a7a7a", "#0A85AE","#cf5742"];
	const themelight = ["#FFCE9E", "rgb(247, 247, 247)", "#fff","rgb(247, 247, 247)"];
	const border = ["#391C08", "#353535", "#023850","red"];
	let allBlack = document.querySelectorAll(".black");
	for (let i = 0; i < 32; i++) {
		allBlack[i].style.backgroundColor = themedark[n];
	}
	let allWhite = document.querySelectorAll(".white");
	for (let i = 0; i < 32; i++) {
		allWhite[i].style.backgroundColor = themelight[n];
	}
	document.querySelector(".outercontainer").style.backgroundColor = border[n];
}

function addelement() {
	let z = 0;
	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
			row[z] = document.createElement("div");
			row[z].classList.add("row");
			row[z].id = `box-${x}-${y}`;
			if (y % 2 ^ x % 2) {
				row[z].classList.add("black");
			} else {
				row[z].classList.add("white");
			}

			innercontainer.appendChild(row[z]);
			z++;
		}
	}
}
square = [];
//defaultPosition();
addelement();
let boardArr = [...Array(8)].map((e) => Array(8));
function convert2d() {
	let z = 0;
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			boardArr[i][j] = row[z];
			z++;
		}
	}
}
convert2d();
defaultPosition();
function defaultPosition() {
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			if (y == 1 || y == 6) {
				let color = y == 1 ? "black" : `whites`;
				boardArr[y][x].innerHTML = eval(color).pawn;
			}
			if (y == 0 || y == 7) {
				let color = y == 0 ? "black" : `whites`;
				if (x == 0 || x == 7) boardArr[y][x].innerHTML = eval(color).rook;
				else if (x == 1 || x == 6)
					boardArr[y][x].innerHTML = eval(color).knight;
				else if (x == 2 || x == 5)
					boardArr[y][x].innerHTML = eval(color).bishop;
				else if (x == 3) boardArr[y][x].innerHTML = eval(color).queen;
				else if (x == 4) boardArr[y][x].innerHTML = eval(color).king;
			}
		}
	}
}

let selEl = [];
let pick;
let selELarr1k = new Array(8).fill(0).map(() => new Array(2).fill(0));
let blackEaten; //storage for eaten black peices
let whiteEaten; //storage for eaten white peices
let blackEatenEL = []; //storage for eaten black peices
let whiteEatenEL = []; //storage for eaten white peices
let whitePlayer = document.querySelector(".white1");
let BlackPlayer = document.querySelector(".black1");
whitePlayer.classList.toggle("active");
let selELarr = [];
let activePlayer;
activePlayer = document.querySelector(".active").id;
checked(true);
let blacktimerstart;
let enpassantW = [];
let enpassantB = [];
let whitetimerstart = setInterval(whitePcountdowntimer, 1000);
let selELcopy = [];
function printID(e) {
	e = e || window.event;
	e = e.target || e.srcElement;
	let el = document.getElementById(e.id);
	let n;
	let n1;
	let canmove;
	let pick1;

	if (el != null) {
		//  checkDOM();
		let sel = el.innerHTML;
		pick1 = sel;
		let CP = (element) => element === pick1;
		activePlayer = document.querySelector(".active").id;
		//check if pick chess peice is black or white
		if (activePlayer == "whiteP") {
			canmove = whiteP.some(CP);
		} else {
			canmove = blackP.some(CP);
		}
		if (sel.length != 0 && canmove) {
			let chmoves;
			pick = sel;
			selEl.push(e.id);
			if (typeof selEl[1] == "undefined") {
				document.getElementById(selEl[0]).classList.add("select");
				selELarr = String(selEl[0]).split("-");

				if (!check) {
					let possiblemoveslocation = [];
					let moves = chessmoves(selELarr, pick, true);
					if (moves.length) {
						for (let i = 0; i < moves.length; i++) {
							el.innerHTML = "";

							if (Boolean(moves[i].innerHTML)) {
								moveappendB = moves[i].innerHTML;
							} else {
								moveappendB = "";
							}

							moves[i].innerHTML = pick;
							let ischeck = checked();
							if (!ischeck) {
								possiblemoveslocation.push(moves[i]);
							}
							moves[i].innerHTML = moveappendB;
						}
						el.innerHTML = pick;
						removeSel(false);
						for (let j = 0; j < possiblemoveslocation.length; j++) {
							if (possiblemoveslocation[j].innerHTML == "" ||possiblemoveslocation[j].innerHTML == pick) {
								possiblemoveslocation[j].classList.add("select");
							} else {
								possiblemoveslocation[j].classList.add("redselect");
							}
						}
					}
				} else {
					chmoves = checkmoves(activePlayer);
					if (chmoves[0].includes(el)) {
						const indexesOf = (arr, item) => arr.reduce((acc, v, i) => (v === item && acc.push(i), acc),[]);
						let moveindexes = indexesOf(chmoves[0], el);
						for (let i = 0; i < moveindexes.length; i++) {
							if (chmoves[1][moveindexes[i]].innerHTML) {
								chmoves[1][moveindexes[i]].classList.add("redselect");
							} else {
								chmoves[1][moveindexes[i]].classList.add("select");
							}
						}
					}
				}
			} else {
				removeSel(false);
				document.getElementById(selEl[1]).classList.add("select");
				selELarr = String(selEl[1]).split("-");

				if (!check) {
					let possiblemoveslocation = [];
					let moves = chessmoves(selELarr, pick, true);
					if (moves.length) {
						for (let i = 0; i < moves.length; i++) {
							el.innerHTML = "";

							if (Boolean(moves[i].innerHTML)) {
								moveappendB = moves[i].innerHTML;
							} else {
								moveappendB = "";
							}

							moves[i].innerHTML = pick;
							let ischeck = checked();
							if (!ischeck) {
								possiblemoveslocation.push(moves[i]);
							}
							moves[i].innerHTML = moveappendB;
						}
						el.innerHTML = pick;
						removeSel(false);
						for (let j = 0; j < possiblemoveslocation.length; j++) {
							if (possiblemoveslocation[j].innerHTML == "" || possiblemoveslocation[j] == el
							) {
								possiblemoveslocation[j].classList.add("select");
							} else {
								possiblemoveslocation[j].classList.add("redselect");
							}
						}
					}
				} else {
					chmoves = checkmoves(activePlayer);
					if (chmoves[0].length == 0) {
						gameover = true;
						Checkmate();
					} else {
						if (chmoves[0].includes(el)) {
							const indexesOf = (arr, item) =>arr.reduce((acc, v, i) => (v === item && acc.push(i), acc),[]);
							let moveindexes = indexesOf(chmoves[0], el);
							for (let i = 0; i < moveindexes.length; i++) {
								if (chmoves[1][moveindexes[i]].innerHTML) {
									chmoves[1][moveindexes[i]].classList.add("redselect");
								} else {
									chmoves[1][moveindexes[i]].classList.add("select");
								}
							}
						}
					}
				}
				selEl.shift();
			}
		} else {
			allSel = document.querySelectorAll(".select");
			redSel = document.querySelectorAll(".redselect");
			for (let i = 0; i < allSel.length; i++) {
				let allSelid = allSel[i].id; //get ID of the selected elements
				if (allSelid != selEl[0]) {
					if (allSel[i] == el) {
						el.innerHTML = pick;
						document.getElementById(selEl[0]).classList.remove("select");
						document.getElementById(selEl[0]).innerHTML = "";
						if (pick.length != 0) {
							myAudio.play();
						}
						if (pick == black.rook ||pick == whites.rook ||pick == black.king ||pick == whites.king) {
							document.getElementById(`${selEl[0]}`).classList.add("true");
						}
						//Castling rules
						if ((pick == black.king || pick == whites.king) &&(el.id == `box-7-2` ||el.id == `box-7-6` ||el.id == `box-0-2` ||el.id == `box-0-6`)) {
							if (el.id == `box-7-2` || el.id == `box-0-2`) {
								elarr = el.id.split("-");
								let rook = document.getElementById(`${elarr[0]}-${elarr[1]}-${0}`).innerHTML;
								document.getElementById(`${elarr[0]}-${elarr[1]}-${0}`).innerHTML = "";
								document.getElementById(`${elarr[0]}-${elarr[1]}-${3}`).innerHTML = rook;
							} else if (el.id == `box-7-6` || el.id == `box-0-6`) {
								elarr = el.id.split("-");
								let rook = document.getElementById(`${elarr[0]}-${elarr[1]}-${7}`).innerHTML;
								document.getElementById(`${elarr[0]}-${elarr[1]}-${7}`).innerHTML = "";
								document.getElementById(`${elarr[0]}-${elarr[1]}-${7}`).innerHTML = "";
								document.getElementById(`${elarr[0]}-${elarr[1]}-${5}`).innerHTML = rook;
							}
						}
						//pawn promotion
						elarray = el.id.split(`-`);
						if ((pick == whites.pawn && elarray[1] == 0) ||(pick == black.pawn && elarray[1] == 7)) {
							let pawnpromote;
							pawnpromo();
							let promopawn = document.querySelectorAll(".promopawn");
							for (let i = 0; i < promopawn.length; i++) {
								promopawn[i].addEventListener("click", function () {
									pawnpromote = promopawn[i].innerHTML;
									overlay2.classList.add("hidden");
									el.innerHTML = pawnpromote;
								});
							}
						}
						//en passant  add enpassant class to possible enpassant
						if (pick == whites.pawn || pick == black.pawn) {
							if (pick == whites.pawn) {
								let enpassantparallelEL = [];
								if (allSel[0].id == el.id) {
									let elminus = Number(elarray[2]) - 1;
									let elplus = Number(elarray[2]) + 1;
									if (elminus >= 0) {
										enpassantparallelEL.push(document.getElementById(`${elarray[0]}-${elarray[1]}-${elminus}`));
									}
									if (elplus < 8) {
										enpassantparallelEL.push(document.getElementById(`${elarray[0]}-${elarray[1]}-${elplus}`));
									}
									for (let i = 0; i < enpassantparallelEL.length;i++) {
										if (enpassantparallelEL[i].innerHTML == black.pawn) {
											el.classList.add("enpassant");
										}
									}
								}
							} else if (pick == black.pawn) {
								let enpassantparallelEL = [];
								if (allSel[allSel.length - 1].id == el.id) {
									let elminus = Number(elarray[2]) - 1;
									let elplus = Number(elarray[2]) + 1;
									if (elminus >= 0) {
										enpassantparallelEL.push(document.getElementById(`${elarray[0]}-${elarray[1]}-${elminus}`));
									}
									if (elplus < 8) {
										enpassantparallelEL.push(document.getElementById(`${elarray[0]}-${elarray[1]}-${elplus}`));
									}
									for (let i = 0;i < enpassantparallelEL.length;i++) {
										if (
											enpassantparallelEL[i].innerHTML == whites.pawn
										) {
											el.classList.add("enpassant");
										}
									}
								}
							}
						}

						//enpassanteater
						if (pick == whites.pawn || pick == black.pawn) {
							if (pick == black.pawn) {
								if (el.classList.contains("enpassantEater")) {
									document.getElementById(`${elarray[0]}-${Number(elarray[1]) - 1}-${elarray[2]}`).innerHTML = "";
									document.getElementById(`${elarray[0]}-${Number(elarray[1]) - 1}-${elarray[2]}`).classList.remove("enpassant");
								}
							}
							if (pick == whites.pawn) {
								if (el.classList.contains("enpassantEater")) {
									document.getElementById(`${elarray[0]}-${Number(elarray[1]) + 1}-${elarray[2]}`).innerHTML = "";
									document.getElementById(`${elarray[0]}-${Number(elarray[1]) + 1}-${elarray[2]}`).classList.remove("enpassant");
								}
							}
						}
						pick = "";
						switchplayer();
					}
				}
			}
			for (let i = 0; i < redSel.length; i++) {
				let redSelid = redSel[i].id;
				if (redSel[i] == el) {
					let EP = (element) => element === el.innerHTML;
					if (blackP.some(EP)) {
						blackEaten = el.innerHTML;
					} else {
						whiteEaten = el.innerHTML;
					}
					if (blackP.some(EP)) {
						let WhitePE = document.querySelector(".whiteP");
						blackEatenEL = document.createElement("div");
						blackEatenEL.textContent = blackEaten;
						WhitePE.appendChild(blackEatenEL);
					} else {
						let BlackPE = document.querySelector(".blackP");
						whiteEatenEL = document.createElement("div");
						whiteEatenEL.textContent = whiteEaten;
						BlackPE.appendChild(whiteEatenEL);
					}
					el.innerHTML = pick;
					elarray = el.id.split(`-`);
					if ((pick == whites.pawn && elarray[1] == 0) ||(pick == black.pawn && elarray[1] == 7)) {
						let pawnpromote;
						pawnpromo();
						let promopawn = document.querySelectorAll(".promopawn");
						for (let i = 0; i < promopawn.length; i++) {
							promopawn[i].addEventListener("click", function () {
								pawnpromote = promopawn[i].innerHTML;
								overlay2.classList.add("hidden");
								el.innerHTML = pawnpromote;
							});
						}
					}

					document.getElementById(selEl[0]).classList.remove("select");
					document.getElementById(selEl[0]).innerHTML = "";
					if (pick.length != 0) {
						myAudio.play();
					}

					pick = "";

					switchplayer();
				}
			}
			removeSel(false);
			let enpassantEater = document.querySelector(".enpassantEater");
			if (enpassantEater) {
				enpassantEater.classList.remove("enpassantEater");
			}

			check = checked(true);
		}
	}
}
function checked(forgame = false) {
	removeSel();
	let whitePieces = [];
	let blackPieces = [];
	let whitePiecesid = [];
	let blackPiecesid = [];
	let whitePiecesinHTML = [];
	let blackPiecesinHTML = [];
	let allpeices = [];
	allbox = document.querySelectorAll(".row");

	for (let i = 0; i < 64; i++) {
		let EL = (element) => element === allbox[i].innerHTML;
		if (whiteP.some(EL)) {
			whitePieces.push(allbox[i]);
			whitePiecesid.push(allbox[i].id);
			whitePiecesinHTML.push(allbox[i].innerHTML);
		} else if (blackP.some(EL)) {
			blackPieces.push(allbox[i]);
			blackPiecesid.push(allbox[i].id);
			blackPiecesinHTML.push(allbox[i].innerHTML);
		}
	}
	activePlayer = document.querySelector(".active").id;
	if (activePlayer == "whiteP") {
		for (let i = 0; i < blackPieces.length; i++) {
			let cArray = String(blackPiecesid[i]).split("-");
			chessmoves(cArray, blackPiecesinHTML[i], false);
		}
	} else if (activePlayer == "blackP") {
		for (let i = 0; i < whitePieces.length; i++) {
			let cArray = String(whitePiecesid[i]).split("-");
			chessmoves(cArray, whitePiecesinHTML[i], false);
		}
	}
	let indexofKingW = whitePiecesinHTML.indexOf(whites.king);
	let indexOfKingB = blackPiecesinHTML.indexOf(black.king);
	if (whitePieces[indexofKingW].classList.contains("red") ||blackPieces[indexOfKingB].classList.contains("red")) {
		check = true;
	} else {
		check = false;
	}
	removeSel();
	if (forgame) {
		checkDOM(check);
	}

	return check;
}
function checkDOM(check) {
	if (check) {
		checktext.classList.remove("hidden");
	} else {
		checktext.classList.add("hidden");
	}
}

function checkmoves(activePlayer) {
	//fuction that check possible moves it check;
	let whitePieces = [];
	let blackPieces = [];
	let whitePiecesid = [];
	let blackPiecesid = [];
	let whitePiecesinHTML = [];
	let blackPiecesinHTML = [];
	let allpeices = [];
	let possiblemoves = [];
	let possiblemoveslocation = [];
	let moveappendB;
	allbox = document.querySelectorAll(".row");

	for (let i = 0; i < 64; i++) {
		let EL = (element) => element === allbox[i].innerHTML;
		if (whiteP.some(EL)) {
			whitePieces.push(allbox[i]);
			whitePiecesid.push(allbox[i].id);
			whitePiecesinHTML.push(allbox[i].innerHTML);
		} else if (blackP.some(EL)) {
			blackPieces.push(allbox[i]);
			blackPiecesid.push(allbox[i].id);
			blackPiecesinHTML.push(allbox[i].innerHTML);
		}
	}
	if (activePlayer == "whiteP") {
		for (let i = 0; i < whitePieces.length; i++) {
			let cArray = String(whitePiecesid[i]).split("-");
			let moves = chessmoves(cArray, whitePiecesinHTML[i], false);
			if (moves.length) {
				for (let j = 0; j < moves.length; j++) {
					whitePieces[i].innerHTML = "";

					if (Boolean(moves[j].innerHTML)) {
						moveappendB = moves[j].innerHTML;
					} else {
						moveappendB = "";
					}

					moves[j].innerHTML = whitePiecesinHTML[i];
					let ischeck = checked();
					if (!ischeck) {
						possiblemoves.push(whitePieces[i]);
						possiblemoveslocation.push(moves[j]);
					}
					moves[j].innerHTML = moveappendB;
				}
				moves[moves.length - 1].innerHTML = moveappendB;
				whitePieces[i].innerHTML = whitePiecesinHTML[i];
			}
		}
		let allmoves = [possiblemoves, possiblemoveslocation];
		return allmoves;
	} else if (activePlayer == "blackP") {
		for (let i = 0; i < blackPieces.length; i++) {
			let cArray = String(blackPiecesid[i]).split("-");
			let moves = chessmoves(cArray, blackPiecesinHTML[i], false);
			if (moves.length) {
				for (let j = 0; j < moves.length; j++) {
					blackPieces[i].innerHTML = "";
					if (moves[j].innerHTML) {
						moveappendB = moves[j].innerHTML;
					} else {
						moveappendB = "";
					}

					moves[j].innerHTML = blackPiecesinHTML[i];
					let ischeck = checked();
					if (!ischeck) {
						possiblemoves.push(blackPieces[i]);
						possiblemoveslocation.push(moves[j]);
					}
					moves[j].innerHTML = moveappendB;
				}
				moves[moves.length - 1].innerHTML = moveappendB;
				blackPieces[i].innerHTML = blackPiecesinHTML[i];
			}
		}
		let allmoves = [possiblemoves, possiblemoveslocation];
		return allmoves;
	}
}
function chessmoves(selELarr, pick, forgame) {
	if (forgame) {
		selectclass = "select";
		redselectclass = "redselect";
	} else {
		selectclass = "green";
		redselectclass = "red";
	}
	if (pick == black.pawn || pick == whites.pawn) {
		if (Number(selELarr[1]) == 1 ||(Number(selELarr[1]) == 6 && pick == whites.pawn)) {
			np = 3;
		} else {
			np = 2;
		}
		if (pick == black.pawn) {
			moveVerticalPlus(np, selELarr, pick, selectclass, redselectclass);
			let rightel;
			let leftel;
			let elRL = [];
			if (forgame) {
				if (selELarr[2] == 0) {
					rightel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) + 1}`);
				} else if (selELarr[2] >= 0 && selELarr[2] <= 7) {
					rightel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) + 1}`);
					leftel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) - 1}`);
				} else if (selELarr[2] < 7) {
					leftel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) - 1}`);
				}
				elRL.push(leftel);
				elRL.push(rightel);
				for (let i = 0; i < elRL.length; i++) {
					if (elRL[i]) {
						if (elRL[i].classList.contains("enpassant")) {
							let enpassantselect = document.getElementById(`${selELarr[0]}-${Number(selELarr[1]) + 1}-${Number(elRL[i].id.split("-")[2])}`);
							enpassantselect.classList.add("redselect");
							enpassantselect.classList.add("enpassantEater");
						}
					}
				}
			}
		} else if (pick == whites.pawn) {
			moveVerticalMinus(np, selELarr, pick, selectclass, redselectclass);
			let rightel;
			let leftel;
			let elRL = [];
			if (forgame) {
				if (selELarr[2] == 0) {
					rightel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) + 1}`);
				} else if (selELarr[2] >= 0 && selELarr[2] <= 7) {
					rightel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) + 1}`);
					leftel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) - 1}`);
				} else if (selELarr[2] < 7) {
					leftel = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) - 1}`);
				}
				elRL.push(leftel);
				elRL.push(rightel);
				for (let i = 0; i < elRL.length; i++) {
					if (elRL[i]) {
						if (elRL[i].classList.contains("enpassant")) {
							let enpassantselect = document.getElementById(`${selELarr[0]}-${Number(selELarr[1]) - 1}-${Number(elRL[i].id.split("-")[2])}`);
							enpassantselect.classList.add("redselect");
							enpassantselect.classList.add("enpassantEater");
						}
					}
				}
			}
		}
	} else if (pick == black.rook || pick == whites.rook) {
		moveVerticalPlus(8, selELarr, pick, selectclass, redselectclass);
		moveVerticalMinus(8, selELarr, pick, selectclass, redselectclass);
		moveSideRight(8, selELarr, pick, selectclass, redselectclass);
		moveSideLeft(8, selELarr, pick, selectclass, redselectclass);
	} else if (pick == black.bishop || pick == whites.bishop) {
		moveDiagonal1(8, selELarr, pick, selectclass, redselectclass);
		moveDiagonal2(8, selELarr, pick, selectclass, redselectclass);
		moveDiagonal3(8, selELarr, pick, selectclass, redselectclass);
		moveDiagonal4(8, selELarr, pick, selectclass, redselectclass);
	} else if (pick == black.knight) {
		horsemove(selELarr, pick, selectclass, redselectclass);
	} else if (pick == whites.knight) {
		horsemove(selELarr, pick, selectclass, redselectclass);
	} else if (pick == black.queen || pick == whites.queen) {
		moveVerticalPlus(8, selELarr, pick, selectclass, redselectclass);
		moveVerticalMinus(8, selELarr, pick, selectclass, redselectclass);
		moveSideRight(8, selELarr, pick, selectclass, redselectclass);
		moveSideLeft(8, selELarr, pick, selectclass, redselectclass);
		moveDiagonal1(8, selELarr, pick, selectclass, redselectclass);
		moveDiagonal2(8, selELarr, pick, selectclass, redselectclass);
		moveDiagonal3(8, selELarr, pick, selectclass, redselectclass);
		moveDiagonal4(8, selELarr, pick, selectclass, redselectclass);
	} else if (pick == black.king || pick == whites.king) {
		n = 2;
		moveVerticalPlus(n, selELarr, pick, selectclass, redselectclass);
		moveVerticalMinus(n, selELarr, pick, selectclass, redselectclass);
		moveSideRight(n, selELarr, pick, selectclass, redselectclass);
		moveSideLeft(n, selELarr, pick, selectclass, redselectclass);
		moveDiagonal1(n, selELarr, pick, selectclass, redselectclass);
		moveDiagonal2(n, selELarr, pick, selectclass, redselectclass);
		moveDiagonal3(n, selELarr, pick, selectclass, redselectclass);
		moveDiagonal4(n, selELarr, pick, selectclass, redselectclass);
		if (forgame) {
			//castling
			let rookdocid = [];
			if (selELarr[2] == 4 && (selELarr[1] == 0 || selELarr[1] == 7)) {
				let kingdocid = document.getElementById(
					`${selELarr[0]}-${selELarr[1]}-${selELarr[2]}`
				);

				rookdocid.push(
					document.getElementById(`${selELarr[0]}-${selELarr[1]}-${0}`)
				);

				rookdocid.push(
					document.getElementById(`${selELarr[0]}-${selELarr[1]}-${7}`)
				);
				for (let a = 0; a < rookdocid.length; a++) {
					let kingAlreadyMove = kingdocid.classList.contains("true");
					let rookAlreadyMove = rookdocid[a].classList.contains("true");

					if (!kingAlreadyMove && !rookAlreadyMove) {
						let clearpath = true;
						let ischeck;
						if (a == 0) {
							for (let b = 1; b < 4; b++) {
								if (document.getElementById(`${selELarr[0]}-${selELarr[1]}-${b}`).innerHTML != "") {
									clearpath = false;
									break;
								}
							}
							if (clearpath) {
								for (let c = 0; c < 4; c++) {
									kingdocid.innerHTML = "";
									document.getElementById(
										`${selELarr[0]}-${selELarr[1]}-${selELarr[2] - c}`
									).innerHTML = pick;
									ischeck = checked();

									document.getElementById(
										`${selELarr[0]}-${selELarr[1]}-${selELarr[2] - c}`
									).innerHTML = "";
									kingdocid.innerHTML = pick;
									if (ischeck) {
										break;
									}

									if (!ischeck && clearpath) {
										document
											.getElementById(
												`${selELarr[0]}-${selELarr[1]}-${
													selELarr[2] - 2
												}`
											)
											.classList.add("select");
									}
								}
							}

							if (!ischeck && clearpath) {
								document.getElementById(`${selELarr[0]}-${selELarr[1]}-${selELarr[2] - 2}`).classList.add("select");
							}
						} else if (a == 1) {
							for (let b = 5; b < 7; b++) {
								if (document.getElementById(`${selELarr[0]}-${selELarr[1]}-${b}`).innerHTML != "") {
									clearpath = false;
									break;
								}
							}
							if (clearpath) {
								for (let c = 1; c < 3; c++) {
									kingdocid.innerHTML = "";

									document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) + c}`).innerHTML = pick;
									ischeck = checked();

									document.getElementById(`${selELarr[0]}-${selELarr[1]}-${Number(selELarr[2]) + c}`).innerHTML = "";
									kingdocid.innerHTML = pick;
									if (ischeck) {
										break;
									}
								}
							}
							if (!ischeck && clearpath) {
								document
									.getElementById(
										`${selELarr[0]}-${selELarr[1]}-${
											Number(selELarr[2]) + 2
										}`
									)
									.classList.add("select");
							}
						}
					}
				}
			}
		}
	}

	let redmoves = document.querySelectorAll(".red");
	let greenmoves = document.querySelectorAll(".green");
	let select = document.querySelectorAll(".select");
	let redselect = document.querySelectorAll(".redselect");
	let movespossible;
	if (forgame) {
		movespossible = [...select, ...redselect];
	} else {
		movespossible = [...redmoves, ...greenmoves];
	}

	return movespossible;
}
function moveVerticalPlus(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	let pickcopy = pick;
	let selELarrcopy = selELarr.slice();
	if (selELarr[1] != 7) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[1]) + i;
			if (selELarr1[i] >= 7) {
				break;
			}
		}
		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(`${selELarr[0]}-${selELarr1[i]}-${selELarr[2]}`);
			if (pick == whites.pawn || pick == black.pawn) {
				pawnEating(selELarrcopy, pickcopy, selELarr1, redselect);

				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;
				//check if pick chess peice is black or white
				if (posiblemoves.innerHTML != "") {
					break;
				}
			} else {
				if (posiblemoves.innerHTML != "") {
					//if there is a peice on its way stop
					//Check if Black or White Piece
					let CP = (element) => element === pick;
					let PM = (element) => element === posiblemoves.innerHTML;
					//check if pick chess peice is black or white

					if ((blackP.some(CP) && blackP.some(PM)) ||	(whiteP.some(CP) && whiteP.some(PM))) {
						break;
					} else {
						posiblemoves.classList.add(redselect);
						break;
					}
				}
			}

			posiblemoves.classList.add(select);
		}
	}
}
function pawnEating(selELarr, pick, selELarr1, redselect) {
	let selEatarr = Number(selELarr[2]) + 1;
	let selEatarr2 = Number(selELarr[2]) - 1;
	let possibleEatenmoves1 = document.getElementById(`${selELarr[0]}-${selELarr1[1]}-${selEatarr}`);
	let possibleEatenmoves2 = document.getElementById(`${selELarr[0]}-${selELarr1[1]}-${selEatarr2}`);

	if (selEatarr < 8 && possibleEatenmoves1.innerHTML != "") {
		possibleEatenmoves1.classList.add(redselect);
	}
	if (selEatarr2 >= 0 && possibleEatenmoves2.innerHTML != "") {
		possibleEatenmoves2.classList.add(redselect);
	}

	let CP = (element) => element === pick;
	let PM = (element) => element === possibleEatenmoves1.innerHTML;
	let PM2 = (element) => element === possibleEatenmoves2.innerHTML;
	if (selEatarr < 8) {
		if ((blackP.some(CP) && blackP.some(PM)) || (whiteP.some(CP) && whiteP.some(PM))) {
			possibleEatenmoves1.classList.remove(redselect);
		}
	}
	if (selEatarr2 >= 0) {
		if ((blackP.some(CP) && blackP.some(PM2)) ||(whiteP.some(CP) && whiteP.some(PM2))
		) {
			possibleEatenmoves2.classList.remove(redselect);
		}
	}
}
function moveVerticalMinus(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	let selELarrcopy = selELarr.slice();
	let pickcopy = pick;
	if (selELarr[1] != 0) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[1]) - i;
			if (selELarr1[i] >= 7 || selELarr1[i] <= 0) {
				break;
			}
		}
		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(`${selELarr[0]}-${selELarr1[i]}-${selELarr[2]}`);
			if (pick == whites.pawn || pick == black.pawn) {
				pawnEating(selELarrcopy, pickcopy, selELarr1, redselect);
				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;
				//check if pick chess peice is black or white
				if (posiblemoves.innerHTML != "") {
					break;
				}
			} else {
				if (posiblemoves.innerHTML != "") {
					//if there is a peice on its way stop
					//Check if Black or White Piece
					let CP = (element) => element === pick;
					let PM = (element) => element === posiblemoves.innerHTML;

					//check if pick chess peice is black or white
					if ((blackP.some(CP) && blackP.some(PM)) || (whiteP.some(CP) && whiteP.some(PM))) {
						break;
					} else if (pick != whites.pawn || pick != black.pawn) {
						posiblemoves.classList.add(redselect);
						break;
					}
				}
			}

			posiblemoves.classList.add(select);
		}
	}
}
function moveSideRight(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	if (selELarr[2] != 7) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[2]) + i;
			if (selELarr1[i] >= 7) {
				break;
			}
		}
		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(`${selELarr[0]}-${selELarr[1]}-${selELarr1[i]}`);
			if (posiblemoves.innerHTML != "") {
				//if there is a peice on its way stop
				//Check if Black or White Piece
				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;

				//check if pick chess peice is black or white
				if ((blackP.some(CP) && blackP.some(PM)) || (whiteP.some(CP) && whiteP.some(PM))) {
					break;
				} else {
					posiblemoves.classList.add(redselect);
					break;
				}
			}
			posiblemoves.classList.add(select);
		}
	}
}
function moveSideLeft(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	if (selELarr[2] != 0) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[2]) - i;
			if (selELarr1[i] >= 7 || selELarr1[i] <= 0) {
				break;
			}
		}
		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(
				`${selELarr[0]}-${selELarr[1]}-${selELarr1[i]}`
			);
			if (posiblemoves.innerHTML != "") {
				//if there is a peice on its way stop
				//Check if Black or White Piece
				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;

				//check if pick chess peice is black or white
				if ((blackP.some(CP) && blackP.some(PM)) ||(whiteP.some(CP) && whiteP.some(PM))) {
					break;
				} else {
					posiblemoves.classList.add(redselect);
					break;
				}
			}
			posiblemoves.classList.add(select);
		}
	}
}
function moveDiagonal1(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	let selELarr2 = [];
	if (selELarr[1] != 7 && selELarr[2] != 7) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[1]) + i;
			selELarr2[i] = Number(selELarr[2]) + i;
			if (selELarr1[i] >= 7 || selELarr2[i] >= 7) {
				break;
			}
		}

		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(
				`${selELarr[0]}-${selELarr1[i]}-${selELarr2[i]}`
			);
			if (posiblemoves.innerHTML != "") {
				//if there is a peice on its way stop
				//Check if Black or White Piece
				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;

				//check if pick chess peice is black or white
				if ((blackP.some(CP) && blackP.some(PM)) || (whiteP.some(CP) && whiteP.some(PM))
				) {
					break;
				} else {
					posiblemoves.classList.add(redselect);
					break;
				}
			}
			posiblemoves.classList.add(select);
		}
	}
}
function moveDiagonal2(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	let selELarr2 = [];
	if (selELarr[1] != 7 && selELarr[2] != 0) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[1]) + i;
			selELarr2[i] = Number(selELarr[2]) - i;
			if (selELarr1[i] >= 7 || selELarr2[i] <= 0) {
				break;
			}
		}
		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(
				`${selELarr[0]}-${selELarr1[i]}-${selELarr2[i]}`
			);
			if (posiblemoves.innerHTML != "") {
				//if there is a peice on its way stop
				//Check if Black or White Piece
				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;

				//check if pick chess peice is black or white
				if (
					(blackP.some(CP) && blackP.some(PM)) ||
					(whiteP.some(CP) && whiteP.some(PM))
				) {
					break;
				} else {
					posiblemoves.classList.add(redselect);
					break;
				}
			}
			posiblemoves.classList.add(select);
		}
	}
}
function moveDiagonal3(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	let selELarr2 = [];
	if (selELarr[1] != 0 && selELarr[2] != 7) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[1]) - i;
			selELarr2[i] = Number(selELarr[2]) + i;
			if (selELarr1[i] <= 0 || selELarr2[i] >= 7) {
				break;
			}
		}
		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(`${selELarr[0]}-${selELarr1[i]}-${selELarr2[i]}`);
			if (posiblemoves.innerHTML != "") {
				//if there is a peice on its way stop
				//Check if Black or White Piece
				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;

				//check if pick chess peice is black or white
				if ((blackP.some(CP) && blackP.some(PM)) ||(whiteP.some(CP) && whiteP.some(PM))) {
					break;
				} else {
					posiblemoves.classList.add(redselect);
					break;
				}
			}
			posiblemoves.classList.add(select);
		}
	}
}
function moveDiagonal4(n,selELarr,pick,select = "select",redselect = "redselect") {
	let selELarr1 = [];
	let selELarr2 = [];
	if (selELarr[1] != 0 && selELarr[2] != 0) {
		for (let i = 1; i < n; i++) {
			selELarr1[i] = Number(selELarr[1]) - i;
			selELarr2[i] = Number(selELarr[2]) - i;
			if (selELarr1[i] <= 0 || selELarr2[i] <= 0) {
				break;
			}
		}
		for (let i = 1; i < selELarr1.length; i++) {
			let posiblemoves = document.getElementById(`${selELarr[0]}-${selELarr1[i]}-${selELarr2[i]}`);
			if (posiblemoves.innerHTML != "") {
				//if there is a peice on its way stop
				//Check if Black or White Piece
				let CP = (element) => element === pick;
				let PM = (element) => element === posiblemoves.innerHTML;

				//check if pick chess peice is black or white
				if ((blackP.some(CP) && blackP.some(PM)) ||(whiteP.some(CP) && whiteP.some(PM))) {
					break;
				} else {
					posiblemoves.classList.add(redselect);
					break;
				}
			}
			posiblemoves.classList.add(select);
		}
	}
}
function removeSel(forcheck = true) {
	let allSel = document.querySelectorAll(".select");
	let allSelR = document.querySelectorAll(".redselect");
	let allselred = document.querySelectorAll(".red");
	let allselgreen = document.querySelectorAll(".green");

	if (forcheck) {
		for (let a = 0; a < allselred.length; a++) {
			allselred[a].classList.remove("red");
		}
		for (let a = 0; a < allselgreen.length; a++) {
			allselgreen[a].classList.remove("green");
		}
	} else {
		for (let a = 0; a < allSel.length; a++) {
			allSel[a].classList.remove("select");
		}
		for (let a = 0; a < allSelR.length; a++) {
			allSelR[a].classList.remove("redselect");
		}
	}
}
function horsemove(selELarr, pick, select, redselect) {
	let knightMoves = [[-2, -1],[-2, 1],[-1, 2],[1, 2],[2, 1],[2, -1],[1, -2],[-1, -2],];
	let selELarrl1k2 = [];
	for (let i = 0; i < 8; i++) {
		selELarr1k[i][0] = Number(selELarr[1]) + knightMoves[i][0];
		selELarr1k[i][1] = Number(selELarr[2]) + knightMoves[i][1];
	}
	for (let i = 0; i < selELarr1k.length; i++) {
		if (selELarr1k[i][0] < 8 && selELarr1k[i][1] < 8 && selELarr1k[i][0] > -1 && selELarr1k[i][1] > -1) {
			selELarrl1k2.push(selELarr1k[i]);
		}
	}
	for (let i = 0; i < selELarrl1k2.length; i++) {
		let posiblemoves = document.getElementById(`${selELarr[0]}-${selELarrl1k2[i][0]}-${selELarrl1k2[i][1]}`);

		posiblemoves.classList.add(select);
		if (posiblemoves.innerHTML != "") {
			//if there is a peice on its way stop
			//Check if Black or White Piece
			let CP = (element) => element === pick;
			let PM = (element) => element === posiblemoves.innerHTML;

			//check if pick chess peice is black or white
			if ((blackP.some(CP) && blackP.some(PM)) ||(whiteP.some(CP) && whiteP.some(PM))) {
				posiblemoves.classList.remove(select);
			} else {
				posiblemoves.classList.remove(select);
				posiblemoves.classList.add(redselect);
			}
		}
	}
}
function Checkmate() {
	overlay.classList.remove("hidden");
	if (activePlayer == "whiteP") {
		winnerText.innerHTML = `Player Black${white.king} wins`;
	} else {
		winnerText.innerHTML = `Player White${black.king} wins`;
	}
}

for (let i = 0; i < 4; i++) {
	officialsdiv[i] = document.createElement("div");
	officialsdiv[i].classList.add("promopawn");
	chessofficials.appendChild(officialsdiv[i]);
}

function pawnpromo() {
	overlay2.classList.remove("hidden");
	for (let i = 1; i < eval(activePlayer).length - 1; i++) {
		officialsdiv[i - 1].innerHTML = eval(activePlayer)[i];
	}
}
function whitePcountdowntimer() {
	whitePTime;
	minutes = Math.floor(whitePTime / 60);
	seconds = whitePTime % 60;
	seconds = seconds < 10 ? `0${seconds}` : seconds;
	whitePTime--;
	whitePtimer.innerHTML = `${minutes}:${seconds}`;
}
function blackPcountdowntimer() {
	blackPTime;
	minutes = Math.floor(blackPTime / 60);
	seconds = blackPTime % 60;
	seconds = seconds < 10 ? `0${seconds}` : seconds;
	blackPTime--;
	blackPtimer.innerHTML = `${minutes}:${seconds}`;
}

function switchplayer() {
	whitePlayer.classList.toggle("active");
	BlackPlayer.classList.toggle("active");
	activePlayer = document.querySelector(".active").id;
	if (activePlayer == "blackP") {
		clearInterval(whitetimerstart);
		whitePcurrentime = whitePtimer.innerHTML.split(":");
		whitePTime = Number(whitePcurrentime[0] * 60) + Number(whitePcurrentime[1]);
		blacktimerstart = setInterval(blackPcountdowntimer, 1000);
	} else {
		clearInterval(blacktimerstart);
		whitetimerstart = setInterval(whitePcountdowntimer, 1000);
		blackPcurrentime = blackPtimer.innerHTML.split(":");
		blackPTime = Number(blackPcurrentime[0] * 60) + Number(blackPcurrentime[1]);
	}
	whitePcountdowntimer();
}