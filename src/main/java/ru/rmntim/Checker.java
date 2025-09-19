package ru.rmntim;

class Checker {
    public static boolean isHit(float x, float y, float r) {

        return checkSquare(x, y, r) || checkTriangle(x, y, r) || checkCircle(x, y, r);
    }

    private static boolean checkSquare(float x, float y, float r) {
        return x <= 0 && y >= 0 && x >= -r && y <= r;
    }

    private static boolean checkTriangle(float x, float y, float r) {
        return x >= 0 && y <= 0 && y >= x - r/2;
    }

    private static boolean checkCircle(float x, float y, float r) {
        return x >= 0 && y >= 0 && Math.sqrt(x*x + y*y) <= r;
    }
}