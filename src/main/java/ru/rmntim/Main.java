package ru.rmntim;

import com.fastcgi.FCGIInterface;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        FCGIInterface fcgiInterface = new FCGIInterface();
        System.err.println("FastCGI сервер запущен и ожидает запросов...");

        while (fcgiInterface.FCGIaccept() >= 0) {
            try {
                String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");
                String uri = FCGIInterface.request.params.getProperty("REQUEST_URI");

                if (method == null || uri == null) {
                    sendError("Неверный запрос");
                    continue;
                }

                // Обработка только POST запросов на /check
                if ("/fcgi-bin/java-fcgi/check".equals(uri)) {
                    if ("POST".equals(method)) {
                        handlePostCheck();
                    } else {
                        sendError("Метод " + method + " не поддерживается для /check");
                    }
                } else {
                    sendError("Неизвестный endpoint: " + uri);
                }
            } catch (Exception e) {
                System.err.println("Ошибка обработки запроса: " + e.getMessage());
                sendError("Внутренняя ошибка сервера");
            }
        }
    }

    private static void handlePostCheck() throws IOException {
        String body = readRequestBody();
        if (body == null || body.trim().isEmpty()) {
            sendError("Пустое тело запроса");
            return;
        }

        // Парсинг JSON
        Map<String, String> params;
        try {
            params = parseJsonBody(body);
        } catch (Exception e) {
            sendError("Неверный формат JSON: " + e.getMessage());
            return;
        }

        processCheckRequest(params);
    }

    // Основная обработка запроса проверки попадания
    private static void processCheckRequest(Map<String, String> params) {
        long startTime = System.nanoTime();

        // Проверяем наличие всех необходимых параметров
        if (!params.containsKey("x") || !params.containsKey("y") || !params.containsKey("r")) {
            sendError("Отсутствуют необходимые параметры: x, y, r");
            return;
        }

        try {
            // Извлекаем и проверяем параметры
            float x = parseAndValidate(params.get("x"), "x", -5, 3);
            float y = parseAndValidate(params.get("y"), "y", -3, 5);
            float r = parseAndValidate(params.get("r"), "r", 1, 3);

            // Проверяем попадание
            boolean isHit = Checker.isHit(x, y, r);

            // Формируем результат
            long workTime = (System.nanoTime() - startTime) / 1000; // микросекунды
            String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            String resultJson = String.format(
                    Locale.US, // Добавьте явное указание локали
                    "{\"x\":%.3f,\"y\":%.3f,\"r\":%.3f,\"result\":%s,\"workTime\":%d,\"currentTime\":\"%s\"}",
                    x, y, r, isHit, workTime, currentTime
            );

            // Отправляем ответ
            sendResponse(resultJson);

        } catch (ValidationException e) {
            sendError(e.getMessage());
        } catch (Exception e) {
            System.err.println("Ошибка обработки: " + e.getMessage());
            sendError("Внутренняя ошибка сервера");
        }
    }

    // Парсинг и валидация параметра
    private static float parseAndValidate(String value, String paramName, float min, float max)
            throws ValidationException {
        try {
            // Заменяем запятую на точку для корректного парсинга
            String normalizedValue = value.replace(',', '.');
            float number = Float.parseFloat(normalizedValue);

            // Проверяем допустимость значения
            if (paramName.equals("x")) {
                if (!Validator.validateX(number)) {
                    throw new ValidationException("Недопустимое значение X. Допустимые значения: -5, -4, -3, -2, -1, 0, 1, 2, 3");
                }
            } else if (paramName.equals("y")) {
                if (!Validator.validateY(number)) {
                    throw new ValidationException("Y должен быть в диапазоне (-3, 5)");
                }
            } else if (paramName.equals("r")) {
                if (!Validator.validateR(number)) {
                    throw new ValidationException("Недопустимое значение R. Допустимые значения: 1, 1.5, 2, 2.5, 3");
                }
            }

            return number;
        } catch (NumberFormatException e) {
            throw new ValidationException("Параметр " + paramName + " должен быть числом");
        }
    }

    // Чтение тела запроса
    private static String readRequestBody() throws IOException {
        String contentLengthStr = FCGIInterface.request.params.getProperty("CONTENT_LENGTH");
        if (contentLengthStr == null) {
            return "";
        }

        int contentLength = Integer.parseInt(contentLengthStr);
        if (contentLength <= 0) {
            return "";
        }

        byte[] buffer = new byte[contentLength];
        int bytesRead = FCGIInterface.request.inStream.read(buffer, 0, contentLength);

        if (bytesRead != contentLength) {
            throw new IOException("Не удалось прочитать все данные из тела запроса");
        }

        return new String(buffer, StandardCharsets.UTF_8);
    }

    // Парсинг JSON тела запроса
    private static Map<String, String> parseJsonBody(String body) {
        Map<String, String> params = new HashMap<>();

        // Упрощенный парсинг JSON
        String cleanedBody = body.replaceAll("[{}\"]", "").trim();
        String[] pairs = cleanedBody.split(",");

        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2);
            if (keyValue.length == 2) {
                params.put(keyValue[0].trim(), keyValue[1].trim());
            }
        }

        return params;
    }

    // Отправка успешного ответа
    private static void sendResponse(String content) {
        String response = String.format(
                "Content-type: application/json\r\n\r\n%s", content
        );
        // Добавьте в sendResponse
        System.err.println("Sending JSON: " + content); // Для отладки
        System.out.println(response);
    }

    // Отправка ошибки
    private static void sendError(String message) {
        String errorJson = String.format("{\"error\":\"%s\"}", message);
        String response = String.format(
                "Content-type: application/json\r\n\r\n%s", errorJson
        );
        System.out.println(response);
    }
}