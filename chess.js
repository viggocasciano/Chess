var tour = document.getElementById("tour");
var tailleBlock = 80;
var ligne = 8;
var colonne = 8;
var canvas;
var context;
var MoveWhite = true;
var MoveBlack = false;
var pos_mouse = {
    x: 0,
    y: 0,
  };
var ctn_coups = document.getElementById("ctn_coups");
var ctn_timer_b = document.getElementById("ctn_timer_b");
var ctn_timer_n = document.getElementById("ctn_timer_n");

var tab_jeu =   [[-2,-3,-4,-5,-6,-4,-3,-2], // -1 = pion noir, -2 = tour noire, -3 = cavalier noir, -4 = fou noir,
                 [-1,-1,-1,-1,-1,-1,-1,-1], // -5 = reine noire, -6 = roi noir
                 [0 , 0, 0, 0, 0, 0, 0 ,0],
                 [0 , 0, 0, 0, 0, 0, 0 ,0],
                 [0 , 0, 0, 0, 0, 0, 0 ,0],
                 [0 , 0, 0, 0, 0, 0, 0 ,0],
                 [1 , 1, 1, 1, 1, 1, 1 ,1],  // 1 = pion blanc, 2 = tour blanche, 3 = cavalier blanc, 4 = fou blanc, 
                 [2 ,3 ,4 ,5 ,6 ,4 , 3 ,2]]; //5 = reine blanche, 6 = roi blanc

var tab_highlight = [[0 , 0, 0, 0, 0, 0, 0 ,0],
                     [0 , 0, 0, 0, 0, 0, 0 ,0],
                     [0 , 0, 0, 0, 0, 0, 0 ,0],
                     [0 , 0, 0, 0, 0, 0, 0 ,0],
                     [0 , 0, 0, 0, 0, 0, 0 ,0],
                     [0 , 0, 0, 0, 0, 0, 0 ,0],
                     [0 , 0, 0, 0, 0, 0, 0 ,0],
                     [0 , 0, 0, 0, 0, 0, 0 ,0]];

var tab_echec_possible = [[0 , 0, 0, 0, 0, 0, 0 ,0],
                          [0 , 0, 0, 0, 0, 0, 0 ,0],
                          [0 , 0, 0, 0, 0, 0, 0 ,0],
                          [0 , 0, 0, 0, 0, 0, 0 ,0],
                          [0 , 0, 0, 0, 0, 0, 0 ,0],
                          [0 , 0, 0, 0, 0, 0, 0 ,0],
                          [0 , 0, 0, 0, 0, 0, 0 ,0],
                          [0 , 0, 0, 0, 0, 0, 0 ,0]];

                 

window.onload = function () {
    canvas = document.getElementById("canvas");
    canvas.height = ligne * tailleBlock;
    canvas.width = colonne * tailleBlock;
    context = canvas.getContext("2d"); // permet de dessiner sur le canvas

    //ecrit les lettres et chiffres au dessus du canvas en créant des balise p
    for (var i = 0; i < ligne; i++) {
        var p = document.createElement("p");
        p.innerHTML = String.fromCharCode(65 + i);
        document.getElementById("coordonnees_lettre").appendChild(p);
    }
    for (var i = 0; i < colonne; i++) {
        var p = document.createElement("p");
        p.innerHTML = i + 1;
        document.getElementById("coordonnees_chiffre").appendChild(p);
    }
    setInterval(update, 10);
    setInterval(timer,100)
  };

