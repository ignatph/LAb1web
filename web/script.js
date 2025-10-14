let currentR = 2;
let points = [];
const STORAGE_KEY = 'savedPoints';

document.getElementById('y').addEventListener('input', function(e) {
    let value = e.target.value;


    value = value.replace(/[^\d.,-]/g, '');

    value = value.replace(',', '.');


    if (value.indexOf('-') > 0) {
        value = value.replace('-', '');
    }


    if ((value.match(/-/g) || []).length > 1) {
        value = value.replace(/-/g, '');
        if (value.length > 0) value = '-' + value;
    }


    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts.slice(1).join('');
    }


    if (value.includes('.')) {
        const parts = value.split('.');
        if (parts[1] && parts[1].length > 3) {
            value = parts[0] + '.' + parts[1].substring(0, 3);
        }
    }

    e.target.value = value;
});
function showError(message) {
    let errorElement = document.getElementById('y-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'y-error';
        errorElement.className = 'error';
        document.getElementById('y').parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    document.getElementById('y').classList.add('error-border');
}

function hideError() {
    const errorElement = document.getElementById('y-error');
    if (errorElement) {
        errorElement.remove();
    }
    document.getElementById('y').classList.remove('error-border');
}

document.getElementById('y').addEventListener('blur', function(e) {
    const value = e.target.value;
    const numberValue = parseFloat(value.replace(',', '.'));

    if (value === '' || isNaN(numberValue)) {
        e.target.setCustomValidity('Пожалуйста, введите число');
        showError('Пожалуйста, введите число');
    } else if (numberValue < -3 || numberValue > 5) {
        e.target.setCustomValidity('Число должно быть от -3 до 5');
        showError('Число должно быть от -3 до 5');
    } else if (value.includes('.') && value.split('.')[1].length > 3) {
        e.target.setCustomValidity('Максимальная точность - 3 знака после запятой');
        showError('Максимальная точность - 3 знака после запятой');
    } else {
        e.target.setCustomValidity('');
        hideError();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadPointsFromStorage();
    drawGraph(currentR);


    const xButtons = document.querySelectorAll('#x-buttons button');
    xButtons[5].classList.add('selected');
    document.getElementById('x-value').value = '0';

    xButtons.forEach(button => {
        button.addEventListener('click', function () {
            xButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('x-value').value = this.value;
        });
    });


    const rCheckboxes = document.querySelectorAll('input[name="r"]');
    rCheckboxes[2].checked = true;

    rCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                rCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
                currentR = parseFloat(this.value);
                drawGraph(currentR);
                points.forEach(point => {
                    addPointToGraph(point.x, point.y, point.r, point.result);
                });
            } else {
                this.checked = true;
            }
        });
    });


    document.getElementById('input-form').addEventListener('submit', function(event) {
        event.preventDefault();
        submitForm();
    });
});
document.getElementById('clear-history').addEventListener('click', function() {
    clearHistory();
});


//table
function loadPointsFromStorage() {
    const savedPoints = localStorage.getItem(STORAGE_KEY);
    if (savedPoints) {
        try {
            points = JSON.parse(savedPoints);
            updateResultsTable();
            points.forEach(point => {
                addPointToGraph(point.x, point.y, point.r, point.result);
            });
        } catch (e) {
            console.error('Ошибка загрузки точек:', e);
            points = [];
        }
    }
}
function savePointsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
}
function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить историю?')) {
        points = [];
        localStorage.removeItem(STORAGE_KEY);
        updateResultsTable();
        drawGraph(currentR);
    }
}
function updateResultsTable() {
    const resultsTable = document.querySelector('#results-table tbody');
    resultsTable.innerHTML = '';

    if (points.length === 0) {
        resultsTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px;">
                    пока ничего нет
                </td>
            </tr>
        `;
        return;
    }

    points.forEach(data => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${data.x}</td>
            <td>${data.y.toFixed(3)}</td>
            <td>${data.r}</td>
            <td>${data.result ? 'Попадание' : 'Промах'}</td>
            <td>${data.currentTime}</td>
            <td>${data.workTime}</td>
        `;
        resultsTable.appendChild(newRow);
    });
}

