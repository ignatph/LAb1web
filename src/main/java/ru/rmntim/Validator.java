package ru.rmntim;

public class Validator {
    private static final float[] VALID_X = {-3, -2, -1, 0, 1, 2, 3, 4, 5};
    public static boolean validateX(float x) {
        for (float v : VALID_X) {
            if (x == v) return true;
        }
        return false;
    }
    public static boolean validateY(float y) {
        return y >= -5 && y <= 3;
    }
    public static boolean validateR(float r) {
        return r >= 1 && r <= 4;
    }


}