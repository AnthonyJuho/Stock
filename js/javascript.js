var korean = document.getElementById("korean");
var english = document.getElementById("english");
var math = document.getElementById("math");
var social = document.getElementById("social");
var science = document.getElementById("science");

var koreanInfo = {
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    }
};
var englishInfo = {
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    }
};
var mathInfo = {
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    }
};
var socialInfo = {
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    }
};
var scienceInfo = {
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    }
};

let ElementArray = [korean,english,math,social,science];
let InfoArray = [koreanInfo,englishInfo,mathInfo,socialInfo,scienceInfo];

let interval = setInterval(function() {
    for(let num = 0;num<=4;num++) {
        var Info = InfoArray[num];
        var random = Math.random()*100000-50000;
        var firstprice = Info.price;
        Info.price += random;
        if(Info.price <= 0) {
            Info.holding = 0;
            Info.profit.percent = 0;
            Info.profit.price = 0;
        } else {
            var ratio = Info.price/firstprice;
            Info.profit.percent *= ratio;
            Info.profit.price = Info.profit.holding*(Info.profit.percent+1);
        }
    }
},1000);

function ShowDiv() {
    for(let num = 0;num<=4;num++){
        var Element = ElementArray[num];
        var Info = InfoArray[num];
        
        var price = Element.getElementById("price");
        var holding = Element.getElementById("holding");
        var profit = Element.getElementById("profit");

        price.innerText = "현재가: "+Info.price+"원";
    }
}

// function ChangeNumber()

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();
}