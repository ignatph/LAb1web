package ru.rmntim.web;

public class ResultEntry {
    private final float x;
    private final float y;
    private final float r;
    private final boolean result;
    private final String currentTime;
    private final long workTime;

    public ResultEntry(float x, float y, float r, boolean result, String currentTime, long workTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.result = result;
        this.currentTime = currentTime;
        this.workTime = workTime;
    }

    public float getX() { return x; }
    public float getY() { return y; }
    public float getR() { return r; }
    public boolean isResult() { return result; }
    public String getCurrentTime() { return currentTime; }
    public long getWorkTime() { return workTime; }
}





