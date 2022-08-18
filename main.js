// Select language and number of question 
let select = document.querySelectorAll(".select");
select.forEach((e) => {
    e.addEventListener("click", () => {
        e.classList.toggle("turn");
    });
});

// Start start-Button Action
let startBtn = document.querySelector(".start .btn-start");
let start = document.querySelector(".start");
let tips= document.querySelector(".tips");
let langInput = document.getElementById("language");
let numInput = document.getElementById("numbers");

startBtn.addEventListener("click", ()=> {
    if (langInput.value !== "Select The Language" &&
    numInput.value !== "Select The Number Of Questions") {
        start.style.display = "none"
        tips.classList.add("open");
    } else {
        alert("You Have to select language and number of question")
    }
    updateCategoryAndQueNum();
});
// Start tips Buttons Action
let exitBtn = document.querySelector(".tips .form .exit");
let continueBtn = document.querySelector(".tips .form .continue");
let container = document.querySelector(".container");

exitBtn.addEventListener("click", () => {
    start.style.display = "flex";
    tips.classList.remove("open");
});

continueBtn.addEventListener("click", () => {
    tips.classList.remove("open");
    container.classList.add("open");
    getQuestions();
});

// Start The questions section
let lanSpan = document.querySelector(".container header span.language");
let numberSpan = document.querySelector(".container footer span.all");
let currentQue = document.querySelector("footer span.current");
let nextQue = document.querySelector(".container footer .next");
let contentSection = document.querySelector("section");
let countDownSpan = document.querySelector(".container header .box-time span.count");
let progressBar = document.querySelector(".container .progress");
let result = document.querySelector(".result");

let currentIndex = 0;
let numOfRightAns = 0;
currentQue.innerHTML = 1;
let countDownInterval;
let time = 15;
let counterWidth;
let ProgressBarWidth = 0;


function updateCategoryAndQueNum() {
    lanSpan.innerHTML = langInput.value;
    numberSpan.innerHTML = numInput.value;
}

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", `json/${langInput.value}-question.json`, true);
    myRequest.send();
    myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        globalThis.jsData = JSON.parse(this.responseText);
        globalThis.queCount = numInput.value
        
        // Add question 
        addQuestions(jsData[currentIndex], queCount);
        
        me();
        countDown(time, queCount);
        countDownProgress(time, queCount);
        
        // click Nextque button
        if (currentIndex < queCount - 1) {
            nextQue.onclick = () => {
                currentIndex++;
                me();
                clearInterval(countDownInterval);
                countDown(time, queCount);
                clearInterval(counterWidth);
                countDownProgress(time, queCount);
                
                // Remove previous question
                contentSection.innerHTML = "";
                
                // Add question 
                addQuestions(jsData[currentIndex], queCount);
                
                nextQue.classList.remove("show");
                
                currentQue.innerHTML = currentIndex + 1;
            };
        }
    }
}
}
function me() {
    globalThis.rightAns = jsData[currentIndex].right_answer;

}
function addQuestions(data, count) {
    if (currentIndex < count) {
        // Create The question Div
    let headDiv = document.createElement("div");
    headDiv.className = "que-head";

    // Create P and Text
    let headP = document.createElement("p");
    let QueText = document.createTextNode(`${currentIndex + 1}. ${data.question}`);

    // Appending elements
    headP.appendChild(QueText);
    headDiv.appendChild(headP);
    contentSection.append(headDiv);

    // Create The Choices

    // Create ul
    let ul = document.createElement("ul");
    ul.className = "answers";

    // Randomize Answers 
    var myArr = ['1', '2', '3', '4'];
    var newArr = [];
    function randArray() {
        globalThis.rand = Math.floor(Math.random() * myArr.length);
        if (newArr.indexOf(rand) == -1) {
            newArr.push(rand);
        } else {
            randArray();
        }
    }

    for (let i = 1; i <= 4; i++) {
        randArray();
        // Create li
        let li = document.createElement("li");

        li.dataset.answer = data[`answer_${myArr[rand]}`];

        // Create Answer Text
        let liText = document.createTextNode(data[`answer_${myArr[rand]}`]);

        // Appending Elements
        contentSection.append(ul);
        ul.appendChild(li);
        li.appendChild(liText)
    }
    chooseAns();
    }
};

