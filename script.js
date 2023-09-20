var startDateTime = new Date(2019,8,23,18,0,0,0); // YYYY (M-1) D H m s ms (start time and date from DB)
var startStamp = startDateTime.getTime();
let weddingDate = new Date(2024,10,2,15,30,0,0)
let weddingStamp = weddingDate.getTime();

//var testDate = new Date(2096,8,4,18,0,0,0);

var newDate = new Date();
var newStamp = newDate.getTime();

function TimelineObject() {
    TimelineObject.prototype.date = new Date();
    TimelineObject.prototype.caption = "";
    TimelineObject.prototype.imageurl = "";
    TimelineObject.liked = false;
    TimelineObject.comments = [];

}

let TimeLineObjs = [];

let dailymessages = [];

let thepassword = "";

/*var testTimelineObj = new TimelineObject();
testTimelineObj.date = new Date(2020,9,23);
testTimelineObj.caption = "Began Dating Yeeeee"
testTimelineObj.imageurl = "Data/TestImage.png"*/

//TimeLineObjs.push(testTimelineObj);

fetch('Data/password.json')
    .then((response) => response.json())
    .then((json) => {
        thepassword = json[0].password;
        validatePassword();
        
    });


fetch('Data/polaroids.json')
    .then((response) => response.json())
    .then((json) => {
        json.forEach((ele) => {
            TimeLineObjs.push(ele) });
        compileTimeline();
        
    });


function compileTimeline() {
    let row = 1;
    let year = "";
    

    let timeline = document.getElementById("maingrid");
    for (let obj of TimeLineObjs) {
        obj.date = new Date(obj.date);
        if (year == "" || year != obj.date.getFullYear()) {
            year = obj.date.getFullYear();
            let yearMarker = compileYearMarker(year);
            yearMarker.className += ` row-start-`+ row;
            row++;
            timeline.appendChild(yearMarker);
            
        } 
        
        if (obj.imageurl != "" || obj.imageurl == undefined) {
            let polaroid = compilePolaroid(obj);
            polaroid.className += ` row-start-`+ row;
            row++;
            if (Math.random() < 0.5) {
                polaroid.className += ' polaroidright';
            } else {
                polaroid.className += ' polaroidleft';
            }
            timeline.appendChild(polaroid);
        } 
        /*else {
            let moment = compileMoment(obj);
            moment.className += ` row-start-`+ row;
            row++;
            
            timeline.appendChild(moment);
        }*/
    }
    }



function compilePolaroid(Ele) {
    let div = document.createElement("div");
    div.className = "h-full py-2 polaroidgrid md:text-5xl lg:text-5xl";
    let polaroid = document.createElement("div");
    polaroid.className="w-1/2 m-auto bg-white flex flex-col border-8 border-white drop-shadow-xl justmeagaindownhere h-full";
    let image = document.createElement("img");
    image.src = Ele.imageurl;
    image.className= "w-full h-full object-contain";

    let info = document.createElement("div");
    info.className = "bg-white w-full flex gap-3 shrink justify-evenly"

    let caption = document.createElement("h2");
    caption.innerHTML = Ele.caption;
    caption.className = "p-0 my-auto text-center"

    let date = document.createElement("h2");
    date.innerHTML = outputDate(Ele.date);
    date.className = "p-0 my-autotext-left"

    info.appendChild(date);
    info.appendChild(caption);

    polaroid.appendChild(image);
    polaroid.appendChild(info);
    
    div.appendChild(polaroid)

    return div;

}

function compileMoment(ele) {
    let div = document.createElement("div");
    div.className = "radialgrad w-1/2 h-fit p-5 mx-auto"

    let Date = document.createElement("h2");
    Date.innerHTML = outputDate(ele.date);
    Date.className="text-2xl text-center";

    let Caption = document.createElement("h2");
    Caption.innerHTML = ele.caption;
    Caption.className="text-2xl text-center";

    div.appendChild(Date);
    div.appendChild(Caption);

    return div;

}