function update() {
    //créer le fond noir du canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // fais des lignes verticales et horizontales tous les 80px

    for (var i = 0; i < ligne; i++) {
        for (var j = 0; j < colonne; j++) {
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    context.fillStyle = "grey";
                    context.fillRect(i * tailleBlock, j * tailleBlock, tailleBlock, tailleBlock);
                }
            } else {
                if (j % 2 != 0) {
                    context.fillStyle = "grey";
                    context.fillRect(i * tailleBlock, j * tailleBlock, tailleBlock, tailleBlock);
                }
            }
        }
    }
    for (var i = 0; i < ligne; i++) {
        for (var j = 0; j < colonne; j++) {
            if (tab_jeu[i][j] != 0) {
                var img = new Image();
                img.src = "assets/img/" + tab_jeu[i][j] + ".png";
                context.drawImage(img, j * tailleBlock, i * tailleBlock, tailleBlock, tailleBlock);
            }
        }
    }
    for (var i = 0; i < ligne; i++) {
        for(var j = 0; j < colonne; j++){
            var img = new Image();
            img.src = "assets/img/dot.png";
            if(tab_highlight[i][j]!=0){
                context.drawImage(img,i * tailleBlock, j * tailleBlock, tailleBlock, tailleBlock);
            }
        }
    }
    canvas.onclick = function (click) {
        tab_highlight = [[0 , 0, 0, 0, 0, 0, 0 ,0],
                        [0 , 0, 0, 0, 0, 0, 0 ,0],
                        [0 , 0, 0, 0, 0, 0, 0 ,0],
                        [0 , 0, 0, 0, 0, 0, 0 ,0],
                        [0 , 0, 0, 0, 0, 0, 0 ,0],
                        [0 , 0, 0, 0, 0, 0, 0 ,0],
                        [0 , 0, 0, 0, 0, 0, 0 ,0],
                        [0 , 0, 0, 0, 0, 0, 0 ,0]];

       //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (MoveBlack == false && MoveWhite == true){
            can_move_piece_blanc(pos_mouse);
            // créer un element p avec un id et un innerHTML
            tour.innerHTML = "Au tour des blancs";

        }
        else{
            can_move_piece_noir(pos_mouse);
            // créer un element p avec un id et un innerHTML
            tour.innerHTML = "Au tour des noirs";
        }
    };
    // créer un timer pour les noirs et les blancs
}
function timer(){

    var ctn_timer_b_floated = parseFloat(document.getElementById("ctn_timer_b").innerHTML);
    var ctn_timer_n_floated = parseFloat(document.getElementById("ctn_timer_n").innerHTML);

    //fais en sorte que le timer à toujours deux chiffres après la virgule et jamais plus
    
    

    if (MoveBlack == false && MoveWhite == true){
        ctn_timer_b_floated = ctn_timer_b_floated.toFixed(2);
        if (ctn_timer_b_floated == 9){
            ctn_timer_b_floated.innerHTML = 8.60;
        }
        else if (ctn_timer_b == 8.00){
            ctn_timer_b.innerHTML = 7.60;
        }
        else if (ctn_timer_b == 7.00){
            ctn_timer_b.innerHTML = 6.60;
        }
        else if (ctn_timer_b == 6.00){
            ctn_timer_b.innerHTML = 5.60;
        }
        else if (ctn_timer_b == 5.00){
            ctn_timer_b.innerHTML = 4.60;
        }
        else if (ctn_timer_b == 4.00){
            ctn_timer_b.innerHTML = 3.60;
        }
        else if (ctn_timer_b == 3.00){
            ctn_timer_b.innerHTML = 2.60;
        }
        else if (ctn_timer_b == 2.00){
            ctn_timer_b.innerHTML = 1.60;
        }
        else if (ctn_timer_b == 1.00){
            ctn_timer_b.innerHTML = 0.60;
        }
        else if (ctn_timer_b == 0.00){
            clearInterval(timer);
            alert("Les noirs ont gagné");
        }
        ctn_timer_b_floated = ctn_timer_b_floated - 0.01;
        //change le contenu de ctn_timer en string
        ctn_timer_b.innerHTML = ctn_timer_b_floated.toString();


    }
    else if (MoveBlack == true && MoveWhite == false){
        ctn_timer_n_floated = ctn_timer_n_floated.toFixed(2);
        if (ctn_timer_n == 9.00){
            ctn_timer_n.innerHTML = 8.60;
        }
        else if (ctn_timer_n == 8.00){
            ctn_timer_n.innerHTML = 7.60;
        }
        else if (ctn_timer_n == 7.00){
            ctn_timer_n.innerHTML = 6.60;
        }
        else if (ctn_timer_n == 6.00){
            ctn_timer_n.innerHTML = 5.60;
        }
        else if (ctn_timer_n == 5.00){
            ctn_timer_n.innerHTML = 4.60;
        }
        else if (ctn_timer_n == 4.00){
            ctn_timer_n.innerHTML = 3.60;
        }
        else if (ctn_timer_n == 3.00){
            ctn_timer_n.innerHTML = 2.60;
        }
        else if (ctn_timer_n == 2.00){
            ctn_timer_n.innerHTML = 1.60;
        }
        else if (ctn_timer_n == 1.00){
            ctn_timer_n.innerHTML = 0.60;
        }
        else if (ctn_timer_n == 0.00){
            clearInterval(timer);
            alert("Les blancs ont gagné");
        }
        ctn_timer_n.innerHTML = ctn_timer_n.innerHTML - 0.01;
    }
}


