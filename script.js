let body = document.querySelector("body");
let columnTags = document.querySelector(".column-tags");
let rownumbers = document.querySelector(".row-numbers");
let grid = document.querySelector(".grid");
let cell = document.querySelector(".cell");
let oldCell;
let selectCellFormula = document.querySelector("#select-cell")
let dataObj = {}




body.spellcheck = false
let menuBarPtag = document.querySelectorAll(".menu-bar p")
for (let i = 0; i < menuBarPtag.length; i++) {
    menuBarPtag[i].addEventListener("click", function (e) {
        if (e.currentTarget.classList.contains("menu-bar-option-selected")) {
            e.currentTarget.classList.remove("menu-bar-option-selected")

        } else {
            for (let j = 0; j < menuBarPtag.length; j++) {
                if (menuBarPtag[j].classList.contains("menu-bar-option-selected")) {
                    menuBarPtag[j].classList.remove("menu-bar-option-selected")

                }
                e.currentTarget.classList.add("menu-bar-option-selected")

            }
        }
    })
}
for (let i = 0; i < 26; i++) {
    let div = document.createElement("div")
    div.classList.add("column-tag-cell")
    div.innerText = String.fromCharCode(65 + i);
    columnTags.append(div)
}
for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div")
    div.classList.add("row-tag-cell")
    div.innerText = i;
    rownumbers.append(div)
}
for (let j = 1; j <= 100; j++) {

    let row = document.createElement("div") /*sbse pehle ek div bnaya jisse ek dabba bn gya fir uss dibbe*/
    row.classList.add("row") /*  ke andr loop lga dia jisse horizontal line m 26 dabbe bn gye fir*/
    for (let i = 0; i < 26; i++) {                  /* uss dabbe ko 100baar wale looop m daal diya*/
        let cell = document.createElement("div")
        cell.classList.add("cell")
        cell.contentEditable="true";
        let address = String.fromCharCode(65+i)+j
         
        cell.setAttribute("data-address",address);
        dataObj[address] = {
            value : "",
            formula : "",
            upstream : [],
            downstream : [],

        }
        cell.addEventListener("click",function(){
            if(oldCell){
            oldCell.classList.remove("grid-selected-cell");
    
            }
            cell.classList.add("grid-selected-cell")
            oldCell = cell
            let cellAddress = this.getAttribute("data-address")
            selectCellFormula.value = cellAddress
            
        })
        cell.addEventListener("input",function(){
            console.log(this.innerText);
            let address = this.getAttribute("data-address")   
            dataObj[address].value= Number(this.innerText)
            console.log(dataObj[address]);
            dataObj[address].formula = ""; 
            let currCellUpstream = dataObj[address].upstream
            for( let i = 0;i<currCellUpstream.length;i++){
                removeFromUpstream(address,currCellUpstream[i]);
            }
            dataObj[address].upstream = []
            //downstream ke elements ko update krna h
            let currCellDownstream = dataObj[address].downstream
            for( let i = 0;i<currCellDownstream.length;i++){
                updateDownstreamElement(currCellDownstream[i])
            }
            
        })
        
        row.append(cell);
        };
        
        grid.append(row)
        }
    
    console.log(dataObj);

function removeFromUpstream(dependent,onWhichItisDepending){ //basically hm isme onWhichItisDepending ko bolenge(dependent bolega) ki tu apne downstream se mujhe nikal de .last wli if statement ka mtlb h ki agr mai tere m pehle se hu to mujhe newDownStream m mt dal mtlb ki nikal de 
    let newDownStream = [];
    let oldDownStream = dataObj[onWhichItisDepending].downstream
    for(let i = 0;i<oldDownStream.length;i++){
        if(oldDownStream[i] != dependent) newDownStream.push(oldDownStream[i])
    }
    dataObj[onWhichItisDepending].downstream = newDownStream;
}
function updateDownstreamElement(elementAddress)
let valueObj = {}
let currCellUpstream = dataObj[elementAddress].upstream
for(let i = 0; i<currCellUpstream.length;i++){
    let upstreamCellAddress = currCellUpstream[i] 
    let upstreamCellValue = dataObj[upstreamCellAddress].value
    valueObj[upstreamCellAddress] = upstreamCellValue

}
let currFormula = dataObj[elementAddress].formula
let formulaArr = currFormula.split(" ")
for(let i = 0;i<formulaArr.length;i++){
    if (valueObj[formulaArr[i]]){
        formulaArr[i] = valueObj(formulaArr[i])
    }
}
currFormula = formulaArr.join(" ")
let newValue = eval(currFormula)
dataObj[elementAddress].value = newValue
let cellOnUI = document.querySelector(`[data-address = ${elementAddress}]`)
cellOnUI.innerText = newValue
let currCellDownstream = dataObj[elementAddress].downstream
if(currCellDownstream.length>0){
    for(let i = 0;i<currCellDownstream.length;i++){
        updateDownstreamElement(currCellDownstream[i])
    }
}