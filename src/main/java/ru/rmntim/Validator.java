package ru.rmntim;
class Validator {

    private static final float[] VALID_X = {-5, -4, -3, -2, -1, 0, 1, 2, 3};

    private static final float[] VALID_R = {1, 1.5f, 2, 2.5f, 3};

    public static boolean validateX(float x) {
        for (float validValue : VALID_X) {
            if (Math.abs(x - validValue) < 0.0001) {
                return true;
            }
        }
        return false;
    }

    public static boolean validateY(float y) {
        return y > -3 && y < 5;
    }

    public static boolean validateR(float r) {
        for (float validValue : VALID_R) {
            if (Math.abs(r - validValue) < 0.0001) {
                return true;
            }
        }
        return false;
    }
}