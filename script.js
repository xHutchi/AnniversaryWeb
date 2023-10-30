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

let mobile = null;

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

function fetchPolaroids() {
fetch('Data/polaroids.json')
    .then((response) => response.json())
    .then((json) => {
        json.forEach((ele) => {
            TimeLineObjs.push(ele) });
        compileTimeline();
        
    });

}

fetchPolaroids();


function compileTimeline() {
    let row = 1;
    let year = "";
    let left = false;

    let timeline = document.getElementById("maingrid");
    let estimatedRows = estimateGridRowSize(TimeLineObjs);
    let rowsString = "";
    for (let i = 0; i < estimatedRows; i++) {
        rowsString += " auto";
    }
    //timeline.style.gridTemplateRows = rowsString;

    for (let obj of TimeLineObjs) {
        obj.date = new Date(obj.date);
        if (year == "" || year != obj.date.getFullYear() && !isNaN(obj.date)) {
            row++;
            year = obj.date.getFullYear();
            let yearMarker = compileYearMarker(year);
            yearMarker.style.gridRowStart = row;
            row++;
            timeline.appendChild(yearMarker);
            
        } 
        
        if (obj.imageurl != "" || obj.imageurl == undefined) {
            let polaroid = compilePolaroid(obj);
            polaroid.style.gridRowStart = row;
            if (mobile) {
                console.log("row")
                row++;
            }
            if (left) {
                polaroid.className += ' polaroidright';
                left = !left;
                if (!mobile) {
                row++;
                }
            } else {
                polaroid.className += ' polaroidleft';
                left = !left;
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
    div.className = "h-full py-2 polaroidgrid md:text-5xl lg:text-5xl flex items-center";
    let polaroid = document.createElement("div");
    polaroid.className="polaroid w-1/2 mx-auto my-auto bg-white flex flex-col border-8 border-white drop-shadow-xl justmeagaindownhere";
    if (Ele.imageurl != "" && Ele.imageurl != undefined) {
    let image = document.createElement("img");
    image.src = Ele.imageurl;
    image.className= "w-full";
    polaroid.appendChild(image);
    }

    let info = document.createElement("div");
    info.className = "polaroidinfo bg-white w-full flex gap-3 shrink justify-evenly"
    

    if (Ele.caption != "" && Ele.caption != undefined && !isNaN(Ele.date)) {
    let caption = document.createElement("h2");
    caption.innerHTML = Ele.caption;
    caption.className = "p-0 my-auto text-center"
    info.appendChild(caption);

    }

    if (Ele.date != "" && Ele.date != undefined && !isNaN(Ele.date)) {

    let date = document.createElement("h2");
    date.innerHTML = outputDate(Ele.date);
    date.className = "p-0 my-autotext-left"
    info.appendChild(date);
    }

    
    
    
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
    div.className = "radialgrad my-5 text-center m-auto px-12 py-3 w-fit rounded-xl text-4xl md:text-5xl tracking-wider font-light yearmarker"
    div.innerHTML = year;

    return div;
}

function outputDate(Date) {
    let string = "";
    string += Date.getDate();
    string += "."
    string+= Date.getMonth() + 1;
    string += "."
    string += Date.getFullYear();
    return string;


}

function estimateGridRowSize(Objs) {
    let yearsArray = []
    let count = 0;
    Objs.forEach( (Obj) => {
        count++;
        let date = new Date(Obj.date);
        if (!yearsArray.includes(date.getFullYear())) {
            
            yearsArray.push(date.getFullYear())
        }

    } )
    return count + yearsArray.length

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
    fetch('Data/testmessages.json')
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
    //let today = new Date(2023,9,27).toDateString();
    if (localStorage.getItem("dailyMessageOpened") && localStorage.getItem("lastMessageOpened") == today) {
        setDailyMessage(localStorage.getItem("dailyMessage"))
    }

}



function newDailyMessage() {
    let today = new Date().toDateString();
    //let today = new Date(2023,9,27).toDateString();
    let dailymessagediv = document.getElementById("dailymessage");
    for (msg of dailymessages) {
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



function isMobile() {
if (mobile != null) {
  if (screen.width < 1100 && !mobile) {
    removeAllChildren(document.getElementById("maingrid"))
    mobile = true;
    if (TimeLineObjs != undefined) {
        compileTimeline();
    } else {
        fetchPolaroids();
    }
  }
  if (screen.width >= 1100 && mobile) {
    removeAllChildren(document.getElementById("maingrid"))
    mobile = false;
    if (TimeLineObjs != undefined) {
        compileTimeline();
    } else {
        fetchPolaroids();
    }
  }
} else {
    if (screen.width < 1100) {
        removeAllChildren(document.getElementById("maingrid"))
        mobile = true;
        console.log(TimeLineObjs)
        
        if (TimeLineObjs != undefined) {
            compileTimeline();
        } else {
            fetchPolaroids();
        }
      }
      if (screen.width >= 1100) {
        removeAllChildren(document.getElementById("maingrid"))
        mobile = false;
        if (TimeLineObjs != undefined) {
            compileTimeline();
        } else {
            fetchPolaroids();
        }
      }
}
}

let isMobileCheck = setInterval(isMobile, 500);

function removeAllChildren(parent) { //used when wiping a dynamic DOM element
    
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}



function DuckEgg () {
    DuckEgg.prototype.name = "";
    DuckEgg.prototype.isEgg = false;
    DuckEgg.prototype.heart = 0;
    DuckEgg.prototype.fedToday = false;


}

function checkFeed(DuckEgg) {
    let today = new Date()
    let todaystring = today.toDateString();
    if (todaystring != DuckEgg.lastfed) {
        DuckEgg.fedToday = false;

        let lastupdated = new Date(DuckEgg.lastupdated);
        let dayssince = Math.floor((today.getTime() - lastupdated.getTime()) / (1000 * 3600 * 24));
        console.log(lastupdated.toDateString() + " " + dayssince +  " " + DuckEgg.heart);
        if (dayssince >= 2) {
            DuckEgg.heart -= 0.25;
            DuckEgg.lastupdated = todaystring;
        }
    }
    



}

function feedDuckEgg(DuckEgg) {
    if (!DuckEgg.fedToday)
    if (DuckEgg.isEgg) {
        DuckEgg.heart += 1
    } else {
        DuckEgg.heart += 1/16;
    }
    DuckEgg.fedToday = true;
    DuckEgg.lastfed = new Date().toDateString();
    reRenderDuckEggs();


}

function CreateDuckEgg() {
    let newEgg = new DuckEgg();
    newEgg.heart = 0;
    newEgg.isEgg = true;
    newEgg.fedToday = false;
    DuckEggs.push(newEgg);
    reRenderDuckEggs();

}

function HatchDuckEgg(DuckEgg) {
    DuckEgg.isEgg = false;
    DuckEgg.heart = 0;
    DuckEgg.fedToday = false;
    reRenderDuckEggs();
}

function setDuckName(DuckEgg, name) {
    DuckEgg.name = name.value;
    reRenderDuckEggs();
}

let DuckEggs = []


function reRenderDuckEggs() {
    console.log(DuckEggs)
    let duckArea = document.getElementById("duckarea");
    removeAllChildren(duckArea);
    if (DuckEggs.length <= 0) {
        let stored = JSON.parse(localStorage.getItem("DuckEggs"))
        if (stored != undefined && stored.length > 0) {
            DuckEggs = stored;
        } else {
            let testDuck = new DuckEgg();
            testDuck.name = ""
            testDuck.heart = 0;
            testDuck.isEgg = false;
            testDuck.fedToday = false;
            DuckEggs.push(testDuck); 
        }
    }

    console.log(DuckEggs);

    DuckEggs.forEach( (Ele)=> {
        checkFeed(Ele);
        if (!Ele.isEgg) {
            let div = document.createElement("div");
            div.className = "duckdiv flex flex-col w-fit gap-3 rounded-2xl p-4"
            
            let heartdiv = document.createElement("div");
            heartdiv.className = "hearteggs flex justify-between"

            if (Ele.heart > 1) {
                Ele.heart = 1;
            }

            let heartsegments = Math.floor(Ele.heart * 16);

            let fullhearts = Math.floor(heartsegments / 4);


            for (let i = 0; i < fullhearts; i++) {
                let heartele = document.createElement("img");
                heartele.src = "Data/redheart.png"
                heartdiv.appendChild(heartele)
            }

            let remaininghearts = heartsegments - (fullhearts * 4) ;
            
            let semiheartele = document.createElement("img");
            switch((remaininghearts)) {
                case 1:
                    semiheartele.src="Data/redheart1.png" 
                    break;
                case 2:
                    semiheartele.src="Data/redheart2.png" 
                    break;
                case 3:
                    semiheartele.src="Data/redheart3.png" 
                    break;
            }

            heartdiv.appendChild(semiheartele);

            let greyhearts = Math.floor((16 - heartsegments) /4);

            for (let i = 0; i < greyhearts; i++) {
                let heartele = document.createElement("img");
                heartele.src = "Data/greyheart.png"
                heartdiv.appendChild(heartele)
            }
            
            div.appendChild(heartdiv);

            let duckimg = document.createElement("img");
            duckimg.className = "duckimage w-fit m-auto drop-shadow-lg"
            duckimg.src = "Data/duckplaceholder.png";

            div.appendChild(duckimg);

            if (Ele.name != "") {

            let duckname = document.createElement("h2")
            duckname.className = "duckname justmeagaindownhere text-white text-6xl m-auto";
            duckname.innerText = Ele.name;

            div.appendChild(duckname);

            } else {
                let namediv = document.createElement("div");
                namediv.className = "ducknameenter w-full flex gap-2";

                let input = document.createElement("input");
                input.className = "w-full h-full p-2 text-2xl rounded-md";
                input.placeholder = "Enter Duck Name"
                input.type = "text"
                namediv.appendChild(input);

                let enterbtn = document.createElement("a");
                enterbtn.className = "text-white my-auto hover:text-gray-500"
                enterbtn.addEventListener("click", () => {
                    setDuckName(Ele, input)

                })

                let entericon = document.createElement("i");
                entericon.className = "fas fa-solid fa-right-to-bracket fa-2xl";
                enterbtn.appendChild(entericon);

                namediv.appendChild(enterbtn);

                div.appendChild(namediv);


            }

            let duckbuttons = document.createElement("div");
            duckbuttons.className = "duckbuttons flex justify-around gap-3"

            let feedbutton = document.createElement("button");
            feedbutton.className = "justmeagaindownhere  hover:bg-gray-500 bg-gray-300 rounded-2xl w-full p-3 text-4xl disabled:bg-gray-700 ";
            
            if (Ele.fedToday) {
                feedbutton.innerText = "Fed Today"; 
                feedbutton.disabled = true;
            } else {
            feedbutton.innerText = "Feed";
            }


            feedbutton.addEventListener("click", (a) => {
                feedDuckEgg(Ele);
            })

            duckbuttons.appendChild(feedbutton);

            let Eggbutton = document.createElement("button");
            Eggbutton.className = "justmeagaindownhere  hover:bg-gray-500 bg-gray-300 rounded-2xl w-full p-3 text-4xl disabled:bg-gray-700 ";
            Eggbutton.innerText = "Egg";
            if (Ele.heart < 1) {
                Eggbutton.disabled = true;
            } 
            Eggbutton.addEventListener("click", (a) => {
                CreateDuckEgg();
            })

            duckbuttons.appendChild(Eggbutton);

            div.appendChild(duckbuttons);

            duckArea.appendChild(div);



        }
        else {
            let div = document.createElement("div");
            div.className = "duckdiv flex flex-col w-fit gap-3 rounded-2xl p-4"

            let eggimg = document.createElement("img");
            eggimg.className = "duckimage w-fit m-auto drop-shadow-lg"

            if (Ele.heart > 1) {
                Ele.heart = 1;
            }

            let eggstage = Math.floor(Ele.heart * 4);

            

            switch (eggstage) {
                case 0:
                    eggimg.src = "Data/egg1.png";
                    break;
                case 1:
                    eggimg.src = "Data/egg2.png";
                    break;
                case 2:
                    eggimg.src = "Data/egg3.png";
                    break;
                case 3:
                    eggimg.src = "Data/egg4.png";
                    break;
                case 4:
                    eggimg.src = "Data/egg4.png";
                    break;
                default: 
                    eggimg.src = "Data/egg4.png"
                    
            }


            div.appendChild(eggimg);

            let duckbuttons = document.createElement("div");
            duckbuttons.className = "duckbuttons flex justify-around gap-3"

            let feedbutton = document.createElement("button");
            feedbutton.className = "justmeagaindownhere  hover:bg-gray-500 bg-gray-300 rounded-2xl w-full p-3 text-4xl disabled:bg-gray-700 ";
            if (Ele.fedToday) {
                feedbutton.innerText = "Fed Today"; 
                feedbutton.disabled = true;
            } else {
            feedbutton.innerText = "Feed";
            }

            feedbutton.addEventListener("click", (a) => {
                console.log("yue")
                feedDuckEgg(Ele);
            })

            duckbuttons.appendChild(feedbutton);

            let Eggbutton = document.createElement("button");
            Eggbutton.className = "justmeagaindownhere  hover:bg-gray-500 bg-gray-300 rounded-2xl w-full p-3 text-4xl disabled:bg-gray-700 ";
            Eggbutton.innerText = "Hatch";
            if (Ele.heart < 1) {
                Eggbutton.disabled = true;
            } 
            Eggbutton.addEventListener("click", (a) => {
                HatchDuckEgg(Ele);
            })

            duckbuttons.appendChild(Eggbutton);

            div.appendChild(duckbuttons);

            duckArea.appendChild(div);

        }
    
    });

    localStorage.setItem("DuckEggs", JSON.stringify(DuckEggs))

}

reRenderDuckEggs();