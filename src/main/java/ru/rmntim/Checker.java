package ru.rmntim;

class Checker {
    public static boolean isHit(float x, float y, float r) {
        // Проверка попадания для варианта 467039
        return checkSquare(x, y, r) || checkTriangle(x, y, r) || checkCircle(x, y, r);
    }

    // Квадратная область (вторая четверть)
    private static boolean checkSquare(float x, float y, float r) {
        return x <= 0 && y >= 0 && x >= -r && y <= r;
    }

    // Треугольная область (четвертая четверть)
    private static boolean checkTriangle(float x, float y, float r) {
        return x >= 0 && y <= 0 && y >= x - r/2;
    }

    // Круговая область (первая четверть)
    private static boolean checkCircle(float x, float y, float r) {
        return x >= 0 && y >= 0 && Math.sqrt(x*x + y*y) <= r;
    }
}