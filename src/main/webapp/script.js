let currentR = 2;
let points = [];

// Валидация для Y (-5 до 3)
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

// Валидация для R (1 до 4)
document.getElementById('r').addEventListener('input', function(e) {
    let value = e.target.value;
    value = value.replace(/[^\d.,]/g, '');
    value = value.replace(',', '.');

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

function showError(elementId, message) {
    let errorElement = document.getElementById(elementId + '-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = elementId + '-error';
        errorElement.className = 'error';
        document.getElementById(elementId).parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    document.getElementById(elementId).classList.add('error-border');
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId + '-error');
    if (errorElement) {
        errorElement.remove();
    }
    document.getElementById(elementId).classList.remove('error-border');
}

document.getElementById('y').addEventListener('blur', function(e) {
    const value = e.target.value;
    const numberValue = parseFloat(value.replace(',', '.'));

    if (value === '' || isNaN(numberValue)) {
        e.target.setCustomValidity('Пожалуйста, введите число');
        showError('y', 'Пожалуйста, введите число');
    } else if (numberValue < -5 || numberValue > 3) {
        e.target.setCustomValidity('Число должно быть от -5 до 3');
        showError('y', 'Число должно быть от -5 до 3');
    } else if (value.includes('.') && value.split('.')[1].length > 3) {
        e.target.setCustomValidity('Максимальная точность - 3 знака после запятой');
        showError('y', 'Максимальная точность - 3 знака после запятой');
    } else {
        e.target.setCustomValidity('');
        hideError('y');
    }
});

document.getElementById('r').addEventListener('blur', function(e) {
    const value = e.target.value;
    const numberValue = parseFloat(value.replace(',', '.'));

    if (value === '' || isNaN(numberValue)) {
        e.target.setCustomValidity('Пожалуйста, введите число');
        showError('r', 'Пожалуйста, введите число');
    } else if (numberValue < 1 || numberValue > 4) {
        e.target.setCustomValidity('Число должно быть от 1 до 4');
        showError('r', 'Число должно быть от 1 до 4');
    } else if (value.includes('.') && value.split('.')[1].length > 3) {
        e.target.setCustomValidity('Максимальная точность - 3 знака после запятой');
        showError('r', 'Максимальная точность - 3 знака после запятой');
    } else {
        e.target.setCustomValidity('');
        hideError('r');
        currentR = numberValue;
        drawGraphWithPoints(currentR);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Восстанавливаем кнопку отправки
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Проверить';
    
    // Загружаем точки из application storage (переданные через JSP)
    if (window.initialPoints && Array.isArray(window.initialPoints)) {
        points = window.initialPoints.slice();
    }
    
    // Получаем текущий R из формы или используем значение по умолчанию
    const rInput = document.getElementById('r');
    if (rInput.value) {
        currentR = parseFloat(rInput.value.replace(',', '.'));
    }
    
    drawGraphWithPoints(currentR);

    const xRadios = document.querySelectorAll('#x-radio input[type="radio"]');
    // Не устанавливаем значение по умолчанию, если уже есть выбранное значение
    const checkedRadio = document.querySelector('#x-radio input[type="radio"]:checked');
    if (!checkedRadio) {
        xRadios[3].checked = true;
        document.getElementById('x-value').value = '0';
    }

    xRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('x-value').value = this.value;
            }
        });
    });

    // Обработчик изменения радиуса для перерисовки графика
    rInput.addEventListener('input', function() {
        const value = parseFloat(this.value.replace(',', '.'));
        if (!isNaN(value) && value >= 1 && value <= 4) {
            currentR = value;
            drawGraphWithPoints(currentR);
        }
    });

    document.getElementById('coordinatePlane').addEventListener('click', onCanvasClick);
});

function drawGraph(r) {
    const canvas = document.getElementById('coordinatePlane');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Рисуем области попадания
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "blue";

    // 1 четверть: прямоугольник с шириной R/2 и высотой R
    ctx.beginPath();
    ctx.rect(centerX, centerY - scale * r, scale * (r/2), scale * r);
    ctx.fill();

    // 2 четверть: треугольник с точками (0,0), (-R,0), (0, R/2)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - scale * r, centerY);
    ctx.lineTo(centerX, centerY - scale * (r/2));
    ctx.closePath();
    ctx.fill();
//3
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
// Рисуем дугу от левой точки (π) до нижней точки (3π/2) по часовой стрелке
    ctx.arc(centerX, centerY, scale * (r/2), Math.PI/2, Math.PI, false);
    ctx.closePath();
    ctx.fill();

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

    // Подписи на осях
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

    getXserif(centerX + scale * (r/2), "R/2");
    getXserif(centerX + scale * r, "R");
    getXserif(centerX - scale * (r/2), "-R/2");
    getXserif(centerX - scale * r, "-R");

    getYserif(centerY - scale * (r/2), "R/2");
    getYserif(centerY - scale * r, "R");
    getYserif(centerY + scale * (r/2), "-R/2");
    getYserif(centerY + scale * r, "-R");

    // Подписи осей
    ctx.fillText('X', canvas.width - 10, centerY - 10);
    ctx.fillText('Y', centerX + 10, 10);
}

