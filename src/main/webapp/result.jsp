<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="ru.rmntim.web.ResultEntry" %>
<%@ page import="ru.rmntim.web.ApplicationStorage" %>
<%@ page import="java.util.List" %>
<%
  ResultEntry result = (ResultEntry) request.getAttribute("result");
  List<ResultEntry> results = ApplicationStorage.getResults(application);
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
  <%
    if (result != null) {
  %>
  <tr style="background-color: #e8f5e8; font-weight: bold;">
    <td><%= String.format(java.util.Locale.US, "%.3f", result.getX()) %></td>
    <td><%= String.format(java.util.Locale.US, "%.3f", result.getY()) %></td>
    <td><%= String.format(java.util.Locale.US, "%.3f", result.getR()) %></td>
    <td><%= result.isResult() ? "Попадание" : "Промах" %></td>
    <td><%= result.getCurrentTime() %></td>
    <td><%= result.getWorkTime() %></td>
  </tr>
  <%
    }

    if (results != null && !results.isEmpty()) {
      for (ResultEntry re : results) {
        if (result == null || !re.equals(result)) {
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
    }

    if ((results == null || results.isEmpty()) && result == null) {
  %>
  <tr>
    <td colspan="6" style="text-align: center; padding: 20px;">пока ничего нет</td>
  </tr>
  <%
    }
  %>
  </tbody>
</table>
<p><a href="controller">Назад к форме</a></p>
</body>
</html>