function can_move_piece_blanc(pos_mouse){
    if (tab_jeu[pos_mouse.y][pos_mouse.x] == 1){
        if (pos_mouse.y <= 5){
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-1] = 1;
                move_piece_pion_blanc(pos_mouse);
            }
        }
        else {
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-1] = 1;
                move_piece_pion_blanc(pos_mouse);
            }
            if (tab_jeu[pos_mouse.y-2][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-2] = 1;
                move_piece_pion_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y-1 >= 0 && pos_mouse.x-1 >= 0){
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x-1] < 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y-1] = 1;
                move_piece_pion_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y-1 >= 0 && pos_mouse.x+1 <= 7){
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x+1] < 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y-1] = 1;
                move_piece_pion_blanc(pos_mouse);
            }
        }
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == 2){
        // créer les déplacements possibles de la tour
        // la tour peut se déplacer sur la gauche, la droite, en haut et en bas tant qu'il n'y a pas d'obstacle
        // la tour peut prendre les pièces adverses
        var i = 1;
        while (pos_mouse.y-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_tour_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x] < 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_tour_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7){

            if (tab_jeu[pos_mouse.y+i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_tour_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x] < 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_tour_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1 ;
        while (pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_tour_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x-i] < 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_tour_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_tour_blanc
            (pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x+i] < 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_tour_blanc
            (pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        } 
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == 3){
        //créer le déplacement des cavaliers
        //le cavalier peut se déplacer en L
        //le cavalier peut prendre les pièces adverses

        if (pos_mouse.y-2 >= 0 && pos_mouse.x-1 >= 0){
            if (tab_jeu[pos_mouse.y-2][pos_mouse.x-1] <= 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y-2] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y-2 >= 0 && pos_mouse.x+1 <= 7){
            if (tab_jeu[pos_mouse.y-2][pos_mouse.x+1] <= 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y-2] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y-1 >= 0 && pos_mouse.x-2 >= 0){
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x-2] <= 0){
                tab_highlight[pos_mouse.x-2][pos_mouse.y-1] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y-1 >= 0 && pos_mouse.x+2 <= 7){
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x+2] <= 0){
                tab_highlight[pos_mouse.x+2][pos_mouse.y-1] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y+1 <= 7 && pos_mouse.x-2 >= 0){
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x-2] <= 0){
                tab_highlight[pos_mouse.x-2][pos_mouse.y+1] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y+1 <= 7 && pos_mouse.x+2 <= 7){
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x+2] <= 0){
                tab_highlight[pos_mouse.x+2][pos_mouse.y+1] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y+2 <= 7 && pos_mouse.x-1 >= 0){
            if (tab_jeu[pos_mouse.y+2][pos_mouse.x-1] <= 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y+2] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
        if (pos_mouse.y+2 <= 7 && pos_mouse.x+1 <= 7){
            if (tab_jeu[pos_mouse.y+2][pos_mouse.x+1] <= 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y+2] = 1;
                move_piece_cavalier_blanc(pos_mouse);
            }
        }
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == 4){
        //créer le déplacement des fous
        //le fou peut se déplacer en diagonale
        //le fou peut prendre les pièces adverses

        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_fou_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] < 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_fou_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_fou_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] < 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_fou_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_fou_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] < 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_fou_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_fou_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] < 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_fou_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == 5){
        //créer le déplacement de la reine
        //la reine peut se déplacer en ligne droite et en diagonale
        //la reine peut prendre les pièces adverses

        var i = 1;
        while (pos_mouse.y-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x] < 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x] < 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x-i] < 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x+i] < 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] < 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] < 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] < 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_reine_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] < 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_reine_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == 6){
        // créer le déplacement du roi blanc
        // le roi blanc peut se déplacer d'une case dans toutes les directions sauf si il est en échec sur ces cases
        // le roi blanc peut se déplacer de deux cases vers la droite ou la gauche si il n'a jamais bougé et qu'il n'y a pas d'obstacle entre lui et la tour et que la tour n'a jamais bougé

        // vérifier si le roi blanc est en échec
        // vérifier si le roi blanc peut se déplacer sur une case
        // vérifier si le roi blanc peut se déplacer de deux cases vers la droite ou la gauche

    }
}
function can_move_piece_noir(pos_mouse){
    if (tab_jeu[pos_mouse.y][pos_mouse.x] == -1){
        // les mêmes mouvements que pour le pion blanc mais à l'inverse
        if (pos_mouse.y >= 2){
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+1] = 1;
                move_piece_pion_noir(pos_mouse);
            }
        }
        else {
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+1] = 1;
                move_piece_pion_noir(pos_mouse);
            }
            if (tab_jeu[pos_mouse.y+2][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+2] = 1;
                move_piece_pion_noir(pos_mouse);
            }
        }
        if (pos_mouse.y+1 >= 0 && pos_mouse.x-1 >= 0){
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x-1] > 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y+1] = 1;
                move_piece_pion_noir(pos_mouse);
            }
        }
        if (pos_mouse.y+1 >= 0 && pos_mouse.x+1 <= 7){
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x+1] > 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y+1] = 1;
                move_piece_pion_noir(pos_mouse);
            }
        }
        

    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == -2){
        var i = 1;
        while (pos_mouse.y-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_tour_blanc(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x] > 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_tour_blanc(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7){

            if (tab_jeu[pos_mouse.y+i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_tour_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x] > 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_tour_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1 ;
        while (pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_tour_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x-i] > 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_tour_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_tour_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x+i] > 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_tour_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
    
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == -3){
        if (pos_mouse.y+2 <= 7 && pos_mouse.x+1 <= 7){
            if (tab_jeu[pos_mouse.y+2][pos_mouse.x+1] == 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y+2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+2][pos_mouse.x+1] > 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y+2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }
        if (pos_mouse.y+2 <= 7 && pos_mouse.x-1 >= 0){
            if (tab_jeu[pos_mouse.y+2][pos_mouse.x-1] == 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y+2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+2][pos_mouse.x-1] > 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y+2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }
        if (pos_mouse.y-2 >= 0 && pos_mouse.x+1 <= 7){
            if (tab_jeu[pos_mouse.y-2][pos_mouse.x+1] == 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y-2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-2][pos_mouse.x+1] > 0){
                tab_highlight[pos_mouse.x+1][pos_mouse.y-2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }
        if (pos_mouse.y-2 >= 0 && pos_mouse.x-1 >= 0){
            if (tab_jeu[pos_mouse.y-2][pos_mouse.x-1] == 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y-2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-2][pos_mouse.x-1] > 0){
                tab_highlight[pos_mouse.x-1][pos_mouse.y-2] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }
        if (pos_mouse.y+1 <= 7 && pos_mouse.x+2 <= 7){
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x+2] == 0){
                tab_highlight[pos_mouse.x+2][pos_mouse.y+1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+1][pos_mouse.x+2] > 0){
                tab_highlight[pos_mouse.x+2][pos_mouse.y+1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }
        if (pos_mouse.y+1 <= 7 && pos_mouse.x-2 >= 0){
            if (tab_jeu[pos_mouse.y+1][pos_mouse.x-2] == 0){
                tab_highlight[pos_mouse.x-2][pos_mouse.y+1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+1][pos_mouse.x-2] > 0){
                tab_highlight[pos_mouse.x-2][pos_mouse.y+1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }

        if (pos_mouse.y-1 >= 0 && pos_mouse.x+2 <= 7){
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x+2] == 0){
                tab_highlight[pos_mouse.x+2][pos_mouse.y-1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-1][pos_mouse.x+2] > 0){
                tab_highlight[pos_mouse.x+2][pos_mouse.y-1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }
        if (pos_mouse.y-1 >= 0 && pos_mouse.x-2 >= 0){
            if (tab_jeu[pos_mouse.y-1][pos_mouse.x-2] == 0){
                tab_highlight[pos_mouse.x-2][pos_mouse.y-1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-1][pos_mouse.x-2] > 0){
                tab_highlight[pos_mouse.x-2][pos_mouse.y-1] = 1;
                move_piece_cavalier_noir(pos_mouse);
            }
        }
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == -4){

        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_fou_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] > 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_fou_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_fou_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] > 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_fou_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_fou_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] > 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_fou_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_fou_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] > 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_fou_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
    }
    else if (tab_jeu[pos_mouse.y][pos_mouse.x] == -5){
        var i = 1;
        while (pos_mouse.y-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x] > 0){
                tab_highlight[pos_mouse.x][pos_mouse.y-i] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x] == 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x] > 0){
                tab_highlight[pos_mouse.x][pos_mouse.y+i] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x-i] > 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y][pos_mouse.x+i] > 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x-i] > 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y-i] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y-i >= 0 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y-i][pos_mouse.x+i] > 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y-i] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x-i >= 0){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] == 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x-i] > 0){
                tab_highlight[pos_mouse.x-i][pos_mouse.y+i] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
        var i = 1;
        while (pos_mouse.y+i <= 7 && pos_mouse.x+i <= 7){
            if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] == 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_reine_noir(pos_mouse);
            }
            else if (tab_jeu[pos_mouse.y+i][pos_mouse.x+i] > 0){
                tab_highlight[pos_mouse.x+i][pos_mouse.y+i] = 1;
                move_piece_reine_noir(pos_mouse);
                break;
            }
            else {
                break;
            }
            i++;
        }
    }
}

