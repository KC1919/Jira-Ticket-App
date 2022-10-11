(function loadAllCards() {

    console.log(localStorage);

    let cardsContainer = document.getElementById("cardsDiv");

    Object.keys(localStorage).forEach(key => {

        if (key !== "id") {
            //fetching the card element from the local storage by its id
            let item = localStorage.getItem(key);

            item = JSON.parse(item);

            let cardElemStr = `<div id=cardDiv-${item.id} class="cardProps"><textarea name="" id=cardText-${item.id} class="cardTextProps" readonly></textarea><img id=${item.id} class="icon lock" src="./img/lock.png"/></div>`;

            //converting the string format to HTML element format
            let parser = new DOMParser();
            let cardElemNode = parser.parseFromString(cardElemStr, 'text/html');

            // console.log(parsedItem);

            let cardElem = cardElemNode.body.firstChild;

            cardsContainer.appendChild(cardElem);

            //card deletion
            cardElem.addEventListener("click", handleDelete);

            let card = document.getElementById(`cardDiv-${item.id}`);

            //setting the card border color to its priority color
            card.style.borderColor = item.color;


            //getting the textarea element from the card element
            let cardTextElem = document.getElementById(`cardText-${item.id}`);


            //saving the user input text to the textarea element of the card
            cardTextElem.value = item.textValue;

            //getting the lock icon
            let icon = document.getElementById(item.id);


            //adding event listener on the lock icon
            icon.addEventListener("click", handleLockClick)
        }
    })
})();


let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", (e) => {
    let ticketModal = document.getElementById("ticketModal");
    let textModal=document.getElementById("modalPara").placeholder="Type here...";
    ticketModal.style.display = "flex";
});


let modalPriBtns = document.querySelectorAll(".modalPriBtnProp");

modalPriBtns.forEach(modalPriBtn => {
    modalPriBtn.addEventListener("click", () => {
        modalPriBtns.forEach(btn => {
            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
            }
        });

        modalPriBtn.classList.add("active");
    });
});

//fetcing the submit button of the ticket modal
let submitBtn = document.getElementById("submitBtn");


submitBtn.addEventListener("click", (e) => {

    let textModal = document.getElementById("modalPara");
    const textValue = textModal.value;

    let priority;

    for (let i = 0; i < modalPriBtns.length; i++) {
        let btn = modalPriBtns[i];
        if (btn.classList.contains("active")) {
            priority = btn;
            break;
        }
    }

    //fetching the color related to the priority id, 1-pink, 2-blue, 3-green, 4-black
    let color = window.getComputedStyle(document.getElementById(priority.id)).backgroundColor;


    //selecting the card container
    let cardsContainer = document.querySelector(".cardsContainer");

    // Generating unique card id(local storage key)

    if (localStorage.length == 0) {
        localStorage.setItem("id", 0);
    }

    //calculating the new card number to be created
    const cardNumber = Number(localStorage.getItem("id")) + 1;

    //incrementing the count of cards that has been stored in the localStorage
    localStorage.setItem("id",cardNumber);


    //creating the card element, with unique id
    let cardElemStr = `<div id=cardDiv-${cardNumber} class="cardProps"><textarea name="" id=cardText-${cardNumber} class="cardTextProps" readonly></textarea><img id=${cardNumber} class="icon lock" src="./img/lock.png"/></div>`;

    // console.log(cardElemStr);

    //converting the card element from string form to HTML element form
    let parser = new DOMParser();
    let doc = parser.parseFromString(cardElemStr, 'text/html');


    //getting the newly created element from the HTML doc
    let cardElemNode = doc.body.firstChild;


    //closing the ticket modal, as the ticket has been created
    let ticketModal = document.getElementById("ticketModal");
    ticketModal.style.display = "none";


    //adding the ticket to the ticket container, to make it visible on the screen
    cardsContainer.appendChild(cardElemNode);

    // console.log(cardElemStr);
    // console.log(cardElemNode);

    let obj = {
        id: cardNumber,
        textValue: textValue,
        color: color
    }


    //saving the new ticket card element in the local storage, with its unique id
    localStorage.setItem(cardNumber, JSON.stringify(obj));


    let card = document.getElementById(`cardDiv-${cardNumber}`);

    //setting the card border color to its priority color
    card.style.borderColor = color;

    //adding delete event listener
    card.addEventListener("click",handleDelete);


    //getting the textarea element from the card element
    let cardTextElem = document.getElementById(`cardText-${cardNumber}`);


    //saving the user input text to the textarea element of the card
    cardTextElem.value = textValue;


    //getting the lock icon
    let icon = document.getElementById(cardNumber);


    //adding event listener on the lock icon
    icon.addEventListener("click", handleLockClick)
});


//Edit functionality implemented
async function handleLockClick(e) {
    let elem = e.target;
    let status = elem.classList[1];
    let id = elem.id;

    // console.log(id);
    if (status === "lock") {

        elem.classList.remove("lock");
        elem.classList.add("unlock");

        elem.setAttribute("src", "./img/unlock.png");

        let textElemId = "cardText-" + id;
        let textElem = document.getElementById(textElemId);

        console.log(textElem.value);
        textElem.readOnly = false;

    } else if (status === "unlock") {

        elem.classList.remove("unlock");
        elem.classList.add("lock");

        elem.setAttribute("src", "./img/lock.png");

        let textElemId = "cardText-" + id;
        let textElem = document.getElementById(textElemId);

        let textValue = textElem.value;

        console.log(textValue);

        let currCardObj = JSON.parse(localStorage.getItem(id));

        currCardObj.textValue = textValue;

        localStorage.setItem(id, JSON.stringify(currCardObj));

        textElem.readOnly = true;
    }
}

let priBtns = document.querySelectorAll(".priBtnProp");

priBtns.forEach(btn => {
    btn.addEventListener("click", singlePriority);
});

//render all cards with same priority
function singlePriority(e) {
    let btn = e.target;

    // console.log(btn.style);

    if (btn.style.border.length != 0) {
        btn.style.border = '';
        location.reload();
    } else {
        priBtns.forEach(priBtn => {
            if (priBtn.style.border.length != 0) {
                priBtn.style.border = '';
            }
        });

        btn.style.border = "2px solid yellow";
    }

    let color = window.getComputedStyle(document.getElementById(btn.id)).backgroundColor;

    let cardsContainer = document.querySelector(".cardsContainer").children;

    // console.log(cardsContainer.length);
    for (let i = 0; i < cardsContainer.length; i++) {
        let card = cardsContainer[i];
        if (card.style.borderColor !== color) {
            card.style.display = "none";
        }
        else{
            card.style.display="block";
        }
    }
}

let delBtn = document.getElementById("delBtn");

delBtn.addEventListener("click", (e) => {
    let btn = delBtn;

    console.log("del btn"+(btn.style.border).length);

    if (btn.style.border.length === 0 ) {
        btn.style.border = "2px solid yellow";
    } else {
        btn.style.border = '';
    }
});


function handleDelete(e) {
    let delBtn = document.getElementById("delBtn");

    let cardsContainer = document.querySelector(".cardsContainer");

    console.log("del func"+delBtn.style.border);
    // console.log(e.target);
    if (delBtn.style.border.length !== 0) {
        let elem = document.getElementById(e.target.id);

        // console.log(elem.tagName);

        if (elem.tagName === "DIV") {

            let id = Number(e.target.id.split("-")[1]);
            console.log(id);

            localStorage.removeItem(id);

            cardsContainer.removeChild(elem);
        }
    }
}