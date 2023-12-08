// Device control
setInterval(function(){

},2000);
let lightOnNoti='Bạn có muốn bật đèn không?'
let lightOffNoti='Bạn có muốn tắt đèn không?'
document.querySelector('#but1').addEventListener('click',()=> {
    if (confirm(lightOnNoti)){
        socket.emit('led', 'on')
        document.getElementById("but1").style.background="grey"
        document.getElementById("but2").style.background="red"
        document.querySelector('#led').src='./img/den_bat.png'
    }
})
document.querySelector('#but2').addEventListener('click',()=> {
    if (confirm(lightOffNoti)){
        socket.emit('led', 'off')
        document.getElementById("but2").style.background="grey"
        document.getElementById("but1").style.background="green"
        document.querySelector('#led').src='./img/den_tat.png'
    }
})

//biểu đồ

const ctx = document.getElementById('myChart').getContext('2d');
const data = {
    labels: [],
    datasets: [
        {
            type: 'line',
            label: 'Temp',
            data: [],
            backgroundColor: '#EE5C42',
            borderColor: '#EE5C42',
        },
        {
            type: 'line',
            label: 'Hum',
            data: [],
            backgroundColor: '#53868B',
            borderColor: '#53868B',
        },
        {
            type: 'line',
            label: 'Light',
            data: [],
            backgroundColor: '#8B752E',
            borderColor: '#8B752E',
        },
        {
            type: 'line',
            label: 'Co2',
            data: [],
            backgroundColor: '#4248EE',
            borderColor: '#4248EE',
        },
    ],
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'DATA UPDATE REALTIME',
            },
        },
    },
};

// function auto(nd,da){
//     if(nd>29 && da>67){
//         socket.emit('led', 'on')
//         document.querySelector('#led').src='./img/den_bat.png'
//     }
//     else{
//         socket.emit('led','off')
//         document.querySelector('#led').src='./img/den_tat.png'
//     }
// }
// auto();

Chart.defaults.color = '#000';
const sensorsChart = new Chart(ctx, config);
setInterval(function(handlingData){

    const handlingData = arr => {
    const dataSS = arr.map(data => Number(data));
    
    data.datasets[0].data.push(dataSS[0]);
    data.datasets[0].data.length === 13 && data.datasets[0].data.shift();
    data.datasets[1].data.push(dataSS[1]);
    data.datasets[1].data.length === 13 && data.datasets[1].data.shift();
    data.datasets[2].data.push(dataSS[2]);
    data.datasets[2].data.length === 13 && data.datasets[2].data.shift();
    data.datasets[3].data.push(dataSS[3]);
    data.datasets[3].data.length === 13 && data.datasets[3].data.shift();
    
    document.getElementById("col1").innerHTML = dataSS[0] + '°C'
    document.getElementById("col2").innerHTML = dataSS[1] + '%'
    document.getElementById("col3").innerHTML = dataSS[2] + ' lux'
    document.getElementById("col4").innerHTML = dataSS[3]


        changeNhietDo(dataSS[0])
        changeDoAm(dataSS[1])
        changeAnhSang(dataSS[2])
        changeKhi(dataSS[3])


    const day = new Date();
    let time = `${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
    data.labels.push(time);
    data.labels.length === 13 && data.labels.shift();
    sensorsChart.update();
    };

    function changeNhietDo(nd){               
        if(nd<20){
        document.getElementById('temp').style.background='#f3fcfa';
        }else if(nd<40){
        document.getElementById('temp').style.background='#93cbbf';
        }else if(nd<60){
        document.getElementById('temp').style.background='#9be0d3';
        }else {
        document.getElementById('temp').style.background='#158772';
        alert('Nhiet do cao qua'); 
        }
    }
            
    function changeDoAm(da){
        if(da<20){
            document.getElementById('hum').style.background = '#f3fcfa'
        } else if(da<40){
            document.getElementById('hum').style.background = '#93cbbf'
        } else if(da<60){
            document.getElementById('hum').style.background = '#9be0d3'
        } else if(da<80){
            document.getElementById('hum').style.background = '#52b6a3'
        } else if(da<100){
            document.getElementById('hum').style.background = '#158772'
        }	
    }

    function changeAnhSang(as){
        if(as<200){
            document.getElementById('light').style.background = '#f3fcfa'
        } else if(as<500){
            document.getElementById('light').style.background = '#93cbbf'
        } else if(as<600){
            document.getElementById('light').style.background = '#9be0d3'
        } else if(as<800){
            document.getElementById('light').style.background = '#52b6a3'
        } else if(as<1000){
            document.getElementById('light').style.background = '#158772'
        }	
    }
            
    function changeKhi(kg){
        if(kg<48){
            document.getElementById('co2').style.background = '#93cbbf'
        } else if(kg>48){
            document.getElementById('co2').style.background = '#fd0000'
            alert('Có nguy cơ hỏa hoạn!!! Khẩn cấp !'); 
    }
}
}, 2000);
// Socket IO

const socket = io();
// setInterval(handlingData(msg), 2000);

socket.on('updateSensor', msg => {     //lang nghe du lieu tu mqtt
    console.log(msg);
    handlingData(msg);
});

socket.on('led', msg => {
    if (msg === 'on') {
        document.querySelector('#anh1').src = './img/den_bat.png';
    }
    if (msg === 'off') {
        document.querySelector('#anh1').src = './img/den_tat.png';
    }
    console.log(`led ${msg}`);
});