// fonction qui recupere le deuxieme click de la souris
function move_piece_pion_blanc(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = 1;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = true;
            MoveWhite = false;
            lastMove(coord,pos_mouse,1);
            if (pos_mouse.y == 0){
                var promot = prompt("Promotion ! choisissez votre piece : 2 = tour, 3 = cavalier, 4 = fou, 5 = reine");
                tab_jeu[pos_mouse.y][pos_mouse.x] = promot;
            }
            
        }
    };
}
function move_piece_pion_noir(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = -1;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = false;
            MoveWhite = true;
            lastMove(coord,pos_mouse,-1);
            if (pos_mouse.y == 7){
                var promot = prompt("Promotion ! choisissez votre piece : 2 = tour, 3 = cavalier, 4 = fou, 5 = reine");
                tab_jeu[pos_mouse.y][pos_mouse.x] = -promot;
            }
        }
    };
}

// fonction qui recupere le deuxieme click de la souris pour la tour
function move_piece_tour_blanc(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = 2;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = true;
            MoveWhite = false;
            lastMove(coord,pos_mouse,2);
        }
    };
}
function move_piece_tour_noir(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = -2;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = false;
            MoveWhite = true;
            lastMove(coord,pos_mouse,-2);
        }
        
    };
}

// fonction qui recupere le deuxieme click de la souris pour le cavalier
function move_piece_cavalier_blanc(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = 3;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = true;
            MoveWhite = false;
            lastMove(coord,pos_mouse,3);
        }
    };
}
function move_piece_cavalier_noir(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = -3;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = false;
            MoveWhite = true;
            lastMove(coord,pos_mouse,-3);
        }
    }
}