function drawGraphWithPoints(r) {
    drawGraph(r);
    // Отрисовываем все точки из application storage
    points.forEach(point => {
        addPointToGraph(point.x, point.y, point.r, point.result);
    });
}

function onCanvasClick(event) {
    const rInput = document.getElementById('r');
    const rValueStr = rInput.value.replace(',', '.');
    const rValue = parseFloat(rValueStr);

    if (isNaN(rValue) || rValue < 1 || rValue > 4) {
        alert('Введите корректный радиус R (от 1 до 4)');
        return;
    }

    const canvas = document.getElementById('coordinatePlane');
    const rect = canvas.getBoundingClientRect();
    const scale = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const x = (clickX - centerX) / scale;
    const y = (centerY - clickY) / scale;

    const possibleX = [-3,-2,-1,0,1,2,3,4,5];
    const snappedX = possibleX.reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
    
    // Устанавливаем значения в форму и отправляем обычным запросом (JSP-рендер)
    const form = document.getElementById('input-form');
    // Выставляем X через радио и скрытое поле
    const xRadios = document.querySelectorAll('#x-radio input[type="radio"]');
    xRadios.forEach(r => { r.checked = (parseFloat(r.value) === snappedX); });
    document.getElementById('x-value').value = String(snappedX);

    // Устанавливаем Y из клика
    document.getElementById('y').value = parseFloat(y.toFixed(3));

    // R уже введён пользователем; используем текущее значение поля
    form.submit();
}

// Убрали localStorage - используем только application storage

function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить историю?')) {
        // Простое перенаправление на GET запрос
        window.location.href = 'clear-history';
    }
}

// Убрали updateResultsTable - таблица обновляется через JSP

function submitForm() {
    // Защита от повторной отправки
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn.disabled) {
        return;
    }
    
    const xRadio = document.querySelector('input[name="x"]:checked');
    if (!xRadio) {
        alert('Пожалуйста, выберите значение X');
        return;
    }
    const xValue = parseFloat(xRadio.value);

    const yInput = document.getElementById('y');
    const yValueStr = yInput.value.replace(',', '.');
    const yValue = parseFloat(yValueStr);

    if (isNaN(yValue)) {
        showError('y', 'Пожалуйста, введите число');
        yInput.focus();
        return;
    }

    if (yValue < -5 || yValue > 3) {
        showError('y', 'Число должно быть от -5 до 3');
        yInput.focus();
        return;
    }

    if (yValueStr.includes('.') && yValueStr.split('.')[1].length > 3) {
        showError('y', 'Максимальная точность - 3 знака после запятой');
        yInput.focus();
        return;
    }

    const rInput = document.getElementById('r');
    const rValueStr = rInput.value.replace(',', '.');
    const rValue = parseFloat(rValueStr);

    if (isNaN(rValue)) {
        showError('r', 'Пожалуйста, введите число');
        rInput.focus();
        return;
    }

    if (rValue < 1 || rValue > 4) {
        showError('r', 'Число должно быть от 1 до 4');
        rInput.focus();
        return;
    }

    if (rValueStr.includes('.') && rValueStr.split('.')[1].length > 3) {
        showError('r', 'Максимальная точность - 3 знака после запятой');
        rInput.focus();
        return;
    }

    hideError('y');
    hideError('r');

    // Блокируем кнопку от повторной отправки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Всё валидно — отправляем обычным запросом на контроллер (JSP-ответ)
    const form = document.getElementById('input-form');
    form.submit();
}

// Убрали addResultToTable - таблица обновляется через JSP

function addPointToGraph(x, y, r, isHit) {
    const canvas = document.getElementById('coordinatePlane');
    const ctx = canvas.getContext('2d');

    const scale = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Масштабируем координаты относительно текущего радиуса
    const scaledX = (x / r) * currentR;
    const scaledY = (y / r) * currentR;

    const pixelX = centerX + scaledX * scale;
    const pixelY = centerY - scaledY * scale;

    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = isHit ? 'green' : 'red';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}


document.getElementById('clear-history').addEventListener('click', function() {
    clearHistory();
});

// Разрешаем нативную отправку формы; если нужно, можно навесить submitForm на кнопку