function compileYearMarker(year) {
    let div = document.createElement("div");
    div.className = "radialgrad my-5 text-center m-auto px-12 py-3 w-fit rounded-xl text-2xl md:text-5xl tracking-wider font-light yearmarker"
    div.innerHTML = year;

    return div;
}

function outputDate(Date) {
    let string = "";
    string += Date.getDate();
    string += "."
    string+= Date.getMonth();
    string += "."
    string += Date.getFullYear();
    return string;


}

var timer; // for storing the interval (to stop or pause later if needed)

function updateClock() {
    newDate = new Date();
    newStamp = newDate.getTime();
    //newStamp = testDate.getTime();
    var diff = Math.round((newStamp-startStamp)/1000);
    diff = diff - (86400 * leapYearsBetween(startDateTime, newDate)); //account for leap day
    var y = Math.floor(diff/(24*60*60*365));
    diff = diff - (y*24*60*60*365);
    var d = Math.floor(diff/(24*60*60)); 
    diff = diff-(d*24*60*60);
    var h = Math.floor(diff/(60*60));
    diff = diff-(h*60*60);
    var m = Math.floor(diff/(60));
    diff = diff-(m*60);
    var s = diff;

    if (d <= 0) {
        XYears(y, true)
    }
    XYears(0, false);
    
    document.getElementById("counter").innerHTML = y+":" + d+":"+h+":"+m+":"+s  ;
    let leapdays = document.createElement("h3");
    leapdays.className = "m-auto w-full text-lg";
    leapdays.innerHTML = " + " + leapYearsBetween(startDateTime, newDate) + " leap day(s)"
    document.getElementById("counter").appendChild(leapdays);

    
}

timer = setInterval(updateClock, 1000);

anniversarymessageshown = false;

function XYears(y, bool) {
    if (!anniversarymessageshown && bool) {
        
        let div = document.createElement("div");
        div.className = "radialgrad my-5 text-center m-auto px-12 py-3 w-fit rounded-xl text-3xl tracking-wider font-light";
        div.innerHTML = `Happy `+ y + ` Years Mads, I love you xxx`;
        anniversarymessageshown = true;
        let counter = document.getElementById("anniversarymessage");
        counter.appendChild(div);
    } else if (!bool && !anniversarymessageshown) {
        anniversarymessageshown = false;
    }

}

function leapYearsBetween(d1, d2) {
    let total = 0;
    for(let i = d1.getFullYear(); i <= d2.getFullYear(); i++) {
        if (i % 4 == 0) {
            total++;
        }
    }
    
    return total;

}

function updateWeddingClock() {
    newDate = new Date();
    newStamp = newDate.getTime();
    //newStamp = testDate.getTime();
    var diff = Math.round((weddingStamp-newStamp)/1000);
    diff = diff - (86400 * leapYearsBetween(newDate, weddingDate)); //account for leap day
    var y = Math.floor(diff/(24*60*60*365));
    diff = diff - (y*24*60*60*365);
    var d = Math.floor(diff/(24*60*60)); 
    diff = diff-(d*24*60*60);
    var h = Math.floor(diff/(60*60));
    diff = diff-(h*60*60);
    var m = Math.floor(diff/(60));
    diff = diff-(m*60);
    var s = diff;

    
    document.getElementById("weddingcounter").innerText = y+":" + d+":"+h+":"+m+":"+s  ;
    let tilwed = document.createElement("h3");
    tilwed.className = "m-auto w-full text-lg";
    tilwed.innerHTML = "til mariag"
    document.getElementById("weddingcounter").appendChild(tilwed);


    
}

timer = setInterval(updateWeddingClock, 1000);

function addDays(date,addDays) { //https://stackoverflow.com/questions/3910043/adding-day-to-a-javascript-date-object-does-not-work-when-moving-to-the-next-mon
    return new Date(date.getTime() + (addDays*24*60*60*1000));
}

