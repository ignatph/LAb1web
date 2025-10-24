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

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ResultEntry that = (ResultEntry) obj;
        return Float.compare(that.x, x) == 0 &&
               Float.compare(that.y, y) == 0 &&
               Float.compare(that.r, r) == 0 &&
               result == that.result &&
               workTime == that.workTime &&
               currentTime.equals(that.currentTime);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(x, y, r, result, currentTime, workTime);
    }
}





