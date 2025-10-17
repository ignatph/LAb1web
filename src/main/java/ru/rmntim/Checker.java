package ru.rmntim;

public class Checker {
    public static boolean isHit(float x, float y, float r) {
        return checkRectangle(x, y, r) || checkTriangle(x, y, r) || checkCircle(x, y, r);
    }


    private static boolean checkRectangle(float x, float y, float r) {
        return x >= 0 && y >= 0 && x <= r/2 && y <= r;
    }


    private static boolean checkTriangle(float x, float y, float r) {
        // Triangle with vertices (0,0), (-R,0), (0,R/2) in Q2
        // Inside condition: x <= 0, y >= 0, and y <= x/2 + R/2
        return x <= 0 && y >= 0 && y <= (x / 2f) + (r / 2f);
    }

    private static boolean checkCircle(float x, float y, float r) {
        return x <= 0 && y <= 0 && (x*x + y*y) <= (r/2)*(r/2);
    }
}