function chooseAns() {
    let myLis = document.querySelectorAll(".answers li");
    myLis.forEach(function (item) {
        item.addEventListener("click", function() {
            myLis.forEach((e) => {
                e.classList.remove("active");
                this.classList.add("active");
            });
            clearInterval(countDownInterval);
            clearInterval(counterWidth);
            countDownSpan.classList.remove("text-blink")
            if (currentIndex < queCount - 1) {
                nextQue.classList.add("show");
            } else {
                submitBtn.classList.add("show");
            }
            let userAns = this.dataset.answer;

            if (userAns == rightAns) {
                numOfRightAns++;
            }
            // Once User Selected Disabled all options
            let myUl = document.querySelector(".answers");
            for (let i = 0; i < myUl.children.length; i++) {
            myUl.children[i].classList.add("disabled");
            };
        });
    });
};

function countDown(time, count) {
    if (currentIndex < count) {
        countDownInterval = setInterval(function () {
            time = time < 10 ? `0${time}` : time;
            countDownSpan.innerHTML = time;

            if (--time < 0) {
                clearInterval(countDownInterval);
                if (currentIndex < numInput.value - 1) {
                    nextQue.click();
                } else {
                    submitBtn.click();
                }
            }
            if (time < 5 && time >= 0) {
                countDownSpan.classList.add("text-blink");
            } else {
                countDownSpan.classList.remove("text-blink");
            }
        }, 1000)
    }
}

function countDownProgress(time, count) {
    if (currentIndex < count) {
        counterWidth = setInterval(function () {
            time += 1;
            progressBar.style.width = time + "px";

            if (time > 599) {
                clearInterval(counterWidth);
            }
        }, 27)
    }
}

// Start Result
let submitBtn = document.querySelector(".container footer .submit");
let closeBtn = document.querySelector(".result span.close");
let rightAnswerSpan = document.querySelector(".result .right-answer");
let totalQue = document.querySelector(".result .total-que");
let word = document.querySelector(".result #word");
let only = document.querySelector(".result .only");

submitBtn.onclick = function () {
    container.classList.remove("open");
    result.classList.add("show-result");

    rightAnswerSpan.textContent = numOfRightAns;
    totalQue.textContent = numInput.value;

    if (numInput.value == 20) {
        if (numOfRightAns >= 18) {
            word.innerHTML = `Excellent 🥳️`;
        } else if (numOfRightAns < 18 && numOfRightAns > 10) {
            word.innerHTML = `Nice 😎`;
        } else {
            word.innerHTML = `Sorry 😞`;
            only.innerHTML = "only";
        }
    } else if (numInput.value == 15) {
        if (numOfRightAns >= 13) {
            word.innerHTML = `Excellent 🥳️`;
        } else if (numOfRightAns < 13 && numOfRightAns > 7) {
            word.innerHTML = `Nice 😎`;
        } else if (numOfRightAns <= 7) {
            word.innerHTML = `Sorry 😞`;
            only.innerHTML = "only";
        }
    } else if (numInput.value == 10) {
        if (numOfRightAns >= 8) {
            word.innerHTML = `Excellent 🥳️`;
        } else if (numOfRightAns < 8 && numOfRightAns > 5) {
            word.innerHTML = `Nice 😎`;
        } else {
            word.innerHTML = `Sorry 😞`;
            only.innerHTML = "only";
        }
    } else {
        if (numOfRightAns == numInput.value) {
            word.innerHTML = `Excellent 🥳️`;
        } else if (numOfRightAns < 5 && numOfRightAns >= 3) {
            word.innerHTML = `Nice 😎`;
        } else {
            word.innerHTML = `Sorry 😞`;
            only.innerHTML = "only";
        }
    }
};

closeBtn.addEventListener("click", () => {
    window.location.reload();
});