function submitForm() {
    const xValue = parseFloat(document.getElementById('x-value').value);


    const yInput = document.getElementById('y');
    const value = yInput.value.replace(',', '.');


    const numberValue = parseFloat(value);

    if (isNaN(numberValue)) {
        showError('Пожалуйста, введите число');
        yInput.focus();
        return;
    }

    if (numberValue < -3 || numberValue > 5) {
        showError('Число должно быть от -3 до 5');
        yInput.focus();
        return;
    }

    if (value.includes('.') && value.split('.')[1].length > 3) {
        showError('Максимальная точность - 3 знака после запятой');
        yInput.focus();
        return;
    }

    hideError();
    const yValue = numberValue;

    const rCheckbox = document.querySelector('input[name="r"]:checked');
    if (!rCheckbox) {
        alert("Пожалуйста, выберите значение R");
        return;
    }
    const rValue = parseFloat(rCheckbox.value);


    const formData = {
        x: xValue,
        y: yValue,
        r: rValue
    };

    fetch('/fcgi-bin/java-fcgi/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert("Ошибка: " + data.error);
            } else {
                points.push(data);
                addResultToTable(data);
                savePointsToStorage();
                updateResultsTable();
                addPointToGraph(data.x, data.y, data.r, data.result);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при отправке данных. Проверьте консоль для подробностей.");
        });
}


function addResultToTable(data) {
    const resultsTable = document.querySelector('#results-table tbody');

    if (resultsTable.querySelector('td[colspan]')) {
        resultsTable.innerHTML = '';
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${data.x}</td>
        <td>${data.y.toFixed(3)}</td>
        <td>${data.r}</td>
        <td>${data.result ? 'Попадание' : 'Промах'}</td>
        <td>${data.currentTime}</td>
        <td>${data.workTime}</td>
    `;

    resultsTable.appendChild(newRow);
}


function drawGraph(r) {
    const canvas = document.getElementById('coordinatePlane');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    function getXserif(x, text) {
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();
        ctx.fillText(text, x-8, centerY-10);
    }

    function getYserif(y, text) {
        ctx.beginPath();
        ctx.moveTo(centerX-5, y);
        ctx.lineTo(centerX+5, y);
        ctx.stroke();
        ctx.fillText(text, centerX+8, y);
    }

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "blue";

    // 1
    ctx.beginPath();
    ctx.arc(centerX, centerY, scale * r, -Math.PI/2, 0);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();

    // 2
    ctx.beginPath();
    ctx.rect(centerX - scale * r, centerY - scale * r, scale * r, scale * r);
    ctx.fill();

    // 3
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - scale * r/2, centerY);
    ctx.lineTo(centerX, centerY + scale * r/2);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;

    // Рисуем оси координат
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.lineWidth = 1;


    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';


    getXserif(centerX - scale * r / 2, "R/2");
    getXserif(centerX + scale * r / 2, "R/2");
    getXserif(centerX + scale * r, "R");
    getXserif(centerX - scale * r, "R");


    getYserif(centerY - scale * r / 2, "R/2");
    getYserif(centerY + scale * r / 2, "R/2");
    getYserif(centerY - scale * r, "R");
    getYserif(centerY + scale * r, "R");

    // Подписи осей
    ctx.fillText('X', canvas.width - 10, centerY - 10);
    ctx.fillText('Y', centerX + 10, 10);
}


function addPointToGraph(x, y, r, isHit) {
    if (Math.abs(r - currentR) > 0.001) {
        return;
    }

    const canvas = document.getElementById('coordinatePlane');
    const ctx = canvas.getContext('2d');

    const scale = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const pixelX = centerX + x * scale;
    const pixelY = centerY - y * scale;

    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = isHit ? 'green' : 'red';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}