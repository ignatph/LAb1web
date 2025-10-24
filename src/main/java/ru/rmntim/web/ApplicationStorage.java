package ru.rmntim.web;

import jakarta.servlet.ServletContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ApplicationStorage {
    private static final String RESULTS_KEY = "applicationResults";
    private static final ReadWriteLock lock = new ReentrantReadWriteLock();
    
    @SuppressWarnings("unchecked")
    public static List<ResultEntry> getResults(ServletContext context) {
        lock.readLock().lock();
        try {
            List<ResultEntry> results = (List<ResultEntry>) context.getAttribute(RESULTS_KEY);
            return results != null ? new ArrayList<>(results) : new ArrayList<>();
        } finally {
            lock.readLock().unlock();
        }
    }
    
    public static void addResult(ServletContext context, ResultEntry entry) {
        lock.writeLock().lock();
        try {
            @SuppressWarnings("unchecked")
            List<ResultEntry> results = (List<ResultEntry>) context.getAttribute(RESULTS_KEY);
            if (results == null) {
                results = Collections.synchronizedList(new ArrayList<>());
                context.setAttribute(RESULTS_KEY, results);
            }
            
            // Проверяем, нет ли уже такой же записи (по координатам и времени)
            boolean exists = results.stream().anyMatch(existing -> 
                Math.abs(existing.getX() - entry.getX()) < 0.001 &&
                Math.abs(existing.getY() - entry.getY()) < 0.001 &&
                Math.abs(existing.getR() - entry.getR()) < 0.001 &&
                existing.getCurrentTime().equals(entry.getCurrentTime())
            );
            
            if (!exists) {
                results.add(entry);
            }
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    public static void clearResults(ServletContext context) {
        lock.writeLock().lock();
        try {
            context.removeAttribute(RESULTS_KEY);
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    public static int getResultCount(ServletContext context) {
        lock.readLock().lock();
        try {
            @SuppressWarnings("unchecked")
            List<ResultEntry> results = (List<ResultEntry>) context.getAttribute(RESULTS_KEY);
            return results != null ? results.size() : 0;
        } finally {
            lock.readLock().unlock();
        }
    }
}
