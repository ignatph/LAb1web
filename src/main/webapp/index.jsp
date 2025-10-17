<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="ru.rmntim.web.ResultEntry" %>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <title>Лабораторная работа 1</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
<table class="layout">
    <tr>
        <td>
            <header id="main-header">
                <h1>Лабораторная работа 1</h1>
                <p>Выполнил: Пахомов Игнат P3113 Вариант 467039</p>
            </header>

            <table>
                <tr>
                    <td width="50%" valign="top">
                        <form id="input-form" method="GET" action="controller">
                            <table class="form-table">
                                <tr>
                                    <td>
                                        <div class="form-group">
                                            <label>Выберите координату X:</label>
                                            <div class="radio-group" id="x-radio">
                                                <input type="radio" name="x" value="-3" id="x_-3"><label for="x_-3">-3</label>
                                                <input type="radio" name="x" value="-2" id="x_-2"><label for="x_-2">-2</label>
                                                <input type="radio" name="x" value="-1" id="x_-1"><label for="x_-1">-1</label>
                                                <input type="radio" name="x" value="0" id="x_0" checked><label for="x_0">0</label>
                                                <input type="radio" name="x" value="1" id="x_1"><label for="x_1">1</label>
                                                <input type="radio" name="x" value="2" id="x_2"><label for="x_2">2</label>
                                                <input type="radio" name="x" value="3" id="x_3"><label for="x_3">3</label>
                                                <input type="radio" name="x" value="4" id="x_4"><label for="x_4">4</label>
                                                <input type="radio" name="x" value="5" id="x_5"><label for="x_5">5</label>
                                            </div>
                                            <input type="hidden" name="x" id="x-value" required />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="form-group">
                                            <label for="y">Введите координату Y (-5 ... 3):</label>
                                            <input
                                                    type="text"
                                                    id="y"
                                                    name="y"
                                                    placeholder="Число от -5 до 3"
                                                    pattern="-?[0-9]+([\.,][0-9]{0,3})?"
                                                    title="Введите число от -5 до 3 с точностью до 3 знаков после запятой"
                                                    required
                                            />
                                            <div class="input-hint">Максимальная точность: 3 знака после запятой</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="form-group">
                                            <label for="r">Введите радиус R (1 ... 4):</label>
                                            <input
                                                    type="text"
                                                    id="r"
                                                    name="r"
                                                    placeholder="Число от 1 до 4"
                                                    pattern="[0-9]+([\.,][0-9]{0,3})?"
                                                    title="Введите число от 1 до 4 с точностью до 3 знаков после запятой"
                                                    required
                                            />
                                            <div class="input-hint">Максимальная точность: 3 знака после запятой</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="submit" id="submit-btn">Проверить</button>
                                        <button type="button" id="clear-history">Очистить историю</button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </td>
                    <td width="50%" valign="top">
                        <div class="graph-container">
                            <h3>График области попадания</h3>
                            <canvas id="coordinatePlane" width="400" height="400"></canvas>
                        </div>
                    </td>
                </tr>
            </table>

            <table id="results-table">
                <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Результат</th>
                    <th>Текущее время</th>
                    <th>Время работы (мкс)</th>
                </tr>
                </thead>
                <tbody>
                <%
                    List<ResultEntry> results = (List<ResultEntry>) session.getAttribute("results");
                    if (results == null || results.isEmpty()) {
                %>
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 20px;">
                            пока ничего нет
                        </td>
                    </tr>
                <%
                    } else {
                        for (ResultEntry re : results) {
                %>
                    <tr>
                        <td><%= String.format(java.util.Locale.US, "%.3f", re.getX()) %></td>
                        <td><%= String.format(java.util.Locale.US, "%.3f", re.getY()) %></td>
                        <td><%= String.format(java.util.Locale.US, "%.3f", re.getR()) %></td>
                        <td><%= re.isResult() ? "Попадание" : "Промах" %></td>
                        <td><%= re.getCurrentTime() %></td>
                        <td><%= re.getWorkTime() %></td>
                    </tr>
                <%
                        }
                    }
                %>
                </tbody>
            </table>
        </td>
    </tr>
</table>

<script>
    window.initialPoints = [
    <%
        if (results != null && !results.isEmpty()) {
            for (int i = 0; i < results.size(); i++) {
                ResultEntry re = results.get(i);
    %>
        { x: <%= String.format(java.util.Locale.US, "%.3f", re.getX()) %>, y: <%= String.format(java.util.Locale.US, "%.3f", re.getY()) %>, r: <%= String.format(java.util.Locale.US, "%.3f", re.getR()) %>, result: <%= re.isResult() %>, currentTime: "<%= re.getCurrentTime() %>", workTime: <%= re.getWorkTime() %> }<%= (i < results.size() - 1) ? "," : "" %>
    <%
            }
        }
    %>
    ];
</script>
<script src="script.js"></script>
</body>
</html>


