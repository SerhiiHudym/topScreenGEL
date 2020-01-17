const renderDateAndTime = () => {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    const day = today.getDate() + '.' + today.getMonth();
    // console.log(time);
    // console.log(day);

    const dateValue = document.querySelector('#dateValue');
    const timeValue = document.querySelector('#timeValue');

    dateValue.innerText = day;
    timeValue.innerText = time;
};

setInterval(renderDateAndTime, 1000)