// fonction qui recupere le deuxieme click de la souris pour le fou
function move_piece_fou_blanc(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = 4;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = true;
            MoveWhite = false;
            lastMove(coord,pos_mouse,4);
        }
    };
}
function move_piece_fou_noir(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = -4;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = false;
            MoveWhite = true;
            lastMove(coord,pos_mouse,-4);
        }
    }
}

function move_piece_reine_blanc(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = 5;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = true;
            MoveWhite = false;
            lastMove(coord,pos_mouse,5);
        }
    };
}

function move_piece_reine_noir(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = -5;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = false;
            MoveWhite = true;
            lastMove(coord,pos_mouse,-5);
        }
    }
}

function move_piece_roi_blanc(pos_mouse){
    canvas.onmouseup = function(click){
        //recupere la taille du canvas dependant de la taille de la fenetre
        var rect = canvas.getBoundingClientRect();
        //recupere l'element width et height de rect
        var width = rect.width/8;
        var height = rect.height/8;
        //recupere la position de la souris
        var coord = [pos_mouse.y, pos_mouse.x]
        pos_mouse.x = Math.floor((click.clientX - rect.left) / width);
        pos_mouse.y = Math.floor((click.clientY - rect.top) / height);
        if (tab_highlight[pos_mouse.x][pos_mouse.y] == 1){
            tab_jeu[pos_mouse.y][pos_mouse.x] = 6;
            tab_jeu[coord[0]][coord[1]] = 0;
            MoveBlack = true;
            MoveWhite = false;
            lastMove(coord,pos_mouse,6);
        }
    }
}

