for(let i = 0; i<5; i++){
    const pHue = (i+5)*20;
    const size = (i+1)*10
    const pElement = document.createElement("p");
    document.body.append(pElement);
    pElement.innerText= "Rad" + [i+1];

    pElement.style.textAlign = "center";
    pElement.style.backgroundColor= `hsl(${pHue}, 80%, 80%)`;
    pElement.style.fontSize = `${size}px`;
    

}   

const div = document.createElement("div");
document.body.append(div);
div.style.display = "flex";
div.style.flexDirection = "row";
div.style.justifyContent = "center"
div.style.border = "1px solid black";



const numeral = ["ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio"];

for(i =0; i<3; i++){ 
const row = document.createElement("div");
div.appendChild(row);

row.style.border ="10px solid lightskyblue";
row.style.width = "5%";
row.style.margin = "10%";

if(i==0){
for (let i = 0; i <10; i++) {
    const p = document.createElement("p");
    row.appendChild(p);

    p.innerText = [i];
    p.style.textAlign =  "start";
    p.style.margin = "1px";
    
    if(i/2 == 2) {
        p.style.background = "lightskyblue";
    } else if (i%2 == 0) {
        p.style.background = "black";
        p.style.color = "white";
    }
    }
    } else if(i==1){ 
        for( let i= 9; i>=0; i--){
            const textP = document.createElement("p");
            row.appendChild(textP);

            textP.innerText= i;
            textP.style.margin = "1px";
            textP.style.textAlign = "center";

    if (i/2 == 4) {
        textP.style.background = "lightskyblue";

    }else if(i%2 == 0) {
        textP.style.background = "black";
        textP.style.color = "white";
    }
}
} else{
    for(let i = 0; i <10; i++){
    const pAlphabet = document.createElement("p");
    row.appendChild(pAlphabet);

    pAlphabet.innerText= numeral[i];
    pAlphabet.style.textAlign =  "center";
    pAlphabet.style.margin = "1px";
    pAlphabet.style.textAlign = "right";

    if (i == 5){
        pAlphabet.style.background = "lightskyblue";
 }else if (i % 2 == 0) {
    pAlphabet.style.background = "black";
    pAlphabet.style.color = "white";
 }
}
}
}


