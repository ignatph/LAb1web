<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="ru.rmntim.web.ResultEntry" %>
<%
    ResultEntry result = (ResultEntry) request.getAttribute("result");
%>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <title>Результат проверки</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
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
    <tr>
        <td><%= String.format(java.util.Locale.US, "%.3f", result.getX()) %></td>
        <td><%= String.format(java.util.Locale.US, "%.3f", result.getY()) %></td>
        <td><%= String.format(java.util.Locale.US, "%.3f", result.getR()) %></td>
        <td><%= result.isResult() ? "Попадание" : "Промах" %></td>
        <td><%= result.getCurrentTime() %></td>
        <td><%= result.getWorkTime() %></td>
    </tr>
    </tbody>
</table>

<p><a href="controller">Назад к форме</a></p>

</body>
</html>