function isWhiteKingChecked(){
  // définir les positions des pièces sur le plateau
  let kingPos;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (tab_jeu[i][j] === '6') {
        kingPos = [i, j];
        break;
      }
    }
  }

  // Vérifier si le roi est attaqué par une pièce ennemie
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (tab_jeu[i][j] === '-1' && i === kingPos[0] - 1 && j === kingPos[1] + 1) {
        return true;
      }
      if (tab_jeu[i][j] === '-1' && i === kingPos[0] - 1 && j === kingPos[1] - 1) {
        return true;
      }
      if (tab_jeu[i][j] === '-2' || tab_jeu[i][j] === '-5') {
        if (i === kingPos[0] || j === kingPos[1]) {
          return true;
        }
      }
      if (tab_jeu[i][j] === '-4' || tab_jeu[i][j] === '-5') {
        if (Math.abs(i - kingPos[0]) === Math.abs(j - kingPos[1])) {
          return true;
        }
      }
      if (tab_jeu[i][j] === '-3') {
        if ((i === kingPos[0] - 2 && j === kingPos[1] + 1) ||
            (i === kingPos[0] - 2 && j === kingPos[1] - 1) ||
            (i === kingPos[0] - 1 && j === kingPos[1] + 2) ||
            (i === kingPos[0] - 1 && j === kingPos[1] - 2) ||
            (i === kingPos[0] + 2 && j === kingPos[1] + 1) ||
            (i === kingPos[0] + 2 && j === kingPos[1] - 1) ||
            (i === kingPos[0] + 1 && j === kingPos[1] + 2) ||
            (i === kingPos[0] + 1 && j === kingPos[1] - 2)) {
          return true;
        }
      }
    }
  }

  return false;
}
function lastMove(coord,pos_mouse,piece){
    coord_x = lettre_x(pos_mouse.x);
    coord_y = 8-pos_mouse.y;
    last_coord_x = lettre_x(coord[1]);
    last_coord_y = 8-coord[0];
    // créer une balise p qui ira à la suite de la variable tour avec dedans la valeur de coord_x et coord_y et une image de la piece qui à joué 
    var p = document.createElement("p");
    var text = document.createTextNode(last_coord_x + last_coord_y + ' → '+coord_x + coord_y + ' :');
    var img = document.createElement("img");
    img.src = "assets/img/"+piece+".png";
    p.appendChild(text);
    p.appendChild(img);
    // donne un id à la balise p
    p.id = "last_move";
    document.getElementById("ctn_coups").appendChild(p);
    ctn_coups.scrollTop = ctn_coups.scrollHeight - 50;
}

function lettre_x(x){
    if (x == 0){
        return "A";
    }
    else if (x == 1){
        return "B";
    }
    else if (x == 2){
        return "C";
    }
    else if (x == 3){
        return "D";
    }
    else if (x == 4){
        return "E";
    }
    else if (x == 5){
        return "F";
    }
    else if (x == 6){
        return "G";
    }
    else if (x == 7){
        return "H";
    }
}
    