function testDatesJson() {
    let array = [];
    let today = new Date();
    let currentday = today;
    for(let i = 0; i < 420; i++) {
        let currentday = new Date(today);
        
        currentday.setDate(today.getDate() + i)
        
            let obj = new Object;
            obj.date = currentday.toDateString();
            obj.message = "";
            array.push(obj);

        
       
        //console.log(newday.toDateString() + " " + weddingDate.toDateString());

    }


}

//testDatesJson();

let msgbutton = document.getElementById("msgbutton");
msgbutton.addEventListener("click", () => {
    fetch('Data/messages.json')
    .then((response) => response.json())
    .then((json) => {
        json.forEach((ele) => {
            dailymessages.push(ele) });
            newDailyMessage();
            
        
    });


})

checkDailyMessage();

function checkDailyMessage() {
    let today = new Date().toDateString();
    if (localStorage.getItem("dailyMessageOpened") && localStorage.getItem("lastMessageOpened") == today) {
        setDailyMessage(localStorage.getItem("dailyMessage"))
    }

}



function newDailyMessage() {
    let today = new Date().toDateString();
    let dailymessagediv = document.getElementById("dailymessage");
    for (msg of dailymessages) {
        //console.log(msg.date + " " + today)
        if (msg.date == today) {
            dailymessagediv.innerHTML = "";
            let msgdiv = document.createElement("h2");
            msgdiv.className =  "text-4xl";
            msgdiv.innerHTML = msg.message;
            dailymessagediv.appendChild(msgdiv);

            let tmrwdiv = document.createElement("h3");
            tmrwdiv.className = "text-2xl text-gray-700"
            tmrwdiv.innerHTML = "Come back tommorow for another message x"
            dailymessagediv.appendChild(tmrwdiv);
            localStorage.setItem("dailyMessage", msg.message)
            localStorage.setItem("dailyMessageOpened", true)
            localStorage.setItem("lastMessageOpened", msg.date)
        }
    }


    


}

function setDailyMessage(message) {
    let dailymessagediv = document.getElementById("dailymessage");
    dailymessagediv.innerHTML = "";
            let msgdiv = document.createElement("h2");
            msgdiv.className =  "text-4xl";
            msgdiv.innerHTML = message;
            dailymessagediv.appendChild(msgdiv);

            let tmrwdiv = document.createElement("h3");
            tmrwdiv.className = "text-2xl text-gray-700"
            tmrwdiv.innerHTML = "Come back tommorow for another message x"
            dailymessagediv.appendChild(tmrwdiv);

}

//main body display none if not password correct
//entered password is hash
//if local storage of recently entered password is == hash then display true

function displayBody(bool) {
    let bodyDiv = document.getElementById("maincontent");
    let passwordDiv = document.getElementById("password-parent")
    if (bool) {
    bodyDiv.style.display = "block";
    passwordDiv.style.display="none";
    } else {
        bodyDiv.style.display = "none";
        passwordDiv.style.display= "flex";
    }

}





function validatePassword(password) {
    if (checkPasswordEntered(password)) {
        displayBody(true);
        
    } else {
        displayBody(false);
    

}
}


function checkPasswordEntered(password) {
    if (password == "" || password == undefined) {
    let enteredPassword = localStorage.getItem("enteredPassword");

    return (thepassword == enteredPassword);
    } else {
        localStorage.setItem("enteredPassword", password)
        return (thepassword == password);
    }

   
}


function enterPassword() {
    let text = document.getElementById("passwordtext").value;
    validatePassword(text);
}

document.getElementById("enter_icon").addEventListener("click", () => {
    enterPassword()
})

document.getElementById("passwordtext").addEventListener("keydown", (e) => {
    if (e.code == "Enter") {
        enterPassword();
    }
})


